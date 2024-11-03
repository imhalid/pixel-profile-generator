import { useDispatch, useSelector } from 'react-redux'
import { toggleOption, BooleanSettingState } from '../store/slices/setting-slice'
import { RootState } from '../store/store'
import ThemeSelect from './theme-select'
import HideStats from './hide-stats'
import { useCallback } from 'react'

// Type definitions
interface CheckboxOption {
  id: keyof BooleanSettingState;
  label: string;
}

// Checkbox Component
const Checkbox: React.FC<CheckboxOption & { checked: boolean; onChange: () => void }> = ({ id, label, checked, onChange }) => (
  <div className='checkbox-wrapper-8 flex items-center gap-3'>
    <label htmlFor={id} className='form-control cursor-pointer'>
      <input
        type='checkbox'
        id={id}
        checked={checked}
        onChange={onChange}
        className='custom-checkbox'
      />
      {label}
    </label>
  </div>
);

const SelectableSetting: React.FC = () => {
  const dispatch = useDispatch();
  const setting = useSelector((state: RootState) => state.setting);

  const checkboxes: CheckboxOption[] = [
    { id: 'screenEffect' as keyof BooleanSettingState, label: 'Screen effect' },
    { id: 'pixelateAvatar' as keyof BooleanSettingState, label: 'Pixelate avatar' },
    { id: 'includeAllCommits' as keyof BooleanSettingState, label: 'Include all commits' },
    { id: 'dithering' as keyof BooleanSettingState, label: 'Dithering' },
  ].filter(option => typeof setting[option.id] === 'boolean');

  const handleCheckboxChange = useCallback(
    (id: keyof BooleanSettingState) => {
      dispatch(toggleOption(id));
    },
    [dispatch]
  );

  return (
    <div className='flex w-full flex-col items-start justify-start gap-5 text-xs'>
      <div className='relative flex h-full w-full flex-wrap justify-between gap-2 p-3 ring-2 ring-white/50'>
        <h1 className='absolute -top-3 bg-neutral-950 px-2'>Settings</h1>
        <div className='flex items-start flex-col gap-2'>
          {checkboxes.map(({ id, label }) => (
            <Checkbox
              key={id}
              id={id}
              label={label}
              checked={typeof setting[id] === 'boolean' ? setting[id] : false}
              onChange={() => handleCheckboxChange(id)}
            />
          ))}
        </div>
        <div className='relative'>
        <HideStats />
        </div>
        <ThemeSelect />
      </div>
    </div>
  );
};

export default SelectableSetting;
