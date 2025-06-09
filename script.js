// app.js

let choreList = [];

// Load saved chores from localStorage (if any)
const savedChores = localStorage.getItem('choreList');
if (savedChores) {
  choreList = JSON.parse(savedChores);
  renderChoreList();
}

const choreForm = document.getElementById('chore-form');
const choreListDiv = document.getElementById('chore-list');
const notifyBtn = document.getElementById('notify-btn');

choreForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElementById('chore-title').value.trim();
  const description = document.getElementById('chore-description').value.trim();
  const progress = parseInt(document.getElementById('chore-progress').value, 10);

  if (!title || isNaN(progress)) {
    alert("Please fill in both title and valid progress.");
    return;
  }

  const newChore = {
    id: Date.now(),
    title,
    description,
    progress
  };

  choreList.push(newChore);
  localStorage.setItem('choreList', JSON.stringify(choreList));

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

    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update Progress';
    updateBtn.addEventListener('click', function() {
      updateChoreProgress(chore.id);
    });
    choreItemDiv.appendChild(updateBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Chore';
    deleteBtn.addEventListener('click', function() {
      deleteChore(chore.id);
    });
    choreItemDiv.appendChild(deleteBtn);

    choreListDiv.appendChild(choreItemDiv);

    if (chore.progress === 100) {
      triggerConfetti();
    }
  });
}

function updateChoreProgress(choreId) {
  const chore = choreList.find(c => c.id === choreId);
  if (chore) {
    chore.progress = Math.min(chore.progress + 25, 100);
    localStorage.setItem('choreList', JSON.stringify(choreList));
    renderChoreList();
  }
}

function deleteChore(choreId) {
  choreList = choreList.filter(c => c.id !== choreId);
  localStorage.setItem('choreList', JSON.stringify(choreList));
  renderChoreList();
}

function triggerConfetti() {
  console.log("Confetti! Chore completed.");
  // You can later integrate a visual effect here
}

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
