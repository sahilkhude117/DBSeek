// app/(auth)/login/page.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Apple, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
// import ForgotPassword from '@/components/shared/ForgotPassword';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePass, setHidePass] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
  
    const toggleVisibility = () => {
      setHidePass(!hidePass);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Start loading
        setError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex =
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
        if (!emailRegex.test(email)) {
          setError('Invalid email address');
          setLoading(false);
          return;
        }
        if (!passwordRegex.test(password)) {
          setError(
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
          );
          setLoading(false);
          return;
        }
    
        try {
          const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });
    
          if (result?.error) {
            setError('Invalid email or password');
          } else {
            router.push('/');
          }
        } catch (e) {
          setError('Something went wrong. Please try again.');
        } finally {
          setLoading(false); // Stop loading
        }
      };
    
      return (
        <div className="min-h-screen pb-24">
          <div className="max-w-md mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="mb-12 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">
                  Welcome Back to DBSeek
                </h1>
                <p className="text-[#6B7280]">
                  Continue your learning journey with us
                </p>
              </div>
    
              {/* Form Card */}
              <Card className="p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Email Field */}
                    <div>
                      <label className="text-sm font-medium text-[#2A5C8F]">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        className="mt-1 focus-visible:ring-[#34C759]"
                        autoComplete="email"
                        placeholder="your@email.com"
                        required
                        value={email}
                        onChange={(e) => {
                          setError('');
                          setEmail(e.target.value)
                        }}
                      />
                    </div>
    
                    {/* Password Field */}
                    <div className="relative">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-[#2A5C8F]">
                          Password
                        </label>
                        {/* <ForgotPassword/> */}
                      </div>
                      <div>
                      <Input
                        id="password"
                        name="password"
                        type={hidePass ? 'password' : 'text'}
                        autoComplete="current-password"
                        required
                        value={password}
                        className="mt-1 focus-visible:ring-[#34C759] pr-10"
                        placeholder="••••••••••••••••"
                        onChange={(e) => {
                          setError('')
                          setPassword(e.target.value)
                        }}
                      />
                      </div>
                      <div
                        onClick={toggleVisibility}
                        className="absolute inset-y-0 right-0 top-5 flex items-center pr-3 cursor-pointer"
                      >
                        {hidePass ? <EyeOff size={20} /> : <Eye size={20} />}
                      </div>
                      </div>
                    </div>
    
                  {/* Error Message */}
                  {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                  )}
    
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-800 py-5 font-bold"
                    size="lg"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      <div className="flex justify-center">
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
    
                {/* Divider */}
                {/* <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#2A5C8F]/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-[#6B7280]">
                      Or continue with
                    </span>
                  </div>
                </div> */}
    
                {/* Social Login Buttons */}
                {/* <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="w-full border-[#2A5C8F]/20 text-[#2A5C8F] hover:bg-[#F8F9FA]"
                  >
                    <Apple className="w-5 h-5 mr-2" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-[#2A5C8F]/20 text-[#2A5C8F] hover:bg-[#F8F9FA]"
                  >
                    <Apple className="w-5 h-5 mr-2" />
                    Apple
                  </Button>
                </div> */}
              </Card>
    
              {/* Footer */}
              <p className="mt-8 text-center text-[#6B7280]">
                Don't have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="text-[#34C759] font-medium hover:underline"
                >
                  Create account
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      );
    }    
 



