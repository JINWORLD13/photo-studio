'use client';

import { motion } from 'framer-motion';
import { Check, Heart, Users, Briefcase, Camera, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Services() {
  const { t } = useTranslation();
  const packages = [
    {
      name: t('services.packages.basic.name'),
      price: '300,000',
      duration: t('services.packages.basic.duration'),
      icon: Camera,
      features: [
        t('services.packages.basic.features.0'),
        t('services.packages.basic.features.1'),
        t('services.packages.basic.features.2'),
        t('services.packages.basic.features.3'),
        t('services.packages.basic.features.4'),
      ],
      recommended: false,
    },
    {
      name: t('services.packages.premium.name'),
      price: '500,000',
      duration: t('services.packages.premium.duration'),
      icon: Heart,
      features: [
        t('services.packages.premium.features.0'),
        t('services.packages.premium.features.1'),
        t('services.packages.premium.features.2'),
        t('services.packages.premium.features.3'),
        t('services.packages.premium.features.4'),
        t('services.packages.premium.features.5'),
        t('services.packages.premium.features.6'),
      ],
      recommended: true,
    },
    {
      name: t('services.packages.wedding.name'),
      price: '1,200,000',
      duration: t('services.packages.wedding.duration'),
      icon: Users,
      features: [
        t('services.packages.wedding.features.0'),
        t('services.packages.wedding.features.1'),
        t('services.packages.wedding.features.2'),
        t('services.packages.wedding.features.3'),
        t('services.packages.wedding.features.4'),
        t('services.packages.wedding.features.5'),
        t('services.packages.wedding.features.6'),
        t('services.packages.wedding.features.7'),
      ],
      recommended: false,
    },
  ];

  const services = [
    {
      icon: Heart,
      title: t('services.servicesList.wedding.title'),
      description: t('services.servicesList.wedding.description'),
      details: [
        t('services.servicesList.wedding.details.0'),
        t('services.servicesList.wedding.details.1'),
        t('services.servicesList.wedding.details.2'),
      ],
    },
    {
      icon: Users,
      title: t('services.servicesList.family.title'),
      description: t('services.servicesList.family.description'),
      details: [
        t('services.servicesList.family.details.0'),
        t('services.servicesList.family.details.1'),
        t('services.servicesList.family.details.2'),
      ],
    },
    {
      icon: Briefcase,
      title: t('services.servicesList.business.title'),
      description: t('services.servicesList.business.description'),
      details: [
        t('services.servicesList.business.details.0'),
        t('services.servicesList.business.details.1'),
        t('services.servicesList.business.details.2'),
      ],
    },
    {
      icon: Camera,
      title: t('services.servicesList.product.title'),
      description: t('services.servicesList.product.description'),
      details: [
        t('services.servicesList.product.details.0'),
        t('services.servicesList.product.details.1'),
        t('services.servicesList.product.details.2'),
      ],
    },
  ];

  const process = [
    { step: 1, title: t('services.process.0.title'), description: t('services.process.0.description') },
    { step: 2, title: t('services.process.1.title'), description: t('services.process.1.description') },
    { step: 3, title: t('services.process.2.title'), description: t('services.process.2.description') },
    { step: 4, title: t('services.process.3.title'), description: t('services.process.3.description') },
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
            {t('services.title')}
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </motion.div>

        {/* Packages */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 flex flex-col ${
                pkg.recommended
                  ? 'ring-2 ring-stone-900 shadow-2xl scale-105'
                  : 'shadow-lg'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-stone-900 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {t('services.popular')}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <pkg.icon className="w-12 h-12 text-stone-700 mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-stone-900">
                    {pkg.price}
                  </span>
                  <span className="text-stone-600 ml-2">{t('services.currency')}</span>
                </div>
                <p className="text-stone-600 flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {pkg.duration}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-stone-700 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`block text-center py-3 rounded-full font-medium transition-colors mt-auto ${
                  pkg.recommended
                    ? 'bg-stone-900 text-white hover:bg-stone-800'
                    : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
                }`}
              >
                {t('services.consultation')}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Services Detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <h2 className="text-4xl font-serif font-bold text-stone-900 text-center mb-12">
            {t('services.servicesTitle')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <service.icon className="w-10 h-10 text-stone-700 mb-4" />
                <h3 className="text-2xl font-serif font-semibold text-stone-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-stone-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.details.map((detail, i) => (
                    <li key={i} className="flex items-center text-stone-600">
                      <div className="w-1.5 h-1.5 bg-stone-400 rounded-full mr-3" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <h2 className="text-4xl font-serif font-bold text-stone-900 text-center mb-12">
            {t('services.processTitle')}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {process.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="w-16 h-16 bg-stone-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-stone-600">{item.description}</p>
                {index < process.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-3 w-6 h-6 text-stone-300" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center py-16 bg-stone-900 rounded-3xl text-white"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            {t('services.cta.title')}
          </h2>
          <p className="text-xl text-stone-300 mb-8">
            {t('services.cta.subtitle')}
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-stone-900 rounded-full hover:bg-stone-100 transition-colors font-medium"
          >
            {t('services.cta.button')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

