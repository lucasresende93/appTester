import React from 'react';
import { SvgXml } from 'react-native-svg';

import bluetooth from './bluetooth.svg';
import colors from '../colors';

function Bluetooth({ width = 24, height = 24, color = colors.primary.white }) {
    return <SvgXml xml={bluetooth} fill={color} width={width} height={height} />;
  }

  const Icons = {
   
    Bluetooth,
  };
  
  export default Icons;