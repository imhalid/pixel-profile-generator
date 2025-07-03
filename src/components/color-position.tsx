import { useDispatch, useSelector } from 'react-redux'
import {
  setLinearFirstColorPosition,
  setLinearSecondColorPosition
} from '../store/slices/preview-slice'
import { RootState } from '../store/store'
const ColorPosition = () => {
  const dispatch = useDispatch()

  const {
    linearFirstColorPosition,
    linearSecondColorPosition,
    linearFirstColor,
    linearSecondColor,
    linearFirstColorOpacity,
    linearSecondColorOpacity
  } = useSelector((state: RootState) => state.preview)

  return (
    <div
      className='flex justify-center flex-col relative mt-2 w-full'
      style={{
        backgroundImage: `linear-gradient(90deg, ${linearFirstColor}${linearFirstColorOpacity} ${linearFirstColorPosition}%, ${linearSecondColor}${linearSecondColorOpacity} ${linearSecondColorPosition}%)`
      }}
    >
      <input
        type='range'
        min={0}
        max={100}
        step={1}
        value={linearFirstColorPosition}
        onChange={e => dispatch(setLinearFirstColorPosition(Number(e.target.value)))}
        id='firstColor'
      />
      <div className='control-information absolute transform -translate-x-1/2 -translate-y-1/2 top-3.5 bg-white px-2 text-nowrap left-1/2 text-black text-xs pointer-events-none'>
        <span>first color position</span>
      </div>

      <input
        type='range'
        min={0}
        max={100}
        step={1}
        value={linearSecondColorPosition}
        onChange={e => dispatch(setLinearSecondColorPosition(Number(e.target.value)))}
        id='secondColor'
      />
      <div className='control-information absolute transform -translate-x-1/2  bottom-1 bg-white px-2 text-nowrap left-1/2 text-black text-xs pointer-events-none'>
        <span>second color position</span>
      </div>
    </div>
  )
}

export default ColorPosition
