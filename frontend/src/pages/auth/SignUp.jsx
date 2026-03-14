import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'

const SignUp = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading , isLoading] = useState(false);
  const navigate = useNavigate()
  return (
    <div>

    </div>
  )
}

export default SignUp
