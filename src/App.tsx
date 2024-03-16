import './App.css'
import CustomCard from './components/custom-create'

function App() {
  return (
    <div className='App'>
      <CustomCard />
      <div>
        <p className='text-xs mt-4'>
          a simple ui for the{' '}
          <span className='underline'>
            <a href='https://github.com/LuciNyan/pixel-profile'>
              pixel-profile
            </a>
          </span>{' '}
          project by{' '}
          <span className='bg-white text-black p-0.5'>
            <a href='https://github.com/LuciNyan'>LuciNyan</a>
          </span>
        </p>
      </div>
      <div className='text-xs mt-3'>
        Contribute to this project on{' '}
        <span className='underline'>
          <a href='https://github.com/imhalid/pixel-profile-generator'>
            GitHub
          </a>
        </span>
      </div>
    </div>
  )
}

export default App
