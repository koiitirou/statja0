import wor1 from '@/components/wor/world_ranking_ja.json';
import wor_path from '@/components/wor/wor_path.json';
import WorldIndexClient from './WorldIndexClient';

const columns = wor1.columns;
const data = wor1.data;
const cls1 = wor_path.country;

var options1 = [];
wor_path.topic.forEach((v) => {
  options1.push(v.nm1);
});

export const metadata = {
  title: '各統計の世界ランキング【国別順位】',
  description:
    '人口・経済・国土など各統計の世界ランキング、国別順位を総まとめ。詳細なランキングデータや経年変化を示したページへのリンクがあります。',
  openGraph: {
    title: '各統計の世界ランキング【国別順位】',
    description:
      '人口・経済・国土など各統計の世界ランキング、国別順位を総まとめ。詳細なランキングデータや経年変化を示したページへのリンクがあります。',
  },
  alternates: {
    canonical: 'https://statja.com/world',
  },
};

export default function WorldPage() {
  return (
    <WorldIndexClient
      columns={columns}
      data={data}
      cls1={cls1}
      options1={options1}
    />
  );
}
