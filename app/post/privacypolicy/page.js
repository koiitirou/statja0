export const metadata = {
  title: 'プライバシーポリシー',
  description: '統計リアルのプライバシーポリシーです。',
  openGraph: {
    title: 'プライバシーポリシー',
    description: '統計リアルのプライバシーポリシーです。',
  },
  alternates: {
    canonical: 'https://statja.com/post/privacypolicy',
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}

import PrivacyPolicyClient from './PrivacyPolicyClient';
