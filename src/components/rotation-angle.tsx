import { useDispatch, useSelector } from 'react-redux'
import { setRotation } from '../store/slices/preview-slice'
import { useEffect } from 'react'
import { RootState } from '../store/store'

const RotationAngle = () => {
  const dispatch = useDispatch()
  const preview = useSelector((state: RootState) => state.preview)
  const rotation = preview.rotation
  useEffect(() => {
    const sliderElement = document.querySelector('.slider')
    if (sliderElement) {
      sliderElement.innerHTML = `
      <style>
        .slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  border: solid white 2px;
  width: 25px;
  height: 25px;
  position: relative;
  z-index: 10;
  background: url('data:image/svg+xml,<svg width="15" height="15" viewBox="0 0 15 15" fill="white" xmlns="http://www.w3.org/2000/svg" transform="rotate(${rotation})"><path d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" fillRule="evenodd" clipRule="evenodd"></path></svg>') no-repeat center center , black;
  cursor: pointer;
}
      </style>
      `
    }
  }, [rotation])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRotation(parseInt(event.target.value)))
  }
  const value = preview.rotation
  return (
    <div className='relative flex w-full group'>
      <div className=' w-full'>
        <input
          type='range'
          min={0}
          max={360}
          step={10}
          value={value}
          onChange={handleChange}
          className='slider'
          id='myRange'
        ></input>
      </div>
      <div className='control-information absolute transform -translate-x-1/2 -translate-y-1/2 top-3.5 bg-black px-2 left-1/2 text-white text-xs pointer-events-none'>
        <span>BG Rotation</span>
      </div>
    </div>
  )
}

export default RotationAngle
