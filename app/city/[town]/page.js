import CityTownClient from './CityTownClient';
import { server } from '@/components/config';
import cit_path from '@/components/cit_path/cit_path.json';

var array4 = [];
Object.keys(cit_path.refs).forEach((v, i) => {
  array4.push(cit_path.refs[v]);
});

export async function generateStaticParams() {
  return array4.map((item) => ({
    town: item.params.town,
  }));
}

export async function generateMetadata({ params }) {
  const { town } = await params;
  const ref1 = array4.find((v) => v.params.town === town);
  const name1 = ref1 ? ref1.params.nam : town;
  return {
    title: name1 + '統計の市区町村ランキング一覧',
    description:
      name1 +
      '統計に関する市区町村ランキング・データを1ページに総まとめ。推移や前年比が一目で分かる表とグラフがあります。',
    openGraph: {
      title: name1 + '統計の市区町村ランキング一覧',
      description:
        name1 +
        '統計に関する市区町村ランキング・データを1ページに総まとめ。推移や前年比が一目で分かる表とグラフがあります。',
    },
    alternates: { canonical: `https://statja.com/city/${town}` },
  };
}

export const revalidate = 86400;
export const dynamicParams = true;

export default async function CityTownPage({ params }) {
  const { town } = await params;

  const res1 = await fetch(`${server}/citcur/${town}.json`, { next: { revalidate: 86400 } });
  const json1 = await res1.json();

  return <CityTownClient json1={json1} town={town} array4={array4} />;
}
