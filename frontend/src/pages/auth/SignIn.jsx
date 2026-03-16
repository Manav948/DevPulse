import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import { GoogleLogin} from "@react-oauth/google";
import { FaGithub } from "react-icons/fa";

const SignIn = () => {
  const [form, setForm] = useState({
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
      const res = await api.post("/api/v1/auth/signIn", form);
      login(res.data);

      toast.success("SignIn successful");
      navigate("/dashboard");
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
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-black via-zinc-900 to-red-900 px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center">
          Sign In
        </h2>
        <p className="text-gray-400 text-center mt-2 mb-6">
          Welcome back
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full mb-6 px-4 py-3 rounded-lg bg-black/40 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition flex items-center justify-center font-semibold text-white mb-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>

          <div className="relative bg-[#18181b] px-4 text-sm text-gray-400">
            Or continue with
          </div>
        </div>

        <div className="flex space-x-2 space-y-1 mb-6 gap-5">

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
                console.log("Google auth error:", error);
                toast.error("Google login failed");
              }
            }}

            onError={() => {
              toast.error("Google login failed");
            }}
          />

          <button
            onClick={handleGithubLogin}
            className="w-full rounded-lg bg-white text-black hover:bg-white/80 transition flex items-center justify-center  border border-white/10 cursor-pointer"
          >
            <FaGithub className="mr-2" /> GitHub
          </button>

        </div>
      </div>
    </div>
  );
};

export default SignIn;