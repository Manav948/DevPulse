import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignUp from "./pages/auth/SignUp"
import SignIn from "./pages/auth/SignIn"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
