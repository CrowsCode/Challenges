
import React, { useState } from 'react';
import './Main.scss';

import CircularSlider from '@fseehawer/react-circular-slider';//https://github.com/fseehawer/react-circular-slider

const DEFAULT_OPTIONS = [
  {
    name: 'Brightness',
    property: 'brightness',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Contrast',
    property: 'contrast',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Saturation',
    property: 'saturate',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Grayscale',
    property: 'grayscale',
    value: 0,
    range: {
      min: 0,
      max: 100
    },
    unit: '%'
  },
  {
    name: 'Sepia',
    property: 'sepia',
    value: 0,
    range: {
      min: 0,
      max: 100
    },
    unit: '%'
  },
  {
    name: 'Hue Rotate',
    property: 'hue-rotate',
    value: 0,
    range: {
      min: 0,
      max: 360
    },
    unit: 'deg'
  },
  {
    name: 'Blur',
    property: 'blur',
    value: 0,
    range: {
      min: 0,
      max: 20
    },
    unit: 'px'
  }
]

function Main() {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const selectedOption = options[selectedOptionIndex]

  function handleSliderChange({ target }) {
    setOptions(prevOptions => {
      return prevOptions.map((option, index) => {
        if (index !== selectedOptionIndex) return option
        return { ...option, value: target.value }
      })
    })
  }

  function getImageStyle() {
    const filters = options.map(option => {
      return `${option.property}(${option.value}${option.unit})`
    })

    return { filter: filters.join(' ') }
  }

  let loadFile = function(event) {
    let image = document.getElementById('image');
    // image.src = URL.createObjectURL(event.target.files[0]);
    image.style.backgroundImage = `url(  ${URL.createObjectURL(event.target.files[0])  })`;
  };

  console.log(getImageStyle())


  let handle_rotate = function(value){
    let image = document.getElementById('image');
    image.style.transform = `rotate(${value}deg)`;
  }
  let handle_scale = function(value){
    let image = document.getElementById('image');
    image.style.transform = `scale(${value/10})`;
  }

  return (
    <div id="container">

     

      <div id="img-and-buttons">
        <div id="buttons">
          <div id="buttons-upload">
            <div id="buttons-image-and-upload">
              <input  type="file"  accept="image/*" name="image" id="file"  onChange={(e) => {loadFile(e)}} style={{display: "none"}} />
              <label for="file" style={{cursor: "pointer"}} >Upload Image</label>
            </div>
          </div>
        </div>
        <div id="image-container">
          <img id="image" style={getImageStyle()} />
        </div>
        
      </div>
    

      
      

      <div id="rotate-and-size">
          <CircularSlider
              width={150}
              label="Rotate"
              min={0}
              max={360}
              dataIndex={0}
              appendToValue="°"
              labelColor="#e84545"
              labelBottom={false}
              knobColor="#ffcc57"
              knobSize={30}
              progressColorFrom="#e84545"
              progressColorTo="#ffcc57"
              progressSize={12}
              trackColor="#53354a"
              trackSize={12}
              
              onChange={(value) => { handle_rotate(value) }}
          />
          <CircularSlider
            width={150}
              label="Scale"
              min={0}
              max={100}
              dataIndex={10}
              labelColor="#e84545"
              labelBottom={false}
              knobColor="#ffcc57"
              knobSize={30}
              progressColorFrom="#e84545"
              progressColorTo="#ffcc57"
              progressSize={12}
              trackColor="#53354a"
              trackSize={12}
              // labelFontSize={20}
              // valueFontSize={20}
              onChange={(value) => { handle_scale(value) }}
          />
        </div>
      
   

      <div id="sidebar-and-slider">
      <div id="slider-container">
          <input
            type="range"
            id="slider"
            min={selectedOption.range.min}
              max={selectedOption.range.max}
              value={selectedOption.value}  
            onChange={handleSliderChange}
          />
        </div>
        <div id="filters">
          {options.map((option, index) => {
            return (
              <button 
              key={index}
                className={`filters-button ${index === selectedOptionIndex ? 'active' : ''}`}
                onClick={() => setSelectedOptionIndex(index)}
              >
                {option.name}
              </button>
            )
          })}
        </div>
      </div>
        
     





    </div>
  )
}

export default Main;