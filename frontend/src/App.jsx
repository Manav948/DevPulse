import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignUp from "./pages/auth/SignUp"
import SignIn from "./pages/auth/SignIn"
import GithubCallback from "./pages/auth/GithubCallback"
import Dashboard from "./pages/dashboard/Dashboard"
import AddMonitor from "./pages/AddMonitor/AddMonitor"
import Settings from "./pages/settings/Settings"
import Home from "./pages/Home/Home"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddMonitor />} />
        <Route path="/github/callback" element={<GithubCallback />} />
        <Route path="/profile" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
