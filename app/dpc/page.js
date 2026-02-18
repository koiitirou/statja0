import { Suspense } from 'react';
import DpcIndexClient from './DpcIndexClient';

export const dynamic = 'force-static';

export async function generateMetadata() {
  return {
    title: 'DPC病気名一覧　治療実績ランキング',
    description:
      'DPCの病気名一覧ページ。治療実績（入院患者数、症例数）・手術件数・在院日数を病気別にまとめています。',
    openGraph: {
      title: 'DPC病気名一覧　治療実績ランキング',
      description:
        'DPCの病気名一覧ページ。治療実績（入院患者数、症例数）・手術件数・在院日数を病気別にまとめています。',
    },
    alternates: {
      canonical: 'https://statja.com/dpc',
    },
  };
}

export default function DpcPage() {
  return (
    <Suspense fallback={null}>
      <DpcIndexClient />
    </Suspense>
  );
}
