import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setTheme, SettingState } from '../store/slices/setting-slice';
import { useCallback } from 'react';

// Define themes array
const themes: SettingState['themeName'][] = ['--', 'journey', 'road_trip', 'fuji', 'monica', 'summer', 'lax', 'crt']

const ThemeSelect: React.FC = () => {
  const dispatch = useDispatch();
  const setting = useSelector((state: RootState) => state.setting);

  const previousTheme = useCallback(() => {
    const currentIndex = themes.indexOf(setting.themeName);
    const newIndex = (currentIndex - 1 + themes.length) % themes.length;
    dispatch(setTheme(themes[newIndex]));
  }, [dispatch, setting.themeName]);

  const nextTheme = useCallback(() => {
    const currentIndex = themes.indexOf(setting.themeName);
    const newIndex = (currentIndex + 1) % themes.length;
    dispatch(setTheme(themes[newIndex]));
  }, [dispatch, setting.themeName]);

  return (
    <div className="flex flex-col text-xs mt-3 border-white border h-fit relative text-start">
      <p className="p-1 bg-white text-center border-black text-black">
        Built-in Themes
      </p>
      <div className="flex justify-between min-w-52 items-center">
        <button
          className="px-2 py-1 bg-white m-1"
          onClick={previousTheme}
          aria-label="Previous Theme"
        >
          &#8592;
        </button>
        <span>{setting.themeName}</span>
        <button
          className="px-2 py-1 bg-white m-1"
          onClick={nextTheme}
          aria-label="Next Theme"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default ThemeSelect;
