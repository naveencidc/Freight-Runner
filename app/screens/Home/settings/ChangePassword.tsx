/*************************************************
 * FreightRunner
 * @exports
 * @function ChangePassword.tsx
 * @extends Component
 * Created by Naveen E on 06/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

"use strict";

import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import {
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import {
  SimpleInput as Input,
  Text,
  Logo,
  Screen,
  View,
  CustomButton,
  TruckImages,
} from "../../../components";
import Icon from "react-native-vector-icons/FontAwesome5";
import colors from "../../../styles/colors";
import { DEVICE_WIDTH, fontSizes } from "../../../styles/globalStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  resetPassword,
  changePassword,
} from "../../../services/registrationService";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../../context/SnackbarContext";
import FastImage from "react-native-fast-image";
import HeaderWithBack from "../../../components/HeaderWithBack";
import storage from "../../../helpers/storage";
import { MyContext } from "../../../context/MyContextProvider";
import { navigateAndSimpleReset } from "../../../utils/Utility";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

function ChangePassword({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [checkMaxLength, setCheckMaxLength] = useState(false);
  const [checkNumber, setCheckNumber] = useState(false);
  const [checkCapitalLetter, setCheckCapitalLetter] = useState(false);
  const [checkSpecialCharacter, setSpecialCharacter] = useState(false);
  const [newHidePass, setNewHidePass] = useState(false);
  const [confirmHidePass, setConfirmHidePass] = useState(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [oldPassword, setoldPassword] = useState<string>("");
  const [oldHidePass, setoldHidePass] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isShowError, setisShowError] = useState(false);
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const global: any = useContext(MyContext);
  let resetToken: String;
  resetToken = route.params?.resetToken;
  console.log(resetToken, "RESET___TOKEN");

  const validateResetPassword = async () => {
    if (oldPassword.trim().length < 8 && oldPassword.trim().length === 0) {
      Alert.alert("Error", "Please enter your old password");
    }
    if (newPassword.trim().length < 8 && confirmPassword.trim().length === 0) {
      Alert.alert("Error", "Please enter your confirm password");
    } else if (newPassword !== confirmPassword) {
      Alert.alert("", "New Password and Confirm New Password do not match!");
    } else {
      setLoading(true);
      await changePassword({
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      })
        .then(async (response) => {
          setLoading(false);
          console.log("RESET password response", response);
          if (response.status === 200) {
            setLoading(false);
            setMessage("Password Updated Successfully");
            setVisible(true);
            await storage.remove("tokens");
            navigateAndSimpleReset("auth");
            global.myDispatch({
              type: "LOGOUT",
            });
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log("Reset Password Error", e.response);
          Alert.alert("Error", e.response.data.message);
        });
    }
  };

  const _verifyPassword = (newPwd) => {
    setNewPassword(newPwd);
    if (newPwd.match(/[A-Z]/) != null) {
      setCheckCapitalLetter(true);
    } else {
      setCheckCapitalLetter(false);
    }
    if (newPwd.match(/[0-9]/) != null) {
      setCheckNumber(true);
    } else {
      setCheckNumber(false);
    }
    if (newPwd.match(/[~!@#$%^&*+=_?/<>.,`:;"'-]/)) {
      setSpecialCharacter(true);
    } else {
      setSpecialCharacter(false);
    }
    if (
      checkCapitalLetter &&
      checkNumber &&
      checkSpecialCharacter &&
      checkMaxLength &&
      newPwd.length > 7
    ) {
      setCheckMaxLength(true);
    } else if (newPwd.length > 7) {
      setCheckMaxLength(true);
    } else {
      setCheckMaxLength(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        title="SETTINGS"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText={""}
        isFrom={""}
        rightOnPress={() => {}}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={{ paddingHorizontal: 20 }}>
            <View style={{ paddingVertical: 15 }}>
              <Text style={{ fontSize: fontSizes.medium, fontWeight: "600" }}>
                Change Password
              </Text>
            </View>
            <View style={styles.textInputView}>
              <Text
                style={{
                  fontSize: fontSizes.small,
                  fontWeight: "500",
                  color: "gray",
                }}
              >
                Old Password
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  style={{
                    padding: 0,
                    fontWeight: "600",
                    fontSize: fontSizes.regular,
                    flex: 1,
                    marginTop: 5,
                  }}
                  onChangeText={(newPwd) => {
                    setoldPassword(newPwd);
                  }}
                  value={oldPassword}
                  placeholder=""
                  keyboardType="default"
                  maxLength={20}
                  secureTextEntry={!oldHidePass ? true : false}
                />

                <Icon
                  name={!oldHidePass ? "eye-slash" : "eye"}
                  size={16}
                  color={colors.background}
                  style={{ alignItems: "center", justifyContent: "center" }}
                  onPress={() => setoldHidePass(!oldHidePass)}
                />
              </View>
            </View>

            <View
              style={[
                styles.textInputView,
                { marginVertical: deviceHeight / 60 },
              ]}
            >
              <Text
                style={{
                  fontSize: fontSizes.small,
                  fontWeight: "500",
                  color: "gray",
                }}
              >
                New Password
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  style={{
                    padding: 0,
                    fontWeight: "600",
                    fontSize: fontSizes.regular,
                    flex: 1,
                    marginTop: 5,
                  }}
                  // onEndEditing={() => {
                  //   if (confirmPassword.trim().length && newPassword !== confirmPassword) {
                  //     setisShowError(true);
                  //   } else {
                  //     setisShowError(false);
                  //   }
                  // }}
                  onChangeText={(newPwd) => {
                    _verifyPassword(newPwd);
                  }}
                  value={newPassword}
                  placeholder=""
                  keyboardType="default"
                  maxLength={20}
                  returnKeyType="done"
                  secureTextEntry={!newHidePass ? true : false}
                />

                <Icon
                  name={!newHidePass ? "eye-slash" : "eye"}
                  size={16}
                  color={colors.background}
                  style={{ alignItems: "center", justifyContent: "center" }}
                  onPress={() => setNewHidePass(!newHidePass)}
                />
              </View>
            </View>
            {checkCapitalLetter &&
            checkNumber &&
            checkSpecialCharacter &&
            checkMaxLength ? null : (
              <View style={{}}>
                <Text style={{ fontSize: fontSizes.regular }}>
                  Password must:
                </Text>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <FastImage
                    style={{ width: 18, height: 18, alignSelf: "center" }}
                    source={
                      checkMaxLength
                        ? require("../../../assets/images/passwordChecked.png")
                        : require("../../../assets/images/passwordUnchecked.png")
                    }
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <Text
                    style={{ fontSize: fontSizes.small, paddingHorizontal: 10 }}
                  >
                    Be a minimum of eight character
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <FastImage
                    style={{ width: 18, height: 18, alignSelf: "center" }}
                    source={
                      checkCapitalLetter
                        ? require("../../../assets/images/passwordChecked.png")
                        : require("../../../assets/images/passwordUnchecked.png")
                    }
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <Text
                    style={{ fontSize: fontSizes.small, paddingHorizontal: 10 }}
                  >
                    Have at least one capital letter
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <FastImage
                    style={{ width: 18, height: 18, alignSelf: "center" }}
                    source={
                      checkNumber
                        ? require("../../../assets/images/passwordChecked.png")
                        : require("../../../assets/images/passwordUnchecked.png")
                    }
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <Text
                    style={{ fontSize: fontSizes.small, paddingHorizontal: 10 }}
                  >
                    Have at least one number
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <FastImage
                    style={{ width: 18, height: 18, alignSelf: "center" }}
                    source={
                      checkSpecialCharacter
                        ? require("../../../assets/images/passwordChecked.png")
                        : require("../../../assets/images/passwordUnchecked.png")
                    }
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <Text
                    style={{ fontSize: fontSizes.small, paddingHorizontal: 10 }}
                  >
                    Have at least one special character
                  </Text>
                </View>
              </View>
            )}

            <View
              style={[
                styles.textInputView,
                { marginVertical: deviceHeight / 60 },
              ]}
            >
              <Text
                style={{
                  fontSize: fontSizes.small,
                  fontWeight: "500",
                  color: "gray",
                }}
              >
                Confirm New Password
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  secureTextEntry={!confirmHidePass ? true : false}
                  style={{
                    padding: 0,
                    fontWeight: "600",
                    fontSize: fontSizes.regular,
                    flex: 1,
                    marginTop: 5,
                  }}
                  // onEndEditing={e => {
                  //   if (confirmPassword !== newPassword) {
                  //     setisShowError(true);
                  //   } else {
                  //     setisShowError(false);
                  //   }
                  // }}
                  //   onSubmitEditing={event => {
                  //     Alert.alert("naveen");
                  //     if (confirmPassword !== newPassword) {
                  //       setisShowError(true);
                  //     } else {
                  //       setisShowError(false);
                  //     }
                  //   }}
                  onChangeText={(confirmPwd) => {
                    setConfirmPassword(confirmPwd);
                  }}
                  value={confirmPassword}
                  placeholder=""
                  maxLength={20}
                  keyboardType="default"
                />
                <Icon
                  name={!confirmHidePass ? "eye-slash" : "eye"}
                  size={16}
                  color={colors.background}
                  style={{ alignItems: "center", justifyContent: "center" }}
                  onPress={() => setConfirmHidePass(!confirmHidePass)}
                />
              </View>
            </View>
            {/* {isShowError ? (
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 10,
                  color: "red",
                  alignSelf: "center",
                  fontFamily: Platform.OS === "ios" ? "NunitoSans-Regular" : "NunitoSans-Regular"
                }}
              >
                New Password and Confirm New Password do not match!
              </Text>
            ) : null} */}
            <View style={{ marginVertical: deviceHeight / 30 }}>
              <CustomButton
                titleColor={colors.white}
                borderColor={
                  checkCapitalLetter &&
                  checkNumber &&
                  checkSpecialCharacter &&
                  checkMaxLength
                    ? "#1F1F1F"
                    : "#454545"
                }
                onPress={() => validateResetPassword()}
                title="Submit"
                backgroundColor={
                  checkCapitalLetter &&
                  checkNumber &&
                  checkSpecialCharacter &&
                  checkMaxLength &&
                  oldPassword.trim().length > 0 &&
                  confirmPassword.trim().length > 0
                    ? "#1F1F1F"
                    : "#454545"
                }
                btnLoading={loading}
                disableButton={
                  checkCapitalLetter &&
                  checkNumber &&
                  checkSpecialCharacter &&
                  checkMaxLength &&
                  oldPassword.trim().length > 0 &&
                  confirmPassword.trim().length > 0
                    ? false
                    : true
                }
              ></CustomButton>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // paddingHorizontal: STANDARD_PADDING
  },
  buttons: {
    alignSelf: "center",
    width: "95%",
  },
  passwordViewContainer: {
    flexDirection: "column",
  },
  passwordMustMainContainer: {
    flexDirection: "column",
  },
  passwordMustContainer: {
    flexDirection: "row",
  },
  confirmPasswordContainer: {
    flexDirection: "column",
    marginTop: 25,
  },
  passwordMustIcon: {
    marginTop: 10,
  },
  icon: {
    marginTop: -40,
    left: DEVICE_WIDTH - 65,
  },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  textInputView: {
    paddingHorizontal: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#F5F4F7",
    borderColor: "#EDEDED",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: deviceHeight / 50,
    borderRadius: 8,
    shadowOffset: { width: -2, height: 2 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export const ChangePasswordValidator = yup.object().shape({
  password: yup.string().required("Please provide your password."),
  confirmPassword: yup
    .string()
    .required("Please provide your confirmPassword."),
});
