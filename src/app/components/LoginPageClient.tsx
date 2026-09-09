'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AppLogo from '@/components/ui/AppLogo';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Navigation,
  Shield,
  Zap,
  Wind,
  Droplets,
  Thermometer,
  Activity,
} from 'lucide-react';
import { PERSONAS } from '@/lib/mockData';

type AuthMode = 'login' | 'signup';
type SignupStep = 1 | 2 | 3;

interface LoginFormData {
  emailOrPhone: string;
  password: string;
  rememberMe: boolean;
}

interface SignupStep1Data {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface SignupStep2Data {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface SignupStep3Data {
  persona: string;
}

const DEMO_CREDENTIALS = {
  user: { email: 'soumyajit@akashvani.in', password: 'Storm@2026', role: 'User' },
  admin: { email: 'admin@akashvani.in', password: 'Admin@Secure9', role: 'Admin' },
};

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

function WeatherStatBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
      <span className="text-white/70">{icon}</span>
      <div>
        <p className="text-white/60 text-[10px] font-medium uppercase tracking-wide">{label}</p>
        <p className="text-white text-sm font-semibold font-mono-data">{value}</p>
      </div>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-secondary transition-colors"
      title={`Copy ${label}`}
    >
      {copied ? <Check size={14} className="text-success" /> : <Copy size={14} className="text-muted-foreground" />}
    </button>
  );
}

export default function LoginPageClient() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [signupStep, setSignupStep] = useState<SignupStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('default');
  const [signupStep1Data, setSignupStep1Data] = useState<Partial<SignupStep1Data>>({});
  const [signupStep2Data, setSignupStep2Data] = useState<Partial<SignupStep2Data>>({});
  const [gpsLoading, setGpsLoading] = useState(false);

  const loginForm = useForm<LoginFormData>({
    defaultValues: { emailOrPhone: '', password: '', rememberMe: false },
  });

  const step1Form = useForm<SignupStep1Data>();
  const step2Form = useForm<SignupStep2Data>();

  // Backend integration point: Replace with real auth API call
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const isValidUser =
      (data.emailOrPhone === DEMO_CREDENTIALS.user.email && data.password === DEMO_CREDENTIALS.user.password) ||
      (data.emailOrPhone === DEMO_CREDENTIALS.admin.email && data.password === DEMO_CREDENTIALS.admin.password);

    if (!isValidUser) {
      loginForm.setError('password', {
        message: 'Invalid credentials — use the accounts below to sign in',
      });
      setIsLoading(false);
      return;
    }

    const isAdmin = data.emailOrPhone === DEMO_CREDENTIALS.admin.email;
    if (typeof window !== 'undefined') {
      localStorage.setItem('akashvani_user', JSON.stringify({ email: data.emailOrPhone, role: isAdmin ? 'admin' : 'user' }));
    }
    toast.success('Welcome back to AkashVani!');
    router.push('/user-dashboard');
  };

  const handleDemoLogin = async (role: 'user' | 'admin') => {
    const creds = DEMO_CREDENTIALS[role];
    loginForm.setValue('emailOrPhone', creds.email);
    loginForm.setValue('password', creds.password);
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    if (typeof window !== 'undefined') {
      localStorage.setItem('akashvani_user', JSON.stringify({ email: creds.email, role }));
    }
    toast.success(`Signed in as ${creds.role}`);
    router.push('/user-dashboard');
  };

  const handleStep1 = async (data: SignupStep1Data) => {
    if (data.password !== data.confirmPassword) {
      step1Form.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    setSignupStep1Data(data);
    setSignupStep(2);
  };

  const handleStep2 = (data: SignupStep2Data) => {
    setSignupStep2Data(data);
    setSignupStep(3);
  };

  const handleStep3 = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    // Backend integration point: POST /api/auth/signup with all collected data
    if (typeof window !== 'undefined') {
      localStorage.setItem('akashvani_user', JSON.stringify({
        email: signupStep1Data.email,
        role: 'user',
        persona: selectedPersona,
        name: signupStep1Data.fullName,
      }));
    }
    toast.success('Account created! Welcome to AkashVani.');
    router.push('/user-dashboard');
  };

  const handleGPSLocation = () => {
    setGpsLoading(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          step2Form.setValue('city', 'Kolkata');
          step2Form.setValue('state', 'Delhi');
          step2Form.setValue('pincode', '110001');
          setGpsLoading(false);
          toast.success('Location detected: Kolkata, Delhi');
        },
        () => {
          setGpsLoading(false);
          toast.error('Could not access GPS. Please enter location manually.');
        }
      );
    } else {
      setGpsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] weather-card-gradient flex-col justify-between p-10 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/3" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <AppLogo size={40} />
            <div>
              <span className="text-white font-bold text-xl tracking-tight">AkashVani</span>
              <p className="text-white/60 text-xs">Weather Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Main hero content */}
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-white text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
              Weather that<br />
              <span className="text-cyan-300">understands you.</span>
            </h1>
            <p className="text-white/70 mt-4 text-base leading-relaxed">
              From weather data to weather decisions. Personalized intelligence for every Indian — farmer, sailor, pilot, or city dweller.
            </p>
          </div>

          {/* Live weather preview stats */}
          <div className="grid grid-cols-2 gap-3">
            <WeatherStatBadge icon={<Thermometer size={16} />} label="Kolkata" value="34°C · Thunderstorm" />
            <WeatherStatBadge icon={<Droplets size={16} />} label="Humidity" value="72%" />
            <WeatherStatBadge icon={<Wind size={16} />} label="Wind Speed" value="18 km/h SW" />
            <WeatherStatBadge icon={<Activity size={16} />} label="Risk Score" value="68 / High" />
          </div>

          {/* Active alert indicator */}
          <div className="flex items-start gap-3 bg-amber-500/20 border border-amber-400/30 rounded-xl p-3">
            <AlertCircle size={18} className="text-amber-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 text-xs font-semibold uppercase tracking-wide">Active Warning</p>
              <p className="text-white/80 text-sm mt-0.5">Thunderstorm warning in effect for Delhi-NCR until 23:00 IST</p>
              <p className="text-white/50 text-xs mt-1">Source: IMD · LIVE ALERT</p>
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['12 Indian Languages', '6 Persona Modes', 'Offline-First', 'AI-Powered', 'IMD Official Data'].map((f) => (
              <span key={`feat-${f}`} className="text-xs text-white/70 bg-white/10 px-2.5 py-1 rounded-full font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs">
            © 2026 AkashVani · For demonstration purposes only · Not an official government service
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <AppLogo size={32} />
            <span className="font-bold text-lg text-foreground">AkashVani</span>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-secondary rounded-xl p-1 mb-8">
            <button
              onClick={() => { setMode('login'); setSignupStep(1); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                mode === 'login' ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                mode === 'signup' ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
                <p className="text-muted-foreground text-sm mt-1">Sign in to your AkashVani account</p>
              </div>

              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      {...loginForm.register('emailOrPhone', {
                        required: 'Email or phone is required',
                        validate: (v) =>
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
                          /^[6-9]\d{9}$/.test(v) ||
                          'Enter a valid email or 10-digit mobile number',
                      })}
                      type="text"
                      placeholder="user@email.com or 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>
                  {loginForm.formState.errors.emailOrPhone && (
                    <p className="text-danger text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {loginForm.formState.errors.emailOrPhone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      {...loginForm.register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      className="w-full pl-10 pr-10 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-danger text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      {...loginForm.register('rememberMe')}
                      type="checkbox"
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm text-muted-foreground">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-primary font-medium hover:underline">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Demo login buttons */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDemoLogin('user')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-2.5 border border-border bg-card rounded-xl text-sm font-semibold text-foreground hover:bg-secondary active:scale-95 transition-all duration-150 disabled:opacity-60"
                >
                  <User size={16} className="text-primary" />
                  User
                </button>
                <button
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-2.5 border border-border bg-card rounded-xl text-sm font-semibold text-foreground hover:bg-secondary active:scale-95 transition-all duration-150 disabled:opacity-60"
                >
                  <Shield size={16} className="text-primary" />
                  Admin
                </button>
              </div>

              {/* Demo credentials box */}
              <div className="mt-5 bg-secondary/60 border border-border rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Zap size={12} className="text-warning" />
                  Credentials
                </p>
                <div className="space-y-2.5">
                  {Object.entries(DEMO_CREDENTIALS).map(([role, creds]) => (
                    <div key={`cred-${role}`} className="flex items-center justify-between bg-card rounded-lg px-3 py-2 border border-border">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-primary uppercase tracking-wide mr-2">{creds.role}</span>
                        <span className="text-xs text-muted-foreground font-mono-data truncate">{creds.email}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <CopyButton text={creds.email} label="email" />
                        <CopyButton text={creds.password} label="password" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <div className="animate-fade-in">
              {/* Step indicator */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={`step-${step}`}>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          signupStep === step
                            ? 'bg-primary text-primary-foreground'
                            : signupStep > step
                            ? 'bg-success text-success-foreground'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {signupStep > step ? <Check size={14} /> : step}
                      </div>
                      {step < 3 && (
                        <div className={`flex-1 h-0.5 rounded-full transition-all ${signupStep > step ? 'bg-success' : 'bg-border'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {signupStep === 1 && 'Personal Information'}
                  {signupStep === 2 && 'Your Location'}
                  {signupStep === 3 && 'Choose Your Mode'}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {signupStep === 1 && 'Create your AkashVani account'}
                  {signupStep === 2 && 'We use this to personalize weather for you'}
                  {signupStep === 3 && 'How do you primarily use weather information?'}
                </p>
              </div>

              {/* Step 1: Personal Info */}
              {signupStep === 1 && (
                <form onSubmit={step1Form.handleSubmit(handleStep1)} className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        {...step1Form.register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })}
                        type="text"
                        placeholder="User Name"
                        className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      />
                    </div>
                    {step1Form.formState.errors.fullName && (
                      <p className="text-danger text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{step1Form.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        {...step1Form.register('email', {
                          required: 'Email is required',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                        })}
                        type="email"
                        placeholder="user@email.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      />
                    </div>
                    {step1Form.formState.errors.email && (
                      <p className="text-danger text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{step1Form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Mobile Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        {...step1Form.register('phone', {
                          required: 'Phone number is required',
                          pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
                        })}
                        type="tel"
                        placeholder="9876543210"
                        className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      />
                    </div>
                    {step1Form.formState.errors.phone && (
                      <p className="text-danger text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{step1Form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        {...step1Form.register('password', {
                          required: 'Password is required',
                          minLength: { value: 8, message: 'Minimum 8 characters' },
                          pattern: { value: /^(?=.*[A-Z])(?=.*\d)/, message: 'Include at least one uppercase letter and one number' },
                        })}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 8 chars, 1 uppercase, 1 number"
                        className="w-full pl-10 pr-10 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {step1Form.formState.errors.password && (
                      <p className="text-danger text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{step1Form.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        {...step1Form.register('confirmPassword', { required: 'Please confirm your password' })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        className="w-full pl-10 pr-10 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {step1Form.formState.errors.confirmPassword && (
                      <p className="text-danger text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{step1Form.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2">
                    Continue <ChevronRight size={18} />
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    By creating an account, you agree to our{' '}
                    <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and{' '}
                    <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
                  </p>
                </form>
              )}

              {/* Step 2: Location */}
              {signupStep === 2 && (
                <form onSubmit={step2Form.handleSubmit(handleStep2)} className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Street Address</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        {...step2Form.register('address', { required: 'Address is required' })}
                        type="text"
                        placeholder="House no., street, locality"
                        className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      />
                    </div>
                    {step2Form.formState.errors.address && (
                      <p className="text-danger text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{step2Form.formState.errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">City / Town</label>
                      <input
                        {...step2Form.register('city', { required: 'City is required' })}
                        type="text"
                        placeholder="Kolkata"
                        className="w-full px-3 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      />
                      {step2Form.formState.errors.city && (
                        <p className="text-danger text-xs mt-1">{step2Form.formState.errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">PIN Code</label>
                      <input
                        {...step2Form.register('pincode', {
                          required: 'PIN code is required',
                          pattern: { value: /^\d{6}$/, message: 'Enter valid 6-digit PIN' },
                        })}
                        type="text"
                        placeholder="110001"
                        className="w-full px-3 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      />
                      {step2Form.formState.errors.pincode && (
                        <p className="text-danger text-xs mt-1">{step2Form.formState.errors.pincode.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">State</label>
                    <select
                      {...step2Form.register('state', { required: 'State is required' })}
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                      <option value="">Select your state</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={`state-${s}`} value={s}>{s}</option>
                      ))}
                    </select>
                    {step2Form.formState.errors.state && (
                      <p className="text-danger text-xs mt-1">{step2Form.formState.errors.state.message}</p>
                    )}
                  </div>

                  {/* GPS button */}
                  <button
                    type="button"
                    onClick={handleGPSLocation}
                    disabled={gpsLoading}
                    className="w-full py-2.5 border border-dashed border-primary text-primary text-sm font-semibold rounded-xl hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {gpsLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                    {gpsLoading ? 'Detecting location...' : 'Use GPS Location'}
                  </button>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setSignupStep(1)} className="flex-1 py-3 border border-border bg-card text-foreground font-semibold rounded-xl hover:bg-secondary active:scale-95 transition-all flex items-center justify-center gap-2">
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2">
                      Continue <ChevronRight size={18} />
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Persona Selection */}
              {signupStep === 3 && (
                <div className="animate-fade-in space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {PERSONAS.map((persona) => (
                      <button
                        key={persona.id}
                        onClick={() => setSelectedPersona(persona.key)}
                        className={`persona-card-hover p-4 rounded-xl border-2 text-left transition-all ${
                          selectedPersona === persona.key
                            ? 'border-primary bg-primary/5 shadow-elevated'
                            : 'border-border bg-card hover:border-primary/40'
                        }`}
                      >
                        <div className="text-2xl mb-2">{persona.icon}</div>
                        <p className={`text-sm font-bold ${selectedPersona === persona.key ? 'text-primary' : 'text-foreground'}`}>
                          {persona.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{persona.description}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button onClick={() => setSignupStep(2)} className="flex-1 py-3 border border-border bg-card text-foreground font-semibold rounded-xl hover:bg-secondary active:scale-95 transition-all flex items-center justify-center gap-2">
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button
                      onClick={handleStep3}
                      disabled={isLoading}
                      className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isLoading ? (
                        <><Loader2 size={18} className="animate-spin" /> Creating account...</>
                      ) : (
                        <>Get Started <ChevronRight size={18} /></>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}