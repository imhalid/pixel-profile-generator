import { useState } from "react";
const ColorPopup = () => {
  const [firstColor, setFirstColor] = useState("#2e222f");
  return (
    <div
      id="popUpContainer"
      className="z-20 flex w-fit items-center  gap-2 bg-neutral-900 px-2 py-1"
    >
      <button
        style={{
          backgroundColor: firstColor,
        }}
        id="popupButton"
        className="relative h-5 w-5 bg-red-500"
      />
      <div
        id="popUp"
        className="absolute left-0  top-10 min-h-16 min-w-28 bg-gray-800 p-4"
      >
        <ColorPalette />
        <input
          type="text"
          className="mt-2 w-full bg-white/10  p-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={firstColor}
          onChange={(e) => setFirstColor(e.target.value)}
        />
      </div>
      <p>{firstColor}</p>
    </div>
  );
};

const ColorPalette = () => {
  return (
    <div className="relative flex w-40 select-none flex-wrap" id="customcolor">
      {colors.map((color) => (
        <button
          key={color}
          style={{ backgroundColor: color }}
          className="h-5 w-5 hover:scale-105 focus:scale-105 focus:outline-none"
          onClick={() => console.log(color)}
        />
      ))}
    </div>
  );
};

export default ColorPopup;

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
