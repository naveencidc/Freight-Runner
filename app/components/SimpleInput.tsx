import React from "react";
import { StyleSheet, TextInput, TextInputProps, ViewStyle } from "react-native";
import { View, Text } from ".";
import { formLabel, STANDARD_BORDER_RADIUS } from "../styles/globalStyles";
import colors from "../styles/colors";
import { fontFamily } from "../styles/globalStyles";

type Props = TextInputProps & {
  containerStyle?: ViewStyle;
  disabled?: boolean;
  error?: string;
  label: string;
  isFrom: string;
};

const SimpleInput: React.FC<Props> = props => {
  return (
    <View
      style={[
        props.isFrom === "TruckDetailScreen" ? null : styles.inputContainer,
        props.containerStyle ? props.containerStyle : null,
        props.disabled ? styles.disabledContainer : null,
        {
          flex: 1
        }
      ]}
    >
      {props.label ? (
        <Text
          weight={props.isFrom === "TruckDetailScreen" ? null : "bold"}
          style={[formLabel, { color: props.error ? colors.red : colors.labelGray }]}
        >
          {props.error || props.label}
        </Text>
      ) : null}
      <TextInput
        editable={props.disabled ? false : true}
        maxLength={props.maxLength}
        keyboardType={props.keyboardType}
        multiline={props.multiline}
        style={[styles.inputStyle, props.style, props.error ? styles.errorState : null]}
        textAlignVertical={props.multiline ? "top" : undefined}
        {...props}
      />
    </View>
  );
};

type Styles = {
  disabledContainer: ViewStyle;
  errorState: ViewStyle;
  inputContainer: ViewStyle;
  inputStyle: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  disabledContainer: {
    opacity: 0.5
  },
  errorState: {
    borderColor: colors.red,
    borderWidth: 1
  },
  inputContainer: {
    marginBottom: 0
  },
  inputStyle: {
    backgroundColor: colors.white,
    borderRadius: STANDARD_BORDER_RADIUS,
    color: colors.mainText,
    fontFamily,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16
  }
});

export default SimpleInput;
