import ColorsPopup from './colors-popup'
import RotationAngle from './rotation-angle'
import ColorPosition from './color-position'
import { useDispatch, useSelector } from 'react-redux'
import { setUserName } from '../store/slices/preview-slice'
import { RootState } from '../store/store'

const BaseSetting = () => {
  const dispatch = useDispatch()
  const userName = useSelector((state: RootState) => state.preview.userName)
  const setting = useSelector((state: RootState) => state.setting)
  const customThemeIsAvailable = setting.themeName !== '--'
  return (
    <div className='relative flex lg:w-1/2 flex-col items-start justify-start gap-2 p-3 pt-5 ring-2 ring-white/50 base-setting'>
      <h1 className='absolute -top-3 bg-neutral-950 px-2'>Base</h1>
      <div className='flex gap-2 flex-col w-full mb-2'>
        <input
          type='text'
          className=' bg-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-white'
          placeholder='Username'
          value={userName}
          onChange={e => dispatch(setUserName(e.target.value))}
        />
        <ColorsPopup />
      </div>
      <div
        className={`w-full flex flex-col gap-2 ${
          customThemeIsAvailable ? 'opacity-30 pointer-events-none' : ''
        }`}
      >
        <RotationAngle />
        <ColorPosition />
      </div>
    </div>
  )
}

export default BaseSetting
