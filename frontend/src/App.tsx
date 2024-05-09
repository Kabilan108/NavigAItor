import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/Landing";
import LoginPage from "@/pages/LogIn";
import MainApp from "@/pages/App";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<MainApp />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
