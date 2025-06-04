/* app.js */

/*
  This script manages the functionality of our Family Chore Tracker.
  We use Vanilla JavaScript to add, update, and delete chores,
  simulate push notifications, and trigger a confetti animation.
*/

// An array to temporarily store our chores (in a real app, data is likely stored on a server)
let choreList = [];

// Get references to key HTML elements for use in the code
const choreForm = document.getElementById('chore-form');
const choreListDiv = document.getElementById('chore-list');
const notifyBtn = document.getElementById('notify-btn');

// Event listener for form submission to add new chore
choreForm.addEventListener('submit', function(event) {
  // Prevents the page from refreshing when the form is submitted
  event.preventDefault();

  // Retrieve values from the form inputs
  const title = document.getElementById('chore-title').value;
  const description = document.getElementById('chore-description').value;
  const progress = parseInt(document.getElementById('chore-progress').value, 10); // Convert string input to number

  // Create a new chore object with a unique id (using the current timestamp)
  const newChore = {
    id: Date.now(),
    title: title,
    description: description,
    progress: progress
  };

  // Add the new chore to our array
  choreList.push(newChore);

  // Reset the form so that it is ready for the next entry
  choreForm.reset();

  // Update the list of chores displayed on the page
  renderChoreList();
});

/*
  Function: renderChoreList
  Purpose: Refresh the displayed chore list so that it reflects the current choreList array.
*/
function renderChoreList() {
  // Clear the existing chore list (except the heading)
  choreListDiv.innerHTML = '<h2>Your Chores</h2>';

  // Iterate over each chore and create its HTML representation
  choreList.forEach(chore => {
    // Create a container for an individual chore
    const choreItemDiv = document.createElement('div');
    choreItemDiv.classList.add('chore-item');

    // Create and append a header element for the chore title
    const titleElem = document.createElement('h3');
    titleElem.textContent = chore.title;
    choreItemDiv.appendChild(titleElem);

    // Create and append a paragraph element for the chore description
    const descElem = document.createElement('p');
    descElem.textContent = chore.description;
    choreItemDiv.appendChild(descElem);

    // Create a container for the progress bar
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('progress-bar-container');

    // Create the progress bar element (its width represents the progress percentage)
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    // Set the width of the bar equal to the chore's progress value plus a '%' symbol
    progressBar.style.width = chore.progress + '%';
    progressBar.textContent = chore.progress + '%';

    // Change the color of the progress bar based on its value for visual feedback
    if (chore.progress < 50) {
      progressBar.style.backgroundColor = 'red';
    } else if (chore.progress < 100) {
      progressBar.style.backgroundColor = 'orange';
    } else {
      progressBar.style.backgroundColor = 'green';
    }

    // Append the progress bar to its container, then add to the chore item
    progressContainer.appendChild(progressBar);
    choreItemDiv.appendChild(progressContainer);

    // Create an "Update Progress" button to simulate changing the chore progress
    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update Progress';
    updateBtn.addEventListener('click', function() {
      updateChoreProgress(chore.id);
    });
    choreItemDiv.appendChild(updateBtn);

    // Create a "Delete Chore" button to remove the chore
    const deleteBtn = document.createElement('button');
    deleteBtn.id = 'delete-btn';
    deleteBtn.textContent = 'Delete Chore';
    deleteBtn.addEventListener('click', function() {
      deleteChore(chore.id);
    });
    choreItemDiv.appendChild(deleteBtn);

    // Append the full chore item to the chore list container in the HTML
    choreListDiv.appendChild(choreItemDiv);

    // If the chore is fully completed (100%), trigger a confetti celebration
    if (chore.progress === 100) {
      triggerConfetti();
    }
  });
}

/*
  Function: updateChoreProgress
  Purpose: Increase the progress of a chore by 25% (up to a maximum of 100%), then refresh the list.
*/
function updateChoreProgress(choreId) {
  // Find the chore in the choreList array using its unique id
  const chore = choreList.find(c => c.id === choreId);
  if (chore) {
    // Increase progress by 25%, ensuring it does not exceed 100%
    chore.progress = Math.min(chore.progress + 25, 100);
    // Re-render the chore list to update the display
    renderChoreList();
  }
}

/*
  Function: deleteChore
  Purpose: Remove a chore from the choreList array based on its id and re-display the list.
*/
function deleteChore(choreId) {
  // Filter out the chore that matches the given id
  choreList = choreList.filter(c => c.id !== choreId);
  renderChoreList();
}

/*
  Function: triggerConfetti
  Purpose: Simulate a celebration when a chore is marked complete.
  Currently, it logs a message; later, you might replace this with a visual animation.
*/
function triggerConfetti() {
  console.log("Confetti! Chore completed.");
  // In a full version, insert code here to trigger a CSS or JavaScript-based confetti animation.
}

/*
  Function: simulateNotification
  Purpose: Demonstrate how a push notification might be created using the Notification API.
*/
function simulateNotification() {
  // Check if the Notification API is supported by the browser
  if ('Notification' in window) {
    // If permission has already been granted, create a notification immediately
    if (Notification.permission === 'granted') {
      new Notification("Reminder: Update your chore progress!", {
        body: "Click here to update the task assigned to you."
        // Additional options such as icons or action buttons can be added here later.
      });
    } 
    // Otherwise, request permission from the user
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // Retry sending the notification if granted
          simulateNotification();
        }
      });
    }
  } else {
    // Alert the user if notifications are not supported in their browser
    alert("This browser does not support desktop notifications.");
  }
}

// Attach an event listener to the "Simulate Notification" button
notifyBtn.addEventListener('click', simulateNotification);

// End of app.js
