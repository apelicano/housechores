/* script.js */

/*
  This script manages the functionality of our Family Chore Tracker.
  We've now added localStorage to save chores in the browser so data doesn't disappear on refresh.
*/

// Initialize the chore list from localStorage, or start with an empty array if none exists
let choreList = JSON.parse(localStorage.getItem('choreList')) || [];

// Get references to key HTML elements for use in the code
const choreForm = document.getElementById('chore-form');
const choreListDiv = document.getElementById('chore-list');
const notifyBtn = document.getElementById('notify-btn');

// Render any saved chores when the page loads
renderChoreList();

// Event listener for form submission to add a new chore
choreForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent page from refreshing

  const title = document.getElementById('chore-title').value;
  const description = document.getElementById('chore-description').value;
  const progress = parseInt(document.getElementById('chore-progress').value, 10);

  const newChore = {
    id: Date.now(), // Unique ID based on timestamp
    title,
    description,
    progress
  };

  choreList.push(newChore); // Add the new chore to the list
  saveChores(); // Save updated list to localStorage
  choreForm.reset(); // Clear form fields
  renderChoreList(); // Refresh the display
});

/*
  Function: renderChoreList
  Purpose: Show the latest list of chores on the screen.
*/
function renderChoreList() {
  // Clear current display (but keep heading)
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

    const progressContainer = document.createElement('div');
    progressContainer.classList.add('progress-bar-container');

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressBar.style.width = chore.progress + '%';
    progressBar.textContent = chore.progress + '%';

    // Change color depending on how much is done
    if (chore.progress < 50) {
      progressBar.style.backgroundColor = 'red';
    } else if (chore.progress < 100) {
      progressBar.style.backgroundColor = 'orange';
    } else {
      progressBar.style.backgroundColor = 'green';
    }

    progressContainer.appendChild(progressBar);
    choreItemDiv.appendChild(progressContainer);

    // Button to update progress
    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update Progress';
    updateBtn.addEventListener('click', function() {
      updateChoreProgress(chore.id);
    });
    choreItemDiv.appendChild(updateBtn);

    // Button to delete the chore
    const deleteBtn = document.createElement('button');
    deleteBtn.id = 'delete-btn';
    deleteBtn.textContent = 'Delete Chore';
    deleteBtn.addEventListener('click', function() {
      deleteChore(chore.id);
    });
    choreItemDiv.appendChild(deleteBtn);

    choreListDiv.appendChild(choreItemDiv);

    // If progress is 100%, trigger a "celebration"
    if (chore.progress === 100) {
      triggerConfetti();
    }
  });
}

/*
  Function: updateChoreProgress
  Purpose: Add 25% progress to a chore (max 100%) and save.
*/
function updateChoreProgress(choreId) {
  const chore = choreList.find(c => c.id === choreId);
  if (chore) {
    chore.progress = Math.min(chore.progress + 25, 100); // Don’t go over 100%
    saveChores(); // Save changes to localStorage
    renderChoreList(); // Refresh display
  }
}

/*
  Function: deleteChore
  Purpose: Remove a chore from the list and update storage.
*/
function deleteChore(choreId) {
  choreList = choreList.filter(c => c.id !== choreId); // Keep everything except the deleted one
  saveChores(); // Save new list
  renderChoreList(); // Refresh display
}

/*
  Function: triggerConfetti
  Purpose: Visual celebration placeholder when a chore is done.
*/
function triggerConfetti() {
  console.log("Confetti! Chore completed.");
  // In a real app, add animated confetti here!
}

/*
  Function: simulateNotification
  Purpose: Show a browser notification reminding users about chores.
*/
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

// Listen for the "Simulate Notification" button click
notifyBtn.addEventListener('click', simulateNotification);

/*
  Function: saveChores
  Purpose: Save the current chore list to the browser’s local storage.
  This makes data persistent even when you refresh the page.
*/
function saveChores() {
  localStorage.setItem('choreList', JSON.stringify(choreList));
}

// End of script.js