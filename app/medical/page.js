import { Suspense } from 'react';
import MedicalIndexClient from './MedicalIndexClient';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateMetadata() {
  return {
    title: '医科診療行為（算定回数）の推移【NDBオープンデータ】',
    description:
      'NDBオープンデータの医科診療行為（算定回数）の推移。男女別・年齢別・都道府県別に分析。',
    openGraph: {
      title: '医科診療行為（算定回数）の推移【NDBオープンデータ】',
      description:
        'NDBオープンデータの医科診療行為（算定回数）の推移。男女別・年齢別・都道府県別に分析。',
    },
    alternates: {
      canonical: 'https://statja.com/medical',
    },
  };
}

export default function MedicalIndexPage() {
  return (
    <Suspense fallback={null}>
      <MedicalIndexClient />
    </Suspense>
  );
}
