import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { FaGithub } from "react-icons/fa";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

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
      const res = await api.post("/api/v1/auth/signIn", form);
      login(res.data);

      toast.success("SignIn successful");
      navigate(from, { replace: true });
    } catch (error) {
      console.log("SignIn error:", error);
      toast.error("SignIn failed");
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

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-green-500/10 
        rounded-2xl p-8 shadow-[0_0_40px_rgba(34,197,94,0.15)] relative overflow-hidden">

        <div className="absolute inset-0 
          bg-linear-to-r from-green-500/10 via-emerald-400/10 to-transparent 
          blur-2xl opacity-50" />

        <h2 className="text-3xl font-bold text-white text-center z-10 relative">
          Sign In
        </h2>

        <p className="text-gray-400 text-center mt-2 mb-6 relative z-10">
          Welcome back
        </p>

        <form onSubmit={handleSubmit} className="relative z-10">

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg bg-white/5 border border-white/10 
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 
              transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full mb-6 px-4 py-3 rounded-lg bg-white/5 border border-white/10 
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 
              transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-linear-to-r from-green-500 to-emerald-600 
              hover:from-green-600 hover:to-emerald-700 transition flex items-center justify-center 
              font-semibold text-white mb-4 shadow-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center mb-4 z-10">
          <span className="px-4 text-sm text-gray-400 relative">
            Or continue with
          </span>
        </div>

        <div className="flex gap-4 mb-6 z-10 relative">
          <div className="flex-1">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await api.post("/api/v1/auth/google", {
                    token: credentialResponse.credential,
                  });

                  login(res.data);
                  toast.success("Google login successful");
                  navigate(from, { replace: true });

                } catch (error) {
                  toast.error("Google login failed");
                }
              }}
              onError={() => toast.error("Google login failed")}
            />
          </div>

          {/* <button
            onClick={handleGithubLogin}
            className="flex-1 py-2 rounded-lg 
              bg-white/10 text-white 
              hover:bg-white/20 transition 
              flex items-center justify-center gap-2 
              border border-white/10"
          >
            <FaGithub /> GitHub
          </button> */}

        </div>

        {/* Footer */}
        <p className="text-gray-400 text-sm text-center relative z-10">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-green-400 hover:text-green-300 cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;