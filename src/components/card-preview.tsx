import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

type CardPreviewProps = {
  username: string
}

const CardPreview: React.FC<CardPreviewProps> = ({ username }) => {
  const [loading, setLoading] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState(
    'https://pixel-profile-ui.vercel.app/api/github-stats?username=imhalid&screen_effect=true&include_all_commits=true&pixelate_avatar=true&background=linear-gradient%280deg%2C+%23165a4cFF+0%25%2C+%2391db69FF+100%25%29&color=%23ffffffFF'
  )

  const baseURL = 'https://pixel-profile.vercel.app/api/github-stats?'

  const preview = useSelector((state: RootState) => state.preview)
  const setting = useSelector((state: RootState) => state.setting)

  // const clearBackground = (str: string) => {
  //   const first15 = str.slice(0, 15);
  //   const last5 = str.slice(-5);

  //   const regex = /^(.*?):/;

  //   if (first15.includes('background')) {
  //     return str.replace(regex, '');
  //   }

  //   if (last5.includes(';')) {
  //     return str.slice(0, -1);
  //   }

  //   return str;
  // };




  /*
  * add radial gradient editor with image
  * improve gradient editor
  * add dithering effect
  * */

  const gradient = `linear-gradient(${preview.rotation}deg, ${preview.firstColor}${preview.firstColorOpacity} ${preview.firstColorPosition}%, ${preview.secondColor}${preview.secondColorOpacity} ${preview.secondColorPosition}%) ${preview.imageUrl && `, url(${preview.imageUrl})`}`
  // `radial-gradient(circle at ${posX}% ${posY}%, ${stopsString})`
  const radoalGradient = `radial-gradient(circle at ${preview.firstColorPosition}% ${preview.secondColorPosition}%, ${preview.gradientColor}) ${preview.imageUrl && `, url(${preview.imageUrl})`}`
  
  const createUrlWithParams = () => {
    const params = new URLSearchParams()
    params.append('username', username)
    setting.screenEffect &&
      params.append('screen_effect', setting.screenEffect.toString())
    setting.dithering && params.append('dithering', setting.dithering.toString())
    setting.includeAllCommits &&
      params.append('include_all_commits', setting.includeAllCommits.toString())
    params.append('pixelate_avatar', setting.pixelateAvatar.toString())

    if (setting.themeName === '--') {
      params.append('background', radoalGradient)
    } else {
      params.append('theme', setting.themeName.toString())
    }
    setting.themeName !== '--' &&
      params.append('theme', setting.themeName.toString())
    params.append('color', preview.textColor + preview.textColorOpacity)
    setting.stats.length >= 1 && params.append('hide', setting.stats.toString())

    return `${baseURL}${params.toString()}`
  }

  const handleGenerateClick = () => {
    if (createUrlWithParams() !== generatedUrl) {
      setLoading(true)
      setGeneratedUrl(createUrlWithParams())
    }
  }

  return (
    <div>
      <div className='relative flex h-full w-full flex-col items-start justify-start gap-2 p-3 pt-5 ring-2 ring-white/50'>
        <h1 className='absolute -top-3 bg-neutral-950 px-2'>Preview</h1>
        <div className='w-full relative'>
          <div
            className={`absolute z-10 flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-md saturate-0 transition-all 
            pointer-events-none ${loading ? 'opacity-100' : 'opacity-0'}`}
          >
            Loading...
          </div>

          <img
            className='w-full'
            onLoad={() => {
              setLoading(false)
            }}
            src={generatedUrl}
            alt='placeholder'
          />
        </div>
      </div>
      <div className='mt-4'>
        <button
          className='w-fit px-5 bg-white h-10 text-black active:translate-y-[2px]'
          onClick={handleGenerateClick}
        >
          Generate New Card
        </button>
        <div className='flex items-center gap-4 mt-5 border-t pt-4'>
          <code className='text-left text-xs flex overflow-hidden break-all'>
            {createUrlWithParams()}
          </code>
          <button
            className='active:translate-y-[2px]'
            onClick={() => {
              navigator.clipboard.writeText(createUrlWithParams())
            }}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardPreview

/**
 * Link is not required to be visible at first.
 * Link preview can be visible.
 * Previous made images can be visible up to 10.
 */