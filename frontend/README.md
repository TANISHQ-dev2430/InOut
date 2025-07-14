# Project: JSJIIT Admin Management System

## Overview
This project is a React-based Single Page Application (SPA) designed to manage superadmins, admins, and guards for JSJIIT. It includes features for authentication, user role management, and institute-based filtering.

## Features
- **Authentication**: Login and code-based login pages integrated with jsjiit.
- **User Role Management**: Superadmin, admin, and guard roles with dynamic filtering.
- **Institute-Based Filtering**: Lists are filtered to show data only for the logged-in user's institute.
- **Creation Forms**: Forms for creating superadmins, admins, and guards.
- **UI/UX**: Styled using Tailwind CSS.
- **Firestore Integration**: Data storage and retrieval for user roles and access codes.
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

## Technologies Used
- React
- Tailwind CSS
- Firebase Firestore
- Vite
- React Router

## Future Enhancements
- Add Firebase Authentication.
- Improve error handling and validation.
- Enhance UI/UX with animations and transitions.

## Contributors
- **Owner**: messi-dev10
- **Collaborators**: [Add names here]

## License
[Specify license here]

