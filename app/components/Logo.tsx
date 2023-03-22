import React from 'react';
import {View, ViewStyle, StyleSheet, Image, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';

type Props = {
  width?: number;
  height?: number;
};

function Logo({isfromForgot}: Props) {
  return (
    <View style={style.containerStyle}>
      {/* <Image
        source={Logos.brandAndText}
        resizeMode="contain"
        style={{ width: width || 520, height: height || 125 }}
      /> */}
      <FastImage
        style={{
          width: Platform.OS === 'android' ? 280 : 220,
          height: Platform.OS === 'android' ? 180 : 100,
        }}
        source={require('../assets/images/logo_new.png')}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
}

export default Logo;

type LogoStyleSheet = {
  containerStyle: ViewStyle;
};

const style = StyleSheet.create<LogoStyleSheet>({
  containerStyle: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
