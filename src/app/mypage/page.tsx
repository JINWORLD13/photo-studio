'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase, Contact } from '@/lib/supabase';
import { User, Mail, Phone, Calendar, MessageSquare, LogOut, Inbox, Camera, Upload } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';

export default function MyPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth');
    } else {
      setUser(user);
      await fetchMyContacts(user.id);
      await loadProfileImage(user.id);
    }
  };

  const loadProfileImage = async (userId: string) => {
    try {
      // 사용자 폴더에서 프로필 이미지 찾기
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
      console.error('Error loading profile image:', error);
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      alert(t('mypage.imageOnly'));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(t('mypage.fileSizeLimit'));
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `profile.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // 기존 파일 삭제 (있는 경우)
      const { data: existingFiles } = await supabase.storage
        .from('profile-images')
        .list(user.id);

      if (existingFiles && existingFiles.length > 0) {
        const filesToRemove = existingFiles.map((x) => `${user.id}/${x.name}`);
        await supabase.storage.from('profile-images').remove(filesToRemove);
      }

      // 새 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from('profile-images').getPublicUrl(filePath);

      setProfileImage(publicUrl + '?t=' + new Date().getTime()); // 캐시 방지
      alert(t('mypage.profileImageChanged'));
    } catch (error) {
      console.error('Upload error:', error);
      alert(t('mypage.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const fetchMyContacts = async (userId: string) => {
    try {
      console.log('Fetching contacts for user:', userId);
      
      // user_id로만 문의 조회 (로그인한 사용자만 문의 가능)
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          statusCode: (error as any).statusCode
        });
        
        // RLS 정책 문제일 가능성이 높음
        if (error.code === 'PGRST116' || error.message.includes('permission')) {
          console.error('RLS 정책 문제: contacts 테이블의 RLS 정책을 확인하세요');
        }
        
        throw error;
      }

      console.log('Fetched contacts:', data?.length || 0, 'items');
      setContacts(data || []);
    } catch (error: any) {
      console.error('Error fetching contacts:', {
        message: error?.message || 'Unknown error',
        error: error,
        stack: error?.stack
      });
      
      // 에러가 발생해도 빈 배열로 설정 (UI는 계속 표시)
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600">{t('mypage.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
              <div className="relative group flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-900 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-stone-900 rounded-full flex items-center justify-center border-2 border-white hover:bg-stone-800 transition-colors disabled:opacity-50"
                  title="프로필 사진 변경"
                >
                  {uploading ? (
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-1 break-keep">
                  {t('mypage.title')}
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-stone-600 break-keep">{t('mypage.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center px-3 py-2 sm:px-4 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0 w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              <span>{t('mypage.logout')}</span>
            </button>
          </div>

          {/* User Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-50 p-4 rounded-lg">
              <p className="text-sm text-stone-600 mb-1">{t('mypage.name')}</p>
              <p className="text-lg font-semibold text-stone-900">
                {user?.user_metadata?.name || t('mypage.noName')}
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-lg">
              <p className="text-sm text-stone-600 mb-1">{t('mypage.email')}</p>
              <p className="text-lg font-semibold text-stone-900 truncate">
                {user?.email || '-'}
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-lg">
              <p className="text-sm text-stone-600 mb-1">{t('mypage.totalInquiries')}</p>
              <p className="text-2xl font-bold text-stone-900">{contacts.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Link
            href="/contact"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-stone-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">{t('mypage.newInquiry')}</h3>
                <p className="text-sm text-stone-600">{t('mypage.newInquiryDesc')}</p>
              </div>
            </div>
          </Link>

          <Link
            href="/portfolio"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-stone-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">{t('mypage.portfolio')}</h3>
                <p className="text-sm text-stone-600">{t('mypage.portfolioDesc')}</p>
              </div>
            </div>
          </Link>

          <Link
            href="/services"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-stone-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">{t('mypage.services')}</h3>
                <p className="text-sm text-stone-600">{t('mypage.servicesDesc')}</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Inquiry History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center">
              <Inbox className="w-6 h-6 mr-2" />
              {t('mypage.inquiryHistory')}
            </h2>
          </div>

          {contacts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Inbox className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                {t('mypage.noInquiries')}
              </h3>
              <p className="text-stone-600 mb-6">{t('mypage.noInquiriesDesc')}</p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
              >
                {t('mypage.makeInquiry')}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-serif font-semibold text-stone-900">
                          {contact.name}
                        </h3>
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                          {t('mypage.pending')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-stone-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(contact.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-stone-600">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center text-stone-600">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-stone-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-stone-700 mb-2">
                      {t('mypage.inquiryContent')}
                    </p>
                    <p className="text-stone-900 whitespace-pre-wrap">{contact.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

