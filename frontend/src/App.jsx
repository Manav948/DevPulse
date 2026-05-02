import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import SignUp from "./pages/auth/SignUp"
import SignIn from "./pages/auth/SignIn"
import GithubCallback from "./pages/auth/GithubCallback"
import Dashboard from "./pages/dashboard/Dashboard"
import AddMonitor from "./pages/AddMonitor/AddMonitor"
import Settings from "./pages/settings/Settings"
import Home from "./pages/Home/Home"
import ProtectedRoute from "./components/ProtectedRoute"
import UpdateMonitor from "./components/updateMonitor"

// Redirect already-authenticated users away from auth pages
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const hasToken = !!localStorage.getItem("token");
  return isAuthenticated || hasToken ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth pages — redirect to dashboard if already signed in */}
        <Route path="/signup" element={<PublicOnlyRoute><SignUp /></PublicOnlyRoute>} />
        <Route path="/signin" element={<PublicOnlyRoute><SignIn /></PublicOnlyRoute>} />

        {/* OAuth callback — no guard needed */}
        <Route path="/github/callback" element={<GithubCallback />} />

        {/* Protected pages — redirect to /signin if not authenticated */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><AddMonitor /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/update" element={<ProtectedRoute><UpdateMonitor /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
