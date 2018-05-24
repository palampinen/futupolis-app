import React from 'react';

import { castArray } from 'lodash';
import { Text } from 'react-native';

const fontStyles = [{ fontFamily: 'Futurice' }];

const MyText = ({ children, style, bold, ...props }) => (
  <Text
    style={[fontStyles.concat([bold ? { fontWeight: 'bold' } : {}]).concat(castArray(style))]}
    {...props}
  >
    {children}
  </Text>
);

export default MyText;
