import { BackgroundPanel, DataPanel, SchemeBar, StylePanel } from './components/controls'
import HistoryPanel from './components/history-panel'
import OutputPanel from './components/output-panel'
import PreviewPanel from './components/preview-panel'
import { SessionProvider } from './components/session'
import { TorchIcon } from './components/icons'

function App() {
  return (
    <SessionProvider>
      <div className='mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6'>
        <header className='flex flex-col items-center gap-4 text-center'>
          <div className='flex items-end gap-4 sm:gap-6'>
            <TorchIcon className='h-12 w-8 shrink-0' />
            <h1 className='title-glow text-lg leading-snug text-torch sm:text-2xl md:text-3xl'>
              Pixel Profile
              <br />
              <span className='text-parchment'>Generator</span>
            </h1>
            <TorchIcon className='h-12 w-8 shrink-0' />
          </div>
          <p className='max-w-xl text-[8px] leading-relaxed text-dim sm:text-[9px]'>
            Forge a retro GitHub stats card for your profile README. Design one card for light mode
            and one for dark, then copy the spell.
          </p>
        </header>

        <div className='grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]'>
          <div className='flex flex-col gap-10'>
            <SchemeBar />
            <DataPanel />
            <StylePanel />
            <BackgroundPanel />
          </div>
          <div className='flex flex-col gap-10 lg:sticky lg:top-6'>
            <PreviewPanel />
            <OutputPanel />
          </div>
        </div>

        <HistoryPanel />

        <footer className='flex flex-col items-center gap-2 text-[8px] leading-relaxed text-stone-500'>
          <p>
            Cards are rendered by{' '}
            <a className='text-dim underline hover:text-torch' href='https://github.com/LuciNyan/pixel-profile'>
              pixel-profile
            </a>{' '}
            by{' '}
            <a className='text-dim underline hover:text-torch' href='https://github.com/LuciNyan'>
              LuciNyan
            </a>
          </p>
          <p>
            Contribute on{' '}
            <a className='text-dim underline hover:text-torch' href='https://github.com/imhalid/pixel-profile-generator'>
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </SessionProvider>
  )
}

export default App
