import "./App.css";
import CustomCard from "./components/custom-create";

function App() {
  return (
    <div className="App">
      <CustomCard />

      {/* {colorData.map((color, index) => {
        return (
          <CardPreview
            key={index}
            firstColor={color.firstColor}
            secondColor={color.secondColor}
            rotateDirection="to bottom right"
          />
        );
      })} */}
    </div>
  );
}

export default App;
