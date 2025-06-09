# 🧹 Family Chore Tracker

A fun and simple web app to help families organize, track, and complete household chores — together! Built with plain HTML, CSS, and JavaScript (no fancy frameworks), this app teaches responsibility, encourages teamwork, and celebrates accomplishments with confetti 🎉.

---

## ✨ Features

- ✅ **Add New Chores** – Assign tasks with a title, description, and progress level
- 📊 **Track Progress** – Update chores in 25% increments until complete
- ✏️ **Edit Tasks** – Quickly change a task's details or progress
- 🗑️ **Delete Individual Tasks** – Remove completed or canceled chores
- 🧹 **Clear All** – Wipe the slate clean with one click
- ⏱️ **Timestamps** – Toggle when chores were added
- 🔔 **Notification Demo** – Simulate desktop reminders (with permission)
- 💾 **Local Storage** – All tasks are saved in the browser, so they won’t disappear on refresh

---

## 🧒 Who It's For

Designed with kids (and busy parents!) in mind:

- Easy to use
- Big buttons
- Simple layout
- Educational logic (progress bars, task ownership, positive feedback)

---

## 🚀 Getting Started

### 1. Clone this Repo

```bash
git clone https://github.com/your-username/family-chore-tracker.git
cd family-chore-tracker
````

### 2. Open `index.html` in a browser

You’re done! The app works entirely in the browser, no server needed.

---

## 🧠 How It Works

* All chores are stored in the browser’s **Local Storage**
* Data is loaded when the app starts and saved automatically
* Confetti appears when chores reach 100% progress 🎉
* "Simulate Notification" uses the **Web Notification API** to show reminders (if supported)

---

## 📁 Project Structure

```
📦 family-chore-tracker/
├── index.html       → Main HTML file
├── style.css        → Styling (progress bars, layout, buttons)
└── script.js        → All logic for chores, localStorage, and UI interactions
```

---

## 📸 Preview

![Screenshot of the app](screenshot.png)

---

## ❤️ Credits

Built with ❤️ by \[Your Name or Family Name].
Created to help families work and grow together!

---

## 📄 License

This project is open-source and free to use under the [MIT License](LICENSE).