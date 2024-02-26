import CardPreview from './components/card-preview'
import CustomCard from './components/custom-create'
import './App.css'

const colorData = [
  { firstColor: '#FF0000', secondColor: '#00FF00' },
  { firstColor: '#0000FF', secondColor: '#FFFF00' },
];


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

export default App
