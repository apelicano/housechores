# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Introduced per-user chore storage using Firebase Realtime Database paths: `users/$uid/chores`
- Implemented secure authentication using Firebase Anonymous Auth
- Added user-specific metadata storage at `users/$uid/meta`
- Updated Firebase security rules to enforce `auth.uid === $uid` access control
- Chores are now isolated per user and no longer globally visible

### Changed
- Replaced global `chores` node with dynamic per-user `choresRef`
- Updated chore creation, update, delete, and filtering logic to use `users/$uid/chores`

---

## [0.2.0] – 2025-06-15

### Added
- Archiving and unarchiving of chores
- Toggle button to show/hide archived chores
- Option to filter chores by assigned user
- UI support for timestamps with localStorage-based toggle

---

## [0.1.0] – 2025-06-10

### Added
- Initial release
- Firebase Realtime Database integration (test mode)
- Basic chore creation with title, description, and progress
- Inline progress update and delete buttons
- Confetti effect on 100% completion
