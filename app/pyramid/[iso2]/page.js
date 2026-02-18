import { server } from '@/components/config';
import pop_path0 from '@/components/pop/pop_path.json';
import pop_path11 from '@/components/pop/jpop_path1.json';
import pop_path12 from '@/components/pop/jpop_path2.json';
import PyramidClient from './PyramidClient';

const pop_path = pop_path0.concat(pop_path11).concat(pop_path12);

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { iso2 } = await params;
  const res3 = pop_path.find((v) => v.params.iso2 == iso2);
  if (!res3) {
    return { title: '人口ピラミッド' };
  }
  var con_name = '';
  if (res3.params.cl == 'sh') {
    con_name = res3.params.jpni + '　' + res3.params.kata;
  } else {
    con_name = res3.params.jpni;
  }

  try {
    const res1 = await fetch(`${server}/yr5out/${iso2}.json`);
    const res2 = await res1.json();
    const e0 = res2;
    const d0 = e0[0];
    const l0 = e0[e0.length - 1];
    return {
      title: con_name + 'の人口ピラミッド【' + d0.yrs + '~' + l0.yrs + '年】',
      description:
        con_name +
        'の人口ピラミッド(5歳階級)、総人口推移、区分人口推移(年少人口、生産年齢人口、高齢者人口)の、' +
        d0.yrs +
        '~' +
        l0.yrs +
        '年の推移データをまとめました。',
      openGraph: {
        title: con_name + 'の人口ピラミッド【' + d0.yrs + '~' + l0.yrs + '年】',
        description:
          con_name +
          'の人口ピラミッド(5歳階級)、総人口推移、区分人口推移のデータをまとめました。',
      },
      alternates: { canonical: `https://statja.com/pyramid/${iso2}` },
    };
  } catch (e) {
    return {
      title: con_name + 'の人口ピラミッド',
    };
  }
}

export default async function PyramidPage({ params }) {
  const { iso2 } = await params;
  const res3 = pop_path.find((v) => v.params.iso2 == iso2);
  var con_name = '';
  if (res3) {
    if (res3.params.cl == 'sh') {
      con_name = res3.params.jpni + '　' + res3.params.kata;
    } else {
      con_name = res3.params.jpni;
    }
  }

  let res2 = [];
  try {
    const res1 = await fetch(`${server}/yr5out/${iso2}.json`);
    res2 = await res1.json();
  } catch (e) {
    res2 = [];
  }

  const breadcrumbItems = [
    { name: 'トップ', href: '/' },
    { name: '世界ランキング', href: '/world' },
    { name: `${con_name}の人口ピラミッド` },
  ];

  return (
    <PyramidClient
      iso2={iso2}
      res2={res2}
      res3={res3 || null}
      con_name={con_name}
      breadcrumbItems={breadcrumbItems}
    />
  );
}
