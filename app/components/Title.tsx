import React, { ReactNode } from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { Text, View } from ".";

type Props = {
  children?: ReactNode;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  type?: "h1" | "h2" | "h3" | "h4";
};

const Title: React.FC<Props> = ({
  children,
  containerStyle,
  labelStyle,
  type
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={labelStyle} type={type ? type : "h1"}>
        {children}
      </Text>
    </View>
  );
};

export default Title;

export type TitleStyleSheet = {
  container: ViewStyle;
};

const styles = StyleSheet.create<TitleStyleSheet>({
  container: {
    marginBottom: 30
  }
});
