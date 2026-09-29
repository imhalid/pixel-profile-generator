import { useState } from 'react'
import { useSession } from './session-context'
import { Panel } from './ui'
import { CopyIcon, GemIcon, MoonIcon, SunIcon, TrashIcon } from './icons'
import { useCopy } from './use-copy'

const timeAgo = (ts: number) => {
  const s = Math.round((Date.now() - ts) / 1000)
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}

const HistoryPanel = () => {
  const { history, historyAvailable, restore, remove, clear, shown } = useSession()
  const { copy } = useCopy()
  const [confirmClear, setConfirmClear] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  return (
    <Panel
      title={`Treasure chest · ${history.length}`}
      icon={<GemIcon />}
      actions={
        history.length > 0 && (
          <button
            type='button'
            className={`px-btn px-btn-sm ${confirmClear ? 'px-btn-danger' : 'px-btn-ghost'}`}
            onClick={() => {
              if (confirmClear) {
                clear()
                setConfirmClear(false)
              } else {
                setConfirmClear(true)
                window.setTimeout(() => setConfirmClear(false), 2500)
              }
            }}
          >
            {confirmClear ? 'Sure?' : 'Clear'}
          </button>
        )
      }
    >
      {!historyAvailable ? (
        <p className='text-[8px] text-dim'>This browser blocks IndexedDB, so past cards can't be saved.</p>
      ) : history.length === 0 ? (
        <p className='py-4 text-[8px] leading-relaxed text-stone-500'>
          Every card you render lands here, saved in this browser. Click one to load its settings back.
        </p>
      ) : (
        <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {history.map(entry => {
            const active = shown.light === entry.url || shown.dark === entry.url
            return (
              <li key={entry.id} className='animate-rise group relative'>
                <button
                  type='button'
                  onClick={() => restore(entry)}
                  className='block w-full text-left'
                  title='Load these settings'
                >
                  <span
                    className='relative block w-full overflow-hidden bg-stone-900'
                    style={{
                      aspectRatio: '1226 / 430',
                      boxShadow: active
                        ? '0 0 0 2px var(--void), 0 0 0 4px var(--torch)'
                        : '0 0 0 2px var(--stone-600), 0 4px 0 2px var(--void)',
                    }}
                  >
                    <img
                      src={entry.url}
                      alt=''
                      loading='lazy'
                      className='absolute inset-0 h-full w-full object-contain transition-transform group-hover:scale-[1.03]'
                    />
                  </span>
                  <span className='mt-3 flex items-center gap-2 text-[7px] text-dim'>
                    {entry.scheme === 'dark' ? <MoonIcon /> : <SunIcon />}
                    <span className='truncate text-parchment'>@{entry.shared.username}</span>
                    <span className='ml-auto shrink-0'>{timeAgo(entry.createdAt)}</span>
                  </span>
                  <span className='mt-1 block truncate text-[6px] text-stone-500'>
                    {entry.card.cardType === 'crt' ? 'crt card' : entry.card.theme ?? `custom ${entry.card.gradient.type}`}
                  </span>
                </button>
                <div className='absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100'>
                  <button
                    type='button'
                    aria-label='Copy image URL'
                    className='px-btn px-btn-sm'
                    onClick={() => {
                      copy(entry.url)
                      setCopiedId(entry.id)
                      window.setTimeout(() => setCopiedId(null), 1200)
                    }}
                  >
                    {copiedId === entry.id ? '✓' : <CopyIcon />}
                  </button>
                  <button
                    type='button'
                    aria-label='Delete from history'
                    className='px-btn px-btn-danger px-btn-sm'
                    onClick={() => remove(entry.id)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Panel>
  )
}

export default HistoryPanel
