"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordFailure, forgotPasswordStart, forgotPasswordSuccess, resetUserState, verifyOTPFailure, verifyOTPStart, verifyOTPSuccess } from "@/Redux/User/UserSlice";
import { forgotPasswordRes, verifyOTP } from "@/Utils/API/auth";
import AuthSideBar from "@/Components/AuthSideBar";
import { Loader, Star } from "lucide-react";
import Link from "next/link";

const VerifyOTP = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: { user: any }) => state.user);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [sentMail, reSentMail] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const message = "Invalid Email Format";
      dispatch(verifyOTPFailure(message));
      return;
    }
    dispatch(verifyOTPStart());
    const result = await verifyOTP(email, otp?.join(""));
    if (result.success) {
      dispatch(verifyOTPSuccess(result?.data));
      router.push("/update-password");
    } else {
      dispatch(verifyOTPFailure(result?.message));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedDigits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (pastedDigits.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedDigits.length && i < 6; i++) {
        newOtp[i] = pastedDigits[i];
      }
      setOtp(newOtp);
      const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        const element = document.getElementById(`otp-${nextEmptyIndex}`);
        if (element) {
          element.focus();
        }
      } else if (pastedDigits.length === 6) {
        const element = document.getElementById(`otp-5`);
        if (element) {
          element.blur();
        }
      }
    }
  };

  const resenttHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const email = user?.currentUser?.email;
    dispatch(forgotPasswordStart());
    const result = await forgotPasswordRes(email);
    if (result.success) {
      dispatch(forgotPasswordSuccess(result?.data));
    } else {
      dispatch(forgotPasswordFailure(result?.message));
    }
  };

  useEffect(() => {
    if(!user?.currentUser?.otpExpiryTime && !user?.isOTPVerified) {
      router.push("/forgot-password")
    }
    const expiryTime = new Date(user?.currentUser?.otpExpiryTime);
    const interval = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor(
        (expiryTime.getTime() - now.getTime()) / 1000
      );
      if (diffInSeconds <= 0) {
        setRemainingSeconds(0);
        clearInterval(interval);
      } else {
        setRemainingSeconds(diffInSeconds);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user?.currentUser?.otpExpiryTime, router, user?.isOTPVerified]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const otpVerification = otp.every(digit => digit !== "");
  const isOTPDisabled = user?.loading || !otpVerification;

  useEffect(() => {
    dispatch(resetUserState());
  }, [dispatch]);

  useEffect(() => {
    if (user?.currentUser?.email) {
      setEmail(user.currentUser.email);
    }
  }, [user?.currentUser?.email]);

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-full hidden md:flex items-center justify-center bg-[#050A24]">
        <AuthSideBar />
      </div>
      <div className="w-full md:w-1/2 h-full px-2 md:px-0 flex items-center justify-center bg-[linear-gradient(to_bottom_right,#050A24_30%,#0E1B54_50%,#050A24_80%)]">
        <div className="relative w-xl h-125">
          <div className="absolute inset-0 bg-[#00000059] backdrop-blur-xl rounded-tl-[100px] rounded-br-[100px] p-5 md:p-20 flex items-center justify-center">
            <form onSubmit={submitHandler} className="flex flex-col gap-10 w-full items-center">
              <div className="flex flex-col gap-2 w-full">
                <p className="text-3xl font-medium text-white text-center">Verify Email</p>
                <p className="text-[16px] font-normal text-left text-white">Enter the otp sent to your registered email <span className="text-yellow-400">{user?.currentUser?.firstName} {user?.currentUser?.lastName}</span></p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-1 ml-8">
                  <p className="text-[14px] leading-6 font-normal text-white">OTP</p>
                  <Star size={11} className="text-yellow-400 fill-current" />
                </div>
                <div className="flex gap-3 w-full items-center justify-center" onPaste={handlePaste}>
                  {
                    otp?.map((digit, index) => (
                      <div className="p-1 rounded-md border border-yellow-100 transition-all duration-300 ease-in-out focus-within:border-yellow-500 focus-within:shadow-[0_0_8px_0_rgba(0,132,165,0.3)]" key={index}>
                        <input required type="text" id={`otp-${index}`} value={digit} onChange={(e) => handleChange(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} maxLength={1} className="w-6 sm:w-8 h-6 sm:h-8 rounded-md text-center text-white text-lg border-none outline-none bg-transparent" disabled={user?.loading}/>
                      </div>
                    ))
                  }
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
                <Link href="/login" className="text-[#E6C97A] text-[14px] leading-6 font-normal cursor-pointer">Login</Link>
              </div>
              <div className="flex justify-between w-full">
                {
                  remainingSeconds === 0 ?
                  (
                    <button disabled={user?.loading} type="button" onClick={resenttHandler} className="text-[14px] leading-6 text-[#E6C97A] font-normal cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">Resend OTP</button>
                  )
                  :
                  (
                    <div className="flex gap-0.5 items-center">
                      <p className="text-[14px] leading-6 text-[#E6C97A] font-normal">Resend in</p>
                      <p className="text-[14px] leading-6 text-[#E6C97A] font-semibold">{formattedTime}</p>
                    </div>
                  )
                }
              </div>
              <button disabled={isOTPDisabled} type="submit" className="w-full flex items-center justify-center py-1 cursor-pointer bg-[#E6C97A] disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500 disabled:hover:bg-gray-600">{user?.loading ? <Loader className="w-6 h-6 text-white animate-spin" /> : "Verify"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;