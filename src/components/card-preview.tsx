import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

type CardPreviewProps = {
  username: string;
};

const CardPreview: React.FC<CardPreviewProps> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [generatedUrl, setGeneratedUrl] = useState(
    'https://pixel-profile.vercel.app/api/github-stats?username=imhalid&screen_effect=true&include_all_commits=true&pixelate_avatar=false&background=linear-gradient%280deg%2C+%23239063+0%25%2C+%2391db69+100%25%29'
  );

  useEffect(() => {
    setLoading(true);
  }, [username]);
  const baseURL = 'https://pixel-profile.vercel.app/api/github-stats?';

  const options = useSelector((state: RootState) => state.preview);
  const setting = useSelector((state: RootState) => state.setting);

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

  const gradient = `linear-gradient(${options.rotation}deg, ${options.firstColor}${options.firstColorOpacity} ${options.firstColorPosition}%, ${options.secondColor}${options.secondColorOpacity} ${options.secondColorPosition}%)`;

  const createUrlWithParams = () => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('screen_effect', setting.screenEffect.toString());
    params.append('include_all_commits', setting.includeAllCommits.toString());
    params.append('pixelate_avatar', setting.pixelateAvatar.toString());
    params.append('background', gradient);
    // params.append('theme', setting.theme.toString());
    // params.append('color', setting.color.toString());
    // params.append('hide', setting.hide.toString());
    return `${baseURL}${params.toString()}`;
  };
  const handleGenerateClick = () => {
    setLoading(true);
    setGeneratedUrl(createUrlWithParams());
  };
  return (
    <div className="card relative">
      {loading && (
        <div className="absolute z-10 flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-md">
          Loading...
        </div>
      )}
      <img
        onLoad={() => {
          setLoading(false);
        }}
        src={generatedUrl}
        alt="placeholder"
      />
      <button onClick={handleGenerateClick}>Generate</button>
      <code className="text-left text-xs flex">{createUrlWithParams()}</code>
    </div>
  );
};

export default CardPreview;
