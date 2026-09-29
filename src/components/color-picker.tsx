import { useEffect, useRef, useState, PointerEvent as ReactPointerEvent } from 'react'
import {
  clamp,
  hexToRgba,
  hsvToRgb,
  normalizeHex,
  rgbToHsv,
  rgbaToHex,
} from '../lib/gradient'

const SWATCHES = [
  '#050505', '#1f1f1f', '#4a4a4a', '#a09a90', '#ece6da', '#ffffff',
  '#e0484f', '#e0582b', '#f5a524', '#ffe08a', '#8bd46b', '#1f6b3a',
  '#6fd0e8', '#6fb7ff', '#2b4c7e', '#7b3fa0', '#e08bd6', '#165a4c',
]

type Hsva = { h: number; s: number; v: number; a: number }

const hexToHsva = (hex: string): Hsva => {
  const { r, g, b, a } = hexToRgba(hex)
  return { ...rgbToHsv(r, g, b), a }
}

const hsvaToHex = ({ h, s, v, a }: Hsva) => {
  const { r, g, b } = hsvToRgb(h, s, v)
  return rgbaToHex(r, g, b, a)
}

/** Drag helper: pointer capture keeps the drag alive outside the element. */
const useDrag = (onMove: (x: number, y: number) => void) => {
  const handlers = {
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      move(e)
    },
    onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e)
    },
  }
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    onMove(
      clamp((e.clientX - r.left) / r.width, 0, 1),
      clamp((e.clientY - r.top) / r.height, 0, 1)
    )
  }
  return handlers
}

export const ColorEditor = ({
  value,
  onChange,
}: {
  value: string
  onChange: (hex: string) => void
}) => {
  const [hsva, setHsva] = useState(() => hexToHsva(value))
  const [text, setText] = useState(value)
  const [lastValue, setLastValue] = useState(value)

  // Follow outside changes without losing hue when the color is grey.
  if (value !== lastValue) {
    setLastValue(value)
    setText(value)
    if (hsvaToHex(hsva) !== value) setHsva(hexToHsva(value))
  }

  const commit = (next: Hsva) => {
    setHsva(next)
    onChange(hsvaToHex(next))
  }

  const sv = useDrag((x, y) => commit({ ...hsva, s: x, v: 1 - y }))
  const hue = useDrag(x => commit({ ...hsva, h: x * 360 }))
  const alpha = useDrag(x => commit({ ...hsva, a: Math.round(x * 100) / 100 }))

  const opaque = hsvaToHex({ ...hsva, a: 1 }).slice(0, 7)

  return (
    <div className='flex w-56 flex-col gap-3'>
      <div
        {...sv}
        className='relative h-32 w-full cursor-crosshair touch-none'
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsva.h} 100% 50%))`,
          boxShadow: '0 0 0 2px var(--stone-600)',
        }}
      >
        <div
          className='pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2'
          style={{
            left: `${hsva.s * 100}%`,
            top: `${(1 - hsva.v) * 100}%`,
            background: opaque,
            boxShadow: '0 0 0 2px #fff, 0 0 0 4px #000',
          }}
        />
      </div>

      <div
        {...hue}
        aria-label='Hue'
        className='relative h-4 w-full cursor-pointer touch-none'
        style={{
          background:
            'linear-gradient(90deg,#f00,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00)',
          boxShadow: '0 0 0 2px var(--stone-600)',
        }}
      >
        <div
          className='pointer-events-none absolute -top-1 h-6 w-2 -translate-x-1/2 bg-parchment'
          style={{ left: `${(hsva.h / 360) * 100}%`, boxShadow: '0 0 0 2px #000' }}
        />
      </div>

      <div
        {...alpha}
        aria-label='Opacity'
        className='checker relative h-4 w-full cursor-pointer touch-none'
        style={{ boxShadow: '0 0 0 2px var(--stone-600)' }}
      >
        <div
          className='absolute inset-0'
          style={{ background: `linear-gradient(90deg, transparent, ${opaque})` }}
        />
        <div
          className='pointer-events-none absolute -top-1 h-6 w-2 -translate-x-1/2 bg-parchment'
          style={{ left: `${hsva.a * 100}%`, boxShadow: '0 0 0 2px #000' }}
        />
      </div>

      <div className='flex items-center gap-2'>
        <input
          className='px-input !p-2 !text-[9px] uppercase'
          value={text}
          spellCheck={false}
          aria-label='Hex color'
          onChange={e => {
            setText(e.target.value)
            const hex = normalizeHex(e.target.value)
            if (hex) onChange(hex)
          }}
          onBlur={() => setText(value)}
        />
        <span className='w-12 shrink-0 text-right text-[9px] text-dim'>
          {Math.round(hsva.a * 100)}%
        </span>
      </div>

      <div className='grid grid-cols-9 gap-1.5'>
        {SWATCHES.map(c => (
          <button
            key={c}
            type='button'
            title={c}
            aria-label={`Use ${c}`}
            className='aspect-square w-full hover:scale-110'
            style={{ background: c, boxShadow: '0 0 0 2px var(--stone-900)' }}
            onClick={() => commit({ ...hexToHsva(c), a: hsva.a })}
          />
        ))}
      </div>
    </div>
  )
}

/** Swatch button that opens a ColorEditor popover. */
const ColorPicker = ({
  value,
  onChange,
  label,
  align = 'left',
  size = 'md',
}: {
  value: string
  onChange: (hex: string) => void
  label: string
  align?: 'left' | 'right'
  size?: 'sm' | 'md'
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const dim = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'

  return (
    <div className='relative' ref={ref}>
      <button
        type='button'
        aria-label={label}
        aria-expanded={open}
        title={label}
        onClick={() => setOpen(o => !o)}
        className={`checker relative block ${dim}`}
        style={{ boxShadow: '0 0 0 2px var(--stone-500), 0 0 0 4px var(--void)' }}
      >
        <span className='absolute inset-0' style={{ background: value }} />
      </button>
      {open && (
        <div
          className={`px-frame animate-rise absolute z-40 mt-3 p-3 ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          <ColorEditor value={value} onChange={onChange} />
        </div>
      )}
    </div>
  )
}

export default ColorPicker
