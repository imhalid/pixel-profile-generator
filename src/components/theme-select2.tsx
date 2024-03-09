import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setTheme, SettingState } from '../store/slices/setting-slice';

const ThemeSelect2 = () => {
  const dispatch = useDispatch();

  const previousTheme = () => {
    const previousTheme = themes.indexOf(setting.themeName) - 1;
    if (previousTheme < 0) {
      dispatch(setTheme(themes[themes.length - 1] as SettingState['themeName']));
    } else {
      dispatch(setTheme(themes[previousTheme] as SettingState['themeName']));
    }
  };

  const nextTheme = () => {
    const nextTheme = themes.indexOf(setting.themeName) + 1;
    if (nextTheme >= themes.length) {
      dispatch(setTheme(themes[0] as SettingState['themeName']));
    } else {
      dispatch(setTheme(themes[nextTheme] as SettingState['themeName']));
    }
  };

  const setting = useSelector((state: RootState) => state.setting);
  return (
    <div className="flex flex-col text-xs mt-3 border-white border relative text-start">
      <p className="p-1 bg-white  text-center border-black text-black">
        Builtin Themes
      </p>
      <div className="flex justify-between min-w-52 items-center">
        <button
          className="px-2 py-1 bg-white m-1"
          onClick={() => {
            previousTheme();
          }}
        >
          <div id="leftArrow"></div>
        </button>
        {setting.themeName}
        <button
          className="px-2 py-1 bg-white m-1"
          onClick={() => {
            nextTheme();
          }}
        >
          <div id="rightArrow"></div>
        </button>
      </div>
    </div>
  );
};

export default ThemeSelect2;

const themes = ['--', 'journey', 'road_trip', 'fuji', 'monica', 'summer', 'lax'];
