/*
  Family Chore Tracker – Updated Version
  Includes: localStorage saving, chore editing, clearing all chores,
  toggleable timestamps, and confetti placeholder.
*/

// Store all chores
let choreList = [];

// Toggle for showing timestamps
let showTimestamps = false;

// Save current choreList to localStorage
function saveChores() {
  localStorage.setItem('choreList', JSON.stringify(choreList));
}

// 🧾 Add new chore when form is submitted
function setupFormListener() {
  const choreForm = document.getElementById('chore-form');
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
    renderChoreList();
  });
}

// ✏️ Render all chores
function renderChoreList() {
  const choreListDiv = document.getElementById('chore-list');
  choreListDiv.innerHTML = '<h2>Your Chores</h2>';

  choreList.forEach(chore => {
    const choreItemDiv = document.createElement('div');
    choreItemDiv.classList.add('chore-item');

    const titleElem = document.createElement('h3');
    titleElem.textContent = chore.title;
    choreItemDiv.appendChild(titleElem);

    const descElem = document.createElement('p');
    descElem.textContent = chore.description;
    choreItemDiv.appendChild(descElem);

    // ⏰ Timestamp display
    if (showTimestamps && chore.timestamp) {
      const timeElem = document.createElement('p');
      const date = new Date(chore.timestamp);
      timeElem.textContent = 'Added: ' + date.toLocaleString();
      timeElem.style.fontSize = '0.8rem';
      timeElem.style.color = '#666';
      choreItemDiv.appendChild(timeElem);
    }

    // 📊 Progress bar
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

    // 🔁 Update Progress
    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update Progress';
    updateBtn.addEventListener('click', function () {
      updateChoreProgress(chore.id);
    });
    choreItemDiv.appendChild(updateBtn);

    // ✏️ Edit Button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Task';
    editBtn.style.marginLeft = '5px';
    editBtn.addEventListener('click', function () {
      editChore(chore.id);
    });
    choreItemDiv.appendChild(editBtn);

    // 🗑️ Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Chore';
    deleteBtn.style.marginLeft = '5px';
    deleteBtn.style.backgroundColor = '#f44336';
    deleteBtn.addEventListener('click', function () {
      deleteChore(chore.id);
    });
    choreItemDiv.appendChild(deleteBtn);

    choreListDiv.appendChild(choreItemDiv);

    if (chore.progress === 100) {
      triggerConfetti();
    }
  });
}

// ➕ Update Progress
function updateChoreProgress(choreId) {
  const chore = choreList.find(c => c.id === choreId);
  if (chore) {
    chore.progress = Math.min(chore.progress + 25, 100);
    saveChores();
    renderChoreList();
  }
}

// ✂️ Delete chore
function deleteChore(choreId) {
  choreList = choreList.filter(c => c.id !== choreId);
  saveChores();
  renderChoreList();
}

// ✏️ Edit chore
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

// 🧼 Clear all chores
function clearAllChores() {
  if (confirm('Delete all chores? This cannot be undone!')) {
    choreList = [];
    saveChores();
    renderChoreList();
  }
}

// 🎉 Confetti placeholder
function triggerConfetti() {
  console.log("🎉 Confetti! Chore completed.");
}

// 🔔 Simulated notification
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

// 🔄 Init after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const savedChores = localStorage.getItem('choreList');
  if (savedChores) {
    choreList = JSON.parse(savedChores);
  }

  // Attach form listener
  setupFormListener();

  // Render chore list
  renderChoreList();

  // Attach notify button
  const notifyBtn = document.getElementById('notify-btn');
  notifyBtn.addEventListener('click', simulateNotification);

  // Add extra buttons: Clear All + Toggle Timestamp
  const choreListDiv = document.getElementById('chore-list');
  const extraButtonsContainer = document.createElement('div');
  extraButtonsContainer.style.marginTop = '1rem';

  const clearAllBtn = document.createElement('button');
  clearAllBtn.textContent = 'Clear All Chores';
  clearAllBtn.addEventListener('click', clearAllChores);

  const toggleTimestampBtn = document.createElement('button');
  toggleTimestampBtn.textContent = 'Toggle Timestamps';
  toggleTimestampBtn.style.marginLeft = '10px';
  toggleTimestampBtn.addEventListener('click', () => {
    showTimestamps = !showTimestamps;
    renderChoreList();
  });

  extraButtonsContainer.appendChild(clearAllBtn);
  extraButtonsContainer.appendChild(toggleTimestampBtn);
  choreListDiv.before(extraButtonsContainer);
});
