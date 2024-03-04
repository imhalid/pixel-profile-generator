import { useReducer, useState } from 'react';
import CardPreview from './card-preview';
import ColorsPopup from './colors-popup';
import RotationAngle from './rotation-angle';
import ColorPosition from './color-position';
import { useDispatch, useSelector } from 'react-redux';
import { setUserName } from '../store/optionsSlice';

const CustomCreate = () => {

  const checkboxes = [
    { id: 'showTotalStars', label: 'Show total stars', defaultValue: false },
    { id: 'showRank', label: 'Show rank', defaultValue: false },
    { id: 'showAvatar', label: 'Show avatar', defaultValue: false },
    { id: 'screenEffect', label: 'Screen effect', defaultValue: false },
    { id: 'pixelateAvatar', label: 'Pixelate avatar', defaultValue: false },
    {
      id: 'includeAllCommits',
      label: 'Include all commits',
      defaultValue: false,
    },
  ];
  
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.options.userName);

  // rotation, custom backroundURL, chose radial or linear or conic gradient

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

  const [state, dispatchReducer] = useReducer(checkboxReducer, {
    showTotalStars: false,
    showRank: false,
    showAvatar: false,
    screenEffect: false,
    pixelateAvatar: false,
    includeAllCommits: false,
  });

  return (
    <div className="relative p-10 ring-2 ring-white/50">
      <h1 className="absolute -top-4 left-1/2 -translate-x-1/2 transform bg-neutral-950 px-3 text-2xl">
        Github Card Generator
      </h1>

      <div
        className="relative mb-4  flex gap-5 bg-neutral-950 text-sm text-white"
        id="settings"
      >
        <div className="relative flex w-1/2 flex-col items-start justify-start gap-2 p-3 pt-5 ring-2 ring-white/50">
          <h1 className="absolute -top-3 bg-neutral-950 px-2">Base</h1>
          <div className="flex gap-2 flex-col w-full mb-2">
            <input
              type="text"
              className=" bg-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Username"
              value={userName}
              onChange={(e) => dispatch(setUserName(e.target.value))}
            />
            <ColorsPopup />
          </div>
          <RotationAngle />
          <ColorPosition />
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-5 text-xs">
          <div className="relative flex h-full w-full flex-col flex-wrap items-start justify-start gap-2 p-3 pt-5 ring-2 ring-white/50">
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
                    dispatchReducer({ type: 'TOGGLE_CHECKBOX', id: checkbox.id })
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
            {/* <div>--------------------------</div>
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
            </div> */}
          </div>
        </div>
      </div>
      {/* <button id="sendButton" className="bg-neutral-900 h-5 flex text-center justify-center p-10">
        Send
      </button> */}
      <div className="relative flex h-full w-full flex-col items-start justify-start gap-2 p-3 pt-5 ring-2 ring-white/50">
        <h1 className="absolute -top-3 bg-neutral-950 px-2">Preview</h1>
        <CardPreview
          username={userName}
          firstColor={'#2e222f'}
          secondColor={'#2e222f'}
          rotateDirection="to bottom right"
          showTotalStars={state.showTotalStars}
          showRank={state.showRank}
          showAvatar={state.showAvatar}
          screenEffect={state.screenEffect}
          pixelateAvatar={state.pixelateAvatar}
          includeAllCommits={state.includeAllCommits}
        />
      </div>
    </div>
  );
};

export default CustomCreate;
