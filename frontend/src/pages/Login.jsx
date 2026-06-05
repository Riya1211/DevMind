import React, { useState } from "react";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/api/authAPI";
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      // save token to localStorage so it persists on refresh
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      if(result){
        toast.success(result.message);
      }
      navigate("/"); // go to dashboard
    } catch (err) {
      toast.error("Sign In Fail");
    }
  };

  return (
    <div className="relative h-screen">
      <div className="w-[346px] py-8 flex flex-col items-center justify-center bg-[#111118] border border-[#ffffff0f] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[13px]">
        <Logo />
        <div className="font-heading font-extrabold text-[1.4rem] mt-3">
          Welcome Back
        </div>
        <div className="font-body text-[0.65rem]">
          sign in to your dev journal
        </div>
        <div className="mt-5 font-body w-full px-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-1">
            {/* Email */}
            <h5 className="text-[0.65rem]">EMAIL</h5>
            <input
              type="email"
              placeholder="you@dev.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border border-[#ffffff0f] text-[0.7rem] text-[#f0f0f5] bg-[#1a1a24] rounded-md"
            />

            {/* Password */}
            <h5 className="text-[0.65rem] mt-2">PASSWORD</h5>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 border border-[#ffffff0f] text-[0.7rem] text-[#f0f0f5] bg-[#1a1a24] rounded-md"
            />

            <button
              type="submit"
              className="font-heading font-bold text-[0.88rem] bg-[#7c6dfa] text-white py-2 rounded-md mt-6 cursor-pointer hover:bg-[#a78bfa] hover:-translate-y-px transition-[background,transform] duration-200 "
            >
              Sign in →
            </button>
            <h5 className="font-body text-[0.65rem] mt-2 text-center">no account? <span className="cursor-pointer hover:text-[#a78bfa] transition-all duration-200" onClick={() => navigate("/register")}>register here</span></h5>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
