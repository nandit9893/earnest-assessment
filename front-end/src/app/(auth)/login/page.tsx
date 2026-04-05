"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import AuthSideBar from "@/Components/AuthSideBar";
import { Eye, EyeOff, Loader, LockKeyholeOpen, Mail, Star } from "lucide-react";
import { resetUserState, signInFailure, signInStart, signInSuccess } from "@/Redux/User/UserSlice";
import { login } from "@/Utils/API/auth";
import Link from "next/link";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: { user: any }) => state.user);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const loginValid =  loginData?.email?.trim() !== "" && loginData?.password?.trim() !== "";
  const isLoginDisabled = user?.loading || !loginValid;

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      const message = "Invalid Email Format";
      dispatch(signInFailure(message));
      return;
    }
    dispatch(signInStart());
    const result = await login(loginData);
    if (result.success) {
      dispatch(signInSuccess({
        currentUser: result?.data?.employee,
        accessToken: result?.data?.accessToken,
      }));
      router.push("/dashboard");
    } else {
      dispatch(signInFailure(result?.message));
    }
  };

  useEffect(() => {
    dispatch(resetUserState());
  }, []);

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-full hidden md:flex items-center justify-center bg-[#050A24]">
        <AuthSideBar />
      </div>
      <div className="w-full md:w-1/2 h-full px-2 md:px-0 flex items-center justify-center bg-[linear-gradient(to_bottom_right,#050A24_30%,#0E1B54_50%,#050A24_80%)]">
        <div className="relative w-xl h-125">
          <div className="absolute inset-0 bg-[#00000059] backdrop-blur-xl rounded-tl-[100px] rounded-br-[100px] p-5 md:p-20 flex items-center justify-center">
            <form onSubmit={submitHandler} className="flex flex-col gap-10 w-full items-center">
              <p className="text-3xl font-medium text-white">Login</p>
              <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-1 ml-8">
                    <p className="text-[14px] leading-6 font-normal text-white">Email</p>
                    <Star size={11} className="text-yellow-400 fill-current" />
                  </div>
                  <div className="flex gap-3 w-full items-center">
                    <Mail className="text-white w-5 h-5" />
                    <input required disabled={user?.loading} name="email" onChange={inputChangeHandler} value={loginData.email} type="text" className="w-full border-b border-gray-200 outline-none placeholder:font-light font-normal text-white placeholder:text-gray-200 text-[14px] leading-6 placeholder:text-[14px] placeholder:leading-6" placeholder="Enter Email" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-1 ml-8">
                    <p className="text-[16px] leading-6.5 font-normal text-white">Password</p>
                    <Star size={11} className="text-yellow-400 fill-current" />
                  </div>
                  <div className="flex gap-3 w-full items-center">
                    <LockKeyholeOpen className="text-white w-5 h-5" />
                    <div className="flex gap-3 border-b border-gray-200 w-full">
                      <input required disabled={user?.loading} name="password" onChange={inputChangeHandler} value={loginData.password} type={isPasswordVisible ? "text" : "password"} className="w-full outline-none placeholder:font-light font-normal text-white placeholder:text-gray-200 text-[14px] leading-6 placeholder:text-[14px] placeholder:leading-6" placeholder="Enter Password" />
                      {
                        isPasswordVisible ? 
                        (
                          <button onClick={() => setIsPasswordVisible(false)} disabled={user?.loading} type="button" className="cursor-pointer">
                            <Eye className="text-white w-4 h-4" />
                          </button>
                        ) 
                        : 
                        (
                          <button onClick={() => setIsPasswordVisible(true)} disabled={user?.loading} type="button" className="cursor-pointer">
                            <EyeOff className="text-white w-4 h-4" />
                          </button>
                        )
                      }
                    </div>
                  </div>
                </div>
                <div className="flex justify-between w-full items-center">
                  <div className="min-h-5">
                    {
                      user?.error && user?.message && (
                        <p className="text-yellow-400 text-[14px] leading-6 font-normal">{user?.message}</p>
                      )
                    }
                  </div>                
                  <Link href="/forgot-password" className="text-[#E6C97A] text-[14px] leading-6 font-normal cursor-pointer">Forgot Password</Link>
                </div>
              </div>
              <button disabled={isLoginDisabled} type="submit" className="w-full flex items-center justify-center py-1 cursor-pointer bg-[#E6C97A] disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500 disabled:hover:bg-gray-600">{user?.loading ? <Loader className="w-6 h-6 text-white animate-spin" /> : "Login"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;