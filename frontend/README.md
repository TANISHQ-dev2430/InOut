# Project: JSJIIT Admin Management System

## Overview
This project is a React-based Single Page Application (SPA) designed to manage superadmins, admins, and guards for JSJIIT. It includes features for authentication, user role management, and institute-based filtering.

## Features
- **Authentication**: Login and code-based login pages integrated with jsjiit.
- **User Role Management**: Superadmin, admin, and guard roles with dynamic filtering.
- **Institute-Based Filtering**: Lists are filtered to show data only for the logged-in user's institute.
- **Creation Forms**: Forms for creating superadmins, admins, and guards.
- **QR Code Scanning**: Integrated QR scanner for managing entry/exit records.
- **Digital ID Cards**: Profile section displaying student ID cards with QR codes.
- **UI/UX**: Modern interface styled using Tailwind CSS.
- **Firestore Integration**: Data storage and retrieval for user roles, access codes, and entry records.
- **Routing**: Navigation between pages using React Router.
- **Local Storage Context**: Custom context for managing logged-in user state.

## File Structure
```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── CodeLogin.jsx
│   │   ├── SuperAdmin.jsx
│   │   ├── SuperAdminCreate.jsx
│   │   ├── admin.jsx
│   │   └── adminCreate.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── App.css
├── eslint.config.js
├── vite.config.js
├── package.json
└── README.md
```

## Setup Instructions
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the development server using `npm run dev`.
4. Ensure Firestore is configured in `firebase.js`.

## Key Files
- **`AuthContext.js`**: Manages user state using local storage.
- **`admin.jsx`**: Displays admin list filtered by institute.
- **`SuperAdmin.jsx`**: Displays superadmin list filtered by institute.
- **`adminCreate.jsx`**: Form for creating admins and guards.
- **`SuperAdminCreate.jsx`**: Form for creating superadmins.
- **`Guard.jsx`**: Handles QR code scanning and entry/exit management.
- **`Profile.jsx`**: Displays student ID cards with QR codes.

## Technologies Used
- React 18
- Tailwind CSS
- Firebase Firestore
- Vite
- React Router
- QR Scanner Library
- React Context API

## Future Enhancements
- Add Firebase Authentication.
- Improve error handling and validation.
- Enhance UI/UX with animations and transitions.
- Add real-time entry/exit notifications.
- Implement batch QR code generation.
- Add detailed entry/exit analytics.
- Enable offline mode support.

## Contributors
- **Owner**: TANISHQ-dev2430

