// ==== Firebase Config and Initialization ====
const firebaseConfig = {
  apiKey: "AIzaSyBpCw-2-e8rR-4hZGE32-Ug6KJJcKSHnn8",
  authDomain: "family-chore-tracker-db5b2.firebaseapp.com",
  databaseURL: "https://family-chore-tracker-db5b2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "family-chore-tracker-db5b2",
  storageBucket: "family-chore-tracker-db5b2.appspot.com",
  messagingSenderId: "1021277258690",
  appId: "1:1021277258690:web:2bd82da2661448fc800c5b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const choresRef = db.ref("chores");

let choreList = [];
let showTimestamps = false;
let currentUserFilter = "All";
let showArchived = false; // Controls visibility of archived chores

// ==== Anonymous Sign-in ====
firebase.auth().signInAnonymously()
  .then(() => {
    console.log("✅ Signed in anonymously");
    initApp();
  })
  .catch(error => {
    console.error("❌ Sign-in failed:", error);
  });

// ==== DOM References ====
const choreForm = document.getElementById('chore-form');
const choreListDiv = document.getElementById('chore-list');
const userSelect = document.getElementById('chore-user');
const filterSelect = document.getElementById('filter-user');
const toggleArchivedBtn = document.getElementById('toggle-archived-btn');

// ==== Initialization ====
function initApp() {
  const savedToggle = localStorage.getItem('showTimestamps');
  if (savedToggle) showTimestamps = savedToggle === 'true';

  const checkbox = document.getElementById('toggle-timestamp-checkbox');
  if (checkbox) checkbox.checked = showTimestamps;

  choresRef.on('value', snapshot => {
    const data = snapshot.val();
    choreList = data ? Object.values(data) : [];
    updateUserFilterOptions();
    renderChoreList();
  });

  setupEventListeners();
}

// ==== Setup Event Listeners ====
function setupEventListeners() {
  choreForm.addEventListener('submit', e => {
    e.preventDefault();
    addNewChore();
  });

  const timestampCheckbox = document.getElementById('toggle-timestamp-checkbox');
  if (timestampCheckbox) {
    timestampCheckbox.addEventListener('change', () => {
      showTimestamps = timestampCheckbox.checked;
      localStorage.setItem('showTimestamps', showTimestamps);
      renderChoreList();
    });
  }

  const clearAllBtn = document.getElementById('clear-all-btn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAllChores);
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      currentUserFilter = filterSelect.value;
      renderChoreList();
    });
  }

  if (toggleArchivedBtn) {
    toggleArchivedBtn.addEventListener('click', () => {
      showArchived = !showArchived;
      toggleArchivedBtn.textContent = showArchived ? 'Hide Archived Chores' : 'Show Archived Chores';
      renderChoreList();
    });
  }
}

// ==== Add New Chore ====
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
    user: assignedTo,
    timestamp: new Date().toISOString(),
    archived: false
  };

  choresRef.child(newChore.id).set(newChore)
    .then(() => {
      choreForm.reset();
      showToast("✅ Chore added");
    })
    .catch(err => {
      console.error("Add failed:", err);
      showToast("❌ Could not add chore");
    });
}

// ==== Render Chores ====
function renderChoreList() {
  // Reset the list container
  choreListDiv.innerHTML = '<h2>Your Chores</h2>';

  // Filter chores based on user filter and archive toggle
  const filtered = choreList.filter(chore =>
    (currentUserFilter === "All" || chore.user === currentUserFilter) &&
    (showArchived || !chore.archived)
  );

  // ⬇️ Always check for visible non-archived chores before toggling timestamp UI
  const hasVisibleNonArchived = filtered.some(c => !c.archived);
  const timestampWrapper = document.getElementById('timestamp-toggle-wrapper');
  if (timestampWrapper) {
    timestampWrapper.style.display = hasVisibleNonArchived ? 'block' : 'none';
  }

  // If no chores match, show placeholder
  if (filtered.length === 0) {
    choreListDiv.innerHTML += `<p>No chores to show.</p>`;
    return;
  }

  // Render each matching chore
  filtered.forEach(chore => {
    const choreItem = document.createElement('div');
    choreItem.className = 'chore-item';

    // Title + User + Archived Label
    const titleElem = document.createElement('h3');
    titleElem.textContent = `${chore.title} (${chore.user})`;
    if (chore.archived) {
      const label = document.createElement('span');
      label.textContent = ' [Archived]';
      label.style.color = '#888';
      label.style.fontSize = '0.9rem';
      titleElem.appendChild(label);
    }
    choreItem.appendChild(titleElem);

    // Description (with basic sanitization)
    const descElem = document.createElement('p');
    descElem.innerHTML = sanitizeHTML(chore.description).replace(/\n/g, "<br>");
    choreItem.appendChild(descElem);

    // Timestamp (optional)
    if (showTimestamps && chore.timestamp) {
      const timeElem = document.createElement('p');
      timeElem.textContent = 'Added: ' + new Date(chore.timestamp).toLocaleString();
      timeElem.classList.add('timestamp');
      choreItem.appendChild(timeElem);
    }

    // Progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-bar-container';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = chore.progress + '%';
    progressBar.textContent = chore.progress + '%';
    progressBar.style.backgroundColor =
      chore.progress === 100 ? 'green' :
      chore.progress >= 50 ? 'orange' : 'red';

    progressContainer.appendChild(progressBar);
    choreItem.appendChild(progressContainer);

    // Show these buttons only if NOT archived
    if (!chore.archived) {
      const updateBtn = document.createElement('button');
      updateBtn.textContent = 'Update Progress';
      updateBtn.onclick = () => updateChoreProgress(chore.id);
      choreItem.appendChild(updateBtn);

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit Task';
      editBtn.style.marginLeft = '5px';
      editBtn.onclick = () => editChore(chore.id);
      choreItem.appendChild(editBtn);
    }

    // Archive/Unarchive toggle button (always visible)
    const archiveBtn = document.createElement('button');
    archiveBtn.textContent = chore.archived ? 'Unarchive' : 'Archive';
    archiveBtn.style.marginLeft = '5px';
    archiveBtn.onclick = () => toggleArchiveChore(chore.id, !chore.archived);
    choreItem.appendChild(archiveBtn);

    choreListDiv.appendChild(choreItem);

    // Trigger confetti if chore is complete
    if (chore.progress === 100) triggerConfetti();
  });
}


// ==== Archive/Unarchive Chore ====
function toggleArchiveChore(choreId, isArchived) {
  choresRef.child(choreId).update({ archived: isArchived })
    .then(() => showToast(isArchived ? "✅ Chore archived" : "✅ Chore unarchived"))
    .catch(err => {
      console.error("Archive toggle failed:", err);
      showToast("❌ Failed to update archive state");
    });
}

// ==== Update Chore Progress ====
function updateChoreProgress(choreId) {
  const chore = choreList.find(c => c.id === choreId);
  if (!chore) return;
  const newProgress = Math.min(chore.progress + 25, 100);

  choresRef.child(choreId).update({ progress: newProgress })
    .then(() => showToast("✅ Progress updated"))
    .catch(err => {
      console.error("Progress update failed:", err);
      showToast("❌ Failed to update progress");
    });
}

// ==== Edit Chore ====
function editChore(choreId) {
  const chore = choreList.find(c => c.id === choreId);
  if (!chore) return;

  const newTitle = prompt("Edit title:", chore.title);
  const newDesc = prompt("Edit description:", chore.description);
  const newProgress = prompt("Edit progress (0–100):", chore.progress);
  const newUser = prompt("Edit assigned user:", chore.user);

  if ([newTitle, newDesc, newProgress, newUser].some(v => v === null)) return;

  const updated = {
    ...chore,
    title: newTitle.trim(),
    description: newDesc.trim(),
    user: newUser.trim(),
    progress: Math.max(0, Math.min(100, parseInt(newProgress)))
  };

  choresRef.child(choreId).set(updated)
    .then(() => showToast("✅ Chore updated"))
    .catch(err => {
      console.error("Update error:", err);
      showToast("❌ Failed to update chore");
    });
}

// ==== Clear All Chores ====
function clearAllChores() {
  if (!confirm('Clear all chores? This will archive them.')) return;

  const updates = {};
  choreList.forEach(chore => {
    updates[`${chore.id}/archived`] = true;
  });

  choresRef.update(updates)
    .then(() => {
      choreList = choreList.map(chore => ({ ...chore, archived: true }));
      showTimestamps = false;
      localStorage.setItem('showTimestamps', 'false');
      renderChoreList();
      updateUserFilterOptions();
      showToast("All chores archived");
    })
    .catch(err => {
      console.error("Archive error:", err);
      showToast("❌ Failed to archive chores");
    });
}

// ==== Filter Options ====
function updateUserFilterOptions() {
  const users = Array.from(new Set(choreList.map(c => c.user))).sort();
  filterSelect.innerHTML = `<option value="All">All</option>` +
    users.map(u => `<option value="${u}">${u}</option>`).join('');
}

// ==== Toast Message ====
function showToast(msg = "Action done") {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==== Confetti Effect ====
function triggerConfetti() {
  document.body.classList.add('confetti-bg');
  setTimeout(() => document.body.classList.remove('confetti-bg'), 3000);
}

// ==== Basic HTML Sanitizer ====
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
