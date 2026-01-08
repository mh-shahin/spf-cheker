import SPFChecker from '@/components/SPFChecker';

export default function Home() {
  return <SPFChecker />;
}

export const metadata = {
  title: 'SPF Record Checker',
  description: 'Check SPF records for any domain',
};