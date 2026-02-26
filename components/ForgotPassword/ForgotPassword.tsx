"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import Image from 'next/image';
import icon from "@/public/fotboll.png";
import { Mail, Lock, KeyRound, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import {
    forgotPasswordSchema,
    otpSchema,
    resetPasswordSchema,
    ForgotPasswordFormData,
    OtpFormData,
    ResetPasswordFormData,
} from '@/ZoodSchema/forgot-password-schema';
import {
    usePasswordResetRequestMutation,
    usePasswordResetVerifyOtpMutation,
    usePasswordResetConfirmMutation,
} from '@/store/api/auth/auth';
import { useRouter } from 'next/navigation';

type Step = 'EMAIL' | 'OTP' | 'RESET' | 'SUCCESS';

export default function ForgotPassword() {
    const [step, setStep] = useState<Step>('EMAIL');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
    const router = useRouter();

    const [requestOtp, { isLoading: isRequestLoading }] = usePasswordResetRequestMutation();
    const [verifyOtp, { isLoading: isVerifyLoading }] = usePasswordResetVerifyOtpMutation();
    const [confirmReset, { isLoading: isConfirmLoading }] = usePasswordResetConfirmMutation();

    // Step 1: Email Form
    const emailForm = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });

    // Step 2: OTP Form
    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' },
    });

    // Step 3: Reset Password Form
    const resetForm = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: '', confirm_password: '' },
    });

    const onEmailSubmit = async (data: ForgotPasswordFormData) => {
        setServerError(null);
        try {
            await requestOtp({ email: data.email }).unwrap();
            setEmail(data.email);
            setStep('OTP');
        } catch (err: any) {
            setServerError(err?.data?.message || err?.data?.detail || "Failed to send OTP. Please try again.");
            console.error(err);
        }
    };

    const onOtpSubmit = async (data: OtpFormData) => {
        setServerError(null);
        try {
            await verifyOtp({ email, otp: data.otp }).unwrap();
            setOtp(data.otp);
            setStep('RESET');
        } catch (err: any) {
            setServerError(err?.data?.message || err?.data?.detail || "Invalid OTP. Please check and try again.");
            console.error(err);
        }
    };

    const onResetSubmit = async (data: ResetPasswordFormData) => {
        setServerError(null);
        try {
            await confirmReset({
                email,
                otp,
                password: data.password,
                confirm_password: data.confirm_password,
            }).unwrap();
            setStep('SUCCESS');
        } catch (err: any) {
            setServerError(err?.data?.message || err?.data?.detail || "Failed to reset password. Please try again.");
            console.error(err);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'EMAIL':
                return (
                    <motion.div
                        key="email"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <Form {...emailForm}>
                            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                                {serverError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-xs flex items-center gap-2"
                                    >
                                        <AlertCircle className="h-4 w-4" />
                                        {serverError}
                                    </motion.div>
                                )}
                                <FormField
                                    control={emailForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        placeholder="admin@sportsadmin.com"
                                                        {...field}
                                                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 pl-8"
                                                    />
                                                </FormControl>
                                                <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            </div>
                                            <AnimatePresence>
                                                {emailForm.formState.errors.email && (
                                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={isRequestLoading}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition-all duration-300 shadow-md"
                                >
                                    {isRequestLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Send OTP
                                </Button>
                            </form>
                        </Form>
                    </motion.div>
                );
            case 'OTP':
                return (
                    <motion.div
                        key="otp"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <p className="text-sm text-gray-600  mb-4">
                            We've sent a 6-digit OTP to <span className="font-semibold text-orange-500">{email}</span>
                        </p>
                        <Form {...otpForm}>
                            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                                {serverError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-xs flex items-center gap-2"
                                    >
                                        <AlertCircle className="h-4 w-4" />
                                        {serverError}
                                    </motion.div>
                                )}
                                <FormField
                                    control={otpForm.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 text-center">
                                            <FormLabel className="text-sm  font-medium text-gray-700">Enter OTP</FormLabel>
                                            <div className=" ">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="123456"
                                                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-center tracking-widest text-lg font-bold"
                                                    />
                                                </FormControl>
                                            </div>
                                            <AnimatePresence>
                                                {otpForm.formState.errors.otp && (
                                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={isVerifyLoading}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition-all duration-300 shadow-md"
                                >
                                    {isVerifyLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Verify OTP
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('EMAIL');
                                        setServerError(null);
                                    }}
                                    className="w-full text-sm text-gray-500 hover:text-orange-500 transition-colors flex items-center justify-center gap-1"
                                >
                                    <ArrowLeft className="h-3 w-3" /> Change Email
                                </button>
                            </form>
                        </Form>
                    </motion.div>
                );
            case 'RESET':
                return (
                    <motion.div
                        key="reset"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <Form {...resetForm}>
                            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                                {serverError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-xs flex items-center gap-2"
                                    >
                                        <AlertCircle className="h-4 w-4" />
                                        {serverError}
                                    </motion.div>
                                )}
                                <FormField
                                    control={resetForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-medium text-gray-700">New Password</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        type={showPasswords.new ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...field}
                                                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 pl-8 pr-10"
                                                    />
                                                </FormControl>
                                                <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                                >
                                                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <AnimatePresence>
                                                {resetForm.formState.errors.password && (
                                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={resetForm.control}
                                    name="confirm_password"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-medium text-gray-700">Confirm Password</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        type={showPasswords.confirm ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...field}
                                                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 pl-8 pr-10"
                                                    />
                                                </FormControl>
                                                <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                                >
                                                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <AnimatePresence>
                                                {resetForm.formState.errors.confirm_password && (
                                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={isConfirmLoading}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition-all duration-300 shadow-md"
                                >
                                    {isConfirmLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Reset Password
                                </Button>
                            </form>
                        </Form>
                    </motion.div>
                );
            case 'SUCCESS':
                return (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-4 py-4"
                    >
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Success!</h3>
                        <p className="text-sm text-gray-600">Your password has been successfully reset.</p>
                        <Button
                            onClick={() => router.push('/sign-in')}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition-all duration-300"
                        >
                            Back to Login
                        </Button>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="grow flex items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full max-w-md"
                >
                    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} glareEnable glareMaxOpacity={0.3} glareColor="#fff">
                        <Card className="bg-white shadow-xl rounded-none overflow-hidden border-none text-black">
                            <CardHeader className="bg-linear-to-b from-orange-400 rounded-bl-full to-orange-300 text-center py-6">
                                <div className="mx-auto mb-2 w-12 h-12 relative">
                                    <Image src={icon} alt="Football Icon" fill className="object-contain rounded-full bg-white p-1" />
                                </div>
                                <CardTitle className="text-white text-lg font-semibold">Forgot Password</CardTitle>
                                <CardDescription className="text-white/90 text-sm">
                                    {step === 'EMAIL' && "Enter your email to receive an OTP"}
                                    {step === 'OTP' && "Verify your identity with the OTP"}
                                    {step === 'RESET' && "Set your new secure password"}
                                    {step === 'SUCCESS' && "Verification complete"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <AnimatePresence mode="wait">
                                    {renderStep()}
                                </AnimatePresence>
                            </CardContent>
                            <CardFooter className="flex border-t rounded-tr-[300px] flex-col items-center bg-gray-50 py-4 text-center text-xs text-gray-500 space-y-1">
                                {step !== 'SUCCESS' && (
                                    <button
                                        onClick={() => router.push('/')}
                                        className="text-orange-500 hover:underline font-medium"
                                    >
                                        Back to Sign In
                                    </button>
                                )}
                                <p>Secure admin access - Protected by 2FA</p>
                            </CardFooter>
                        </Card>
                    </Tilt>
                </motion.div>
            </main>
            <footer className="text-center text-xs text-gray-500 py-2">
                Admin Panel v2.0 © 2024 Sports Admin
            </footer>
        </div>
    );
}
