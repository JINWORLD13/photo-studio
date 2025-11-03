'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase, Contact } from '@/lib/supabase';
import { Mail, Phone, Calendar, LogOut, Inbox, Trash2, Image, Shield, Clock, Search, Filter, X, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { checkIsAdmin, ADMIN_ERROR_MESSAGES, getPortfolioAdminUrl } from '@/lib/admin-auth';
import { startSessionMonitoring, clearSession, getRemainingTime } from '@/lib/session-manager';

export default function Admin() {
  const router = useRouter();
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);
  
  // 필터 및 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    checkUser();
    fetchContacts();
    
    // 세션 모니터링 시작
    const cleanup = startSessionMonitoring(
      // 세션 만료 경고 (10분 후)
      () => {
        setSessionWarning(true);
        const timeLeft = getRemainingTime();
        setSessionTimeLeft(timeLeft);
      },
      // 세션 만료 (15분 후)
      () => {
        alert(ADMIN_ERROR_MESSAGES.sessionExpired);
        handleLogout();
      }
    );
    
    return cleanup;
  }, []);

  // 필터 및 검색 적용
  useEffect(() => {
    let result = [...contacts];

    // 검색 필터 적용
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.message.toLowerCase().includes(query) ||
          (contact.phone && contact.phone.toLowerCase().includes(query))
      );
    }

    // 정렬 적용
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // name으로 정렬
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sortOrder === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      }
    });

    setFilteredContacts(result);
  }, [contacts, searchQuery, sortBy, sortOrder]);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth');
    } else {
      // 강화된 관리자 권한 확인
      const isAdmin = checkIsAdmin(user);
      if (!isAdmin) {
        // 일반 사용자는 홈으로 리다이렉트
        alert(ADMIN_ERROR_MESSAGES.notAdmin);
        router.push('/');
        return;
      }
      setUser(user);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setContacts(data || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching contacts:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    clearSession(); // 세션 정리
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.deleteConfirm'))) return;

    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);

      if (error) throw error;

      setContacts(contacts.filter((contact) => contact.id !== id));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting contact:', error);
      }
      alert(t('admin.deleteError'));
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSortBy('date');
    setSortOrder('desc');
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
          <p className="text-stone-600">{t('admin.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Session Warning Banner */}
        {sessionWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-lg"
          >
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-amber-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">
                  {t('admin.sessionExpiring')}
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  {t('admin.sessionExpiringDesc').replace('{minutes}', Math.ceil(sessionTimeLeft / 60).toString())}
                </p>
              </div>
              <button
                onClick={() => setSessionWarning(false)}
                className="text-amber-600 hover:text-amber-800"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <div className="flex items-start gap-2 mb-2">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0 mt-1" />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-stone-900 break-words leading-tight">
                  {t('admin.title')}
                </h1>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-stone-600 break-words">
                {t('admin.subtitle')}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm flex-shrink-0 whitespace-nowrap"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>{t('admin.logout')}</span>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-50 p-4 rounded-lg">
              <p className="text-sm text-stone-600 mb-1">{t('admin.totalContacts')}</p>
              <p className="text-2xl font-bold text-stone-900">{contacts.length}</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-lg">
              <p className="text-sm text-stone-600 mb-1">{t('admin.todayContacts')}</p>
              <p className="text-2xl font-bold text-stone-900">
                {
                  contacts.filter(
                    (c) =>
                      new Date(c.created_at).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-lg">
              <p className="text-sm text-stone-600 mb-1">{t('admin.loginAccount')}</p>
              <p className="text-sm font-medium text-stone-900 truncate">
                {user?.email || '-'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <Link
              href={getPortfolioAdminUrl()}
              className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 sm:px-6 sm:py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              <Image className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">{t('admin.portfolioManagement')}</span>
            </Link>
          </div>
        </motion.div>

        {/* Contacts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 flex items-center flex-wrap gap-2">
              <Inbox className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span className="break-keep">{t('admin.contactsTitle')}</span>
              <span className="text-base sm:text-lg font-normal text-stone-500 whitespace-nowrap">
                ({filteredContacts.length}/{contacts.length})
              </span>
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 sm:px-4 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-sm sm:text-base whitespace-nowrap flex-shrink-0"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              <span>{t('admin.filters')}</span>
              <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* 필터 및 검색 패널 */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <div className="space-y-4">
                {/* 검색바 */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {t('admin.search')}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('admin.searchPlaceholder')}
                      className="w-full pl-10 pr-10 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 정렬 옵션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      {t('admin.sortBy')}
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
                    >
                      <option value="date">{t('admin.sortByDate')}</option>
                      <option value="name">{t('admin.sortByName')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      {t('admin.sortOrder')}
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
                    >
                      <option value="desc">{t('admin.sortDesc')}</option>
                      <option value="asc">{t('admin.sortAsc')}</option>
                    </select>
                  </div>
                </div>

                {/* 필터 초기화 버튼 */}
                {(searchQuery || sortBy !== 'date' || sortOrder !== 'desc') && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleResetFilters}
                      className="flex items-center px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {t('admin.resetFilters')}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {contacts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Inbox className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                {t('admin.noContacts')}
              </h3>
              <p className="text-stone-600">
                {t('admin.noContactsDesc')}
              </p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Search className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                {t('admin.noSearchResults')}
              </h3>
              <p className="text-stone-600 mb-6">
                {t('admin.noSearchResultsDesc')}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                {t('admin.resetFilters')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-serif font-semibold text-stone-900 mb-1">
                        {contact.name}
                      </h3>
                      <div className="flex items-center text-sm text-stone-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(contact.created_at)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('admin.delete')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-stone-600">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-stone-900 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center text-stone-600">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <a
                          href={`tel:${contact.phone}`}
                          className="hover:text-stone-900 hover:underline"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="bg-stone-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-stone-700 mb-2">
                      {t('admin.messageLabel')}
                    </p>
                    <p className="text-stone-900 whitespace-pre-wrap">
                      {contact.message}
                    </p>
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

