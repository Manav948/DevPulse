import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import {Toaster} from "react-hot-toast"
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            className: 'bg-gray-800 text-white',
            style: {
              fontSize: '16px',
              padding: '10px 20px',
            },
          }}
        />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
