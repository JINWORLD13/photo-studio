'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Camera, User, LogOut } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { checkIsAdmin as checkAdminAuth } from '@/lib/admin-auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const { t } = useTranslation();
  const router = useRouter();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/portfolio', label: t('nav.portfolio') },
    { href: '/services', label: t('nav.services') },
    { href: '/contact', label: t('nav.contact') },
  ];

  useEffect(() => {
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const adminStatus = checkAdminAuth(session.user);
          setIsAdmin(adminStatus);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUser(user);
      const adminStatus = checkAdminAuth(user);
      setIsAdmin(adminStatus);
      await loadProfileImage(user.id);
    }
  };

  const loadProfileImage = async (userId: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('profile-images')
        .list(userId, {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      if (data && data.length > 0) {
        const {
          data: { publicUrl },
        } = supabase.storage
          .from('profile-images')
          .getPublicUrl(`${userId}/${data[0].name}`);
        
        setProfileImage(publicUrl);
      }
    } catch (error) {
      // 프로필 이미지 없음 - 기본 아이콘 사용
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Camera className="w-6 h-6 text-stone-700 group-hover:text-stone-900 transition-colors" />
            <span className="text-xl font-serif font-semibold text-stone-900">
              Moment Snap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-stone-600 hover:text-stone-900 transition-colors font-medium whitespace-nowrap text-sm lg:text-base"
              >
                {link.label}
              </Link>
            ))}
            
            {/* 사용자 메뉴 */}
            {user ? (
              <div className="flex items-center space-x-1.5 lg:space-x-3">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-2.5 py-1.5 lg:px-4 lg:py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors text-xs lg:text-sm font-medium whitespace-nowrap"
                  >
                    {t('nav.admin')}
                  </Link>
                )}
                {!isAdmin && (
                  <Link
                    href="/mypage"
                    className="flex items-center space-x-1 lg:space-x-2 px-2.5 py-1.5 lg:px-4 lg:py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors text-xs lg:text-sm font-medium whitespace-nowrap"
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-5 h-5 lg:w-6 lg:h-6 rounded-full object-cover border border-white"
                      />
                    ) : (
                      <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    )}
                    <span>{t('nav.mypage')}</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-stone-600 hover:text-stone-900 transition-colors whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="text-xs lg:text-sm">{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center space-x-1 px-2.5 py-1.5 lg:px-4 lg:py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors text-xs lg:text-sm font-medium whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                <span>{t('nav.login')}</span>
              </Link>
            )}
            
            {/* 언어 전환 버튼 - 맨 마지막 */}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="메뉴 열기"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-stone-700" />
            ) : (
              <Menu className="w-6 h-6 text-stone-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-stone-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* 사용자 메뉴 (모바일) */}
            <div className="px-4 pt-3 border-t border-stone-200 space-y-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.adminDashboard')}
                    </Link>
                  )}
                  {!isAdmin && (
                    <Link
                      href="/mypage"
                      className="block px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.mypage')}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="block px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.loginSignup')}
                </Link>
              )}
            </div>
            
            {/* 모바일 언어 전환 */}
            <div className="px-4 pt-3 border-t border-stone-200">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

