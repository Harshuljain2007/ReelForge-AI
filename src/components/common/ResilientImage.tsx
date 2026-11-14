import {Film} from 'lucide-react';
import React, {useState} from 'react';

interface ResilientImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#14171C] text-[#A1A7B3] border border-white/[0.08] p-4 text-center ${className}`}
      >
        <Film className="w-6 h-6 text-[#34D399] mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-[#E4E7EC] truncate max-w-full">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
