import { useState } from 'react';
import { CameraOff } from 'lucide-react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

export const ProductImage = ({ src, alt, className, fallbackClassName, ...props }: Props) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`bg-[#F5EFE6] flex items-center justify-center ${fallbackClassName || className || ''}`}
      >
        <CameraOff className="w-8 h-8 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};
