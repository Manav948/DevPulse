import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../lib/axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const GithubCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGithubUser = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get("code");

        if (!code) {
          toast.error("GitHub authorization failed");
          navigate("/signin");
          return;
        }

        const res = await api.post("/api/v1/auth/github", { code });
        login(res.data);
        toast.success("GitHub login successful");
        navigate("/dashboard");
      } catch (error) {
        console.error("GitHub auth error:", error);
        toast.error("GitHub authentication failed");
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchGithubUser();
  }, [location.search, navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-black via-zinc-900 to-red-900">
      <div className="text-white text-xl flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        Processing GitHub Authentication...
      </div>
    </div>
  );
};

export default GithubCallback;
