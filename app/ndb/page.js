import { Suspense } from 'react';
import NdbClient from './NdbClient';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateMetadata() {
  return {
    title: '処方薬ランキング【NDB】売上・処方数・薬価の推移',
    description:
      'NDBオープンデータの処方薬ランキング。内服・外用・注射の売上・処方数・薬価・前年比を比較。',
  };
}

export default function NdbPage() {
  return (
    <Suspense fallback={null}>
      <NdbClient />
    </Suspense>
  );
}
