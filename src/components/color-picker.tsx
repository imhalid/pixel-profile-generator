import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ColorPickerProps {
  color: string;  // Now expects rgba hex format (#rrggbbaa)
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Convert hex to HSLA
  const hexToHSLA = useCallback((hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    let a = parseInt(hex.slice(7, 9) || 'ff', 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100, a: a };
  }, []);

  const [hsla, setHSLA] = useState(() => hexToHSLA(color));

  const handleSaturationLightnessChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const s = x * 100;
    const l = (100 - y * 100);

    setHSLA(prev => ({ ...prev, s, l }));
    onChange(HSLAToHex(hsla.h, s, l, hsla.a));
  };

  const handleHueChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const h = x * 360;

    setHSLA(prev => ({ ...prev, h }));
    onChange(HSLAToHex(h, hsla.s, hsla.l, hsla.a));
  };

  const handleAlphaChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHSLA(prev => ({ ...prev, a: x }));
    onChange(HSLAToHex(hsla.h, hsla.s, hsla.l, x));
  };

  const HSLAToHex = (h: number, s: number, l: number, a: number): string => {
    s /= 100;
    l /= 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - s * Math.min(l, 1 - l) * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    const alpha = Math.round(a * 255).toString(16).padStart(2, '0');
    return `#${f(0)}${f(8)}${f(4)}${alpha}`;
  };

  return (
    <div className="relative pt-0.5" ref={pickerRef}>
      <button
        className="w-4 h-4 relative"
        style={{ backgroundColor: color.slice(0, 7) }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div 
          className="absolute inset-0 border border-white/50"
          style={{ 
            backgroundColor: color,
            // backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==")'
          }} 
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 p-4 bg-neutral-900" style={{ width: '200px' }}>
          {/* Saturation/Lightness picker */}
          <div
            className="w-full h-40 mb-2 cursor-pointer relative"
            style={{
              background: `
                linear-gradient(to right, #fff 0%, hsl(${hsla.h}, 100%, 50%) 100%),
                linear-gradient(to top, #000 0%, transparent 100%)
              `,
              backgroundBlendMode: 'multiply'
            }}
            onMouseDown={handleSaturationLightnessChange}
            onMouseMove={(e) => e.buttons && handleSaturationLightnessChange(e)}
          >
            <div
              className="w-3 h-3 border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
              style={{
                position: 'absolute',
                left: `${hsla.s}%`,
                top: `${100 - hsla.l}%`,
                backgroundColor: color
              }}
            />
          </div>

          {/* Hue slider */}
          <div
            className="w-full h-4 cursor-pointer relative"
            style={{
              background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
            }}
            onMouseDown={handleHueChange}
            onMouseMove={(e) => e.buttons && handleHueChange(e)}
          >
            <div
              className="w-1 h-full outline outline-2 outline-neutral-50 transform -translate-x-1/2"
              style={{
                position: 'absolute',
                left: `${(hsla.h / 360) * 100}%`,
                backgroundColor: `hsl(${hsla.h}, 100%, 50%)`
              }}
            />
          </div>

          {/* Alpha slider */}
          <div
            className="w-full h-4 cursor-pointer relative mt-2"
            style={{
              background: `linear-gradient(to right, transparent, ${HSLAToHex(hsla.h, hsla.s, hsla.l, 1).slice(0, 7)})`,
              
            }}
            onMouseDown={handleAlphaChange}
            onMouseMove={(e) => e.buttons && handleAlphaChange(e)}
          >
            <div
              className="w-1 h-full outline outline-2 outline-neutral-50 transform -translate-x-1/2"
              style={{
                position: 'absolute',
                left: `${hsla.a * 100}%`,
                backgroundColor: HSLAToHex(hsla.h, hsla.s, hsla.l, hsla.a)
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
