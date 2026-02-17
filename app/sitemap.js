import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://statja.com';

function readJson(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
}

export default function sitemap() {
  const now = new Date().toISOString();
  const entry = (p) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: 'daily', priority: 0.7 });

  // Static pages
  const staticPaths = ['/', '/bed', '/city', '/dpc', '/dpc/alternative', '/hospital', '/ndb', '/ndb/checkup', '/prefecture', '/world', '/post/privacypolicy'];
  const urls = staticPaths.map(entry);

  // /hospital/[hospital]
  const hospital_ssg_list = readJson('public/comp/data/link/hospital_ssg_list.json');
  hospital_ssg_list.forEach((s) => urls.push(entry(`/hospital/${s.params.hospital}`)));

  // /dpc/[did]
  const dpc_ssg_list2 = readJson('public/comp/data/link/dpc_ssg_list2.json');
  dpc_ssg_list2.forEach((s) => urls.push(entry(`/dpc/${s.params.did}`)));

  // /dpc/alternative/[dhsh]
  const dpc_alt = readJson('public/comp/data/link/dpc_alternative_path.json');
  dpc_alt.forEach((s) => urls.push(entry(`/dpc/alternative/${s.params.dhsh}`)));

  // /bed/[bed]
  const bed_path = readJson('public/comp/data/link/bed_path.json');
  bed_path.forEach((s) => urls.push(entry(`/bed/${s.params.bed}`)));

  // /ndb/[eid]
  const path1 = readJson('public/comp/data/link/path1.json');
  path1.forEach((s) => urls.push(entry(`/ndb/${s.params.eid}`)));

  // /ndb/prescription/[id2] - path array has all 18,902 individual prescription entries
  const sum_presc = readJson('components/path_ndb/sum_prescription_path.json');
  sum_presc.path.forEach((s) => urls.push(entry(`/ndb/prescription/${s.params.id2}`)));

  // /ndb/checkup/[cid]
  const checkup = readJson('components/mdc/exp/checkup_path.json');
  checkup.forEach((s) => urls.push(entry(`/ndb/checkup/${s.params.cid}`)));

  // /pyramid/[iso2]
  const pop0 = readJson('components/pop/pop_path.json');
  const pop1 = readJson('components/pop/jpop_path1.json');
  const pop2 = readJson('components/pop/jpop_path2.json');
  [...pop0, ...pop1, ...pop2].forEach((s) => urls.push(entry(`/pyramid/${s.params.iso2}`)));

  // /world/[category]
  const wor = readJson('components/wor/wor_path.json');
  wor.topic.forEach((t) => t.itm.forEach((item) => urls.push(entry(`/world/${item}`))));

  // /country/[country]
  Object.keys(wor.country).forEach((code) => urls.push(entry(`/country/${code}`)));

  // /prefecture/[lnk]
  const pr2 = readJson('components/pr2_path/pr2_path.json');
  Object.values(pr2.refs).forEach((v) => urls.push(entry(`/prefecture/${v.params.lnk}`)));

  // /prefecture/category/[id] - use the flat path array
  pr2.path.forEach((s) => urls.push(entry(`/prefecture/category/${s.params.id}`)));

  // /prefecture/vegetable/[yasai]
  const yasai = readJson('components/pr2_path/yasai_path.json');
  yasai.path.forEach((s) => urls.push(entry(`/prefecture/vegetable/${s.params.yasai}`)));

  // /city/category/[city]
  const cit = readJson('components/cit_path/cit_path.json');
  cit.path.forEach((s) => urls.push(entry(`/city/category/${s.params.city}`)));

  // /city/cinfo/[cinfo]
  Object.keys(cit.pref).forEach((code) => urls.push(entry(`/city/cinfo/${code}`)));

  // /patient/[mdc] and /zaiin/[mdc]
  const mdcs = ['m00','m01','m02','m03','m04','m05','m06','m07','m08','m09','m10','m11','m12','m13','m14','m15','m16','m17','m18'];
  mdcs.forEach((m) => { urls.push(entry(`/patient/${m}`)); urls.push(entry(`/zaiin/${m}`)); });

  return urls;
}
