"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
}

// 카테고리 키와 번역 매핑
const CATEGORY_KEYS = {
  all: "all",
  wedding: "wedding",
  couple: "couple",
  profile: "profile",
  family: "family",
  product: "product",
} as const;

export default function PortfolioPage() {
  const { locale } = useLanguage();
  const { t } = useTranslation();
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState<PortfolioItem[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    CATEGORY_KEYS.all
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [isHoveringButtons, setIsHoveringButtons] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  // 카테고리 목록 (키 값)
  const categories = [
    { key: CATEGORY_KEYS.all, labelKey: "portfolio.categories.all" },
    { key: CATEGORY_KEYS.wedding, labelKey: "portfolio.categories.wedding" },
    { key: CATEGORY_KEYS.couple, labelKey: "portfolio.categories.couple" },
    { key: CATEGORY_KEYS.profile, labelKey: "portfolio.categories.profile" },
    { key: CATEGORY_KEYS.family, labelKey: "portfolio.categories.family" },
    { key: CATEGORY_KEYS.product, labelKey: "portfolio.categories.product" },
  ];

  useEffect(() => {
    fetchPortfolios();
  }, []);

  useEffect(() => {
    // 카테고리 필터링
    if (selectedCategory === CATEGORY_KEYS.all) {
      setFilteredPortfolios(portfolios);
    } else {
      const filtered = portfolios.filter(
        (item) => item.category === selectedCategory
      );
      setFilteredPortfolios(filtered);
    }
  }, [selectedCategory, portfolios]);

  async function fetchPortfolios() {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching portfolios...");
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        setError(
          `데이터베이스 오류: ${error.message || JSON.stringify(error)}`
        );
        throw error;
      }

      console.log("Fetched portfolios:", data);
      console.log("Number of portfolios:", data?.length || 0);

      setPortfolios(data || []);
      setFilteredPortfolios(data || []);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      const errorMsg =
        error instanceof Error ? error.message : "알 수 없는 오류";
      setError(`포트폴리오를 불러올 수 없습니다: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

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
      setSelectedImage(filteredPortfolios[newIndex]);
    }
  };

  // 다음 이미지
  const showNextImage = () => {
    if (currentIndex < filteredPortfolios.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedImage(filteredPortfolios[newIndex]);
    }
  };

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        showPrevImage();
      } else if (e.key === "ArrowRight") {
        showNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedImage,
    currentIndex,
    filteredPortfolios,
    showPrevImage,
    showNextImage,
  ]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
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
      }, 2000); // 2초 후 자동으로 사라짐
      return () => clearTimeout(timer);
    }
  }, [selectedImage, currentIndex]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-4">
            {t("portfolio.title")}
          </h1>
          <p className="text-xl md:text-2xl text-stone-600">
            {t("portfolio.subtitle")}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                selectedCategory === category.key
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }`}
            >
              {t(category.labelKey)}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredPortfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolios.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleImageClick(item, index)}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white cursor-pointer"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* 확대 아이콘 */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-stone-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="mb-2">
                    <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm whitespace-nowrap">
                      {t(`portfolio.categories.${item.category}`)}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 break-keep line-clamp-1">
                    {t(`portfolioItems.${item.title}.title`, item.title)}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-200 line-clamp-2 break-keep">
                    {t(
                      `portfolioItems.${item.description}.description`,
                      item.description
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {t("portfolio.noItems")}
            </h3>
            <p className="text-gray-500">{t("portfolio.noItemsDescription")}</p>
          </div>
        )}
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
          {currentIndex < filteredPortfolios.length - 1 && (
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
          {currentIndex < filteredPortfolios.length - 1 && (
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
                  {currentIndex + 1} / {filteredPortfolios.length}
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

      {/* CTA Section */}
      <section className="bg-stone-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            {t("portfolio.cta.title")}
          </h2>
          <p className="text-xl mb-8 text-stone-300">
            {t("portfolio.cta.description")}
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-stone-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-stone-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            {t("portfolio.cta.button")}
          </a>
        </div>
      </section>
    </div>
  );
}
