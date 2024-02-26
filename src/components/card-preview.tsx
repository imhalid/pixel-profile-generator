import React, { useState, useEffect } from 'react';

type CardPreviewProps = {
  rotateDirection:
    | 'to bottom right'
    | 'to bottom left'
    | 'to top right'
    | 'to top left';
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
  customBackground?: boolean;
};

const CardPreview: React.FC<CardPreviewProps> = ({
  rotateDirection = 'to bottom right',
  firstColor = '#000000',
  secondColor = '#FFFFFF',
  username = 'imhalid',
  includeAllCommits = false,
  pixelateAvatar = true,
  screenEffect = true,
  showAvatar = true,
  showRank = false,
  showTotalStars = false,
  background = '',
  customBackground = false,
}) => {
  const [loading, setLoading] = useState(true);

console.table({
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
  background,
  customBackground,
});
  useEffect(() => {
    setLoading(true);
  }, [firstColor, secondColor, rotateDirection]);
  const baseURL = 'https://pixel-profile.vercel.app/api/github-stats?';

  const handleImageLoad = () => {
    setLoading(false);
  };

  const clearBackground = (str: string) => {
    const first15 = str.slice(0, 15);
    const last5 = str.slice(-5);

    const regex = /^(.*?):/;

    if (first15.includes('background')) {
      return str.replace(regex, '');
    }

    if (last5.includes(';')) {
      return str.slice(0, -1);
    }

    return str
  }

  // gradient and url
// linear-gradient(to right, #ff00fc60, #00000090), url("https://images.unsplash.com/photo-1705933278878-d069f96a0717?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D");


  const createUrlWithParams = () => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('screen_effect', screenEffect ? 'true' : 'false');
    params.append('show_avatar', showAvatar ? 'true' : 'false');
    params.append('show_rank', showRank ? 'true' : 'false');
    params.append('show_total_stars', showTotalStars ? 'true' : 'false');
    params.append('include_all_commits', includeAllCommits ? 'true' : 'false');
    params.append('pixelate_avatar', pixelateAvatar ? 'true' : 'false'); 
    params.append('background', clearBackground(background));
    return `${baseURL}${params.toString()}`;
  };

  return (
    <div className="card relative">
      {loading && (
        <div className="absolute z-10 w-full h-full flex justify-center items-center bg-black/50 backdrop-blur-md">
          Loading...
        </div>
      )}
      <img onLoad={handleImageLoad} src={createUrlWithParams()} alt="placeholder" />
    </div>
  );
};

export default CardPreview;