import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { setHideProperties } from "../store/slices/setting-slice";

const HideProperties = () => {
  const dispatch = useDispatch();
  const setting = useSelector((state: RootState) => state.setting);
  return (
    <div className="flex flex-col text-xs mt-3 relative border-x text-start">
      <p className="p-1 bg-white text-black ">Hide Properties</p>
      <div className="grid grid-cols-[repeat(2,_minmax(100px,_auto))] grid-rows-3">
        {properties.map((property, index) => (
          <div key={index} className=" relative border-x">
            <input
              type="checkbox"
              id={property}
              name="theme"
              value={property}
              checked={setting.properties.includes(property)}
              onChange={() => {
                if (setting.properties.includes(property)) {
                  dispatch(
                    setHideProperties(
                      setting.properties.filter((p) => p !== property)
                    )
                  );
                } else {
                  dispatch(
                    setHideProperties([...setting.properties, property])
                  );
                }
              }}
              className="hidden"
            />
            <label
              htmlFor={property}
              className={`block cursor-pointer p-1 ${setting.properties.includes(property) ? "bg-white text-black" : "transparent"}`}
            >
              {property}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HideProperties;

const properties = [
  "avatar",
  "commits",
  "contributions",
  "issues",
  "prs",
  "rank",
  "stars",
];