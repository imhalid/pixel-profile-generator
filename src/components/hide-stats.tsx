import { RootState } from '../store/store'
import { useDispatch, useSelector } from 'react-redux'
import { setHideStats as setHideStats } from '../store/slices/setting-slice'

const HideStats = () => {
  const dispatch = useDispatch()
  const setting = useSelector((state: RootState) => state.setting)
  return (
    <div className='flex flex-col text-xs mt-3 md:mt-0 relative border text-start'>
      <p className='p-1 bg-white text-black border-b-4 border-black'>
        Hide Stats
      </p>
      <div className='flex flex-col'>
        {stats.map((stat, index) => (
          <div key={index} className=' relative'>
            <input
              type='checkbox'
              id={stat}
              name='theme'
              value={stat}
              checked={setting.stats.includes(stat)}
              onChange={() => {
                if (setting.stats.includes(stat)) {
                  dispatch(setHideStats(setting.stats.filter(p => p !== stat)))
                } else {
                  dispatch(setHideStats([...setting.stats, stat]))
                }
              }}
              className='hidden'
            />
            <label
              htmlFor={stat}
              className={`block cursor-pointer p-1 ${
                setting.stats.includes(stat)
                  ? 'bg-white text-black'
                  : 'transparent'
              }`}
            >
              {stat}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HideStats

const stats = [
  'avatar',
  'commits',
  'contributions',
  'issues',
  'prs',
  'rank',
  'stars'
]
