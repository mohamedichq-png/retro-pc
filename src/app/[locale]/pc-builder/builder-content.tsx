// RETRO Qatar — PC Builder Content (Client)

'use client';

import React from 'react';
import { BuilderWizard } from '@/components/builder/BuilderWizard';
import { PartSelector } from '@/components/builder/PartSelector';
import { BuildSummary } from '@/components/builder/BuildSummary';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import type { Product } from '@/types';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface PCBuilderContentProps {
  products: Product[];
  dict: Dictionary;
  locale: Locale;
}

export function PCBuilderContent({ products, dict, locale }: PCBuilderContentProps) {
  const breadcrumbs = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.pcBuilder?.title || 'PC Builder' },
  ];

  return (
    <div className="bg-retro-bg min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <Breadcrumb items={breadcrumbs} className="mb-8" />
        
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-retro-text tracking-tight mb-4">
            {dict.pcBuilder?.title || 'Custom PC Builder'}
          </h1>
          <p className="text-sm sm:text-base text-retro-text-secondary max-w-2xl mx-auto">
            {dict.pcBuilder?.subtitle || 'Build your dream gaming PC step-by-step. Our compatibility engine ensures all your parts work perfectly together.'}
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* Main Workspace (Left) */}
          <div className="flex-1 w-full">
            <BuilderWizard dict={dict} locale={locale} />
            <PartSelector products={products} dict={dict} locale={locale} />
          </div>

          {/* Summary Sidebar (Right) */}
          <div className="w-full xl:w-[420px] shrink-0">
            <BuildSummary dict={dict} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
