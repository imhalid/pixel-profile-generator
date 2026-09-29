import { KeyboardEvent, PointerEvent as ReactPointerEvent, useRef, useState } from 'react'
import { backgroundCss } from '../lib/card-config'
import {
  GRADIENT_PRESETS,
  RADIAL_SIZES,
  RadialShape,
  RadialSize,
  clamp,
  gradientToCss,
  sortStops,
  stopsStripCss,
} from '../lib/gradient'
import {
  addStop,
  removeStop,
  reverseStops,
  selectStop,
  setGradient,
  updateCard,
  updateGradient,
  updateStop,
} from '../store/editor-slice'
import { useActiveCard, useAppDispatch, useAppSelector } from '../store/store'
import { ColorEditor } from './color-picker'
import { Segmented } from './ui'
import { ReloadIcon, TrashIcon } from './icons'

const ANGLE_SNAPS = [0, 45, 90, 135, 180, 225, 270, 315]
const POSITION_SNAPS = [0, 50, 100]

const NumberField = ({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  suffix: string
  onChange: (v: number) => void
}) => (
  <label className='flex items-center gap-2 text-[8px] text-dim'>
    {label}
    <span className='relative'>
      <input
        type='number'
        min={min}
        max={max}
        value={Math.round(value)}
        onChange={e => {
          const n = Number(e.target.value)
          if (!Number.isNaN(n)) onChange(clamp(n, min, max))
        }}
        className='px-input !w-[72px] !p-2 !pr-6 !text-[9px]'
      />
      <span className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-stone-500'>
        {suffix}
      </span>
    </span>
  </label>
)

/** Drag around the dial to set the linear angle (CSS: 0deg points up). */
const AngleDial = ({ angle, onChange }: { angle: number; onChange: (a: number) => void }) => {
  const set = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    let a = (Math.atan2(dx, -dy) * 180) / Math.PI
    if (a < 0) a += 360
    const step = e.shiftKey ? 45 : 5
    onChange(Math.round(a / step) * step % 360)
  }
  return (
    <div
      role='slider'
      aria-label='Gradient angle'
      aria-valuemin={0}
      aria-valuemax={359}
      aria-valuenow={angle}
      tabIndex={0}
      onKeyDown={e => {
        const d = e.shiftKey ? 45 : 5
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange((angle + d) % 360)
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange((angle - d + 360) % 360)
      }}
      onPointerDown={e => {
        e.currentTarget.setPointerCapture(e.pointerId)
        set(e)
      }}
      onPointerMove={e => e.currentTarget.hasPointerCapture(e.pointerId) && set(e)}
      className='px-inset relative h-20 w-20 shrink-0 cursor-grab touch-none rounded-full active:cursor-grabbing'
      title='Drag to rotate · Shift snaps to 45°'
    >
      {ANGLE_SNAPS.map(a => (
        <span
          key={a}
          className='absolute left-1/2 top-1/2 h-1 w-1 bg-stone-500'
          style={{ transform: `rotate(${a}deg) translateY(-34px) translate(-50%, -50%)` }}
        />
      ))}
      <span
        className='absolute left-1/2 top-1/2 h-8 w-1 origin-bottom bg-torch'
        style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
      >
        <span className='absolute -left-1 -top-1 h-3 w-3 bg-torch' />
      </span>
      <span className='absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-parchment' />
    </div>
  )
}

const StopBar = () => {
  const dispatch = useAppDispatch()
  const card = useActiveCard()
  const selected = useAppSelector(s => s.editor.selectedStop[s.editor.scheme])
  const barRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const { stops } = card.gradient

  const posFromEvent = (clientX: number) => {
    const r = barRef.current!.getBoundingClientRect()
    return clamp(Math.round(((clientX - r.left) / r.width) * 100), 0, 100)
  }

  const onHandleKey = (e: KeyboardEvent, id: string, position: number) => {
    const d = e.shiftKey ? 10 : 1
    if (e.key === 'ArrowLeft') dispatch(updateStop({ id, position: position - d }))
    else if (e.key === 'ArrowRight') dispatch(updateStop({ id, position: position + d }))
    else if (e.key === 'Delete' || e.key === 'Backspace') dispatch(removeStop(id))
    else return
    e.preventDefault()
  }

  return (
    <div className='pb-6 pt-2'>
      <div
        ref={barRef}
        className='checker relative h-8 w-full cursor-copy touch-none'
        style={{ boxShadow: '0 0 0 2px var(--stone-500), 0 0 0 4px var(--void)' }}
        title='Click to add a color stop'
        onPointerDown={e => {
          if (e.target !== e.currentTarget && e.target !== e.currentTarget.firstChild) return
          dispatch(addStop({ position: posFromEvent(e.clientX) }))
        }}
      >
        <div className='absolute inset-0' style={{ background: stopsStripCss(stops) }} />
        {stops.map(stop => {
          const active = stop.id === selected
          return (
            <button
              key={stop.id}
              type='button'
              aria-label={`Color stop ${stop.color} at ${stop.position}%`}
              onKeyDown={e => onHandleKey(e, stop.id, stop.position)}
              onPointerDown={e => {
                e.stopPropagation()
                e.currentTarget.setPointerCapture(e.pointerId)
                dispatch(selectStop(stop.id))
                setDragging(stop.id)
              }}
              onPointerMove={e => {
                if (dragging === stop.id && e.currentTarget.hasPointerCapture(e.pointerId)) {
                  dispatch(updateStop({ id: stop.id, position: posFromEvent(e.clientX) }))
                }
              }}
              onPointerUp={() => setDragging(null)}
              onFocus={() => dispatch(selectStop(stop.id))}
              className={`absolute top-1/2 h-11 w-4 -translate-x-1/2 -translate-y-1/2 touch-none ${
                dragging === stop.id ? 'cursor-grabbing' : 'cursor-grab'
              } ${active ? 'z-10' : ''}`}
              style={{ left: `${stop.position}%` }}
            >
              <span
                className='checker absolute inset-0'
                style={{
                  boxShadow: active
                    ? '0 0 0 2px var(--void), 0 0 0 4px var(--torch)'
                    : '0 0 0 2px var(--void), 0 0 0 4px var(--parchment)',
                }}
              >
                <span className='absolute inset-0' style={{ background: stop.color }} />
              </span>
              <span
                className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 text-[7px] ${
                  active ? 'text-torch' : 'text-stone-500'
                }`}
              >
                {stop.position}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const GradientEditor = () => {
  const dispatch = useAppDispatch()
  const card = useActiveCard()
  const selectedId = useAppSelector(s => s.editor.selectedStop[s.editor.scheme])
  const g = card.gradient
  const selected = g.stops.find(s => s.id === selectedId) ?? sortStops(g.stops)[0]
  const locked = card.theme !== null || card.cardType === 'crt'

  const setCenter = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    dispatch(
      updateGradient({
        posX: clamp(Math.round(((e.clientX - r.left) / r.width) * 100), 0, 100),
        posY: clamp(Math.round(((e.clientY - r.top) / r.height) * 100), 0, 100),
      })
    )
  }

  return (
    <div className={`flex flex-col gap-5 ${locked ? 'pointer-events-none opacity-40' : ''}`}>
      {/* Presets */}
      <div>
        <span className='px-label'>Presets</span>
        <div className='grid grid-cols-4 gap-2 sm:grid-cols-8'>
          {GRADIENT_PRESETS.map(p => (
            <button
              key={p.name}
              type='button'
              title={p.name}
              onClick={() => dispatch(setGradient(p.gradient))}
              className='group flex flex-col items-center gap-1.5'
            >
              <span
                className='block h-8 w-full group-hover:-translate-y-0.5'
                style={{
                  background: gradientToCss(p.gradient),
                  boxShadow: '0 0 0 2px var(--stone-600), 0 3px 0 2px var(--void)',
                }}
              />
              <span className='text-[6px] text-stone-500 group-hover:text-parchment'>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode + preview */}
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <Segmented
          label='Gradient type'
          value={g.type}
          onChange={type => dispatch(updateGradient({ type }))}
          options={[
            { value: 'linear', label: 'Linear' },
            { value: 'radial', label: 'Radial' },
          ]}
        />
        <button type='button' className='px-btn px-btn-ghost px-btn-sm' onClick={() => dispatch(reverseStops())}>
          <ReloadIcon /> Reverse
        </button>
      </div>

      <div
        className={`checker relative w-full touch-none ${g.type === 'radial' ? 'cursor-crosshair' : ''}`}
        style={{ aspectRatio: '1226 / 430', boxShadow: '0 0 0 2px var(--stone-500), 0 0 0 4px var(--void)' }}
        onPointerDown={e => {
          if (g.type !== 'radial') return
          e.currentTarget.setPointerCapture(e.pointerId)
          setCenter(e)
        }}
        onPointerMove={e => {
          if (g.type === 'radial' && e.currentTarget.hasPointerCapture(e.pointerId)) setCenter(e)
        }}
        title={g.type === 'radial' ? 'Drag to move the gradient center' : undefined}
      >
        <div
          className='absolute inset-0'
          style={{ backgroundImage: backgroundCss(card), backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        {g.type === 'radial' && (
          <>
            <div className='pointer-events-none absolute inset-0 opacity-30'>
              {[25, 50, 75].map(p => (
                <span key={`v${p}`} className='absolute top-0 h-full w-px bg-white mix-blend-difference' style={{ left: `${p}%` }} />
              ))}
              {[25, 50, 75].map(p => (
                <span key={`h${p}`} className='absolute left-0 h-px w-full bg-white mix-blend-difference' style={{ top: `${p}%` }} />
              ))}
            </div>
            <span
              className='pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 bg-parchment'
              style={{ left: `${g.posX}%`, top: `${g.posY}%`, boxShadow: '0 0 0 2px #000, 0 0 0 4px var(--torch)' }}
            />
          </>
        )}
      </div>

      {/* Geometry */}
      {g.type === 'linear' ? (
        <div className='flex flex-wrap items-center gap-4'>
          <AngleDial angle={g.angle} onChange={angle => dispatch(updateGradient({ angle }))} />
          <div className='flex flex-1 flex-col gap-3'>
            <NumberField label='Angle' value={g.angle} min={0} max={359} suffix='°' onChange={angle => dispatch(updateGradient({ angle }))} />
            <div className='flex flex-wrap gap-1'>
              {ANGLE_SNAPS.map(a => (
                <button
                  key={a}
                  type='button'
                  onClick={() => dispatch(updateGradient({ angle: a }))}
                  className={`px-1.5 py-1 text-[7px] ${g.angle === a ? 'bg-torch text-void' : 'bg-stone-900 text-dim hover:text-parchment'}`}
                  style={{ boxShadow: '0 0 0 2px var(--stone-600)' }}
                >
                  {a}°
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center gap-3'>
            <Segmented<RadialShape>
              size='sm'
              label='Radial shape'
              value={g.shape}
              onChange={shape => dispatch(updateGradient({ shape }))}
              options={[
                { value: 'circle', label: 'Circle' },
                { value: 'ellipse', label: 'Ellipse' },
              ]}
            />
            <label className='flex items-center gap-2 text-[8px] text-dim'>
              Size
              <select
                value={g.size}
                onChange={e => dispatch(updateGradient({ size: e.target.value as RadialSize }))}
                className='px-input !w-auto !p-2 !text-[8px]'
              >
                {RADIAL_SIZES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='flex flex-wrap items-center gap-4'>
            <NumberField label='X' value={g.posX} min={0} max={100} suffix='%' onChange={posX => dispatch(updateGradient({ posX }))} />
            <NumberField label='Y' value={g.posY} min={0} max={100} suffix='%' onChange={posY => dispatch(updateGradient({ posY }))} />
            <div className='grid grid-cols-3 gap-1' aria-label='Center presets'>
              {POSITION_SNAPS.flatMap(y =>
                POSITION_SNAPS.map(x => (
                  <button
                    key={`${x}-${y}`}
                    type='button'
                    title={`${x}% ${y}%`}
                    onClick={() => dispatch(updateGradient({ posX: x, posY: y }))}
                    className={`h-3 w-3 ${g.posX === x && g.posY === y ? 'bg-torch' : 'bg-stone-600 hover:bg-stone-500'}`}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stops */}
      <div>
        <div className='mb-1 flex items-center justify-between'>
          <span className='px-label !mb-0'>Color stops · {g.stops.length}/8</span>
          <span className='text-[7px] text-stone-500'>click bar to add · arrows to nudge</span>
        </div>
        <StopBar />
      </div>

      {selected && (
        <div className='px-inset flex flex-col gap-4 p-4'>
          <div className='flex flex-wrap items-center gap-3'>
            <span
              className='checker relative h-6 w-6 shrink-0'
              style={{ boxShadow: '0 0 0 2px var(--void), 0 0 0 4px var(--torch)' }}
            >
              <span className='absolute inset-0' style={{ background: selected.color }} />
            </span>
            <span className='text-[8px] text-parchment'>
              Stop {sortStops(g.stops).findIndex(s => s.id === selected.id) + 1}
              <span className='text-stone-500'> / {g.stops.length}</span>
            </span>
            <div className='ml-auto flex items-center gap-3'>
              <NumberField
                label='Pos'
                value={selected.position}
                min={0}
                max={100}
                suffix='%'
                onChange={position => dispatch(updateStop({ id: selected.id, position }))}
              />
              <button
                type='button'
                className='px-btn px-btn-danger px-btn-sm !p-2'
                disabled={g.stops.length <= 2}
                title={g.stops.length <= 2 ? 'A gradient needs at least two stops' : 'Remove this stop'}
                aria-label='Remove stop'
                onClick={() => dispatch(removeStop(selected.id))}
              >
                <TrashIcon className='h-3.5 w-3.5' />
              </button>
            </div>
          </div>
          <ColorEditor
            key={selected.id}
            className='w-full'
            value={selected.color}
            related={g.stops.map(s => s.color)}
            onChange={color => dispatch(updateStop({ id: selected.id, color }))}
          />
          <p className='text-[7px] leading-relaxed text-stone-500'>
            Tip: lower the opacity of stops to let a background image show through.
          </p>
        </div>
      )}

      {/* Image layer */}
      <div>
        <label className='px-label' htmlFor='image-url'>
          Image layer (under the gradient)
        </label>
        <input
          id='image-url'
          className='px-input'
          placeholder='https://… .png / .gif'
          value={card.imageUrl}
          onChange={e => dispatch(updateCard({ imageUrl: e.target.value }))}
        />
      </div>
    </div>
  )
}

export default GradientEditor
