import React from 'react';
import { Text } from 'react-native';

const MyText = ({ children, style, bold, ...props }) => (
  <Text style={[{ fontFamily: bold ? 'Futurice-Bold' : 'Futurice-Regular' }, style]} {...props}>
    {children}
  </Text>
);

export default MyText;
