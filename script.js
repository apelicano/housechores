// Add your JavaScript code here
const choreList = document.querySelector('.chore-list');
// This line selects the element with the class 'chore-list' and stores it in the 'choreList' variable.
// This is where we will append the chore cards.

// Sample chore data
const chores = [
  {
    title: 'Wash the dishes',
    description: 'Wash all the dirty dishes in the sink.',
    progress: 50
  },
  {
    title: 'Vacuum the living room',
    description: 'Vacuum the entire living room floor.',
    progress: 75
  },
  {
    title: 'Tidy up your room',
    description: 'Make your bed, put away your toys, and organize your desk.',
    progress: 25
  }
];
// This is a sample array of chore objects, each with a title, description, and progress.
// In a real-world scenario, this data would likely come from a backend API or a database.

// Function to create a chore card
function createChoreCard(chore) {
  // This function takes a chore object as an argument and returns a new chore card element.

  const choreCard = document.createElement('div');
  // Create a new 'div' element to represent the chore card.
  choreCard.classList.add('chore-card');
  // Add the 'chore-card' class to the chore card element.

  const choreTitle = document.createElement('h3');
  // Create a new 'h3' element to hold the chore title.
  choreTitle.textContent = chore.title;
  // Set the text content of the chore title element to the 'title' property of the chore object.

  const choreDescription = document.createElement('p');
  // Create a new 'p' element to hold the chore description.
  choreDescription.textContent = chore.description;
  // Set the text content of the chore description element to the 'description' property of the chore object.

  const progressBar = document.createElement('div');
  // Create a new 'div' element to represent the progress bar.
  progressBar.classList.add('progress-bar');
  // Add the 'progress-bar' class to the progress bar element.

  const progressBarFill = document.createElement('div');
  // Create a new 'div' element to represent the progress bar fill.
  // This element will be used to visually represent the progress of the chore.

  // Append the chore title, description, and progress bar to the chore card
  choreCard.appendChild(choreTitle);
  choreCard.appendChild(choreDescription);
  choreCard.appendChild(progressBar);
  progressBar.appendChild(progressBarFill);

  return choreCard;
  // Return the completed chore card element.
}

// Loop through the chore data and create chore cards
chores.forEach(chore => {
  // For each chore object in the 'chores' array, call the 'createChoreCard' function.
  const choreCard = createChoreCard(chore);
  // The 'createChoreCard' function returns a new chore card element.

  choreList.appendChild(choreCard);
  // Append the new chore card element to the 'choreList' container.
});
