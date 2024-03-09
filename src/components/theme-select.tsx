import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setTheme, SettingState } from "../store/slices/setting-slice";

const ThemeSelect = () => {
  const dispatch = useDispatch();

  const setting = useSelector((state: RootState) => state.setting);
  return (
    <div className="flex flex-col text-xs mt-3 relative text-start">
      <p className="p-1 bg-white text-black">Builtin Themes</p>
      <div className="flex flex-wrap">
        {themes.map((theme, index) => (
          <div key={index} className="relative border-x">
            <input
              type="radio"
              id={theme}
              name="theme"
              value={theme}
              checked={setting.themeName === theme}
              onChange={() => {
                dispatch(setTheme(theme as SettingState["themeName"]));
              }}
              className="hidden"
            />
            <label
              htmlFor={theme}
              className={`block cursor-pointer p-1 ${setting.themeName === theme ? "bg-white text-black" : "transparent"}`}
            >
              {theme}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelect;

const themes = [
  "--",
  "journey",
  "road_trip",
  "fuji",
  "monica",
  "summer",
  "lax",
];
