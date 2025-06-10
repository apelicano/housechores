// =============================
// Firebase Configuration
// =============================
const firebaseConfig = {
  apiKey: "AIzaSyBpCw-2-e8rR-4hZGE32-Ug6KJJcKSHnn8",
  authDomain: "family-chore-tracker-db5b2.firebaseapp.com",
  databaseURL: "https://family-chore-tracker-db5b2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "family-chore-tracker-db5b2",
  storageBucket: "family-chore-tracker-db5b2.appspot.com",
  messagingSenderId: "1021277258690",
  appId: "1:1021277258690:web:2bd82da2661448fc800c5b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Global state variables
let choreList = [];
let showTimestamps = false;
let currentUserFilter = "All";

// Anonymous sign-in to protect writes
firebase.auth().signInAnonymously()
  .then(() => {
    console.log("✅ Signed in anonymously");
    initApp(); // Proceed after successful auth
  })
  .catch((error) => {
    console.error("❌ Anonymous sign-in failed:", error);
  });

// Firebase DB reference
const db = firebase.database();
const choresRef = db.ref("chores");

// =============================
// App Initialization
// =============================
function initApp() {
  const savedToggle = localStorage.getItem('showTimestamps');
  if (savedToggle) showTimestamps = savedToggle === 'true';

  const checkbox = document.getElementById('toggle-timestamp-checkbox');
  if (checkbox) checkbox.checked = showTimestamps;

  // Load chores from Firebase
  choresRef.once('value')
    .then(snapshot => {
      const data = snapshot.val();
      choreList = data ? Object.values(data) : [];
      updateUserFilterOptions();
      renderChoreList();
    })
    .catch(error => {
      console.error("Failed to load chores from Firebase:", error);
      choreList = [];
      renderChoreList();
    });

  // Attach event listeners
  setupEventListeners();
}

// =============================
// DOM References
// =============================
const choreForm = document.getElementById('chore-form');
const choreListDiv = document.getElementById('chore-list');
const userSelect = document.getElementById('chore-user');
const filterSelect = document.getElementById('filter-user');

// =============================
// Event Listeners
// =============================
function setupEventListeners() {
  // Form submission
  choreForm.addEventListener('submit', event => {
    event.preventDefault();
    addNewChore();
  });

  // Timestamp toggle
  const timestampCheckbox = document.getElementById('toggle-timestamp-checkbox');
  if (timestampCheckbox) {
    timestampCheckbox.addEventListener('change', () => {
      showTimestamps = timestampCheckbox.checked;
      localStorage.setItem('showTimestamps', showTimestamps);
      renderChoreList();
    });
  }

  // Clear all
  const clearAllBtn = document.getElementById('clear-all-btn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAllChores);
  }

  // Filter by user
  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      currentUserFilter = filterSelect.value;
      renderChoreList();
    });
  }
}

// =============================
// Add New Chore
// =============================
function addNewChore() {
  const title = document.getElementById('chore-title').value.trim();
  const description = document.getElementById('chore-description').value.trim();
  const progress = parseInt(document.getElementById('chore-progress').value, 10);
  const assignedTo = userSelect.value;

  if (!title || !description || isNaN(progress)) {
    showToast("❌ All fields required");
    return;
  }

  const newChore = {
    id: Date.now(),
    title,
    description,
    progress,
    timestamp: new Date().toISOString(),
    user: assignedTo
  };

  choresRef.child(newChore.id).set(newChore)
    .then(() => {
      choreList.push(newChore);
      choreForm.reset();
      document.getElementById('timestamp-toggle-wrapper').style.display = 'block';
      updateUserFilterOptions();
      renderChoreList();
    })
    .catch(err => {
      console.error("❌ Failed to add chore:", err);
      showToast("❌ Could not save chore.");
    });
}

// =============================
// Render Chore List
// =============================
function renderChoreList() {
  choreListDiv.innerHTML = '<h2>Your Chores</h2>';

  const filtered = currentUserFilter === "All"
    ? choreList
    : choreList.filter(c => c.user === currentUserFilter);

  if (filtered.length === 0) {
    choreListDiv.innerHTML += "<p>No chores yet.</p>";
    document.getElementById('timestamp-toggle-wrapper').style.display = 'none';
    return;
  }

  document.getElementById('timestamp-toggle-wrapper').style.display = 'block';

  filtered.forEach(chore => {
    const choreItem = document.createElement('div');
    choreItem.classList.add('chore-item');

    const titleElem = document.createElement('h3');
    titleElem.textContent = `${chore.title} (${chore.user})`;
    choreItem.appendChild(titleElem);

    const descElem = document.createElement('p');
    descElem.innerHTML = sanitizeHTML(chore.description).replace(/\n/g, '<br>');
    choreItem.appendChild(descElem);

    if (showTimestamps && chore.timestamp) {
      const timeElem = document.createElement('p');
      timeElem.textContent = 'Added: ' + new Date(chore.timestamp).toLocaleString();
      timeElem.classList.add('timestamp');
      choreItem.appendChild(timeElem);
    }

    // Progress bar
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('progress-bar-container');

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressBar.style.width = chore.progress + '%';
    progressBar.textContent = chore.progress + '%';

    // Color based on progress level
    progressBar.style.backgroundColor =
      chore.progress === 100 ? 'green' :
      chore.progress >= 50 ? 'orange' : 'red';

    progressContainer.appendChild(progressBar);
    choreItem.appendChild(progressContainer);

    // Buttons
    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update Progress';
    updateBtn.addEventListener('click', () => updateChoreProgress(chore.id));
    choreItem.appendChild(updateBtn);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Task';
    editBtn.style.marginLeft = '5px';
    editBtn.addEventListener('click', () => editChore(chore.id));
    choreItem.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Chore';
    deleteBtn.style.marginLeft = '5px';
    deleteBtn.style.backgroundColor = '#f44336';
    deleteBtn.addEventListener('click', () => deleteChore(chore.id));
    choreItem.appendChild(deleteBtn);

    choreListDiv.appendChild(choreItem);

    if (chore.progress === 100) triggerConfetti();
  });
}

// =============================
// Update Progress
// =============================
function updateChoreProgress(choreId) {
  const chore = choreList.find(c => c.id === choreId);
  if (!chore) return;

  const newProgress = Math.min(chore.progress + 25, 100);
  choresRef.child(choreId).update({ progress: newProgress })
    .then(() => {
      chore.progress = newProgress;
      renderChoreList();
    })
    .catch(error => {
      console.error("Progress update error:", error);
      showToast("❌ Failed to update progress");
    });
}

// =============================
// Delete Chore
// =============================
function deleteChore(choreId) {
  choresRef.child(choreId).remove()
    .then(() => {
      choreList = choreList.filter(c => c.id !== choreId);
      renderChoreList();
      updateUserFilterOptions();
      showToast("Chore deleted");
    })
    .catch(error => {
      console.error("Delete error:", error);
      showToast("❌ Failed to delete chore");
    });
}

// =============================
// Edit Chore
// =============================
function editChore(choreId) {
  const chore = choreList.find(c => c.id === choreId);
  if (!chore) return;

  const newTitle = prompt('Edit title:', chore.title);
  const newDesc = prompt('Edit description:', chore.description);
  const newProgress = prompt('Edit progress (0–100):', chore.progress);
  const newUser = prompt('Edit assigned user:', chore.user);

  if ([newTitle, newDesc, newProgress, newUser].some(v => v === null)) return;

  const updated = {
    ...chore,
    title: newTitle.trim(),
    description: newDesc.trim(),
    user: newUser.trim(),
    progress: Math.max(0, Math.min(100, parseInt(newProgress)))
  };

  choresRef.child(choreId).set(updated)
    .then(() => {
      const index = choreList.findIndex(c => c.id === choreId);
      if (index !== -1) choreList[index] = updated;
      updateUserFilterOptions();
      renderChoreList();
    })
    .catch(err => {
      console.error("Update error:", err);
      showToast("❌ Failed to update chore");
    });
}

// =============================
// Clear All Chores
// =============================
function clearAllChores() {
  if (!confirm('Delete all chores?')) return;

  choresRef.remove()
    .then(() => {
      choreList = [];
      showTimestamps = false;
      localStorage.setItem('showTimestamps', 'false');
      renderChoreList();
      updateUserFilterOptions();
    })
    .catch(err => {
      console.error("Clear error:", err);
      showToast("❌ Failed to clear chores");
    });
}

// =============================
// Helpers
// =============================

function updateUserFilterOptions() {
  const users = Array.from(new Set(choreList.map(c => c.user))).sort();
  filterSelect.innerHTML = `<option value="All">All</option>` +
    users.map(u => `<option value="${u}">${u}</option>`).join('');
}

function showToast(msg = "Action completed") {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function triggerConfetti() {
  console.log("🎉 Confetti!");
  document.body.classList.add('confetti-bg');
  setTimeout(() => document.body.classList.remove('confetti-bg'), 3000);
}

// Basic HTML sanitizer (allows <a>, <em>, <strong>)
function sanitizeHTML(input) {
  const allowed = { 'A': ['href', 'target'], 'EM': [], 'STRONG': [] };
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');

  function clean(node) {
    if (node.nodeType === Node.TEXT_NODE) return node.cloneNode();
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const tag = node.tagName.toUpperCase();
    if (!allowed[tag]) {
      const frag = document.createDocumentFragment();
      node.childNodes.forEach(c => {
        const n = clean(c);
        if (n) frag.appendChild(n);
      });
      return frag;
    }

    const el = document.createElement(tag);
    allowed[tag].forEach(attr => {
      if (node.hasAttribute(attr)) {
        el.setAttribute(attr, node.getAttribute(attr));
      }
    });
    node.childNodes.forEach(c => {
      const n = clean(c);
      if (n) el.appendChild(n);
    });
    return el;
  }

  const result = document.createDocumentFragment();
  doc.body.childNodes.forEach(n => {
    const cleaned = clean(n);
    if (cleaned) result.appendChild(cleaned);
  });

  const container = document.createElement('div');
  container.appendChild(result);
  return container.innerHTML;
}
