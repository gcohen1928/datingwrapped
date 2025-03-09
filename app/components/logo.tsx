import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

interface LogoProps {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ href = '/', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: {
      icon: 'h-6 w-6',
      text: 'text-lg'
    },
    md: {
      icon: 'h-8 w-8',
      text: 'text-xl'
    },
    lg: {
      icon: 'h-10 w-10',
      text: 'text-2xl'
    }
  };

  const LogoContent = (
    <>
      <FaHeart className={`${sizeClasses[size].icon} text-brand-lavender-500`} />
      <span className={`ml-2 ${sizeClasses[size].text} font-bold text-brand-lavender-500 font-inter`}>
        Dating Wrapped
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {LogoContent}
      </Link>
    );
  }

  return <div className="flex items-center">{LogoContent}</div>;
} 