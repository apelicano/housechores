/*
  Family Chore Tracker – Fully Enhanced
  Features:
  - localStorage saving
  - chore editing
  - clear all chores
  - toggleable timestamps (via checkbox)
  - toast notification on clear
*/
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBpCw-2-e8rR-4hZGE32-Ug6KJJcKSHnn8",
    authDomain: "family-chore-tracker-db5b2.firebaseapp.com",
    databaseURL: "https://family-chore-tracker-db5b2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "family-chore-tracker-db5b2",
    storageBucket: "family-chore-tracker-db5b2.firebasestorage.app",
    messagingSenderId: "1021277258690",
    appId: "1:1021277258690:web:2bd82da2661448fc800c5b"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Realtime Database reference
  const db = firebase.database();
  const choresRef = db.ref("chores");

let choreList = [];
let showTimestamps = false;

// DOM References
const choreForm = document.getElementById('chore-form');
const choreListDiv = document.getElementById('chore-list');
// const notifyBtn = document.getElementById('notify-btn'); // Not in use currently

// 🔒 Simple HTML sanitizer: allows <em>, <strong>, <a href="...">
function sanitizeHTML(input) {
  const allowedTags = {
    'EM': [],
    'STRONG': [],
    'A': ['href', 'target', 'rel']
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');

  function clean(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.cloneNode();
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toUpperCase();

      if (allowedTags.hasOwnProperty(tagName)) {
        const el = document.createElement(tagName);

        allowedTags[tagName].forEach(attr => {
          if (node.hasAttribute(attr)) {
            const val = node.getAttribute(attr);
            if (attr === 'href') {
              if (/^(https?:|mailto:)/i.test(val)) {
                el.setAttribute(attr, val);
              }
            } else {
              el.setAttribute(attr, val);
            }
          }
        });

        node.childNodes.forEach(child => {
          const cleanChild = clean(child);
          if (cleanChild) el.appendChild(cleanChild);
        });

        return el;
      } else {
        // Not allowed: skip tag but keep children
        const fragment = document.createDocumentFragment();
        node.childNodes.forEach(child => {
          const cleanChild = clean(child);
          if (cleanChild) fragment.appendChild(cleanChild);
        });
        return fragment;
      }
    }

    return null;
  }

  const safeFragment = document.createDocumentFragment();
  doc.body.childNodes.forEach(child => {
    const cleanNode = clean(child);
    if (cleanNode) safeFragment.appendChild(cleanNode);
  });

  const tempDiv = document.createElement('div');
  tempDiv.appendChild(safeFragment);
  return tempDiv.innerHTML;
}

// Load state from localStorage + Firebase on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedTimestampToggle = localStorage.getItem('showTimestamps');
  if (savedTimestampToggle) showTimestamps = savedTimestampToggle === 'true';

  const clearAllBtn = document.getElementById('clear-all-btn');
  if (clearAllBtn) clearAllBtn.addEventListener('click', clearAllChores);

  const checkbox = document.getElementById('toggle-timestamp-checkbox');
  const checkboxWrapper = document.getElementById('timestamp-toggle-wrapper');
  if (checkbox) checkbox.checked = showTimestamps;

  // 🔥 Load from Firebase
  choresRef.on('value', (snapshot) => {
    const data = snapshot.val();
    choreList = data ? data : [];

    // Show timestamp toggle if any chores exist
    if (checkboxWrapper) checkboxWrapper.style.display = choreList.length ? 'block' : 'none';

    renderChoreList();
  });
});


// Save chores to Firebase Realtime Database
function saveChores() {
  choresRef.set(choreList);
}


// Add new chore
choreForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('chore-title').value;
  const description = document.getElementById('chore-description').value;
  const progress = parseInt(document.getElementById('chore-progress').value, 10);

  const newChore = {
    id: Date.now(),
    title,
    description,
    progress,
    timestamp: new Date().toISOString()
  };

  choreList.push(newChore);
  saveChores();
  choreForm.reset();

  // Show timestamp toggle if it was hidden
  const checkboxWrapper = document.getElementById('timestamp-toggle-wrapper');
  if (checkboxWrapper) checkboxWrapper.style.display = 'block';

  renderChoreList();
});

// Render all chores
function renderChoreList() {
  choreListDiv.innerHTML = '<h2>Your Chores</h2>';

  choreList.forEach(chore => {
    const choreItemDiv = document.createElement('div');
    choreItemDiv.classList.add('chore-item');

    const titleElem = document.createElement('h3');
    titleElem.textContent = chore.title;
    choreItemDiv.appendChild(titleElem);

    const descElem = document.createElement('p');
    descElem.innerHTML = sanitizeHTML(chore.description).replace(/\n/g, '<br>');
    // deprecated after sanitizeHTML implementation
    // descElem.textContent = chore.description;
    choreItemDiv.appendChild(descElem);

    // Optional Timestamp
    if (showTimestamps && chore.timestamp) {
      const timeElem = document.createElement('p');
      const date = new Date(chore.timestamp);
      timeElem.textContent = 'Added: ' + date.toLocaleString();
      timeElem.style.fontSize = '0.8rem';
      timeElem.style.color = '#666';
      choreItemDiv.appendChild(timeElem);
    }

    // Progress Bar
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('progress-bar-container');

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressBar.style.width = chore.progress + '%';
    progressBar.textContent = chore.progress + '%';

    if (chore.progress < 50) {
      progressBar.style.backgroundColor = 'red';
    } else if (chore.progress < 100) {
      progressBar.style.backgroundColor = 'orange';
    } else {
      progressBar.style.backgroundColor = 'green';
    }

    progressContainer.appendChild(progressBar);
    choreItemDiv.appendChild(progressContainer);

    // Buttons
    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update Progress';
    updateBtn.addEventListener('click', () => updateChoreProgress(chore.id));
    choreItemDiv.appendChild(updateBtn);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Task';
    editBtn.style.marginLeft = '5px';
    editBtn.addEventListener('click', () => editChore(chore.id));
    choreItemDiv.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Chore';
    deleteBtn.style.marginLeft = '5px';
    deleteBtn.style.backgroundColor = '#f44336';
    deleteBtn.addEventListener('click', () => deleteChore(chore.id));
    choreItemDiv.appendChild(deleteBtn);

    choreListDiv.appendChild(choreItemDiv);

    if (chore.progress === 100) {
      triggerConfetti();
    }
  });
}

// Update progress
function updateChoreProgress(choreId) {
  const chore = choreList.find(c => c.id === choreId);
  if (chore) {
    chore.progress = Math.min(chore.progress + 25, 100);
    saveChores();
    renderChoreList();
  }
}

// Delete chore
function deleteChore(choreId) {
  choreList = choreList.filter(c => c.id !== choreId);
  saveChores();
  renderChoreList();

  // Hide timestamp toggle if list is now empty
  if (choreList.length === 0) {
    const checkboxWrapper = document.getElementById('timestamp-toggle-wrapper');
    if (checkboxWrapper) checkboxWrapper.style.display = 'none';
  }
}

// Edit chore
function editChore(choreId) {
  const chore = choreList.find(c => c.id === choreId);
  if (chore) {
    const newTitle = prompt('Edit title:', chore.title);
    const newDesc = prompt('Edit description:', chore.description);
    const newProgress = prompt('Edit progress (0–100):', chore.progress);

    if (newTitle !== null && newDesc !== null && newProgress !== null) {
      chore.title = newTitle.trim();
      chore.description = newDesc.trim();
      const parsedProgress = parseInt(newProgress);
      chore.progress = isNaN(parsedProgress) ? chore.progress : Math.max(0, Math.min(100, parsedProgress));
      saveChores();
      renderChoreList();
    }
  }
}

// Clear all chores
function clearAllChores() {
  if (confirm('Delete all chores? This cannot be undone!')) {
    choreList = [];
    choresRef.set([]); // 🔥 Clear in Firebase

    // Reset timestamp state and hide toggle
    showTimestamps = false;
    localStorage.setItem('showTimestamps', 'false');

    const checkbox = document.getElementById('toggle-timestamp-checkbox');
    const wrapper = document.getElementById('timestamp-toggle-wrapper');
    if (checkbox) checkbox.checked = false;
    if (wrapper) wrapper.style.display = 'none';

    renderChoreList();
    showToast("All chores cleared");
  }
}


// Simulate confetti
function triggerConfetti() {
  console.log("🎉 Confetti! Chore completed.");
  document.body.classList.add('confetti-bg');

  setTimeout(() => {
    document.body.classList.remove('confetti-bg');
  }, 3000);
}


// 🔔 Notification simulation (currently unused)
/*
function simulateNotification() {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification("Reminder: Update your chore progress!", {
        body: "Click here to update the task assigned to you."
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          simulateNotification();
        }
      });
    }
  } else {
    alert("This browser does not support desktop notifications.");
  }
}
*/


// Handle toggle timestamp checkbox
const timestampCheckbox = document.getElementById('toggle-timestamp-checkbox');
if (timestampCheckbox) {
  timestampCheckbox.addEventListener('change', () => {
    showTimestamps = timestampCheckbox.checked;
    localStorage.setItem('showTimestamps', showTimestamps);
    renderChoreList();
  });
}

// 📣 Attach event listener to Notify button (currently disabled)
/*
notifyBtn.addEventListener('click', simulateNotification);
*/


// Show toast message
function showToast(message = "Action completed") {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// code snippet from firebase

  // Import the functions you need from the SDKs you need
  
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

