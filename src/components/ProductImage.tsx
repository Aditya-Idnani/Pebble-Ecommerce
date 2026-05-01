import { useState } from 'react';
import { CameraOff } from 'lucide-react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

export const ProductImage = ({ src, alt, className, fallbackClassName, ...props }: Props) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <img
        src="/images/fallback.png"
        alt="Image unavailable"
        className={`${className || ''} ${fallbackClassName || ''} object-cover`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={`${className || ''} object-cover`}
      onError={() => setError(true)}
      {...props}
    />
  );
};
