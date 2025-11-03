"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { getContactInfo } from "@/config/business-info";

export default function Contact() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const contactInfo = getContactInfo(locale as "ko" | "en" | "ja");

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "웨딩스냅",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // 로그인 체크
  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      router.push("/auth?redirect=/contact");
      return;
    }

    // 로그인한 사용자의 정보로 폼 자동 채우기
    setFormData({
      name: user.user_metadata?.name || "",
      email: user.email || "",
      phone: user.user_metadata?.phone || "",
      service: "웨딩스냅",
      message: "",
    });
    setCheckingAuth(false);
  };

  // 로그인 체크 중이면 로딩 표시
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600">로그인 확인 중...</p>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 현재 로그인한 사용자 정보 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 1. Supabase에 저장 (Supabase 설정이 완료된 경우에만 작동)
      try {
        const { error: dbError } = await supabase.from("contacts").insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: `[${formData.service}] ${formData.message}`,
            user_id: user?.id || null, // 로그인한 경우 user_id 저장
          },
        ]);

        if (dbError) {
          if (process.env.NODE_ENV === "development") {
            console.warn("DB 저장 실패 (Supabase 미설정):", dbError);
          }
          // Supabase 설정이 안 되어 있어도 계속 진행
        }
      } catch (dbError) {
        if (process.env.NODE_ENV === "development") {
          console.warn("DB 저장 건너뜀 (Supabase 미설정):", dbError);
        }
        // DB 저장 실패해도 이메일은 보내기
      }

      // 2. Gmail API로 이메일 발송
      try {
        const emailResponse = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message,
          }),
        });

        if (!emailResponse.ok) {
          if (process.env.NODE_ENV === "development") {
            console.log("이메일 발송 실패 (선택사항)");
          }
        }
      } catch (emailError) {
        if (process.env.NODE_ENV === "development") {
          console.log("이메일 발송 실패 (선택사항):", emailError);
        }
        // 이메일 실패해도 DB 저장은 성공했으므로 계속 진행
      }

      // 성공
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "웨딩스냅",
        message: "",
      });

      // 3초 후 성공 메시지 숨기기
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error:", err);
      }
      const errorMessage =
        err instanceof Error
          ? err.message
          : "문의 전송에 실패했습니다. 다시 시도해주세요.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    {
      icon: Phone,
      title: t("contact.contactCards.phone"),
      content: contactInfo.phoneFormatted,
      href: contactInfo.phoneHref,
      subtext: contactInfo.businessHours,
    },
    {
      icon: Mail,
      title: t("contact.contactCards.email"),
      content: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
      subtext: t("contact.contactCards.emailAvailable"),
    },
    {
      icon: MapPin,
      title: t("contact.contactCards.studio"),
      content: contactInfo.address,
      href: null,
      subtext: t("contact.contactCards.visitInfo"),
    },
  ];

  return (
    <div className="min-h-screen py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto whitespace-pre-line">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6">
                {t("contact.form.title")}
              </h2>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t("contact.form.success")}
                </motion.div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      {t("contact.form.name")} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      readOnly
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-stone-100 text-stone-600 cursor-not-allowed"
                      placeholder={t("contact.form.namePlaceholder")}
                    />
                    <p className="text-xs text-stone-500 mt-1">
                      로그인한 계정 정보가 사용됩니다
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      {t("contact.form.email")} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      readOnly
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-stone-100 text-stone-600 cursor-not-allowed"
                      placeholder={t("contact.form.emailPlaceholder")}
                    />
                    <p className="text-xs text-stone-500 mt-1">
                      로그인한 이메일이 사용됩니다
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      {t("contact.form.phone")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition"
                      placeholder={t("contact.form.phonePlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      {t("contact.form.service")} *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition"
                    >
                      <option>{t("contact.services.wedding")}</option>
                      <option>{t("contact.services.couple")}</option>
                      <option>{t("contact.services.profile")}</option>
                      <option>{t("contact.services.family")}</option>
                      <option>{t("contact.services.product")}</option>
                      <option>{t("contact.services.other")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {t("contact.form.message")} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition resize-none"
                    placeholder={t("contact.form.messagePlaceholder")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 text-white py-4 rounded-full hover:bg-stone-800 transition-colors font-medium text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    t("contact.form.submitting")
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t("contact.form.submit")}
                    </>
                  )}
                </button>

                <p className="text-sm text-stone-500 text-center">
                  {t("contact.form.privacy")}
                </p>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {contactCards.map((card, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <card.icon className="w-10 h-10 text-stone-700 mb-4" />
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-2">
                  {card.title}
                </h3>
                {card.href ? (
                  <a
                    href={card.href}
                    className="text-stone-900 font-medium mb-1 hover:text-stone-600 transition-colors inline-block"
                  >
                    {card.content}
                  </a>
                ) : (
                  <p className="text-stone-900 font-medium mb-1">
                    {card.content}
                  </p>
                )}
                <p className="text-sm text-stone-600">{card.subtext}</p>
              </div>
            ))}

            {/* FAQ Quick Links */}
            <div className="bg-stone-900 text-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-serif font-semibold mb-4">
                {t("contact.faq.title")}
              </h3>
              <ul className="space-y-3 text-stone-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("contact.faq.q1")}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("contact.faq.q2")}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("contact.faq.q3")}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t("contact.faq.q4")}</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
