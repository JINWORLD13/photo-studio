'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Heart, Star, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import StructuredData from '@/components/StructuredData';

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description: string;
}

export default function Home() {
  const { t } = useTranslation();
  const [portfolioPreview, setPortfolioPreview] = useState<PortfolioItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [isHoveringButtons, setIsHoveringButtons] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  
  const features = [
    {
      icon: Camera,
      title: t('home.features.equipment.title'),
      description: t('home.features.equipment.description'),
    },
    {
      icon: Heart,
      title: t('home.features.emotion.title'),
      description: t('home.features.emotion.description'),
    },
    {
      icon: Star,
      title: t('home.features.delivery.title'),
      description: t('home.features.delivery.description'),
    },
  ];

  // Supabase에서 최신 포트폴리오 3개 가져오기
  useEffect(() => {
    async function fetchRecentPortfolios() {
      try {
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        if (data && data.length > 0) {
          setPortfolioPreview(data);
        }
      } catch (error) {
        console.error('Error fetching recent portfolios:', error);
      }
    }

    fetchRecentPortfolios();
  }, []);

  // 이미지 클릭 핸들러
  const handleImageClick = (item: PortfolioItem, index: number) => {
    setSelectedImage(item);
    setCurrentIndex(index);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedImage(null);
  };

  // 이전 이미지
  const showPrevImage = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedImage(portfolioPreview[newIndex]);
    }
  };

  // 다음 이미지
  const showNextImage = () => {
    if (currentIndex < portfolioPreview.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedImage(portfolioPreview[newIndex]);
    }
  };

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex, portfolioPreview]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedImage]);

  // 모달 열릴 때 또는 이미지 변경 시 텍스트 일시적으로 표시
  useEffect(() => {
    if (selectedImage) {
      setIsHoveringControls(true);
      setIsHoveringButtons(true);
      setIsHoveringImage(true);
      const timer = setTimeout(() => {
        setIsHoveringControls(false);
        setIsHoveringButtons(false);
        setIsHoveringImage(false);
      }, 5000); // 5초 후 자동으로 사라짐
      return () => clearTimeout(timer);
    }
  }, [selectedImage, currentIndex]);

  return (
    <div className="overflow-hidden">
      <StructuredData type="service" />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920')] bg-cover bg-center opacity-10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-stone-600 mb-8 max-w-2xl mx-auto whitespace-pre-line">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors font-medium text-lg group"
              >
                {t('home.hero.ctaPrimary')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-stone-900 rounded-full hover:bg-stone-100 transition-colors font-medium text-lg border-2 border-stone-200"
              >
                {t('home.hero.ctaSecondary')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-stone-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-stone-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-base sm:text-lg text-stone-600 max-w-3xl mx-auto whitespace-pre-line px-4">
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-stone-50 p-8 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-stone-700 mb-4" />
                <h3 className="text-2xl font-serif font-semibold text-stone-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
              {t('home.recentWork.title')}
            </h2>
            <p className="text-lg text-stone-600">
              {t('home.recentWork.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {portfolioPreview.length > 0 ? (
              portfolioPreview.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handleImageClick(item, index)}
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* 확대 아이콘 */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-xl font-serif font-semibold">
                        {t(`portfolio.categories.${item.category}`)}
                      </p>
                      <p className="text-sm text-gray-200 mt-1">
                        {t(`portfolioItems.${item.title}.title`, item.title)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // 데이터가 없을 때 로딩 또는 빈 상태 표시
              <div className="col-span-3 text-center py-12 text-gray-500">
                <p>{t('portfolio.noItems')}</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center px-8 py-4 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors font-medium"
            >
              {t('home.recentWork.viewAll')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-stone-900 text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight whitespace-pre-line cta-title">
              {t('home.cta.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-stone-300 mb-8 whitespace-pre-line leading-relaxed max-w-3xl mx-auto cta-subtitle">
              {t('home.cta.subtitle')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-stone-900 rounded-full hover:bg-stone-100 transition-colors font-medium text-base sm:text-lg"
            >
              {t('home.cta.button')}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </motion.div>
        </div>
        <style jsx>{`
          @media (max-width: 312px) {
            .cta-title {
              font-size: 1.5rem;
            }
            .cta-subtitle {
              font-size: 0.875rem;
            }
          }
        `}</style>
      </section>

      {/* 이미지 모달 라이트박스 */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeModal}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={closeModal}
            onMouseEnter={() => setIsHoveringControls(true)}
            onMouseLeave={() => {
              if (!isHoveringImage && !isHoveringButtons) {
                setIsHoveringControls(false);
              }
            }}
            className="absolute top-4 right-4 z-[100] p-3 text-white transition-opacity duration-500 ease-in-out pointer-events-auto"
            style={{ opacity: isHoveringControls ? 1 : 0 }}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 drop-shadow-lg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* 왼쪽 버튼 호버 영역 */}
          {currentIndex > 0 && (
            <div
              className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 pointer-events-auto z-50"
              onMouseEnter={() => {
                setIsHoveringButtons(true);
                setIsHoveringControls(true);
              }}
              onMouseLeave={() => {
                setIsHoveringButtons(false);
                if (!isHoveringImage) {
                  setIsHoveringControls(false);
                }
              }}
              onTouchStart={() => {
                setIsHoveringButtons(true);
                setIsHoveringControls(true);
              }}
              style={{ zIndex: 50 }}
            />
          )}

          {/* 오른쪽 버튼 호버 영역 */}
          {currentIndex < portfolioPreview.length - 1 && (
            <div
              className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 pointer-events-auto z-50"
              onMouseEnter={() => {
                setIsHoveringButtons(true);
                setIsHoveringControls(true);
              }}
              onMouseLeave={() => {
                setIsHoveringButtons(false);
                if (!isHoveringImage) {
                  setIsHoveringControls(false);
                }
              }}
              onTouchStart={() => {
                setIsHoveringButtons(true);
                setIsHoveringControls(true);
              }}
              style={{ zIndex: 50 }}
            />
          )}

          {/* 이전 버튼 */}
          {currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsHoveringButtons(true);
                setIsHoveringControls(true);
                showPrevImage();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsHoveringButtons(true);
                setIsHoveringControls(true);
                showPrevImage();
              }}
              onMouseEnter={() => {
                setIsHoveringButtons(true);
                setIsHoveringControls(true);
              }}
              onMouseLeave={() => {
                setIsHoveringButtons(false);
                if (!isHoveringImage) {
                  setIsHoveringControls(false);
                }
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full text-white transition-all duration-300 pointer-events-auto hover:scale-110"
              style={{
                touchAction: "manipulation",
                zIndex: 100,
                opacity: isHoveringButtons ? 1 : 0,
              }}
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 sm:h-10 sm:w-10 drop-shadow-lg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* 다음 버튼 */}
          {currentIndex < portfolioPreview.length - 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsHoveringButtons(true);
                setIsHoveringControls(true);
                showNextImage();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsHoveringButtons(true);
                setIsHoveringControls(true);
                showNextImage();
              }}
              onMouseEnter={() => {
                setIsHoveringButtons(true);
                setIsHoveringControls(true);
              }}
              onMouseLeave={() => {
                setIsHoveringButtons(false);
                if (!isHoveringImage) {
                  setIsHoveringControls(false);
                }
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full text-white transition-all duration-300 pointer-events-auto hover:scale-110"
              style={{
                touchAction: "manipulation",
                zIndex: 100,
                opacity: isHoveringButtons ? 1 : 0,
              }}
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 sm:h-10 sm:w-10 drop-shadow-lg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* 이미지 컨테이너 */}
          <div
            className="relative max-w-7xl max-h-[90vh] mx-0 sm:mx-4 pointer-events-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsHoveringImage(true);
              setIsHoveringControls(true);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              setIsHoveringImage(true);
              setIsHoveringControls(true);
            }}
            onMouseEnter={() => {
              setIsHoveringImage(true);
              setIsHoveringControls(true);
            }}
            onMouseLeave={() => {
              setIsHoveringImage(false);
              if (!isHoveringButtons) {
                setIsHoveringControls(false);
              }
            }}
            style={{ zIndex: 0 }}
          >
            {/* 메인 이미지 */}
            <div className="relative pointer-events-auto" style={{ zIndex: 0 }}>
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHoveringImage(true);
                  setIsHoveringControls(true);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setIsHoveringImage(true);
                  setIsHoveringControls(true);
                }}
              />
            </div>

            {/* 이미지 정보 */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6 rounded-b-lg pointer-events-none transition-all duration-500 ease-in-out"
              style={{
                zIndex: 1,
                pointerEvents: "none",
                opacity: isHoveringControls ? 1 : 0,
                transform: isHoveringControls
                  ? "translateY(0)"
                  : "translateY(10px)",
              }}
            >
              <div
                className="mb-2 flex flex-wrap items-center gap-2"
                style={{ pointerEvents: "none" }}
              >
                <span
                  className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white whitespace-nowrap"
                  style={{ pointerEvents: "none" }}
                >
                  {t(`portfolio.categories.${selectedImage.category}`)}
                </span>
                <span
                  className="text-white/70 text-xs sm:text-sm whitespace-nowrap"
                  style={{ pointerEvents: "none" }}
                >
                  {currentIndex + 1} / {portfolioPreview.length}
                </span>
              </div>
              <h3
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 break-keep"
                style={{ pointerEvents: "none" }}
              >
                {t(
                  `portfolioItems.${selectedImage.title}.title`,
                  selectedImage.title
                )}
              </h3>
              <p
                className="text-sm sm:text-base lg:text-lg text-gray-200 break-keep"
                style={{ pointerEvents: "none" }}
              >
                {t(
                  `portfolioItems.${selectedImage.description}.description`,
                  selectedImage.description
                )}
              </p>
            </div>
          </div>

          {/* 키보드 힌트 */}
          <div
            className="absolute bottom-4 sm:bottom-8 left-1/2 flex flex-wrap justify-center gap-2 sm:gap-4 text-white/60 text-xs sm:text-sm transition-all duration-500 ease-in-out px-4"
            style={{
              zIndex: 200,
              opacity: isHoveringControls ? 1 : 0,
              transform: isHoveringControls
                ? "translate(-50%, 0) scale(1)"
                : "translate(-50%, -10px) scale(0.95)",
            }}
          >
            <span className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-white/10 rounded text-xs sm:text-sm">
                ESC
              </kbd>
              <span>{t("modal.close")}</span>
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-white/10 rounded text-xs sm:text-sm">
                ←
              </kbd>
              <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-white/10 rounded text-xs sm:text-sm">
                →
              </kbd>
              <span>{t("modal.viewDetails")}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
