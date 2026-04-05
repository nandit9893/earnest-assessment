"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { resetUserState, updatePasswordFailure, updatePasswordStart, updatePasswordSuccess } from "@/Redux/User/UserSlice";
import { updatePassword } from "@/Utils/API/auth";
import AuthSideBar from "@/Components/AuthSideBar";
import { Check, Eye, EyeOff, Info, Loader, LockKeyholeOpen, Star, X } from "lucide-react";
import Link from "next/link";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: { user: any }) => state.user);

  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassowrd] = useState(false);

  const [reNewPassword, setReNewPassword] = useState("");
  const [showReNewPassword, setShowReNewPassowrd] = useState(false);
  
  const [showNewPasswordInfo, setShowNewPasswordInfo] = useState(false);
  const [showReNewPasswordInfo, setShowReNewPasswordInfo] = useState(false);

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 6;
    const hasNumber = /[0-9]/.test(password);
    const hasAlphabet = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);    
    return {
      isValid: hasMinLength && hasNumber && hasAlphabet && hasSpecial,
      hasMinLength,
      hasNumber,
      hasAlphabet,
      hasSpecial
    };
  };

  const passwordValidation = validatePassword(newPassword);
  const isPasswordSame = newPassword !== "" && reNewPassword !== "" && newPassword === reNewPassword;
  
  const calculateStrength = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (passwordValidation.hasMinLength) score += 25;
    if (passwordValidation.hasNumber) score += 25;
    if (passwordValidation.hasAlphabet) score += 25;
    if (passwordValidation.hasSpecial) score += 25;
    return score;
  };
  
  const strengthPercentage = calculateStrength();
  
  const getStrengthColor = () => {
    if (strengthPercentage < 40) return "bg-red-500";
    if (strengthPercentage < 75) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const getStrengthText = () => {
    if (strengthPercentage < 40) return "Weak";
    if (strengthPercentage < 75) return "Medium";
    return "Strong";
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== reNewPassword) {
      dispatch(updatePasswordFailure("Passwords do not match"));
      return;
    }
    if (!passwordValidation.isValid) {
      dispatch(updatePasswordFailure("Password must have at least 6 characters, numbers, alphabets, and special characters"));
      return;
    }
    dispatch(updatePasswordStart());
    const result = await updatePassword(newPassword, user?.currentUser?._id);
    if (result.success) {
      dispatch(updatePasswordSuccess());
      router.push("/login");
    } else {
      dispatch(updatePasswordFailure(result?.message));
    }
  };

  useEffect(() => {
    if(!user?.currentUser && !user?.isOTPVerified) {
      router.push("/forgot-password")
    }
  }, [user?.currentUser, router, user?.isOTPVerified]);

  useEffect(() => {
    dispatch(resetUserState());
  }, [dispatch]);

  const updatePasswordValid = newPassword?.trim() !== "" && reNewPassword?.trim() !== "" && newPassword === reNewPassword && passwordValidation.isValid;

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-full hidden md:flex items-center justify-center bg-[#050A24]">
        <AuthSideBar />
      </div>
      <div className="w-full md:w-1/2 h-full px-2 md:px-0 flex items-center justify-center bg-[linear-gradient(to_bottom_right,#050A24_30%,#0E1B54_50%,#050A24_80%)]">
        <div className="relative w-xl h-125">
          <div className="absolute inset-0 bg-[#00000059] backdrop-blur-xl rounded-tl-[100px] rounded-br-[100px] p-5 md:p-20 flex items-center justify-center">
              <form onSubmit={submitHandler} className="flex flex-col gap-5 w-full items-center">
                <div className="flex flex-col gap-2 w-full">
                    <p className="text-3xl font-medium text-white text-center">Update Password</p>
                    <p className="text-[16px] font-normal text-left text-white">Enter the new password <span className="text-yellow-400">{user?.currentUser?.firstName} {user?.currentUser?.lastName}</span></p>
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex justify-between w-full items-center ml-8">
                        <div className="flex gap-1">
                          <p className="text-[14px] leading-6 font-normal text-white">New Password</p>
                          <Star size={11} className="text-yellow-400 fill-current" />
                        </div>
                        <div className="flex items-center justify-center mr-8 relative">
                            <button type="button" onMouseEnter={() => setShowNewPasswordInfo(true)} onMouseLeave={() => setShowNewPasswordInfo(false)} className="cursor-pointer">
                              <Info size={18} className="text-yellow-400" />
                            </button>
                            {
                                showNewPasswordInfo && (
                                  <div className="absolute bottom-full right-0 w-44 p-2 bg-gray-800 rounded shadow-lg z-10 flex flex-col gap-0.5">
                                    <p className="text-white text-[12px] leading-5.5">Password must have at least:</p>
                                    <div className="flex flex-col w-full">
                                        <div className="flex gap-1 w-full items-center">
                                            <div className={`${passwordValidation?.hasMinLength ? "bg-green-400" : "bg-red-400"} p-0.5 w-4 h-4 flex items-center justify-center rounded-full`}>
                                                {
                                                    passwordValidation?.hasMinLength ? <Check className="text-white w-full h-full" /> : <X className="text-white w-full h-full" />
                                                }
                                            </div>
                                            <p className="text-[12px] text-white leading-5.5 font-normal">6 characters</p>
                                        </div>
                                        <div className="flex gap-1 w-full items-center">
                                            <div className={`${passwordValidation?.hasNumber ? "bg-green-400" : "bg-red-400"} p-0.5 w-4 h-4 flex items-center justify-center rounded-full`}>
                                                {
                                                    passwordValidation?.hasNumber ? <Check className="text-white w-full h-full" /> : <X className="text-white w-full h-full" />
                                                }
                                            </div>
                                            <p className="text-[12px] text-white leading-5.5 font-normal">1 number</p>
                                        </div>
                                        <div className="flex gap-1 w-full items-center">
                                            <div className={`${passwordValidation?.hasAlphabet ? "bg-green-400" : "bg-red-400"} p-0.5 w-4 h-4 flex items-center justify-center rounded-full`}>
                                                {
                                                    passwordValidation?.hasAlphabet ? <Check className="text-white w-full h-full" /> : <X className="text-white w-full h-full" />
                                                }
                                            </div>
                                            <p className="text-[12px] text-white leading-5.5 font-normal">1 alphabet</p>
                                        </div>
                                        <div className="flex gap-1 w-full items-center">
                                            <div className={`${passwordValidation?.hasSpecial ? "bg-green-400" : "bg-red-400"} p-0.5 w-4 h-4 flex items-center justify-center rounded-full`}>
                                                {
                                                    passwordValidation?.hasSpecial ? <Check className="text-white w-full h-full" /> : <X className="text-white w-full h-full" />
                                                }
                                            </div>
                                            <p className="text-[12px] text-white leading-5.5 font-normal">1 special character</p>
                                        </div>
                                    </div>
                                  </div>
                                )
                            }
                        </div>
                      </div>
                      <div className="flex gap-3 w-full items-center">
                        <LockKeyholeOpen className="text-white w-5 h-5" />
                        <div className="flex gap-3 border-b border-gray-200 w-full">
                          <input required disabled={user?.loading} name="newPassword" onChange={(event) => setNewPassword(event.target.value)  } value={newPassword} type={showNewPassword ? "text" : "password"} className="w-full outline-none placeholder:font-light font-normal text-white placeholder:text-gray-200 text-[14px] leading-6 placeholder:text-[14px] placeholder:leading-6" placeholder="Enter New Password" />
                          {
                            showNewPassword ? 
                            (
                              <button disabled={user?.loading} onClick={() => setShowNewPassowrd(false)} type="button" className="cursor-pointer">
                                <Eye className="text-white w-4 h-4" />
                              </button>
                            ) 
                            : 
                            (
                              <button disabled={user?.loading} onClick={() => setShowNewPassowrd(true)} type="button" className="cursor-pointer">
                                <EyeOff className="text-white w-4 h-4" />
                              </button>
                            )
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex justify-between w-full items-center ml-8">
                        <div className="flex gap-1">
                          <p className="text-[14px] leading-6  font-normal text-white">Re New Password</p>
                          <Star size={11} className="text-yellow-400 fill-current" />
                        </div>
                        <div className="flex items-center justify-center mr-8 relative">
                            <button type="button" onMouseEnter={() => setShowReNewPasswordInfo(true)} onMouseLeave={() => setShowReNewPasswordInfo(false)} className="cursor-pointer">
                              <Info size={18} className="text-yellow-400" />
                            </button>
                            {
                                showReNewPasswordInfo && (
                                    <div className="absolute bottom-full right-0 w-36 p-2 bg-gray-800 rounded shadow-lg z-10 flex gap-1 items-center">
                                        <div className={`${isPasswordSame ? "bg-green-400" : "bg-red-400"} p-0.5 w-4 h-4 flex items-center justify-center rounded-full`}>
                                            { isPasswordSame? <Check className="text-white w-full h-full" /> : <X className="text-white w-full h-full" /> }
                                        </div>
                                        <p className="text-[12px] text-white leading-5.5 font-normal">{isPasswordSame ? "Password Match" : "Password not match"}</p>
                                    </div>
                                )
                            }
                        </div>
                      </div>
                      <div className="flex gap-3 w-full items-center">
                        <LockKeyholeOpen className="text-white w-5 h-5" />
                        <div className="flex gap-3 border-b border-gray-200 w-full">
                          <input required disabled={user?.loading} name="password" onChange={(event) => setReNewPassword(event.target.value) } value={reNewPassword} type={showReNewPassword ? "text" : "password"} className="w-full outline-none placeholder:font-light font-normal text-white placeholder:text-gray-200 text-[14px] leading-6 placeholder:text-[14px] placeholder:leading-6" placeholder="Enter Re New Password" />
                          {
                            showReNewPassword ? 
                            (
                              <button disabled={user?.loading} onClick={() => setShowReNewPassowrd(false)} type="button" className="cursor-pointer">
                                <Eye className="text-white w-4 h-4" />
                              </button>
                            ) 
                            : 
                            (
                              <button disabled={user?.loading} onClick={() => setShowReNewPassowrd(true)} type="button" className="cursor-pointer">
                                <EyeOff className="text-white w-4 h-4" />
                              </button>
                            )
                          }
                        </div>
                    </div>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <div className="h-5">
                      {
                        user?.error && user?.message && (
                          <p className="text-yellow-400 text-[14px] leading-6 font-normal">{user?.message}</p>
                        )
                      }
                    </div>                
                    <Link href="/forgot-password" className="text-[#E6C97A] text-[14px] leading-6 font-normal cursor-pointer">Forgot Password</Link>
                  </div>
                </div>
                <button disabled={!updatePasswordValid || user?.loading} type="submit" className="w-full flex items-center justify-center py-1 cursor-pointer bg-[#E6C97A] disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500 disabled:hover:bg-gray-600">{user?.loading ? <Loader className="w-6 h-6 text-white animate-spin" /> : "Update Password"}</button>
                <div className="w-full min-h-17.5">
                    {newPassword && (
                      <div className="w-full flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <p className="text-[12px] text-white leading-5.5 font-normal">Password Strength: {getStrengthText()}</p>
                            {
                                reNewPassword && !isPasswordSame && (
                                    <p className="text-[12px] text-red-400 leading-5.5 font-normal">Passwords do not match!</p>
                                )
                            }
                            {
                                reNewPassword && isPasswordSame && (
                                    <p className="text-[12px] text-green-400 leading-5.5 font-normal">✓ Passwords match</p>
                                )
                            }
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full transition-all duration-300 ${getStrengthColor()}`} style={{ width: `${strengthPercentage}%` }}/>
                          </div>
                        </div>
                    )}
                  </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;