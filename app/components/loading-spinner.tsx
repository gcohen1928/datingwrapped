'use client';

import { FC, CSSProperties } from 'react';
import { BounceLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  loading?: boolean;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#9370DB', // brand-lavender-500 equivalent hex color
  className = '',
  loading = true,
}) => {
  const sizeValues = {
    xs: 15,
    sm: 25,
    md: 40,
    lg: 60
  };

  const spinnerSize = sizeValues[size];

  const override: CSSProperties = {
    display: 'block',
    margin: '0 auto',
  };

  return (
    <div className={className}>
      <BounceLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={spinnerSize}
        aria-label="Loading"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingSpinner; 