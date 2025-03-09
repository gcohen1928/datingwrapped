import PageLayout from '../components/page-layout';

export default function WrappedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
} 