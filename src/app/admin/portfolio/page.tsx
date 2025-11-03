"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Upload, Trash2, Image as ImageIcon, Plus, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { checkIsAdmin, ADMIN_ERROR_MESSAGES } from "@/lib/admin-auth";

interface Portfolio {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description: string | null;
  created_at: string;
}

export default function AdminPortfolio() {
  const router = useRouter();
  const { t } = useTranslation();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "wedding",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      await checkUser();
      await fetchPortfolios();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth");
    } else {
      // 통합된 관리자 권한 체크 함수 사용
      const isAdmin = checkIsAdmin(user);

      // 디버깅 정보 출력 (개발 환경에서만)
      if (process.env.NODE_ENV === "development") {
        console.log("=== 관리자 권한 체크 ===");
        console.log("사용자 이메일:", user.email);
        console.log("user_metadata.role:", user.user_metadata?.role);
        console.log("app_metadata.role:", user.app_metadata?.role);
        console.log(
          "환경변수 NEXT_PUBLIC_ADMIN_EMAILS:",
          process.env.NEXT_PUBLIC_ADMIN_EMAILS
        );
        console.log("관리자 권한:", isAdmin);
        console.log("=======================");
      }

      if (!isAdmin) {
        alert(ADMIN_ERROR_MESSAGES.notAdmin);
        router.push("/");
      }
    }
  };

  const fetchPortfolios = async () => {
    try {
      console.log("Starting to fetch portfolios from Supabase...");

      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      // 디버깅: 가져온 포트폴리오 데이터 확인
      console.log("Fetched portfolios:", data?.length || 0, "items");
      if (data && data.length > 0) {
        console.log("First portfolio:", {
          id: data[0].id,
          title: data[0].title,
          category: data[0].category,
          image_url: data[0].image_url,
        });
      } else {
        console.warn("No portfolios found in database!");
        console.log("Possible causes:");
        console.log("   1. No data in 'portfolios' table");
        console.log("   2. RLS (Row Level Security) policy blocking access");
        console.log("   3. Run QUICK_FIX_PORTFOLIO.sql in Supabase SQL Editor");
      }

      setPortfolios(data || []);
    } catch (error) {
      console.error("❌ Error fetching portfolios:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert(t("adminPortfolio.imageOnly"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(t("adminPortfolio.fileSizeLimit"));
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert(t("adminPortfolio.selectImage"));
      return;
    }

    setUploading(true);

    try {
      // 1. 이미지 업로드
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 2. public URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio-images").getPublicUrl(filePath);

      // 3. 데이터베이스에 저장
      const { error: dbError } = await supabase.from("portfolios").insert([
        {
          title: formData.title,
          image_url: publicUrl,
          category: formData.category,
          description: formData.description || null,
        },
      ]);

      if (dbError) throw dbError;

      // 성공
      alert(t("adminPortfolio.uploadSuccess"));
      setShowUploadModal(false);
      setFormData({ title: "", category: "wedding", description: "" });
      setSelectedFile(null);
      setPreviewUrl("");
      fetchPortfolios();
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("adminPortfolio.unknownError");
      alert(`${t("adminPortfolio.uploadFailed")}: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm(t("adminPortfolio.deleteConfirm"))) return;

    try {
      // 1. Storage에서 이미지 삭제
      // URL 형식: https://xxx.supabase.co/storage/v1/object/public/portfolio-images/파일명
      // 또는: https://xxx.supabase.co/storage/v1/object/public/portfolio-images/public/파일명
      let path = "";

      if (imageUrl.includes("/portfolio-images/")) {
        // URL에서 'portfolio-images/' 이후의 경로 추출
        path = imageUrl.split("/portfolio-images/")[1];
      } else {
        // 마지막 부분만 추출 (fallback)
        path = imageUrl.split("/").pop() || "";
      }

      console.log("Deleting image from storage:", path);

      if (path) {
        const { error: storageError } = await supabase.storage
          .from("portfolio-images")
          .remove([path]);

        if (storageError) {
          console.error("Storage delete error:", storageError);
          // Storage 삭제 실패해도 DB 삭제는 계속 진행
        }
      }

      // 2. 데이터베이스에서 삭제
      const { error: dbError } = await supabase
        .from("portfolios")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      setPortfolios(portfolios.filter((p) => p.id !== id));
      alert(t("adminPortfolio.deleteSuccess"));
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("adminPortfolio.deleteError");
      alert(`${t("adminPortfolio.deleteError")}: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600">{t("admin.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2 break-keep">
              {t("adminPortfolio.title")}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 break-keep">
              {t("adminPortfolio.subtitle")}
            </p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto flex-shrink-0">
            <Link
              href="/admin"
              className="flex items-center justify-center px-3 py-2 sm:px-4 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm sm:text-base whitespace-nowrap flex-1 sm:flex-initial"
            >
              <span className="hidden sm:inline">← </span>
              {t("adminPortfolio.backToDashboard")}
            </Link>
            {portfolios.length > 0 && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center justify-center px-3 py-2 sm:px-4 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors text-sm sm:text-base whitespace-nowrap flex-1 sm:flex-initial"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                {t("adminPortfolio.addImage")}
              </button>
            )}
          </div>
        </div>

        {/* Portfolio Grid */}
        {portfolios.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ImageIcon className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-900 mb-2">
              {t("adminPortfolio.noPortfolio")}
            </h3>
            <p className="text-stone-600 mb-6">
              {t("adminPortfolio.addFirstImage")}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t("adminPortfolio.addImage")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {portfolios.map((portfolio) => (
              <motion.div
                key={portfolio.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden group"
              >
                <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={portfolio.image_url}
                    alt={t(
                      `portfolioItems.${portfolio.title}.title`,
                      portfolio.title
                    )}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="eager"
                    onLoad={(e) => {
                      console.log(
                        "Image loaded successfully:",
                        portfolio.image_url
                      );
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.error(
                        "Failed to load image:",
                        portfolio.image_url
                      );
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center flex-col">
                            <svg class="w-16 h-16 text-stone-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p class="text-stone-500 text-sm">이미지를 불러올 수 없습니다</p>
                          </div>
                        `;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center pointer-events-none">
                    <button
                      onClick={() =>
                        handleDelete(portfolio.id, portfolio.image_url)
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-red-600 text-white rounded-full hover:bg-red-700 pointer-events-auto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-stone-900 mb-1 text-sm truncate">
                    {t(
                      `portfolioItems.${portfolio.title}.title`,
                      portfolio.title
                    )}
                  </h3>
                  <p className="text-xs text-stone-600 truncate">
                    {t(`portfolio.categories.${portfolio.category}`)}
                  </p>
                  {portfolio.description && (
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {t(
                        `portfolioItems.${portfolio.description}.description`,
                        portfolio.description
                      )}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-stone-900">
                    {t("adminPortfolio.addImageModal")}
                  </h2>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setSelectedFile(null);
                      setPreviewUrl("");
                    }}
                    className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      {t("adminPortfolio.imageLabel")} *
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        previewUrl
                          ? "border-stone-300"
                          : "border-stone-300 hover:border-stone-400"
                      }`}
                      onClick={() =>
                        document.getElementById("file-input")?.click()
                      }
                    >
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                          <p className="text-stone-600 mb-2">
                            {t("adminPortfolio.clickToSelect")}
                          </p>
                          <p className="text-sm text-stone-500">
                            {t("adminPortfolio.imageFormat")}
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      {t("adminPortfolio.titleLabel")} *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
                      placeholder={t("adminPortfolio.titlePlaceholder")}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      {t("adminPortfolio.categoryLabel")} *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none"
                    >
                      <option value="wedding">
                        {t("portfolio.categories.wedding")}
                      </option>
                      <option value="couple">
                        {t("portfolio.categories.couple")}
                      </option>
                      <option value="profile">
                        {t("portfolio.categories.profile")}
                      </option>
                      <option value="family">
                        {t("portfolio.categories.family")}
                      </option>
                      <option value="product">
                        {t("portfolio.categories.product")}
                      </option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      {t("adminPortfolio.descriptionLabel")}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none resize-none"
                      placeholder={t("adminPortfolio.descriptionPlaceholder")}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadModal(false);
                        setSelectedFile(null);
                        setPreviewUrl("");
                      }}
                      className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      {t("adminPortfolio.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={uploading || !selectedFile}
                      className="flex-1 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading
                        ? t("adminPortfolio.uploading")
                        : t("adminPortfolio.upload")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
