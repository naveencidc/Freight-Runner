import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextProps,
  TextStyle,
} from 'react-native';

import colors, {Color} from '../styles/colors';
import {fontSizes} from '../styles/globalStyles';

type Props = {
  color?: Color;
  style?: StyleProp<TextStyle>;
  type?: 'h1' | 'h2' | 'h3' | 'h4';
  weight?: 'bold' | 'semibold';
} & TextProps;

const Text: React.FC<Props> = ({
  color = colors.mainText,
  style,
  type = 'body',
  weight,
  ...props
}) => {
  const fontFamily = () => {
    if (weight === 'bold') {
      return Platform.OS === 'ios' ? 'NunitoSans-Bold' : 'NunitoSans-Bold';
    } else if (weight === 'semibold') {
      return Platform.OS === 'ios'
        ? 'NunitoSans-Semibold'
        : 'NunitoSans-Semibold';
    }
    return Platform.OS === 'ios' ? 'NunitoSans-Regular' : 'NunitoSans-Regularr';
  };

  const fontWeight = () => {
    if (weight === 'semibold') {
      return '600';
    } else if (weight === 'bold') {
      return '700';
    }
    return '400';
  };

  const typeProperties = (): [number, number, '600'?] => {
    if (type === 'h1') {
      return [44, fontSizes.xxLarge];
    } else if (type === 'h2') {
      return [36, fontSizes.xLarge, '600'];
    } else if (type === 'h3') {
      return [36, fontSizes.large, '600'];
    } else if (type === 'h4') {
      return [24, fontSizes.regular, '600'];
    }
    return [24, fontSizes.regular];
  };

  const [lineHeight, size, textWeight] = typeProperties();

  const styles = StyleSheet.create({
    text: {
      color: color,
      // fontFamily: fontFamily(),
      fontSize: size,
      ...Platform.select({
        android: {
          fontWeight: textWeight || fontWeight(),
        },
      }),
    },
  });

  return (
    <RNText style={[styles.text, style]} {...props}>
      {props.children}
    </RNText>
  );
};

export default Text;
