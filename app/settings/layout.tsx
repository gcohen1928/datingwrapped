import PageLayout from '../components/page-layout';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
} 