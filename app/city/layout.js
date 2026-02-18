export const metadata = {
  title: '市区町村データランキング',
  description:
    '日本の市区町村データランキングの年次推移を、表・グラフ・地図でまとめました。人口、面積、密度、経済、行政、家計などの指標を調べることができます。',
  openGraph: {
    title: '市区町村データランキング',
    description:
      '日本の市区町村データランキングの年次推移を、表・グラフ・地図でまとめました。人口、面積、密度、経済、行政、家計などの指標を調べることができます。',
  },
  alternates: {
    canonical: 'https://statja.com/city',
  },
};

export default function CityLayout({ children }) {
  return children;
}
