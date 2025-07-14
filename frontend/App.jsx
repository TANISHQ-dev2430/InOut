import React, { useState, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./src/pages/login";
import Profile from "./src/pages/profile";
import Guard from "./src/pages/Guard";
import SuperAdmin from "./src/pages/SuperAdmin";
import SuperAdminCreate from "./src/pages/SuperAdminCreate";
import CodeLogin from "./src/pages/CodeLogin";
import Header from "./src/components/Header";
import Community from "./src/pages/Community";
import LostAndFound from "./src/pages/LostAndFound";
import Loader from "./src/components/Loader";
import Admin from "./src/pages/admin";
import AdminCreate from "./src/pages/adminCreate";
import { AuthProvider } from "./src/context/AuthContext";

// Main App component that handles routing and state management
function App() {
  const [portalInstance, setPortalInstance] = useState(null);

  return (
    <AuthProvider>
      <Router>
        <div style={{ backgroundColor: '#1E1E1E', minHeight: '100vh' }}>
          {portalInstance && <Header />}
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route
                path="/"
                element={
                  portalInstance ? (
                    <Navigate to="/profile" />
                  ) : (
                    <Login onLoginSuccess={(portal) => setPortalInstance(portal)} />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  portalInstance ? (
                    <Profile w={portalInstance} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/community"
                element={
                  portalInstance ? (
                    <Community />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/lost-and-found"
                element={
                  portalInstance ? (
                    <LostAndFound />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/guard"
                element={<Guard />}
              />
              <Route
                path="/superadmin"
                element={<SuperAdmin />}
              />
              <Route
                path="/superadmincreate"
                element={<SuperAdminCreate />}
              />
              <Route
                path="/codelogin"
                element={<CodeLogin />}
              />
              <Route
                path="/admin"
                element={<Admin />}
              />
              <Route
                path="/adminCreate"
                element={<AdminCreate />}
              />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;