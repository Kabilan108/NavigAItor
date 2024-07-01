import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import OAuthCallback from "@/pages/oauth-callback";
import Dashboard from "@/pages/dashboard";
import LandingPage from "@/pages/landing";
import SignupPage from "@/pages/signup";
import LoginPage from "@/pages/login";

import { ThemeProvider } from "@/context/theme-provider";
import { AuthProvider } from "@/context/auth-provider";
import { TabProvider } from "@/context/tab-provider";
import { useAuth } from "@/lib/hooks";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <TabProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<Dashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/oauth-callback" element={<OAuthCallback />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </TabProvider>
    </AuthProvider>
  );
}

export default App;
