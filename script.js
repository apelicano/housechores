// Add a new global variable to track whether timestamps should be shown
let showTimestamps = false;

// Add Clear All and Toggle Timestamp buttons to the DOM
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
choreListDiv.before(extraButtonsContainer); // Add buttons above the chore list

// Add timestamp when a new chore is created
choreForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElementById('chore-title').value;
  const description = document.getElementById('chore-description').value;
  const progress = parseInt(document.getElementById('chore-progress').value, 10);

  const newChore = {
    id: Date.now(), // unique ID
    title,
    description,
    progress,
    timestamp: new Date().toISOString() // Save when it was created
  };

  choreList.push(newChore);
  saveChores();
  choreForm.reset();
  renderChoreList();
});

function renderChoreList() {
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

    if (showTimestamps && chore.timestamp) {
      const timeElem = document.createElement('p');
      const date = new Date(chore.timestamp);
      timeElem.textContent = 'Added: ' + date.toLocaleString();
      timeElem.style.fontSize = '0.8rem';
      timeElem.style.color = '#666';
      choreItemDiv.appendChild(timeElem);
    }

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

    // Update progress
    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update Progress';
    updateBtn.addEventListener('click', function () {
      updateChoreProgress(chore.id);
    });
    choreItemDiv.appendChild(updateBtn);

    // NEW: Update Task button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Task';
    editBtn.style.marginLeft = '5px';
    editBtn.addEventListener('click', function () {
      editChore(chore.id);
    });
    choreItemDiv.appendChild(editBtn);

    // Delete
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Chore';
    deleteBtn.style.marginLeft = '5px';
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

// NEW: Edit chore content (title, description, progress)
function editChore(choreId) {
  const chore = choreList.find(c => c.id === choreId);
  if (chore) {
    const newTitle = prompt('Update title:', chore.title);
    const newDescription = prompt('Update description:', chore.description);
    const newProgress = prompt('Update progress (0–100):', chore.progress);

    if (newTitle !== null && newDescription !== null && newProgress !== null) {
      chore.title = newTitle.trim();
      chore.description = newDescription.trim();
      const progressValue = parseInt(newProgress);
      chore.progress = isNaN(progressValue) ? chore.progress : Math.max(0, Math.min(100, progressValue));
      saveChores();
      renderChoreList();
    }
  }
}

// NEW: Clear all chores
function clearAllChores() {
  if (confirm('Are you sure you want to delete all chores?')) {
    choreList = [];
    saveChores();
    renderChoreList();
  }
}