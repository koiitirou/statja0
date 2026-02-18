import { Suspense } from 'react';
import DpcAltIndexClient from './DpcAltIndexClient';

export const dynamic = 'force-static';

export async function generateMetadata() {
  return {
    title: 'DPC代替一覧　治療実績ランキング',
    description:
      'DPC代替一覧ページ。治療実績（入院患者数、症例数）・手術件数・在院日数を病気別にまとめています。',
    openGraph: {
      title: 'DPC代替一覧　治療実績ランキング',
      description:
        'DPC代替一覧ページ。治療実績（入院患者数、症例数）・手術件数・在院日数を病気別にまとめています。',
    },
    alternates: {
      canonical: 'https://statja.com/dpc/alternative',
    },
  };
}

export default function DpcAlternativePage() {
  return (
    <Suspense fallback={null}>
      <DpcAltIndexClient />
    </Suspense>
  );
}
