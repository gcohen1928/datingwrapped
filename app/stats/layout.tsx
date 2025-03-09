import PageLayout from '../components/page-layout';

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
} 