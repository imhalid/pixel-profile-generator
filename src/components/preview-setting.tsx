import ColorsPopup from './colors-popup'
import RotationAngle from './rotation-angle'
import ColorPosition from './color-position'
import { useDispatch, useSelector } from 'react-redux'
import { setUserName, setImageUrl } from '../store/slices/preview-slice'
import { RootState } from '../store/store'
import { useState } from 'react'
import RadialGradientGenerator from './radial-gradient'
import LinearGradientGenerator from './linear-gradient'
import  {setGradientType}  from '../store/slices/preview-slice'
const BaseSetting = () => {

  const [showWarning, setShowWarning] = useState(true)

  const closeWarning = () => {
    setShowWarning(false)
  }

  const dispatch = useDispatch()
  const preview = useSelector((state: RootState) => state.preview)
  const userName = useSelector((state: RootState) => state.preview.userName)
  const imageUrl = useSelector((state: RootState) => state.preview.imageUrl)
  const setting = useSelector((state: RootState) => state.setting)
  
  //setGradientType
  const customThemeIsAvailable = setting.themeName !== '--'
  return (
    <div className='relative flex lg:w-1/2 flex-col items-start justify-start gap-2 p-3 pt-5 ring-2 ring-white/50 base-setting'>
      <h1 className='absolute -top-3 bg-neutral-950 px-2'>Base</h1>

      <div className='flex gap-2 w-fit flex-wrap mb-2'>
        

        <input
          type='text'
          className=' bg-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-white'
          placeholder='Username'
          value={userName}
          onChange={e => dispatch(setUserName(e.target.value))}
        />
        <div className='flex'>
        <ColorsPopup />
        <div className='flex flex-col w-fit text-xs leading-[18px] relative border text-start'>
          <div className='flex '>
            {['linear', 'radial'].map((type) => (
              <div key={type} className='relative'>
                <input
                  type='radio'
                  id={type}
                  name='gradientType'
                  value={type}
                  checked={preview.gradientType === type}
                  onChange={() => dispatch(setGradientType(type as "linear" | "radial"))}
                  className='hidden'
                />
                <label
                  htmlFor={type}
                  className={`block cursor-pointer h-full p-1 capitalize ${
                    preview.gradientType === type
                      ? 'bg-white text-black'
                      : 'transparent'
                  }`}
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
        </div>

      </div>
      <div
        className={`w-full flex flex-col gap-2 ${
          customThemeIsAvailable ? 'opacity-30 pointer-events-none' : ''
        }`}
      >
        {
          preview.gradientType === 'linear' ? (
            <LinearGradientGenerator />
          ) : (
              <RadialGradientGenerator />
          )
        }
        
        <div className='w-full relative'>
          <input
            type='text'
            className='backgroundUrl bg-white/10 p-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-white'
            placeholder='Image URL'
            value={imageUrl}
            onChange={e => dispatch(setImageUrl(e.target.value))}
          />
          {showWarning && (
            <label className='experimental bg-cyan-800 text-cyan-100 flex text-left flex-col'>
              <div className='absolute top-0 bg-cyan-900 px-3 py-2  right-0 flex justify-between w-full'>
                <span className='text-sm'>Reminder!!</span>
                <button onClick={closeWarning} className='px-1'>
                  X
                </button>
              </div>

              <p className=''>
                Decrease the opacity of the colors so that the image you add is
                visible
              </p>
            </label>
          )}
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
