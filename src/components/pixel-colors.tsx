'use client'
import { parseColor } from 'react-stately';
import { ColorArea, ColorSlider, Flex } from '@adobe/react-spectrum';
import React from 'react';

function ColorPalette() {
  let [color, setColor] = React.useState(parseColor('#ff00ff'));
  let [redChannel, greenChannel, blueChannel] = color.getColorChannels();
  return (
      <Flex direction="column">
        <ColorArea
          xChannel={redChannel}
          yChannel={greenChannel}
          value={color}
          onChange={setColor}
        />
        <ColorSlider channel={blueChannel} value={color} onChange={setColor} />
        <ColorSlider channel="alpha" value={color} onChange={setColor} />
        <p>Current value: {color.toString('css')}</p>
      </Flex>
  );
}

export default ColorPalette;