import * as Popover from "@radix-ui/react-popover";
import { animated, useTransition } from "@react-spring/web";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFirstColor,
  setSecondColor,
  setFirstColorOpacity,
  setSecondColorOpacity,
  setTextColor,
  setTextColorOpacity,
  PreviewState,
} from "../store/slices/preview-slice";
import "./styles.css";
import { RootState } from "../store/store";
import { Dispatch } from "@reduxjs/toolkit";

const Popovers = () => {
  return (
    <div className="flex items-center flex-wrap lg:flex-nowrap justify-between gap-2">
      <PopoverDemo type="firstColor" />
      <PopoverDemo type="secondColor" />
      <PopoverDemo type="textColor" />
    </div>
  );
};
export default Popovers;

const PopoverDemo = ({ type }: { type: string }) => {
  const dispatch = useDispatch();
  const preview = useSelector((state: RootState) => state.preview);
  const setting = useSelector((state: RootState) => state.setting);
  const customThemeIsAvailable = setting.themeName !== "--";
  useEffect(() => {
    document.body.setAttribute(
      "style",
      `--firstColor: ${preview.firstColor}${preview.firstColorOpacity}; --secondColor: ${preview.secondColor}${preview.secondColorOpacity}; --textColor: ${preview.textColor}${preview.textColorOpacity}`
    );
  });

  const [open, setOpen] = useState(false);

  const transitions = useTransition(open, {
    from: {
      opacity: 0,
      transform: "translateY(-10px)",
    },
    enter: {
      opacity: 1,
      transform: "translateY(0px)",
    },
    leave: {
      opacity: 0,
      transform: "translateY(-10px)",
    },
    exitBeforeEnter: true,
    config: {
      duration: 100,
    },
  });
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={`flex w-fit items-center h-full gap-2 bg-neutral-900 px-2 py-1 ${
            customThemeIsAvailable && type !== "textColor"
              ? "opacity-30 pointer-events-none"
              : ""
          }`}
          aria-label="Update dimensions"
        >
          <div
            style={{
              backgroundColor: preview[type as keyof PreviewState] as string,
            }}
            id="popupButton"
            className="relative h-5 w-5 bg-red-500"
          />
          <p className="text-xs">{preview[type as keyof PreviewState]}</p>
        </button>
      </Popover.Trigger>
      {transitions((styles, item) =>
        item ? (
          <Popover.Portal forceMount>
            <animated.div style={styles}>
              <Popover.Content
                className="PopoverContent z-50 relative flex w-52 flex-col items-center justify-center border-2 border-white/50 bg-neutral-950 p-4"
                forceMount
              >
                <ColorPalette
                  dispatch={dispatch}
                  type={type}
                  preview={preview}
                />
              </Popover.Content>
            </animated.div>
          </Popover.Portal>
        ) : null
      )}
    </Popover.Root>
  );
};

const ColorPalette = ({
  dispatch,
  type,
  preview,
}: {
  dispatch: Dispatch;
  type: string;
  preview: PreviewState;
}) => {
  let opacityActionType: string = "";
  if (type === "firstColor") {
    opacityActionType = setFirstColorOpacity.type;
  } else if (type === "secondColor") {
    opacityActionType = setSecondColorOpacity.type;
  } else if (type === "textColor") {
    opacityActionType = setTextColorOpacity.type;
  }

  let colorActionType: string = "";

  if (type === "firstColor") {
    colorActionType = setFirstColor.type;
  } else if (type === "secondColor") {
    colorActionType = setSecondColor.type;
  } else if (type === "textColor") {
    colorActionType = setTextColor.type;
  }
  const returnHexOpacity = (value: number) => {
    const hex = hexOpacity[value];

    dispatch({
      type: opacityActionType,
      payload: hex,
    });
  };

  let colorOpacity: string = "";
  if (type === "firstColor") {
    colorOpacity = preview.firstColorOpacity;
  } else if (type === "secondColor") {
    colorOpacity = preview.secondColorOpacity;
  } else if (type === "textColor") {
    colorOpacity = preview.textColorOpacity;
  }
  return (
    <div id="customcolor">
      {colors.map((color) => (
        <button
          key={color}
          style={{ backgroundColor: color }}
          className="color-button"
          onClick={() => {
            dispatch({
              type: colorActionType,
              payload: color,
            });
          }}
        />
      ))}
      <div className="w-full mt-3 border-t border-white/50">
        <input
          type="range"
          min="0"
          max="99"
          value={hexOpacity.indexOf(colorOpacity)}
          step={1}
          onChange={(e) => {
            returnHexOpacity(parseInt(e.target.value));
          }}
          id={type}
        />
      </div>
    </div>
  );
};

const colors = [
  "#2e222f",
  "#3e3546",
  "#625565",
  "#966c6c",
  "#ab947a",
  "#694f62",
  "#7f708a",
  "#9babb2",
  "#c7dcd0",
  "#ffffff",
  "#6e2727",
  "#b33831",
  "#ea4f36",
  "#f57d4a",
  "#ae2334",
  "#e83b3b",
  "#fb6b1d",
  "#f79617",
  "#f9c22b",
  "#7a3045",
  "#9e4539",
  "#cd683d",
  "#e6904e",
  "#fbb954",
  "#4c3e24",
  "#676633",
  "#a2a947",
  "#d5e04b",
  "#fbff86",
  "#165a4c",
  "#239063",
  "#1ebc73",
  "#91db69",
  "#cddf6c",
  "#313638",
  "#374e4a",
  "#547e64",
  "#92a984",
  "#b2ba90",
  "#0b5e65",
  "#0b8a8f",
  "#0eaf9b",
  "#30e1b9",
  "#8ff8e2",
  "#323353",
  "#484a77",
  "#4d65b4",
  "#4d9be6",
  "#8fd3ff",
  "#45293f",
  "#6b3e75",
  "#905ea9",
  "#a884f3",
  "#eaaded",
  "#753c54",
  "#a24b6f",
  "#cf657f",
  "#ed8099",
  "#831c5d",
  "#c32454",
  "#f04f78",
  "#f68181",
  "#fca790",
  "#fdcbb0",
];

const hexOpacity = [
  "00",
  "03",
  "05",
  "08",
  "0A",
  "0D",
  "0F",
  "12",
  "14",
  "17",
  "1A",
  "1C",
  "1F",
  "21",
  "24",
  "26",
  "29",
  "2B",
  "2E",
  "30",
  "33",
  "36",
  "38",
  "3B",
  "3D",
  "40",
  "42",
  "45",
  "47",
  "4A",
  "4D",
  "4F",
  "52",
  "54",
  "57",
  "59",
  "5C",
  "5E",
  "61",
  "63",
  "66",
  "69",
  "6B",
  "70",
  "73",
  "75",
  "78",
  "7A",
  "7D",
  "80",
  "82",
  "85",
  "87",
  "8A",
  "8C",
  "8F",
  "91",
  "94",
  "96",
  "99",
  "9C",
  "9E",
  "A1",
  "A3",
  "A6",
  "A8",
  "AB",
  "AD",
  "B0",
  "B3",
  "B5",
  "B8",
  "BA",
  "BD",
  "BF",
  "C2",
  "C4",
  "C7",
  "C9",
  "CC",
  "CF",
  "D1",
  "D4",
  "D6",
  "D9",
  "DB",
  "DE",
  "E0",
  "E3",
  "E6",
  "E8",
  "EB",
  "ED",
  "F0",
  "F2",
  "F5",
  "F7",
  "FA",
  "FC",
  "FF",
];
