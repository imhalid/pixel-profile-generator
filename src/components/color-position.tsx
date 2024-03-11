import { useDispatch, useSelector } from "react-redux";
import {
  setFirstColorPosition,
  setSecondColorPosition,
} from "../store/slices/preview-slice";
import { RootState } from "../store/store";
const ColorPosition = () => {
  const dispatch = useDispatch();

  const {
    firstColorPosition,
    secondColorPosition,
    firstColor,
    secondColor,
    firstColorOpacity,
    secondColorOpacity,
  } = useSelector((state: RootState) => state.preview);

  return (
    <div
      className="flex justify-center flex-col relative mt-2 w-full"
      style={{
        backgroundImage: `linear-gradient(90deg, ${firstColor}${firstColorOpacity} ${firstColorPosition}%, ${secondColor}${secondColorOpacity} ${secondColorPosition}%)`,
      }}
    >
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={firstColorPosition}
        onChange={(e) =>
          dispatch(setFirstColorPosition(Number(e.target.value)))
        }
        id="firstColor"
      />
      <div
       className='control-information absolute transform -translate-x-1/2 -translate-y-1/2 top-3.5 bg-white px-2 text-nowrap left-1/2 text-black text-xs pointer-events-none'>
        <span>first color position</span>
      </div>
      
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={secondColorPosition}
        onChange={(e) =>
          dispatch(setSecondColorPosition(Number(e.target.value)))
        }
        id="secondColor"
      />
      <div className='control-information absolute transform -translate-x-1/2  bottom-1 bg-white px-2 text-nowrap left-1/2 text-black text-xs pointer-events-none'>
        <span>second color position</span>
      </div>
    </div>
  );
};

export default ColorPosition;
