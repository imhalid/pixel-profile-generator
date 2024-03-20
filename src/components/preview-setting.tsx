import ColorsPopup from './colors-popup'
import RotationAngle from './rotation-angle'
import ColorPosition from './color-position'
import { useDispatch, useSelector } from 'react-redux'
import { setUserName, setImageUrl } from '../store/slices/preview-slice'
import { RootState } from '../store/store'
import { useEffect, useState } from 'react'

const BaseSetting = () => {

  const [showWarning, setShowWarning] = useState(true)
  const [checkedShowWarning, setCheckedShowWarning] = useState(false)
  useEffect(() => {
    const warning = localStorage.getItem('dontShow')
    if (warning) {
      setShowWarning(Boolean(warning))
    } else {
      setShowWarning(false)
    }
  }, [])

  const closeWarning = () => {
    if (checkedShowWarning) {
      localStorage.setItem('dontShow', 'true')
    }
    setShowWarning(false)
  }

  const dispatch = useDispatch()
  const userName = useSelector((state: RootState) => state.preview.userName)
  const imageUrl = useSelector((state: RootState) => state.preview.imageUrl)

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
        <div className='w-full relative'>
          <input
            type='text'
            className='backgroundUrl bg-white/10 p-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-white'
            placeholder='Image URL'
            value={imageUrl}
            onChange={e => dispatch(setImageUrl(e.target.value))}
          />
          {
            showWarning && (
              <label className='experimental text-red-100 flex text-left flex-col'>
                <div className='absolute top-0 bg-red-900 px-3 py-2  right-0 flex justify-between w-full'>
                  <div className='flex items-center gap-3'>
                    <input
                      type='checkbox'
                      id='dontShow'
                      className='custom-checkbox'
                      onChange={() => setCheckedShowWarning(!checkedShowWarning)}
                      checked={checkedShowWarning}
                    />
                    <label htmlFor='dontShow'>don't show this again</label>
                  </div>
                  <button
                    onClick={closeWarning}
                    className='px-1'>X</button>
                </div>
                <span className='text-base'>Warning!!</span>
                <p className='mt-3'>
                  Decrease the opacity of the colors so that the image you add is
                  visible
                </p>
              </label>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default BaseSetting

/**
 * Add a small warning note for the label.
 * If the warning message is not desired to be displayed again, an option should be provided with a button.
 */
