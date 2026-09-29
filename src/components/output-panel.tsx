import { useMemo, useState } from 'react'
import { buildSnippets } from '../lib/card-config'
import { useAppSelector } from '../store/store'
import { Panel, Segmented } from './ui'
import { CheckIcon, CopyIcon, ScrollIcon } from './icons'
import { useCopy } from './use-copy'

type Tab = 'html' | 'markdown' | 'actions'

const NOTES: Record<Tab, (linked: boolean) => string> = {
  html: linked =>
    linked
      ? 'Paste into your profile README. Turn off "Same card for both" to serve a different card to light and dark mode.'
      : 'GitHub picks the <source> that matches the viewer\'s theme. The <img> is the fallback for everything else.',
  markdown: linked =>
    linked
      ? 'Plain Markdown image.'
      : 'GitHub hides #gh-dark-mode-only / #gh-light-mode-only images for the other theme.',
  actions: () =>
    'Save as .github/workflows/pixel-profile.yml in your profile repo (<user>/<user>). Cards are rendered daily into the `output` branch, so they load instantly and never hit API limits. The README snippet is at the bottom.',
}

const OutputPanel = () => {
  const cards = useAppSelector(s => s.editor.cards)
  const shared = useAppSelector(s => s.editor.shared)
  const linked = useAppSelector(s => s.editor.linked)
  const [tab, setTab] = useState<Tab>('html')
  const { copied, copy } = useCopy()

  const snippets = useMemo(() => buildSnippets(cards, shared, linked), [cards, shared, linked])
  const code = snippets[tab]

  return (
    <Panel title='Spell scroll' icon={<ScrollIcon />}>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <Segmented<Tab>
            size='sm'
            label='Snippet format'
            value={tab}
            onChange={setTab}
            options={[
              { value: 'html', label: 'HTML' },
              { value: 'markdown', label: 'Markdown' },
              { value: 'actions', label: 'GitHub Action' },
            ]}
          />
          <button type='button' className='px-btn px-btn-torch px-btn-sm' onClick={() => copy(code)}>
            {copied ? <CheckIcon /> : <CopyIcon />} {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className='px-inset max-h-72 overflow-auto p-3 text-left text-[8px] leading-[1.9] text-moss'>
          <code className='whitespace-pre-wrap break-all'>{code}</code>
        </pre>
        <p className='text-left text-[7px] leading-relaxed text-stone-500'>{NOTES[tab](linked)}</p>
      </div>
    </Panel>
  )
}

export default OutputPanel
