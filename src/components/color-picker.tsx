import { useEffect, useRef, useState, PointerEvent as ReactPointerEvent } from 'react'
import { DropperIcon } from './icons'
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

type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> }

const eyeDropper = (): EyeDropperCtor | undefined =>
  (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper

/** Horizontal track with a ring thumb; arrow keys nudge it. */
const Slider = ({
  label,
  value,
  onChange,
  track,
  thumb,
  step,
  checker = false,
}: {
  label: string
  /** 0 - 1 */
  value: number
  onChange: (v: number) => void
  track: string
  thumb: string
  step: number
  checker?: boolean
}) => {
  const drag = useDrag(x => onChange(x))
  return (
    <div
      {...drag}
      role='slider'
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      onKeyDown={e => {
        const d = e.shiftKey ? step * 10 : step
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(clamp(value + d, 0, 1))
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(clamp(value - d, 0, 1))
        else return
        e.preventDefault()
      }}
      className={`relative h-3 w-full cursor-pointer touch-none ${checker ? 'checker' : ''}`}
      style={{ boxShadow: '0 0 0 2px var(--void)' }}
    >
      <div className='absolute inset-0' style={{ background: track }} />
      <div
        className='pointer-events-none absolute top-1/2 h-5 w-3 -translate-x-1/2 -translate-y-1/2'
        style={{
          left: `${value * 100}%`,
          background: thumb,
          boxShadow: 'inset 0 0 0 2px #fff, 0 0 0 2px #000',
        }}
      />
    </div>
  )
}

const ChannelInput = ({
  label,
  value,
  max,
  onChange,
}: {
  label: string
  value: number
  max: number
  onChange: (v: number) => void
}) => (
  <label className='flex min-w-0 flex-1 flex-col items-center gap-1'>
    <input
      type='number'
      min={0}
      max={max}
      value={Math.round(value)}
      onChange={e => {
        const n = Number(e.target.value)
        if (!Number.isNaN(n)) onChange(clamp(n, 0, max))
      }}
      className='px-input !px-1 !py-2 text-center !text-[9px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none'
    />
    <span className='text-[6px] text-stone-500'>{label}</span>
  </label>
)

export const ColorEditor = ({
  value,
  onChange,
  related = [],
  className = 'w-64',
}: {
  value: string
  onChange: (hex: string) => void
  /** Colors worth one click, e.g. the other gradient stops. */
  related?: string[]
  className?: string
}) => {
  const [hsva, setHsva] = useState(() => hexToHsva(value))
  const [text, setText] = useState(value.slice(1, 7))
  const [lastValue, setLastValue] = useState(value)
  const [mode, setMode] = useState<'hex' | 'rgb'>('hex')
  // The color when the editor opened, shown next to the live one.
  const [original] = useState(value)

  // Follow outside changes without losing hue when the color is grey.
  if (value !== lastValue) {
    setLastValue(value)
    setText(value.slice(1, 7))
    if (hsvaToHex(hsva) !== value) setHsva(hexToHsva(value))
  }

  const commit = (next: Hsva) => {
    setHsva(next)
    onChange(hsvaToHex(next))
  }

  const sv = useDrag((x, y) => commit({ ...hsva, s: x, v: 1 - y }))
  const opaque = hsvaToHex({ ...hsva, a: 1 }).slice(0, 7)
  const rgba = hexToRgba(value)
  const setRgba = (patch: Partial<typeof rgba>) => {
    const c = { ...rgba, ...patch }
    commit(hexToHsva(rgbaToHex(c.r, c.g, c.b, c.a)))
  }
  const Dropper = eyeDropper()
  const extras = [...new Set(related.filter(c => c !== value))].slice(0, 7)

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Saturation / brightness */}
      <div
        {...sv}
        role='slider'
        tabIndex={0}
        aria-label='Saturation and brightness'
        aria-valuenow={Math.round(hsva.s * 100)}
        onKeyDown={e => {
          const d = e.shiftKey ? 0.1 : 0.01
          const moves: Record<string, Partial<Hsva>> = {
            ArrowRight: { s: clamp(hsva.s + d, 0, 1) },
            ArrowLeft: { s: clamp(hsva.s - d, 0, 1) },
            ArrowUp: { v: clamp(hsva.v + d, 0, 1) },
            ArrowDown: { v: clamp(hsva.v - d, 0, 1) },
          }
          if (!moves[e.key]) return
          e.preventDefault()
          commit({ ...hsva, ...moves[e.key] })
        }}
        className='relative h-36 w-full cursor-crosshair touch-none'
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsva.h} 100% 50%))`,
          boxShadow: '0 0 0 2px var(--void), 0 0 0 4px var(--stone-600)',
        }}
      >
        <div
          className='pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2'
          style={{
            left: `${hsva.s * 100}%`,
            top: `${(1 - hsva.v) * 100}%`,
            background: opaque,
            boxShadow: 'inset 0 0 0 2px #fff, 0 0 0 2px #000',
          }}
        />
      </div>

      {/* Before / after + sliders + eyedropper */}
      <div className='flex items-center gap-3'>
        <button
          type='button'
          title='Click to go back to the original color'
          onClick={() => commit(hexToHsva(original))}
          className='checker relative flex h-10 w-10 shrink-0 flex-col'
          style={{ boxShadow: '0 0 0 2px var(--void), 0 0 0 4px var(--stone-600)' }}
        >
          <span className='flex-1' style={{ background: value }} />
          <span className='flex-1' style={{ background: original }} />
        </button>
        <div className='flex min-w-0 flex-1 flex-col gap-3'>
          <Slider
            label='Hue'
            value={hsva.h / 360}
            step={1 / 360}
            onChange={x => commit({ ...hsva, h: x * 360 })}
            track='linear-gradient(90deg,#f00,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00)'
            thumb={`hsl(${hsva.h} 100% 50%)`}
          />
          <Slider
            label='Opacity'
            value={hsva.a}
            step={0.01}
            onChange={x => commit({ ...hsva, a: Math.round(x * 100) / 100 })}
            track={`linear-gradient(90deg, transparent, ${opaque})`}
            thumb={value}
            checker
          />
        </div>
        {Dropper && (
          <button
            type='button'
            title='Pick a color from the screen'
            aria-label='Pick a color from the screen'
            className='px-btn px-btn-ghost px-btn-sm shrink-0 !p-2'
            onClick={() =>
              new Dropper()
                .open()
                .then(r => {
                  const hex = normalizeHex(r.sRGBHex)
                  if (hex) commit({ ...hexToHsva(hex), a: hsva.a })
                })
                .catch(() => {})
            }
          >
            <DropperIcon className='h-4 w-4' />
          </button>
        )}
      </div>

      {/* Values */}
      <div className='flex items-start gap-2'>
        <button
          type='button'
          onClick={() => setMode(m => (m === 'hex' ? 'rgb' : 'hex'))}
          title='Switch between HEX and RGB'
          className='px-btn px-btn-ghost px-btn-sm w-12 shrink-0 !px-0 !py-[9px]'
        >
          {mode.toUpperCase()}
        </button>
        {mode === 'hex' ? (
          <label className='relative flex min-w-0 flex-1 flex-col items-center gap-1'>
            <span className='pointer-events-none absolute left-2 top-[9px] text-[9px] text-stone-500'>#</span>
            <input
              className='px-input !py-2 !pl-5 !text-[9px] uppercase'
              value={text}
              maxLength={8}
              spellCheck={false}
              aria-label='Hex color'
              onChange={e => {
                setText(e.target.value.replace('#', ''))
                const hex = normalizeHex(e.target.value)
                // Six digits keep the current opacity; eight digits set it.
                if (hex) {
                  const digits = e.target.value.replace('#', '').length
                  onChange(digits === 8 || digits === 4 ? hex : hex.slice(0, 7) + value.slice(7))
                }
              }}
              onBlur={() => setText(value.slice(1, 7))}
            />
            <span className='text-[6px] text-stone-500'>HEX</span>
          </label>
        ) : (
          <>
            <ChannelInput label='R' value={rgba.r} max={255} onChange={r => setRgba({ r })} />
            <ChannelInput label='G' value={rgba.g} max={255} onChange={g => setRgba({ g })} />
            <ChannelInput label='B' value={rgba.b} max={255} onChange={b => setRgba({ b })} />
          </>
        )}
        <div className='w-14 shrink-0'>
          <ChannelInput label='ALPHA %' value={rgba.a * 100} max={100} onChange={a => setRgba({ a: a / 100 })} />
        </div>
      </div>

      {/* Quick picks */}
      <div className='flex flex-col gap-2'>
        {extras.length > 0 && (
          <div className='flex items-center gap-2'>
            <span className='w-12 shrink-0 text-[6px] text-stone-500'>IN USE</span>
            <div className='flex flex-wrap gap-1.5'>
              {extras.map(c => (
                <Swatch key={c} color={c} onPick={() => commit(hexToHsva(c))} />
              ))}
            </div>
          </div>
        )}
        <div className='flex items-start gap-2'>
          <span className='w-12 shrink-0 pt-1 text-[6px] text-stone-500'>PALETTE</span>
          <div className='grid flex-1 grid-cols-9 gap-1.5'>
            {SWATCHES.map(c => (
              <Swatch key={c} color={c} onPick={() => commit({ ...hexToHsva(c), a: hsva.a })} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const Swatch = ({ color, onPick }: { color: string; onPick: () => void }) => (
  <button
    type='button'
    title={color}
    aria-label={`Use ${color}`}
    onClick={onPick}
    className='checker relative aspect-square min-w-[16px] hover:-translate-y-0.5'
    style={{ boxShadow: '0 0 0 2px var(--void)' }}
  >
    <span className='absolute inset-0' style={{ background: color }} />
  </button>
)


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
          <ColorEditor value={value} onChange={onChange} className='w-72' />
        </div>
      )}
    </div>
  )
}

export default ColorPicker
