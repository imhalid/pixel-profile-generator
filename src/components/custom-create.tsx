import CardPreview from './card-preview';
import { useState, useReducer } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';

const CustomCreate = () => {
  const [firstColor, setFirstColor] = useState('#0500ff');
  const [secondColor, setSecondColor] = useState('#ff00fc');
  const [userName, setUserName] = useState('imhalid');
  const [background, setBackground] = useState(
    'linear-gradient(to right, #ff00fc60, #00000090), url("https://images.unsplash.com/photo-1705933278878-d069f96a0717?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D")'
  );
  const [customBackground, setCustomBackground] = useState(false);

  const checkboxes = [
    { id: 'showTotalStars', label: 'Show total stars', defaultValue: false },
    { id: 'showRank', label: 'Show rank', defaultValue: true },
    { id: 'showAvatar', label: 'Show avatar', defaultValue: true },
    { id: 'screenEffect', label: 'Screen effect', defaultValue: true },
    { id: 'pixelateAvatar', label: 'Pixelate avatar', defaultValue: true },
    { id: 'includeAllCommits', label: 'Include all commits', defaultValue: false },
  ];

  type State = {
    [key: string]: boolean;
  };

  type Action = {
    type: string;
    id: string;
  };

const checkboxReducer = (state: State, action: Action): State => {
  if (action.type === 'TOGGLE_CHECKBOX') {
    return {
      ...state,
      [action.id]: !state[action.id],
    };
  } else {
    return state;
  }
};

  const [state, dispatch] = useReducer(checkboxReducer, {
    showTotalStars: true,
    showRank: true,
    showAvatar: true,
    screenEffect: true,
    pixelateAvatar: true,
    includeAllCommits: false,
  });

  return (
    <div className="ring-2 ring-white/50 p-10 relative">
      <h1 className="absolute left-1/2 -translate-x-1/2 -top-4 bg-neutral-950 px-3 transform text-2xl">
        Github Card Generator
      </h1>

      <div
        className="bg-neutral-950 text-white  mb-4 text-sm flex gap-4 relative"
        id="settings"
      >
        <div className="flex relative justify-start pt-5 gap-2 items-start flex-col ring-white/50 ring-2 w-fit p-3">
          <h1 className="absolute -top-3 bg-neutral-950 px-2">Base</h1>
          <input
            type="text"
            className="w-fit p-2 bg-white/10 focus:outline-none focus:ring-2 focus:ring-white text-white"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <div className="flex gap-2 justify-between w-full">
            <div
              id="popUpContainer"
              className="w-fit z-20 flex bg-neutral-900  px-2 py-1 gap-2 items-center"
            >
              <button
                style={{
                  backgroundColor: firstColor,
                }}
                id="popupButton"
                className="w-5 h-5 bg-red-500 relative"
              />
              <div
                id="popUp"
                className="min-w-28 p-4  min-h-16 bg-gray-800 absolute top-10 left-0"
              >
                <HexAlphaColorPicker
                  color={firstColor}
                  onChange={setFirstColor}
                />
                <input
                  type="text"
                  className="mt-2 w-full p-2  bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                  value={secondColor}
                  onChange={(e) => setSecondColor(e.target.value)}
                />
              </div>
              <p>{firstColor}</p>
            </div>
            <div
              id="popUpContainer"
              className="w-fit z-20 flex bg-neutral-900  px-2 py-1 gap-2 items-center"
            >
              <button
                style={{
                  backgroundColor: secondColor,
                }}
                id="popupButton"
                className="w-5 h-5 bg-red-500  relative"
              />
              <div
                id="popUp"
                className="min-w-28 p-4  min-h-16 bg-gray-800 absolute top-10 left-0"
              >
                <HexAlphaColorPicker
                  color={secondColor}
                  onChange={setSecondColor}
                />
                <input
                  type="text"
                  className="mt-2 w-full p-2  bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                  value={secondColor}
                  onChange={(e) => setSecondColor(e.target.value)}
                />
              </div>
              <p>{secondColor}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-start items-start gap-5 text-xs w-full">
          <div className="flex relative h-full justify-start pt-5 gap-2 items-start flex-col flex-wrap ring-white/50 ring-2 w-full p-3">
            <h1 className="absolute -top-3 bg-neutral-950 px-2">Settings</h1>
            {checkboxes.map((checkbox) => (
              <div
                className="checkbox-wrapper-8 flex items-center gap-3"
                key={checkbox.id}
              >
                <input
                  className="tgl tgl-skewed"
                  id={checkbox.id}
                  type="checkbox"
                  defaultChecked={checkbox.defaultValue}
                  onChange={() =>
                    dispatch({ type: 'TOGGLE_CHECKBOX', id: checkbox.id })
                  }
                />
                <label
                  className="tgl-btn"
                  data-tg-off="OFF"
                  data-tg-on="ON"
                  htmlFor={checkbox.id}
                />
                <label htmlFor={checkbox.id}>{checkbox.label}</label>
              </div>
            ))}
            <div>--------------------------</div>
            <div className="checkbox-wrapper-8 flex items-center gap-3">
              <input
                className="tgl tgl-skewed"
                id="customBackground"
                type="checkbox"
                defaultChecked={customBackground}
                onChange={() => setCustomBackground(!customBackground)}
              />
              <label
                className="tgl-btn"
                data-tg-off="OFF"
                data-tg-on="ON"
                htmlFor="customBackground"
              />
              <label htmlFor="customBackground">Custom CSS Background</label>
            </div>
          </div>
          {customBackground && (
            <div className="flex relative h-full justify-start pt-5 gap-2 items-start flex-col ring-white/50 ring-2 w-full p-3">
              <h1 className="absolute -top-3 bg-neutral-950 px-2">
                Background CSS
              </h1>

              <textarea
                className="w-full p-2 bg-white/10 focus:outline-none focus:ring-2 focus:ring-white text-white h-full"
                placeholder="Background Gradient"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      {/* <button id="sendButton" className="bg-neutral-900 h-5 flex text-center justify-center p-10">
        Send
      </button> */}
      <div className="flex relative h-full justify-start pt-5 gap-2 items-start flex-col ring-white/50 ring-2 w-full p-3">
        <h1 className="absolute -top-3 bg-neutral-950 px-2">Preview</h1>
        <CardPreview
          username={userName}
          firstColor={firstColor}
          secondColor={secondColor}
          rotateDirection="to bottom right"
          showTotalStars={state.showTotalStars}
          showRank={state.showRank}
          showAvatar={state.showAvatar}
          screenEffect={state.screenEffect}
          pixelateAvatar={state.pixelateAvatar}
          includeAllCommits={state.includeAllCommits}
          background={background}
        />
      </div>
    </div>
  );
};

export default CustomCreate;



