import CardPreview from './card-preview'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import BaseSetting from './preview-setting'
import SelectableSetting from './selectable-setting'

const CustomCreate = () => {
  const userName = useSelector((state: RootState) => state.preview.userName)

  return (
    <div className='relative p-10 ring-2 mt-10 ring-white/50'>
      <h1 className='absolute -top-4 left-1/2 -translate-x-1/2 transform bg-neutral-950 px-3 text-2xl w-fit'>
        Github Card Generator
      </h1>

      <div
        className='relative mb-4  flex gap-5 flex-col lg:flex-row bg-neutral-950 text-sm text-white'
        id='settings'
      >
        <BaseSetting />

        <SelectableSetting />
      </div>
      <div className='w-full'>
        <CardPreview username={userName} />
      </div>
    </div>
  )
}

export default CustomCreate
