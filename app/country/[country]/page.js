import { server } from '@/components/config';
import wor_path from '@/components/wor/wor_path.json';
import CountryClient from './CountryClient';

const cls1 = wor_path.country;

var options1 = [];
wor_path.topic.forEach((v) => {
  options1.push(v.nm1);
});

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { country } = await params;
  const title = `${cls1[country].jpn}の統計ランキング（人口、面積、経済、貧困など）`;
  const description = `${cls1[country].jpn}の統計データランキング・年次推移をまとめました。詳細データ・順位変化・前年比がわかるページへリンクしています。`;
  return {
    title,
    description,
    openGraph: { title },
  };
}

export default async function CountryPage({ params }) {
  const { country } = await params;
  const res1 = await fetch(`${server}/rn3_100/${country}_ja.json`);
  const res2 = await res1.json();

  // Pass raw columns without sortType (functions can't cross server/client boundary)
  const columns = res2.columns_ja;
  const data = res2.data;

  const title = `${cls1[country].jpn}の統計ランキング（人口、面積、経済、貧困など）`;
  const description = `${cls1[country].jpn}の統計データランキング・年次推移をまとめました。詳細データ・順位変化・前年比がわかるページへリンクしています。`;

  return (
    <CountryClient
      country={country}
      columns={columns}
      data={data}
      cls1={cls1}
      options1={options1}
      title={title}
      description={description}
    />
  );
}
