import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { FaGithub } from "react-icons/fa";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/api/v1/auth/signUp", form);
      login(res.data);
      toast.success("Signup successful");
      navigate("/signin");
    } catch (error) {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/github/callback`;

    const githubURL = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

    window.location.href = githubURL;
  };

  return (
    <div className="flex items-center justify-center min-h-screen 
      bg-linear-to-br from-black via-[#020617] to-green-900 px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-green-500/10 
        rounded-2xl p-8 shadow-[0_0_60px_rgba(34,197,94,0.12)] relative overflow-hidden">

        <div className="absolute inset-0 
          bg-linear-to-r from-green-500/20 via-emerald-400/10 to-transparent 
          blur-3xl opacity-40" />

        <h2 className="text-3xl font-bold text-white text-center relative z-10">
          Create Account
        </h2>

        <p className="text-gray-400 text-center mt-2 mb-6 relative z-10">
          Start monitoring your services
        </p>

        <form onSubmit={handleSubmit} className="relative z-10">

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#020617]/60 border border-green-500/10 
              text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 
              focus:border-green-400/30 transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#020617]/60 border border-green-500/10 
              text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 
              focus:border-green-400/30 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full mb-6 px-4 py-3 rounded-lg bg-[#020617]/60 border border-green-500/10
              text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 
              focus:border-green-400/30 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-linear-to-r from-green-500 to-emerald-600 
              hover:from-green-600 hover:to-emerald-700 transition flex items-center justify-center 
              font-semibold text-white mb-4 shadow-[0_0_20px_rgba(34,197,94,0.25)]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center mb-4 z-10">
          <span className=" px-4 text-sm text-gray-500 relative">
            Or continue with
          </span>
        </div>

        <div className="flex gap-4 mb-6 relative z-10">

          <div className="flex-1">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await api.post("/api/v1/auth/google", {
                    token: credentialResponse.credential,
                  });

                  login(res.data);
                  toast.success("Google login successful");
                  navigate("/dashboard");

                } catch (error) {
                  toast.error("Google login failed");
                }
              }}
              onError={() => toast.error("Google login failed")}
            />
          </div>

          <button
            onClick={handleGithubLogin}
            className="flex-1 py-2 rounded-lg 
              bg-[#020617]/60 text-gray-200 
              hover:bg-[#020617]/80 transition 
              flex items-center justify-center gap-2 
              border border-green-500/10"
          >
            <FaGithub /> GitHub
          </button>

        </div>
        
        <p className="text-gray-400 text-sm text-center relative z-10">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-green-400 hover:text-green-300 cursor-pointer"
          >
            Sign In
          </span>
        </p>

      </div>
    </div>
  );
};

export default SignUp;