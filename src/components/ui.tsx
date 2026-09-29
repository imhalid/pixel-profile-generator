import { ReactNode } from 'react'

export const Panel = ({
  title,
  icon,
  actions,
  children,
  className = '',
}: {
  title: string
  icon?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
}) => (
  <section className={`px-frame p-4 pt-7 ${className}`}>
    <h2 className='panel-title'>
      {icon}
      {title}
    </h2>
    {actions && (
      <div className='absolute -top-3.5 right-4 flex gap-2'>{actions}</div>
    )}
    {children}
  </section>
)

export const Toggle = ({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  hint?: string
}) => (
  <label className='group flex cursor-pointer items-center gap-3 py-1 text-[9px] leading-relaxed'>
    <input
      type='checkbox'
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      className='peer sr-only'
    />
    <span
      aria-hidden
      className={`relative h-4 w-8 shrink-0 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-torch ${
        checked ? 'bg-moss/80' : 'bg-stone-900'
      }`}
      style={{ boxShadow: '0 0 0 2px var(--stone-600)' }}
    >
      <span
        className={`absolute top-0 h-4 w-4 transition-[left] duration-100 ${
          checked ? 'left-4 bg-parchment' : 'left-0 bg-stone-500'
        }`}
      />
    </span>
    <span className='flex flex-col text-left'>
      <span className={checked ? 'text-parchment' : 'text-dim'}>{label}</span>
      {hint && <span className='text-[7px] text-stone-500 group-hover:text-dim'>{hint}</span>}
    </span>
  </label>
)

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  size = 'md',
  label,
}: {
  value: T
  options: { value: T; label: ReactNode; title?: string }[]
  onChange: (v: T) => void
  size?: 'sm' | 'md'
  label?: string
}) {
  return (
    <div
      role='radiogroup'
      aria-label={label}
      className='inline-flex flex-wrap bg-stone-900 p-1'
      style={{ boxShadow: '0 0 0 2px var(--stone-600)' }}
    >
      {options.map(o => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type='button'
            role='radio'
            aria-checked={active}
            title={o.title}
            onClick={() => onChange(o.value)}
            className={`flex items-center gap-2 ${size === 'sm' ? 'px-2 py-1.5 text-[8px]' : 'px-3 py-2 text-[9px]'} ${
              active
                ? 'bg-torch text-void'
                : 'text-dim hover:bg-stone-700 hover:text-parchment'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

