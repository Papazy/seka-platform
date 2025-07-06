'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/enum';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {login, isLoading} = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try{
      await login(email, password)
    }catch(err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Terjadi kesalahan saat masuk. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 px-6 lg:px-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-[#3ECF8E] to-[#2DD4BF] rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="mt-6 text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              SEKA USK
            </h1>
            <p className="mt-2 text-sm text-gray-600 font-medium">
              Sistem Evaluasi Kode Akademik USK
            </p>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Selamat Datang Kembali
            </h2>
            <p className="mt-2 text-gray-600">
              Masuk ke akun Anda untuk melanjutkan pembelajaran
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white/70 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/20">
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-[#3ECF8E] transition-all duration-200 bg-white/50"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-[#3ECF8E] transition-all duration-200 bg-white/50"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#3ECF8E] focus:ring-[#3ECF8E] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Ingat saya
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-[#3ECF8E] hover:text-[#2DD4BF] transition-colors">
                    Lupa password?
                  </a>
                </div>
              </div> */}

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#3ECF8E] to-[#2DD4BF] hover:from-[#2DD4BF] hover:to-[#3ECF8E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-white group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    )}
                  </span>
                  {isLoading ? 'Masuk...' : 'Masuk'}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Atau</span>
                </div>
              </div>
            </div>

            {/* Guest Login */}
            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] transition-all duration-200"
              >
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Masuk dengan Google
              </button>
            </div>
          </div>

          {/* Footer */}
          {/* <p className="mt-8 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <a href="#" className="font-semibold text-[#3ECF8E] hover:text-[#2DD4BF] transition-colors">
              Daftar sekarang
            </a>
          </p> */}
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="w-1/2 relative bg-gradient-to-br from-[#3ECF8E] to-[#2DD4BF] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3Cpath d='m40 40v-40h-40z' fill-opacity='0.1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-center items-center p-12 text-white">
          <div className="max-w-md text-center">
            {/* Floating Code Elements */}
            <div className="relative mb-8">
              <div className="absolute -top-4 -left-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 transform rotate-12 animate-float">
                <code className="text-white text-sm font-mono">{'{ }'}</code>
              </div>
              <div className="absolute -top-2 -right-8 bg-white/20 backdrop-blur-sm rounded-lg p-3 transform -rotate-12 animate-float-delayed">
                <code className="text-white text-sm font-mono">{'</>'}</code>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <svg className="h-16 w-16 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>

            <h3 className="text-3xl font-bold mb-4">
              Platform Programming Informatika USK
            </h3>
            <p className="text-lg text-white/90 leading-relaxed">
              Platform pembelajaran coding yang dirancang untuk mengembangkan skill programming Anda dengan praktik langsung dan feedback real-time.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center text-white/90">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Online Judge System</span>
              </div>
              <div className="flex items-center text-white/90">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Real-time Code Evaluation</span>
              </div>
              {/* <div className="flex items-center text-white/90">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Interactive Learning</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: "url('/images/gedung_mipa.jpg')" }}
        ></div>
      </div>
    </div>
  );
}