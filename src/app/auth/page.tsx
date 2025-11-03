'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, Camera, User, ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { checkIsAdmin, getAdminUrl, ADMIN_ERROR_MESSAGES } from '@/lib/admin-auth';
import { 
  isBlocked, 
  recordFailedAttempt, 
  recordSuccessfulLogin, 
  getRemainingAttempts,
  getClientIdentifier 
} from '@/lib/rate-limiter';
import { initSession } from '@/lib/session-manager';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const redirectUrl = searchParams.get('redirect') || '/';
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // 로그인 시도 제한 체크
        const identifier = getClientIdentifier(formData.email);
        const blockStatus = isBlocked(identifier);
        
        if (blockStatus.blocked) {
          throw new Error(blockStatus.message || ADMIN_ERROR_MESSAGES.tooManyAttempts);
        }

        // 로그인
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          // 로그인 실패 기록
          recordFailedAttempt(identifier);
          const remaining = getRemainingAttempts(identifier);
          setRemainingAttempts(remaining);
          
          if (remaining > 0) {
            throw new Error(`${authError.message} (남은 시도: ${remaining}회)`);
          } else {
            throw new Error(ADMIN_ERROR_MESSAGES.tooManyAttempts);
          }
        }

        if (data.user) {
          // 로그인 성공 - 시도 기록 초기화
          recordSuccessfulLogin(identifier);
          setRemainingAttempts(null);
          
          // 세션 초기화
          initSession();
          
          // 관리자 체크
          const isAdmin = checkIsAdmin(data.user);
          if (isAdmin) {
            router.push(getAdminUrl());
          } else {
            // redirect 파라미터가 있으면 해당 페이지로, 없으면 홈으로
            router.push(redirectUrl);
          }
        }
      } else {
        // 회원가입
        if (formData.password !== formData.confirmPassword) {
          throw new Error(t('auth.passwordMismatch'));
        }

        const { data, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        });

        if (authError) throw authError;

        if (data.user) {
          // 회원가입 성공 후 바로 로그인되어 있으므로 redirect URL로 이동
          setSuccess(t('auth.signupSuccess'));
          setTimeout(() => {
            router.push(redirectUrl);
          }, 1500);
        }
      }
    } catch (err: any) {
      setError(err.message || t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-900 rounded-full mb-4">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-stone-900">
              {isLogin ? t('auth.loginTitle') : t('auth.signupTitle')}
            </h2>
            <p className="mt-2 text-stone-600">
              {isLogin ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm"
            >
              {success}
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
            >
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{error}</p>
                  {remainingAttempts !== null && remainingAttempts > 0 && (
                    <p className="mt-1 text-xs text-red-600">
                      {remainingAttempts}회 더 실패하면 15분간 로그인이 차단됩니다.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {t('auth.name')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition"
                    placeholder={t('auth.namePlaceholder')}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition"
                  placeholder={t('auth.emailPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition"
                  placeholder={t('auth.passwordPlaceholder')}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition"
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-3 rounded-full hover:bg-stone-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? t('auth.submitting')
                : isLogin
                ? t('auth.loginButton')
                : t('auth.signupButton')}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
              className="text-stone-600 hover:text-stone-900 transition-colors text-sm"
            >
              {isLogin ? t('auth.needSignup') : t('auth.needLogin')}
            </button>
          </div>

          {/* Terms and Privacy */}
          {!isLogin && (
            <div className="mt-4 text-center text-xs text-stone-500">
              {t('auth.agreementText')}{' '}
              <Link href="/terms" className="text-stone-700 hover:underline">
                {t('footer.terms')}
              </Link>{' '}
              {t('auth.and')}{' '}
              <Link href="/privacy" className="text-stone-700 hover:underline">
                {t('footer.privacy')}
              </Link>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-stone-600 hover:text-stone-900 transition-colors text-sm"
          >
            {t('auth.backHome')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-900"></div>
        </div>
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}

