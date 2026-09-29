import { useEffect, useState } from 'react'
import { Scheme, isHeavyCard } from '../lib/card-config'
import { setScheme } from '../store/editor-slice'
import { useActiveCard, useAppDispatch, useAppSelector } from '../store/store'
import { useSession } from './session-context'
import { Panel } from './ui'
import { CopyIcon, EyeIcon, MoonIcon, ReloadIcon, SkullIcon, SunIcon } from './icons'
import { useCopy } from './use-copy'

const GITHUB = {
  dark: { bg: '#0d1117', border: '#30363d', fg: '#e6edf3', muted: '#7d8590' },
  light: { bg: '#ffffff', border: '#d0d7de', fg: '#1f2328', muted: '#656d76' },
}

const MESSAGES = [
  'Summoning stats',
  'Counting commits',
  'Forging pixels',
  'Casting shaders',
  'Polishing the glass',
  'Waking the API',
]

const BLOCKS = 16

const useElapsed = (startedAt: number | null) => {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!startedAt) return
    const t = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(t)
  }, [startedAt])
  return startedAt ? Math.max(0, now - startedAt) : 0
}

const LoadingOverlay = ({ startedAt, onCancel }: { startedAt: number | null; onCancel: () => void }) => {
  const elapsed = useElapsed(startedAt)
  // Fast at first, then crawls toward the end: the API usually needs 2-5s.
  const progress = Math.min(0.95, 1 - Math.exp(-elapsed / 2200))
  const filled = Math.round(progress * BLOCKS)
  const message = MESSAGES[Math.floor(elapsed / 1100) % MESSAGES.length]

  return (
    <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 overflow-hidden bg-void/70'>
      <div className='scanlines pointer-events-none absolute inset-0' />
      <div className='animate-scan pointer-events-none absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-torch/15 to-transparent' />
      <p className='relative text-[9px] text-torch sm:text-[11px]' role='status' aria-live='polite'>
        {message}
        <span className='animate-blink'>_</span>
      </p>
      <div className='relative flex gap-1 bg-void p-1.5' style={{ boxShadow: '0 0 0 2px var(--stone-500)' }}>
        {Array.from({ length: BLOCKS }, (_, i) => (
          <span
            key={i}
            className={`h-3 w-2 sm:h-4 sm:w-3 ${i < filled ? (i >= BLOCKS - 4 ? 'bg-ember' : 'bg-torch') : 'bg-stone-700'}`}
          />
        ))}
      </div>
      <div className='relative flex items-center gap-3 text-[8px] text-dim'>
        <span>{(elapsed / 1000).toFixed(1)}s</span>
        <button type='button' onClick={onCancel} className='underline decoration-dotted hover:text-parchment'>
          cancel
        </button>
      </div>
    </div>
  )
}

const ErrorOverlay = ({
  message,
  hint,
  scheme,
  onRetry,
}: {
  message: string
  hint?: string
  scheme: Scheme
  onRetry: () => void
}) => (
  // The veil takes the README color so the dialog reads the same on both themes.
  <div
    className='absolute inset-0 z-10 flex items-center justify-center overflow-auto p-3'
    style={{ background: scheme === 'dark' ? 'rgb(13 17 23 / 0.8)' : 'rgb(255 255 255 / 0.75)' }}
  >
    <div role='alert' className='px-frame animate-shake w-full max-w-sm p-4 text-left'>
      <div className='mb-3 flex items-center gap-2 text-[11px] text-blood'>
        <SkullIcon className='h-5 w-5 shrink-0' />
        You died
      </div>
      <p className='text-[8px] leading-[1.9] text-parchment'>{message}</p>
      {hint && <p className='mt-2 text-[7px] leading-[1.9] text-torch'>{hint}</p>}
      <button type='button' className='px-btn px-btn-torch px-btn-sm mt-4' onClick={onRetry}>
        <ReloadIcon /> Try again
      </button>
    </div>
  </div>
)

const EmptyCard = () => (
  <div className='absolute inset-0 flex items-center justify-center'>
    <div className='grid h-full w-full grid-cols-[1fr_2fr] gap-[6%] p-[5%] opacity-40'>
      <div className='animate-pulse bg-stone-600' />
      <div className='flex flex-col justify-center gap-[10%]'>
        {[80, 55, 70, 45].map(w => (
          <div key={w} className='h-[10%] animate-pulse bg-stone-600' style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  </div>
)

const PreviewPanel = () => {
  const dispatch = useAppDispatch()
  const scheme = useAppSelector(s => s.editor.scheme)
  const linked = useAppSelector(s => s.editor.linked)
  const username = useAppSelector(s => s.editor.shared.username)
  const card = useActiveCard()
  const { shown, status, error, startedAt, currentUrl, generate, cancel } = useSession()
  const { copied, copy } = useCopy()

  const src = shown[scheme]
  const stale = src !== currentUrl
  const gh = GITHUB[scheme]
  const other: Scheme = scheme === 'dark' ? 'light' : 'dark'

  // Ctrl/Cmd + Enter renders from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        generate()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [generate])

  return (
    <Panel title='Scrying glass' icon={<EyeIcon />}>
      <div className='flex flex-col gap-4'>
        {/* GitHub README mock so the card is judged on the real backdrop. */}
        <div style={{ background: gh.bg, boxShadow: `0 0 0 2px ${gh.border}` }}>
          <div
            className='flex items-center justify-between px-3 py-2 font-sans text-[11px]'
            style={{ color: gh.fg, borderBottom: `1px solid ${gh.border}` }}
          >
            <span className='flex items-center gap-2'>
              <span style={{ color: gh.muted }}>{username || 'username'} /</span>
              <b>README.md</b>
            </span>
            <span className='flex items-center gap-1.5 text-[10px]' style={{ color: gh.muted }}>
              {scheme === 'dark' ? <MoonIcon /> : <SunIcon />}
              GitHub {scheme}
            </span>
          </div>
          <div className='p-3 sm:p-4'>
            {/* The card's height depends on hidden rows, so only the empty state is fixed. */}
            <div
              className={`relative w-full overflow-hidden ${status === 'error' ? 'min-h-[220px]' : 'min-h-[140px]'}`}
              style={src ? undefined : { aspectRatio: '1226 / 430' }}
            >
              {src ? (
                <img
                  key={src}
                  src={src}
                  alt={`${username} pixel profile card (${scheme})`}
                  className={`animate-pixel-in block h-auto w-full ${
                    status === 'loading' ? 'blur-[1px] grayscale' : ''
                  }`}
                />
              ) : (
                <EmptyCard />
              )}
              {status === 'loading' && <LoadingOverlay startedAt={startedAt} onCancel={cancel} />}
              {status === 'error' && error && (
                <ErrorOverlay
                  message={error}
                  hint={isHeavyCard(card) ? 'Screen effect and CRT often time out on the public API. Turn them off, or use the GitHub Action snippet.' : undefined}
                  scheme={scheme}
                  onRetry={generate}
                />
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <button
            type='button'
            className={`px-btn px-btn-torch ${stale && status !== 'loading' ? 'animate-pulse' : ''}`}
            onClick={generate}
            disabled={status === 'loading'}
            title='Ctrl / ⌘ + Enter'
          >
            <ReloadIcon /> {status === 'loading' ? 'Rendering…' : 'Render card'}
          </button>
          {stale && status !== 'loading' && (
            <span className='text-[8px] text-torch'>● changes not rendered yet</span>
          )}
          <div className='ml-auto flex gap-2'>
            {src && (
              <>
                <button type='button' className='px-btn px-btn-ghost px-btn-sm' onClick={() => copy(src)}>
                  <CopyIcon /> {copied ? 'Copied' : 'URL'}
                </button>
                <a className='px-btn px-btn-ghost px-btn-sm' href={src} target='_blank' rel='noreferrer'>
                  Open
                </a>
              </>
            )}
          </div>
        </div>

        {!linked && (
          <button
            type='button'
            onClick={() => dispatch(setScheme(other))}
            className='group flex items-center gap-3 p-2 text-left'
            style={{ background: GITHUB[other].bg, boxShadow: `0 0 0 2px ${GITHUB[other].border}` }}
          >
            <span className='relative w-32 shrink-0 overflow-hidden' style={{ aspectRatio: '1226 / 430' }}>
              {shown[other] ? (
                <img src={shown[other]!} alt='' className='absolute inset-0 h-full w-full object-contain' />
              ) : (
                <span className='absolute inset-0 bg-stone-600/40' />
              )}
            </span>
            <span className='text-[8px]' style={{ color: GITHUB[other].muted }}>
              {other} mode card
              <br />
              <span className='group-hover:underline'>switch to edit →</span>
            </span>
          </button>
        )}
      </div>
    </Panel>
  )
}

export default PreviewPanel
