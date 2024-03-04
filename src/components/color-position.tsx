import { useDispatch, useSelector } from 'react-redux';
import { setFirstColorPosition, setSecondColorPosition } from '../store/optionsSlice';
const ColorPosition = () => {
  const dispatch = useDispatch();
  const firstColorPosition = useSelector((state) => state.options.firstColorPosition);
  const secondColorPosition = useSelector((state) => state.options.secondColorPosition);
  const firstColor = useSelector((state) => state.options.firstColor);
  const secondColor = useSelector((state) => state.options.secondColor);
  
  return (
    <div className="flex justify-center flex-col relative mt-2 w-full" style={{
      backgroundImage: `linear-gradient(90deg, ${firstColor} ${firstColorPosition}%, ${secondColor} ${secondColorPosition}%)`,
    }}>
      <input
        type="range"
        min="0"
        max="100"
        step={1}
        value={firstColorPosition}
        onChange={(e) => dispatch(setFirstColorPosition(e.target.value))}
        id="firstColor"
      />
      <input
        type="range"
        min="0"
        max="100"
        step={1}
        value={secondColorPosition}
        onChange={(e) => dispatch(setSecondColorPosition(e.target.value))}
        id="secondColor"
      />
    </div>
  );
};

export default ColorPosition;
