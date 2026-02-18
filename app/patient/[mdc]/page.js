import { server } from '@/components/config';
import PatientClient from './PatientClient';
import JsonLd from '@/components/JsonLd';
import path0 from '@/public/comp/data/link/path1.json';

export const dynamic = 'force-static';
export const dynamicParams = true;

var path1 = [
  {
    params: {
      mdc: 'm00',
      mdn: '全疾患',
    },
  },
];
path1.push(...path0);

export async function generateStaticParams() {
  return path1.map((s) => ({
    mdc: s.params.mdc,
  }));
}

export async function generateMetadata({ params }) {
  const { mdc } = await params;
  const thisMdc = path1.find((s) => s.params.mdc === mdc);
  const mdcName = thisMdc ? thisMdc.params.mdn : '';
  return {
    title: `${mdcName}の患者数ランキング【DPC】`,
    description: `全国・各都道府県の病院における、${mdcName}の患者数ランキングをDPCオープンデータをもとにまとめています。`,
    openGraph: {
      title: `${mdcName}の患者数ランキング【DPC】`,
      description: `全国・各都道府県の病院における、${mdcName}の患者数ランキングをDPCオープンデータをもとにまとめています。`,
    },
    alternates: { canonical: `https://statja.com/patient/${mdc}` },
  };
}

export default async function PatientPage({ params }) {
  const { mdc } = await params;
  const this_path1 = path1.filter((s) => s.params.mdc === mdc);
  const res = await fetch(`${server}/rank/patient_${mdc}.json`, { next: { revalidate: false } });
  if (!res.ok) return <div>データが見つかりません</div>;
  const ssg2 = await res.json();

  const columns1 = [
    { Header: '都道府県', accessor: 'shn' },
    { Header: '病院', accessor: 'hs2' },
    {
      Header: '患者数(人)',
      columns: [
        { Header: 'すべて', accessor: 'all' },
        { Header: '手術あり', accessor: 'yes' },
        { Header: '手術なし', accessor: 'non' },
      ],
    },
    {
      Header: '患者割合(%)',
      columns: [
        { Header: 'すべて', accessor: 'alp' },
        { Header: '手術あり', accessor: 'yep' },
        { Header: '手術なし', accessor: 'nop' },
      ],
    },
  ];

  const mdcTitle = ssg2.def?.mdn || mdc;
  const breadcrumbItems = [
    { name: 'トップ', href: '/' },
    { name: '患者数ランキング' },
    { name: mdcTitle },
  ];
  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${mdcTitle}の患者数ランキング`,
    description: `${mdcTitle}の患者数ランキング。全国・都道府県別の患者数・割合の推移。`,
    url: `https://statja.com/patient/${mdc}`,
    license: 'https://www.mhlw.go.jp/stf/shingi2/0000196043_00012.html',
  };

  return (
    <>
      <JsonLd data={datasetJsonLd} />
      <PatientClient
        ssg2={ssg2}
        columns1={columns1}
        category1='患者数'
        category2='patient'
        mdc1={mdc}
        path1={path1}
        this_path1={this_path1}
        breadcrumbItems={breadcrumbItems}
      />
    </>
  );
}
