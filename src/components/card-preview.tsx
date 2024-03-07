import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

type CardPreviewProps = {
  username: string;
};
//l
const CardPreview: React.FC<CardPreviewProps> = ({ username }) => {
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(
    "https://pixel-profile.vercel.app/api/github-stats?username=imhalid&screen_effect=true&include_all_commits=true&pixelate_avatar=false&background=linear-gradient%280deg%2C+%23239063+0%25%2C+%2391db69+100%25%29"
  );

  const baseURL = "https://pixel-profile.vercel.app/api/github-stats?";

  const preview = useSelector((state: RootState) => state.preview);
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

  const gradient = `linear-gradient(${preview.rotation}deg, ${preview.firstColor}${preview.firstColorOpacity} ${preview.firstColorPosition}%, ${preview.secondColor}${preview.secondColorOpacity} ${preview.secondColorPosition}%)`;

  const createUrlWithParams = () => {
    const params = new URLSearchParams();
    params.append("username", username);
    setting.screenEffect &&
      params.append("screen_effect", setting.screenEffect.toString());
    setting.includeAllCommits &&
      params.append(
        "include_all_commits",
        setting.includeAllCommits.toString()
      );
    setting.pixelateAvatar &&
      params.append("pixelate_avatar", setting.pixelateAvatar.toString());
    params.append("background", gradient);
    // params.append('theme', setting.theme.toString());
     params.append('color', preview.textColor + preview.textColorOpacity);
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
