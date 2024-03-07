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
    <div className="flex items-center justify-between gap-2">
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
          className="z-20 flex w-fit items-center h-full gap-2 bg-neutral-900 px-2 py-1"
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
                className="PopoverContent flex w-52 flex-col items-center justify-center border-2 border-white/50 bg-neutral-950 p-4"
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

// create a array insted of ten element and this element hex opacity value
/**
 * Opacity Value	Hex Code
100	FF
99	FC
98	FA
97	F7
96	F5
95	F2
94	F0
93	ED
92	EB
91	E8
90	E6
89	E3
88	E0
87	DE
86	DB
85	D9
84	D6
83	D4
82	D1
81	CF
80	CC
79	C9
78	C7
77	C4
76	C2
75	BF
74	BD
73	BA
72	B8
71	B5
70	B3
69	B0
68	AD
67	AB
66	A8
65	A6
64	A3
63	A1
62	9E
61	9C
60	99
59	96
58	94
57	91
56	8F
55	8C
54	8A
53	87
52	85
51	82
50	80
49	7D
48	7A
47	78
46	75
45	73
44	70
43	6E
42	6B
41	69
40	66
39	63
38	61
37	5E
36	5C
35	59
34	57
33	54
32	52
31	4F
30	4D
29	4A
28	47
27	45
26	42
25	40
24	3D
23	3B
22	38
21	36
20	33
19	30
18	2E
17	2B
16	29
15	26
14	24
13	21
12	1F
11	1C
10	1A
9	17
8	14
7	12
6	0F
5	0D
4	0A
3	08
2	05
1	03
0	00
 */

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
