import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import { useRegisterMutation } from "../store/api/authApi";
import toast from 'react-hot-toast';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [register, { isLoading, isError, error }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await register({ name, email, password }).unwrap();
      // .unwrap() throws error if request fails
      // so we can catch it below
      navigate("/login"); // after register go to login
      if(result){
        toast.success(result.message);
      }
    } catch (err) {
      toast.error("Registration Failed");
    }
  };

  return (
    <div className="relative h-screen">
      <div className="w-[346px] py-8 flex flex-col items-center justify-center bg-[#111118] border border-[#ffffff0f] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[13px]">
        <Logo />
        <div className="font-heading font-extrabold text-[1.4rem] mt-3">
          Create Account
        </div>
        <div className="font-body text-[0.65rem]">
          start your dev journal today
        </div>

        {/* Error message */}
        {isError && (
          <div className="mt-3 px-4 py-2 bg-[#f8717118] border border-[#f8717133] rounded-lg text-[#f87171] text-[0.65rem] font-mono mx-8 text-center">
            {error?.data?.message || "Something went wrong"}
          </div>
        )}

        <div className="mt-5 font-body w-full px-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-1">

            {/* Name — extra field */}
            <h5 className="text-[0.65rem]">NAME</h5>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 border border-[#ffffff0f] text-[0.7rem] text-[#f0f0f5] bg-[#1a1a24] rounded-md"
            />

            <h5 className="text-[0.65rem] mt-2">EMAIL</h5>
            <input
              type="email"
              placeholder="you@dev.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border border-[#ffffff0f] text-[0.7rem] text-[#f0f0f5] bg-[#1a1a24] rounded-md"
            />

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
              disabled={isLoading}
              className="font-heading font-bold text-[0.88rem] bg-[#7c6dfa] text-white py-2 rounded-md mt-6 cursor-pointer hover:bg-[#a78bfa] hover:-translate-y-px transition-[background,transform] duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create account →"}
            </button>

            <h5 className="font-body text-[0.65rem] mt-2 text-center">
              already have account?{" "}
              <Link to="/login" className="cursor-pointer hover:text-[#a78bfa] transition-all duration-200">
                sign in here
              </Link>
            </h5>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;