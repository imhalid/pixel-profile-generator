import * as Popover from "@radix-ui/react-popover";
import { animated, useTransition } from "@react-spring/web";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFirstColor,
  setSecondColor,
} from "../store/slices/preview-slice";
import "./styles.css";

const Popovers = () => {
  return (
    <div className="flex items-center justify-between gap-5">
      <PopoverDemo type="firstColor" />
      <PopoverDemo type="secondColor" />
    </div>
  );
};
export default Popovers;

const PopoverDemo = ({ type }: { type: string }) => {
  const dispatch = useDispatch();
  const options = useSelector((state) => state.options);

  useEffect(()=>{
    document.body.setAttribute('style', `--firstColor: ${options.firstColor}; --secondColor: ${options.secondColor};`)
  })

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
          className="z-20 flex w-fit items-center h-full gap-2 bg-neutral-900 px-2 py-1"
          aria-label="Update dimensions"
        >
          <div
            style={{
              backgroundColor: options[type],
            }}
            id="popupButton"
            className="relative h-5 w-5 bg-red-500"
          />
          {options[type]}
        </button>
      </Popover.Trigger>
      {transitions((styles, item) =>
        item ? (
          <Popover.Portal forceMount>
            <animated.div style={styles}>
              <Popover.Content
                className="PopoverContent flex w-52 flex-col items-center justify-center border-2 border-white/50 bg-neutral-950 p-4"
                forceMount
              >
                <ColorPalette dispatch={dispatch} type={type} />
              </Popover.Content>
            </animated.div>
          </Popover.Portal>
        ) : null,
      )}
    </Popover.Root>
  );
};

const ColorPalette = ({ dispatch, type }) => {
  return (
    <div id="customcolor">
      {colors.map((color) => (
        <button
          key={color}
          style={{ backgroundColor: color }}
          className="color-button"
          onClick={() => {
            dispatch({
              type:
                type === "firstColor"
                  ? setFirstColor.type
                  : setSecondColor.type,
              payload: color,
            });
          }}
        />
      ))}
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
