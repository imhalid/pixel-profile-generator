import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type CardPreviewProps = {
  rotateDirection:
    | "to bottom right"
    | "to bottom left"
    | "to top right"
    | "to top left";
  firstColor: string;
  secondColor: string;
  textColor?: string;
  includeAllCommits?: boolean;
  pixelateAvatar?: boolean;
  screenEffect?: boolean;
  showAvatar?: boolean;
  showRank?: boolean;
  showTotalStars?: boolean;
  username: string;
  background?: string;
};

const CardPreview: React.FC<CardPreviewProps> = ({
  rotateDirection,
  firstColor,
  secondColor,
  username,
  includeAllCommits,
  pixelateAvatar,
  screenEffect,
  showAvatar,
  showRank,
  showTotalStars,
}) => {
  const [loading, setLoading] = useState(true);

  // console.table({
  //   rotateDirection,
  //   firstColor,
  //   secondColor,
  //   username,
  //   includeAllCommits,
  //   pixelateAvatar,
  //   screenEffect,
  //   showAvatar,
  //   showRank,
  //   showTotalStars,
  //   background,
  // });
  useEffect(() => {
    setLoading(true);
  }, [firstColor, secondColor, rotateDirection]);
  const baseURL = "https://pixel-profile.vercel.app/api/github-stats?";

  const handleImageLoad = () => {
    setLoading(false);
  };

  const options = useSelector((state) => state.options);

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

  const gradient = `linear-gradient(${options.rotation}deg, ${options.firstColor} ${options.firstColorPosition}%, ${options.secondColor} ${options.secondColorPosition}%)`;

  const createUrlWithParams = () => {
    const params = new URLSearchParams();
    params.append("username", username);
    screenEffect && params.append("screen_effect", screenEffect.toString());
    showAvatar && params.append("show_avatar", showAvatar.toString());
    showRank && params.append("show_rank", showRank.toString());
    showTotalStars &&
      params.append("show_total_stars", showTotalStars.toString());
    includeAllCommits &&
      params.append("include_all_commits", includeAllCommits.toString());
    pixelateAvatar &&
      params.append("pixelate_avatar", pixelateAvatar.toString());
    params.append("background", gradient);
    return `${baseURL}${params.toString()}`;
  };

  return (
    <div className="card relative">
      {loading && (
        <div className="absolute z-10 flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-md">
          Loading...
        </div>
      )}
      <img
        onLoad={handleImageLoad}
        src={createUrlWithParams()}
        alt="placeholder"
      />
    </div>
  );
};

export default CardPreview;
