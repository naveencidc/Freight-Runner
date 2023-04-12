import React, { ReactNode, useEffect, useState } from "react";
import { Input as RNEInput, InputProps as RNEInputProps } from "react-native-elements";
import { FormikProps } from "formik";
import { NativeSyntheticEvent, TextInputFocusEventData, StyleSheet, ViewStyle } from "react-native";

import { Label } from ".";
import colors from "../styles/colors";

type InputProps = {
  formikProps: FormikProps<any>;
  label?: string;
  name: string;
  required?: boolean;
};

export type Props = InputProps & RNEInputProps;

function Input({ formikProps, label, name, required, ...props }: Props) {
  const { ...inputProps } = useFormikInput({
    formikProps,
    label,
    name,
    required
  });
  // Without this the effect doesn't run on first touch of the input
  const [initialFocus, setInitialFocus] = useState<boolean>(false);

  const input = React.createRef();
  const [borderColor, setBorderColor] = useState<string>(colors.white);
  useEffect(() => {
    if (formikProps.errors[name] && formikProps.touched[name]) {
      setBorderColor(colors.red);
      return;
      // @ts-ignore
    } else if (input.current.isFocused()) {
      setBorderColor(colors.primary);
      return;
    } else if (borderColor !== colors.white) {
      setBorderColor(colors.white);
    }
  }, [formikProps.errors, formikProps.touched, name, input, borderColor]);

  return (
    <RNEInput
      ref={input}
      onFocus={() => setInitialFocus(true)}
      {...props}
      {...inputProps}
      containerStyle={[props.containerStyle]}
      inputContainerStyle={[
        inputStyles.inputContainerStyle,
        { borderColor: borderColor },
        props.inputContainerStyle
      ]}
    />
  );
}

type InputStyleSheet = {
  inputContainerStyle: ViewStyle;
};

const inputStyles = StyleSheet.create<InputStyleSheet>({
  inputContainerStyle: {
    borderWidth: 2,
    backgroundColor: "white",
    borderBottomWidth: 2
  }
});

export default Input;

type FormikInput = {
  errorMessage?: string;
  label?: ReactNode;
  value?: string;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onChangeText?: (value: string) => void;
};

function useFormikInput({ formikProps, label, name, required }: InputProps): FormikInput {
  const { errors, setFieldTouched, setFieldValue, touched, values } = formikProps;
  const invalid = touched[name] && errors[name];

  const onBlur = (_: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFieldTouched(name);
  };

  const onChangeText = (value: string) => {
    setFieldValue(name, value);
  };

  return {
    errorMessage: (invalid && (errors[name] as string)) || undefined,
    label: <Label title={label || ""} required={required} />,
    value: values[name],
    onBlur,
    onChangeText
  };
}
