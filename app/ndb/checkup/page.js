import { server } from '@/components/config';
import checkup_path from '@/components/mdc/exp/checkup_path.json';
import summary_mean from '@/components/mdc/exp/summary_mean.json';
import CheckupIndexClient from './CheckupIndexClient';

export const dynamic = 'force-static';

export async function generateMetadata() {
  return {
    title: '特定健診（健康診査）の検査データ平均値【NDBオープンデータ】',
    description:
      'NDBオープンデータの特定健診（健康診査）の検査データ平均値の推移。都道府県別・年齢別・性別に分析。',
    openGraph: {
      title: '特定健診（健康診査）の検査データ平均値【NDBオープンデータ】',
      description:
        'NDBオープンデータの特定健診（健康診査）の検査データ平均値の推移。都道府県別・年齢別・性別に分析。',
    },
    alternates: {
      canonical: 'https://statja.com/ndb/checkup',
    },
  };
}

export default function CheckupIndexPage() {
  return (
    <CheckupIndexClient
      checkup_path={checkup_path}
      summary_mean={summary_mean}
    />
  );
}
