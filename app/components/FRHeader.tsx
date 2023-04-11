import React from "react";
import { Dimensions, StyleSheet, Text, ViewStyle, View, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import colors from "../styles/colors";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

type Props = {
  title: string;
  fontSize: number;
  fontWeight: string;
  rightOnPress(): void;
};

const FRHeader: React.FC<Props> = ({ fontSize, title, fontWeight, rightOnPress }) => {
  return (
    <View style={styles.mainView}>
      <View style={{ flex: 1 }}></View>
      <Text
        style={{
          flex: 1,
          fontSize: fontSize,
          alignSelf: "center",
          fontWeight: fontWeight,
          textAlign: "center"
        }}
      >
        {title}
      </Text>
      <View style={{ flex: 1, marginTop: -8, alignItems: "flex-end" }}>
        {title === "MY PROFILE" ? (
          <TouchableOpacity onPress={rightOnPress}>
            <FastImage
              resizeMode={"contain"}
              source={require("../../app/assets/images/siren.png")}
              style={{ height: 28, width: 28, marginRight: 10 }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

type Styles = {
  mainView: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  mainView: {
    paddingVertical: deviceHeight / 45,
    backgroundColor: colors.white,
    // paddingBottom: 10,
    flexDirection: "row"
  }
});

export default FRHeader;
