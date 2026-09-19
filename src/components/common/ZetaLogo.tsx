import React from 'react';

interface ZetaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  dark?: boolean;
  className?: string;
}

export const ZetaLogo: React.FC<ZetaLogoProps> = ({
  size = 'md',
  showText = true,
  dark = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { img: 'h-6 sm:h-7', text: 'text-xs sm:text-sm', sub: 'text-[6px]' },
    md: { img: 'h-8 sm:h-9', text: 'text-sm xs:text-base sm:text-lg', sub: 'text-[8px]' },
    lg: { img: 'h-9 sm:h-11', text: 'text-lg sm:text-xl', sub: 'text-[9px]' },
    xl: { img: 'h-12 sm:h-16', text: 'text-xl sm:text-2xl', sub: 'text-[10px]' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-1.5 sm:gap-2.5 select-none shrink-0 min-w-0 ${className}`}>
      {/* Zeta Calculator Attached Logo Graphic */}
      <div className="relative shrink-0 flex items-center justify-center transition-transform hover:scale-102">
        <img
          src="/logo.png"
          alt="Zeta Calculator Logo"
          className={`${currentSize.img} w-auto object-contain rounded-xl drop-shadow-md shrink-0`}
          referrerPolicy="no-referrer"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight min-w-0">
          <span className={`${currentSize.text} font-black tracking-tight flex items-center whitespace-nowrap`}>
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-200 bg-clip-text text-transparent">
              Zeta
            </span>
            <span className={dark ? 'text-white ml-1' : 'text-slate-900 ml-1'}>Calculator</span>
          </span>
          <span className={`${currentSize.sub} font-bold uppercase tracking-widest text-indigo-300/90 mt-0.5 hidden sm:block`}>
            zetacalculator.net
          </span>
        </div>
      )}
    </div>
  );
};

