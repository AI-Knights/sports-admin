"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import Image from 'next/image';
import { SignInFormData, signInSchema } from '@/ZoodSchema/sign-in-schema';
import { Checkbox } from '@radix-ui/react-checkbox';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import icon from "@/public/fotboll.png"
import { useRouter } from 'next/navigation';
import { useLoginAdminMutation } from '@/store/api/auth/auth';

export default function SignInPage() {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });
  const [loginAdmin, { isLoading }] = useLoginAdminMutation()
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter()

  // Clear error message when user starts typing
  const emailValue = form.watch('email');
  const passwordValue = form.watch('password');

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  }, [emailValue, passwordValue]);

  const onSubmit = async (data: SignInFormData) => {
    try {
      setErrorMessage(null);
      const response = await loginAdmin({ email: data.email, password: data.password }).unwrap();
      console.log(response)
      localStorage.setItem("email", data.email);

      router.push("/verify-otp");
    } catch (err: any) {
      console.error(err);
      if (err?.data?.detail) {
        setErrorMessage(err.data.detail);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} glareEnable glareMaxOpacity={0.3} glareColor="#fff">
            <Card className="bg-white shadow-xl rounded-none  overflow-hidden border-none">
              <CardHeader className="bg-gradient-to-b from-orange-400 rounded-bl-full to-orange-300 text-center py-6">
                <div className="mx-auto mb-2 w-12 h-12 relative">
                  <Image src={icon} alt="Football Icon" fill className="object-contain rounded-full bg-white p-1" />
                </div>
                <CardTitle className="text-white text-lg font-semibold">Sports Admin</CardTitle>
                <CardDescription className="text-white/90 text-sm">Sign in to manage your platform</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-3 text-sm">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="font-medium">{errorMessage}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="relative">
                            <FormControl>
                              <Input
                                placeholder="demo@sportsadmin.com"
                                {...field}
                                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 pl-8"
                              />
                            </FormControl>
                            <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </motion.div>
                          <AnimatePresence>
                            {form.formState.errors.email && (
                              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <FormMessage className="text-red-500 text-xs mt-1" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="relative">
                            <FormControl>
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                {...field}
                                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 pl-8 pr-10"
                              />
                            </FormControl>
                            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </motion.div>
                          <AnimatePresence>
                            {form.formState.errors.password && (
                              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <FormMessage className="text-red-500 text-xs mt-1" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-between text-sm">
                      <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-gray-600">Remember me</FormLabel>
                          </FormItem>
                        )}
                      />
                      <a href="/forgot-password" className="text-orange-500 hover:text-orange-600 hover:underline transition-all duration-300">Forgot password?</a>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex border-t  rounded-tr-[300px] flex-col items-center bg-gray-50 py-4 text-center text-xs text-gray-500 space-y-1">
                <p>Demo credentials: any email & password</p>
                <p>Secure admin access - Protected by 2FA</p>
              </CardFooter>
            </Card>
          </Tilt>
        </motion.div>
      </main>
      <footer className="text-center text-xs text-gray-500 py-2">
        Admin Panel v2.0 © 2025 Sports Admin
      </footer>
    </div>
  );
}
