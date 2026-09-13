import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, User } from 'lucide-react';

const GRADIENTS = [
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-blue-500 to-cyan-600',
  'from-violet-500 to-fuchsia-600',
  'from-rose-600 to-red-700',
  'from-teal-500 to-emerald-600',
];

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getGradient(name) {
  if (!name || typeof name !== 'string') return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

const DEFAULT_AVATAR_PLACEHOLDER = 'https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png';

export default function Avatar({
  src,
  name = 'User',
  size = 'md',
  className = '',
  shape = 'rounded-2xl',
  online = false,
  verified = false,
  alt,
}) {
  const [imgError, setImgError] = useState(false);

  // Extract valid URL if src is an object or string
  const rawUrl = typeof src === 'string' ? src.trim() : src?.url?.trim();
  const imageUrl = rawUrl && !rawUrl.includes('undefined') && !rawUrl.includes('null')
    ? rawUrl
    : DEFAULT_AVATAR_PLACEHOLDER;

  const hasValidImage = Boolean(imageUrl && !imgError);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 text-xl font-bold',
    '2xl': 'w-24 h-24 sm:w-28 sm:h-28 text-3xl font-black',
  }[size] || size;

  const initials = getInitials(name);
  const gradient = getGradient(name);

  return (
    <div className={`relative flex-shrink-0 inline-flex items-center justify-center select-none ${className}`}>
      <div
        className={`${sizeClasses} ${shape} overflow-hidden flex items-center justify-center shadow-xs border border-slate-200/80 transition-transform duration-200`}
      >
        {hasValidImage ? (
          <img
            src={imageUrl}
            alt={alt || name || 'User avatar'}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-tr ${gradient} text-white flex items-center justify-center font-bold tracking-wider`}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Online indicator */}
      {online && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs"
          title="Online"
        />
      )}

      {/* Verified indicator if not already shown in header */}
      {verified && !online && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs"
          title="Verified Profile"
        >
          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
        </span>
      )}
    </div>
  );
}
