import { Suspense } from 'react';
import HospitalIndexClient from './HospitalIndexClient';

export const dynamic = 'force-static';

export async function generateMetadata() {
  return {
    title: 'DPC病院一覧と治療実績【入院患者数ランキング（月平均数）】',
    description:
      'DPC病院一覧から、全国・各都道府県の病院の診療実績（症例数、手術数、在院日数）を比較することができます。',
  };
}

export default function HospitalPage() {
  return (
    <Suspense fallback={null}>
      <HospitalIndexClient />
    </Suspense>
  );
}
