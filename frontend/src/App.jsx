import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignUp from "./pages/auth/SignUp"
import SignIn from "./pages/auth/SignIn"
import GithubCallback from "./pages/auth/GithubCallback"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/github/callback" element={<GithubCallback />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
