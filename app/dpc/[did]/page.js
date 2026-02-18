import { server } from '@/components/config';
import DpcDidClient from './DpcDidClient';
import array4 from '@/public/comp/data/link/dpc_ssg_list2.json';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return array4.map((s) => ({
    did: s.params.did,
  }));
}

export async function generateMetadata({ params }) {
  const { did } = await params;
  const res = await fetch(`${server}/retable/${did}_ssg.json`, { next: { revalidate: false } });
  if (!res.ok) return { title: 'DPC' };
  const ssg1 = await res.json();
  const tDis = ssg1.definition.dis;
  return {
    title: `${tDis}の病院ランキング【入院数、手術件数】`,
    description: `全国都道府県の${tDis}の病院ランキングです。治療実績（入院患者数、症例数）・手術件数・在院日数の推移を比較。`,
    openGraph: {
      title: `${tDis}の病院ランキング【入院数、手術件数】`,
      description: `全国都道府県の${tDis}の病院ランキングです。治療実績（入院患者数、症例数）・手術件数・在院日数の推移を比較。`,
    },
    alternates: { canonical: `https://statja.com/dpc/${did}` },
  };
}

export default async function DpcDidPage({ params }) {
  const { did } = await params;
  const res = await fetch(`${server}/retable/${did}_ssg.json`, { next: { revalidate: false } });
  if (!res.ok) return <div>データが見つかりません</div>;
  const ssg1 = await res.json();

  const tArray = array4.find((s) => s.params.did === did) || { params: {} };

  // Build time_list2 from ssg1.definition.time_list1
  const time_list2 = [];
  ssg1.definition.time_list1.forEach((v) => {
    time_list2.push(v.value);
  });

  // Use columns from the JSON itself
  const columns = ssg1.table.columns;
  columns[1].filter = 'includes';
  columns[1].disableSortBy = true;
  columns[1].id = 'prefecture';
  columns[2].accessor = 'hkj';

  // Build yearList
  const yearList = [];
  for (let i = 0; i < ssg1.definition.time_list1.length; i++) {
    var thisYear = {};
    thisYear['value'] = ssg1.definition.time_list1[i].value;
    thisYear['label'] = ssg1.definition.time_list1[i].value;
    yearList.push(thisYear);
  }

  // Build graphList dynamically from columns
  const graphList = [
    { value: 'ran', label: '順位(全国)', unit: '位', rev: true },
  ];
  const vb1 = ['治療実績', '在院日数'];
  const un1 = ['件', '日'];
  ['治療実績(件数)', '在院日数(日)'].forEach((v0, i0) => {
    const found = columns.find((s) => s.Header == v0);
    if (found && found.columns) {
      found.columns.forEach((v1) => {
        var gc1 = { unit: un1[i0], rev: false };
        gc1['value'] = v1.accessor;
        gc1['label'] = `${vb1[i0]}(${v1.Header})`;
        graphList.push(gc1);
      });
    }
  });

  const icdis = tArray.params.icd;

  return (
    <DpcDidClient
      ssg1={ssg1}
      did1={did}
      graphList={graphList}
      time_list2={time_list2}
      yearList={yearList}
      columns={columns}
      dhsh={null}
      icdis={icdis}
    />
  );
}
