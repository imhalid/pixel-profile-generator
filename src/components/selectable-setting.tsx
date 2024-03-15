import { useDispatch, useSelector } from 'react-redux';
import { toggleOption } from '../store/slices/setting-slice';
import { RootState } from '../store/store';
import ThemeSelect from './theme-select';
import HideStats from './hide-stats';

const SelectableSetting = () => {
  const dispatch = useDispatch();
  const setting = useSelector((state: RootState) => state.setting);

  const checkboxes = [
    { id: 'screenEffect', label: 'Screen effect' },
    { id: 'pixelateAvatar', label: 'Pixelate avatar' },
    { id: 'includeAllCommits', label: 'Include all commits' },
  ];

  return (
    <div className="flex w-full flex-col items-start justify-start gap-5 text-xs">
      <div className="relative flex h-full w-full flex-wrap justify-between gap-2 p-3 ring-2 ring-white/50">
        <h1 className="absolute -top-3 bg-neutral-950 px-2">Settings</h1>
        <div className="flex items-start flex-col gap-2">
          {checkboxes.map((checkbox) => (
            <div
              className="checkbox-wrapper-8 flex items-center gap-3"
              key={checkbox.id}
            >
              <div className="container cursor-pointer">
                <label className="form-control" htmlFor={checkbox.id}>
                  <input
                    className="custom-checkbox"
                    type="checkbox"
                    id={checkbox.id}
                    defaultChecked={
                      setting[
                        checkbox.id as
                          | 'screenEffect'
                          | 'pixelateAvatar'
                          | 'includeAllCommits'
                      ]
                    }
                    onChange={() =>
                      dispatch(
                        toggleOption(
                          checkbox.id as
                            | 'screenEffect'
                            | 'pixelateAvatar'
                            | 'includeAllCommits'
                        )
                      )
                    }
                  />
                  <label htmlFor={checkbox.id} className="text-xs cursor-pointer">
                    {checkbox.label}
                  </label>
                </label>
              </div>
            </div>
          ))}

          <ThemeSelect />
        </div>
        <div>
          <HideStats />
        </div>
      </div>
    </div>
  );
};


export default SelectableSetting;