import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignUp from "./pages/auth/SignUp"
import SignIn from "./pages/auth/SignIn"
import GithubCallback from "./pages/auth/GithubCallback"
import Dashboard from "./pages/dashboard/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/github/callback" element={<GithubCallback />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
