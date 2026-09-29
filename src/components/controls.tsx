import { HIDE_KEYS, Scheme, THEMES } from '../lib/card-config'
import {
  copyCardFromOther,
  resetCard,
  setLinked,
  setScheme,
  setShared,
  toggleHide,
  updateCard,
} from '../store/editor-slice'
import { useActiveCard, useAppDispatch, useAppSelector } from '../store/store'
import ColorPicker from './color-picker'
import GradientEditor from './gradient-editor'
import { Panel, Segmented, Toggle } from './ui'
import { LinkIcon, MoonIcon, SunIcon } from './icons'

const CACHE_OPTIONS = [
  { value: 0, label: 'API default' },
  { value: 21600, label: '6 hours' },
  { value: 43200, label: '12 hours' },
  { value: 86400, label: '24 hours' },
]

export const SchemeBar = () => {
  const dispatch = useAppDispatch()
  const scheme = useAppSelector(s => s.editor.scheme)
  const linked = useAppSelector(s => s.editor.linked)
  const other: Scheme = scheme === 'light' ? 'dark' : 'light'

  return (
    <div className='px-frame flex flex-wrap items-center justify-between gap-3 p-3'>
      <div className='flex flex-wrap items-center gap-3'>
        <Segmented<Scheme>
          label='Card being edited'
          value={scheme}
          onChange={v => dispatch(setScheme(v))}
          options={[
            { value: 'dark', label: <><MoonIcon /> Dark mode card</>, title: 'Shown to GitHub dark theme users' },
            { value: 'light', label: <><SunIcon /> Light mode card</>, title: 'Shown to GitHub light theme users' },
          ]}
        />
        {!linked && (
          <button
            type='button'
            className='px-btn px-btn-ghost px-btn-sm'
            onClick={() => dispatch(copyCardFromOther())}
            title={`Replace this card with the ${other} card`}
          >
            Copy from {other}
          </button>
        )}
      </div>
      <Toggle
        label='Same card for both'
        hint={linked ? 'edits apply to light + dark' : 'light and dark are separate'}
        checked={linked}
        onChange={v => dispatch(setLinked(v))}
      />
    </div>
  )
}

export const DataPanel = () => {
  const dispatch = useAppDispatch()
  const shared = useAppSelector(s => s.editor.shared)
  const invalid = shared.username.trim() !== '' && !/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(shared.username.trim())

  return (
    <Panel title='Adventurer' icon={<LinkIcon />}>
      <div className='flex flex-col gap-4'>
        <div>
          <label className='px-label' htmlFor='username'>
            GitHub username
          </label>
          <input
            id='username'
            className={`px-input ${invalid ? '!text-blood' : ''}`}
            placeholder='octocat'
            autoComplete='off'
            spellCheck={false}
            value={shared.username}
            onChange={e => dispatch(setShared({ username: e.target.value }))}
          />
          {invalid && <p className='mt-2 text-[7px] text-blood'>That doesn't look like a GitHub username.</p>}
        </div>
        <div>
          <label className='px-label' htmlFor='exclude'>
            Exclude repos (comma separated)
          </label>
          <input
            id='exclude'
            className='px-input'
            placeholder='my-fork, old-project'
            spellCheck={false}
            value={shared.excludeRepo}
            onChange={e => dispatch(setShared({ excludeRepo: e.target.value }))}
          />
        </div>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <Toggle
            label='Include all commits'
            hint='not just the last year'
            checked={shared.includeAllCommits}
            onChange={v => dispatch(setShared({ includeAllCommits: v }))}
          />
          <label className='flex flex-col text-left'>
            <span className='px-label'>Cache</span>
            <select
              className='px-input !w-auto !p-2 !text-[8px]'
              value={shared.cacheSeconds}
              onChange={e => dispatch(setShared({ cacheSeconds: Number(e.target.value) }))}
            >
              {CACHE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </Panel>
  )
}

export const StylePanel = () => {
  const dispatch = useAppDispatch()
  const card = useActiveCard()
  const crt = card.cardType === 'crt'

  return (
    <Panel
      title='Enchantments'
      actions={
        <button type='button' className='px-btn px-btn-ghost px-btn-sm' onClick={() => dispatch(resetCard())}>
          Reset
        </button>
      }
    >
      <div className='flex flex-col gap-5'>
        <div>
          <span className='px-label'>Card</span>
          <Segmented
            label='Card type'
            value={card.cardType}
            onChange={cardType => dispatch(updateCard({ cardType }))}
            options={[
              { value: 'stats', label: 'Stats card' },
              { value: 'crt', label: 'CRT monitor', title: 'Fixed retro CRT card, only data options apply' },
            ]}
          />
          {crt && (
            <p className='mt-3 text-[7px] leading-relaxed text-torch'>
              The CRT card has a fixed look. The public API often fails to render it, so use the
              GitHub Actions snippet to pre-render it in your profile repo.
            </p>
          )}
        </div>

        <div className={crt ? 'pointer-events-none opacity-40' : ''}>
          <span className='px-label'>Theme</span>
          <div className='grid grid-cols-4 gap-2 sm:grid-cols-6'>
            <ThemeTile
              label='Custom'
              active={card.theme === null}
              onClick={() => dispatch(updateCard({ theme: null }))}
              swatch='repeating-linear-gradient(45deg, var(--stone-600) 0 4px, var(--stone-800) 4px 8px)'
            />
            {THEMES.map(t => (
              <ThemeTile
                key={t.id}
                label={t.label}
                active={card.theme === t.id}
                swatch={t.swatch}
                onClick={() => dispatch(updateCard({ theme: t.id }))}
              />
            ))}
          </div>
        </div>

        <div className={`flex flex-wrap items-center gap-3 ${crt ? 'pointer-events-none opacity-40' : ''}`}>
          <ColorPicker
            label='Text color'
            value={card.textColor}
            onChange={textColor => dispatch(updateCard({ textColor }))}
          />
          <div className='flex flex-col text-left'>
            <span className='text-[9px]'>Text color</span>
            <span className='text-[7px] uppercase text-stone-500'>{card.textColor}</span>
          </div>
        </div>

        <div className={`grid gap-x-4 gap-y-1 sm:grid-cols-2 ${crt ? 'pointer-events-none opacity-40' : ''}`}>
          <Toggle label='Screen effect' hint='broken on public API (issue #63)' checked={card.screenEffect} onChange={v => dispatch(updateCard({ screenEffect: v }))} />
          <Toggle label='Dithering' hint='256 color palette' checked={card.dithering} onChange={v => dispatch(updateCard({ dithering: v }))} />
          <Toggle label='Pixelate avatar' checked={card.pixelateAvatar} onChange={v => dispatch(updateCard({ pixelateAvatar: v }))} />
          <Toggle label='Avatar border' checked={card.avatarBorder} onChange={v => dispatch(updateCard({ avatarBorder: v }))} />
        </div>

        <div className={crt ? 'pointer-events-none opacity-40' : ''}>
          <span className='px-label'>Hide</span>
          <div className='flex flex-wrap gap-2'>
            {HIDE_KEYS.map(({ key, label }) => {
              const hidden = card.hide.includes(key)
              return (
                <button
                  key={key}
                  type='button'
                  aria-pressed={hidden}
                  onClick={() => dispatch(toggleHide(key))}
                  className={`px-2 py-1.5 text-[8px] ${
                    hidden ? 'bg-blood/80 text-white line-through' : 'bg-stone-900 text-dim hover:text-parchment'
                  }`}
                  style={{ boxShadow: '0 0 0 2px var(--stone-600)' }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Panel>
  )
}

const ThemeTile = ({
  label,
  swatch,
  active,
  onClick,
}: {
  label: string
  swatch: string
  active: boolean
  onClick: () => void
}) => (
  <button type='button' onClick={onClick} aria-pressed={active} className='group flex flex-col items-center gap-1.5'>
    <span
      className={`block h-9 w-full ${active ? '' : 'group-hover:-translate-y-0.5'}`}
      style={{
        background: swatch,
        boxShadow: active
          ? '0 0 0 2px var(--void), 0 0 0 4px var(--torch)'
          : '0 0 0 2px var(--stone-600), 0 3px 0 2px var(--void)',
      }}
    />
    <span className={`text-[6px] ${active ? 'text-torch' : 'text-stone-500 group-hover:text-parchment'}`}>{label}</span>
  </button>
)

export const BackgroundPanel = () => {
  const card = useActiveCard()
  const locked = card.theme !== null || card.cardType === 'crt'
  return (
    <Panel title='Background'>
      {locked && (
        <p className='mb-4 text-[8px] leading-relaxed text-torch'>
          {card.cardType === 'crt'
            ? 'The CRT card ignores custom backgrounds.'
            : 'A built-in theme is selected. Pick "Custom" to use your own gradient.'}
        </p>
      )}
      <GradientEditor />
    </Panel>
  )
}
