import React from "react";
import { Dimensions, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/FontAwesome5Pro";
import { View } from ".";
import colors from "../styles/colors";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;



const TruckImages: React.FC = ({ }) => {
  return (
    <View style={{ position: 'absolute', flexDirection: 'row', marginTop: -deviceHeight / 15 }}>
    <FastImage
      source={require('../../app/assets/images/img3.png')}
      style={{ height: deviceHeight / 7.5, width: deviceWidth / 10.5, alignSelf: 'flex-end', marginRight: 5 }}
    />
    <FastImage
      source={require('../../app/assets/images/img4.png')}
      style={{ height: deviceHeight / 7.5, width: deviceWidth / 2.5, alignSelf: 'flex-end', marginRight: 5 }}
    />
    <FastImage
      source={require('../../app/assets/images/img2.png')}
      style={{ height: deviceHeight / 7.5, width: deviceWidth / 2.5, alignSelf: 'flex-end', marginRight: 5 }}
    />
    <FastImage
      source={require('../../app/assets/images/img1.png')}
      style={{ height: deviceHeight / 7.5, width: deviceWidth / 10.5, alignSelf: 'flex-end', marginRight: 5 }}
    />
  </View>
  );
};

type Styles = {
  titleText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  titleText: {
    textAlign: "center",
    fontWeight: 'bold',
  }
});

export default TruckImages;
