import { StyleProp, Platform, TextStyle, Dimensions } from "react-native";
import colors from "./colors";

export const PLATFORM = Platform.OS;
export const DEVICE_WIDTH = Dimensions.get("window").width;
export const STANDARD_BORDER_RADIUS = 9;
export const STANDARD_PADDING = 20;

export const fontFamily = Platform.OS === "ios" ? "NunitoSans-Regular" : "NunitoSans-Regular";

export const appTheme = {
  colors: {
    primary: colors.primary,
    secondary: colors.secondary
  },
  Button: {
    buttonStyle: {
      borderRadius: STANDARD_BORDER_RADIUS,
      paddingHorizontal: 30,
      paddingVertical: 10
    },
    titleStyle: {
      fontFamily,
      fontSize: 18
    }
  },
  Input: {
    containerStyle: [{ height: 95, paddingHorizontal: 0 }],
    errorStyle: { fontFamily },
    inputContainerStyle: [
      {
        backgroundColor: colors.white,
        borderRadius: 16,
        height: 50,
        paddingLeft: 20
      }
    ]
  }
};

export const fontSizes = {
  xSmall: 12,
  small: 14,
  regular: 16,
  medium: 18,
  large: 20,
  xLarge: 24,
  xxLarge: 36
};

export const hitSlopConfig = {
  top: 10,
  left: 10,
  bottom: 10,
  right: 10
};

export const formLabel: StyleProp<TextStyle> = {
  color: colors.labelGray,
  fontWeight: "500",
  fontSize: 14
};
