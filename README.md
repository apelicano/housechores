# 🧹 Family Chore Tracker

A simple, responsive family-friendly web app for tracking household chores.

![screenshot](./screenshot.png) <!-- Optional, if you have one -->

---

## 🚀 Features

- ✅ Add, edit, update progress, or delete chores
- 🎉 Visual confetti when a chore is completed (100%)
- 📈 Progress bar for each chore
- 🕒 Optional timestamp toggle for each chore
- ☁️ **Firebase Realtime Database** integration (no more localStorage)
- 🔒 Simple HTML sanitization (safe usage of `<em>`, `<strong>`, `<a>`)
- 🥳 Lightweight and mobile-friendly
- 🔔 Ready for future notification features

---

## 🔧 Tech Stack

- HTML5, CSS3, JavaScript (vanilla)
- Firebase Realtime Database (via [Firebase JavaScript SDK (Compat)](https://firebase.google.com/docs/web/setup))
- Hosted via GitHub Pages

---

## 🔌 Setup Instructions

### 1. 🔥 Firebase Setup

1. Create a [Firebase project](https://console.firebase.google.com/)
2. Enable **Realtime Database**
3. Set database **location** (e.g., `asia-southeast1` for Philippines/Singapore)
4. Set **Database Rules** to:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
````

> ⚠️ **Important**: This rule is open and insecure. For private/family use only. For public access, configure [proper security rules](https://firebase.google.com/docs/database/security).

---

### 2. 🧩 Add Firebase SDK to your `index.html`

```html
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js"></script>
```

---

### 3. 🔐 Initialize Firebase in `script.js`

```js
// Firebase config (safe for client-side in most cases)
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
const db = firebase.database();
```

---

### 4. 🧠 Data Structure

Chores are stored under `chores/` in the Realtime Database, with each chore being:

```json
{
  "id": 1234567890,
  "title": "Wash Dishes",
  "description": "Don't forget to clean the sink!",
  "progress": 75,
  "timestamp": "2025-06-09T10:00:00.000Z"
}
```

---

### 5. 🧪 Local Dev Tips

* Use `localhost` or GitHub Pages to test
* Keep secrets like API keys out of public repos for production apps
* You can reset your Firebase API key anytime in the console

---

## ✅ Todo / Roadmap

* [x] Firebase migration
* [x] Clean HTML sanitizer for safe rich-text descriptions
* [ ] Firebase Auth (optional login)
* [ ] Scheduled reminders / push notifications
* [ ] Filter chores by family member or due date
* [ ] Monthly summaries / charts

---

## 👨‍👩‍👧‍👦 Why this app?

Built to help my kids stay on top of their responsibilities — and make chores feel like progress bars in a game!

---

## 🛠 Author

Created by **[apelicano](https://github.com/apelicano)**

---

## 📄 License

MIT License — free to use and modify for your family, too.