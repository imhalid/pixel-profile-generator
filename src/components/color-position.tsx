import { useDispatch, useSelector } from 'react-redux';
import {
  setFirstColorPosition,
  setSecondColorPosition,
} from '../store/slices/preview-slice';
import { RootState } from '../store/store';
const ColorPosition = () => {
  const dispatch = useDispatch();
  const firstColorPosition = useSelector(
    (state: RootState) => state.preview.firstColorPosition
  );
  const secondColorPosition = useSelector(
    (state: RootState) => state.preview.secondColorPosition
  );
  const firstColor = useSelector((state: RootState) => state.preview.firstColor);
  const secondColor = useSelector(
    (state: RootState) => state.preview.secondColor
  );

  return (
    <div
      className="flex justify-center flex-col relative mt-2 w-full"
      style={{
        backgroundImage: `linear-gradient(90deg, ${firstColor} ${firstColorPosition}%, ${secondColor} ${secondColorPosition}%)`,
      }}
    >
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={firstColorPosition}
        onChange={(e) => dispatch(setFirstColorPosition(Number(e.target.value)))}
        id="firstColor"
      />
      <input
        type="range"
        min="0"
        max="100"
        step={1}
        value={secondColorPosition}
        onChange={(e) => dispatch(setSecondColorPosition(Number(e.target.value)))}
        id="secondColor"
      />
    </div>
  );
};

export default ColorPosition;
