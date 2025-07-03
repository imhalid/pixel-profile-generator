import { RootState } from '../store/store'
import { useDispatch, useSelector } from 'react-redux'
import { setHideStats as setHideStats } from '../store/slices/setting-slice'

// Only valid hide keys
const validStats = [
  { key: 'avatar', label: 'Avatar' },
  { key: 'commits', label: 'Commits' },
  { key: 'contributions', label: 'Contributions' },
  { key: 'issues', label: 'Issues' },
  { key: 'prs', label: 'Pull Requests' },
  { key: 'rank', label: 'Rank' },
  { key: 'stars', label: 'Stars' },
];

const HideStats = () => {
  const dispatch = useDispatch()
  const setting = useSelector((state: RootState) => state.setting)
  const selectedStats = setting.stats as string[]; // type guard for includes/filter
  return (
    <div className='flex flex-col text-xs mt-3 md:mt-0 relative border text-start'>
      <p className='p-1 bg-white text-black border-b-4 border-black'>
        Hide Stats
      </p>
      <div className='flex flex-col'>
        {validStats.map(({ key, label }) => (
          <div key={key} className=' relative'>
            <input
              type='checkbox'
              id={key}
              name='theme'
              value={key}
              checked={selectedStats.includes(key)}
              onChange={() => {
                if (selectedStats.includes(key)) {
                  dispatch(setHideStats(selectedStats.filter(p => p !== key) as any))
                } else {
                  dispatch(setHideStats([...(selectedStats as any), key]))
                }
              }}
              className='hidden'
            />
            <label
              htmlFor={key}
              className={`block cursor-pointer p-1 ${
                selectedStats.includes(key)
                  ? 'bg-white text-black'
                  : 'transparent'
              }`}
            >
              {label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HideStats
