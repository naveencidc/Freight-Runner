/*************************************************
 * FreightRunner
 * @exports
 * @function Landing.tsx
 * @extends Component
 * Created by Naveen E on 04/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

"use strict";

import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ViewStyle,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Text, Logo, View, CustomButton } from "../components";
import colors from "../styles/colors";
import {
  PLATFORM,
  STANDARD_PADDING,
  DEVICE_WIDTH,
  fontFamily,
} from "../styles/globalStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FastImage from "react-native-fast-image";
import { Images } from "../assets/images";
import { MyContext } from "./../../app/context/MyContextProvider";
import deviceInfoModule from "react-native-device-info";
import Config from "react-native-config";
import { navigateAndSimpleReset } from "../utils/Utility";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

function Landing({ navigation }: any) {
  const global: any = useContext(MyContext);
  console.log(global.myState);

  useEffect(() => {
    getLocationPermissions();
  });

  const getLocationPermissions = async () => {
    if (PLATFORM === "ios") return;

    try {
      const permissionsGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (permissionsGranted === true) return;

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Please allow location access.",
          message:
            "This app needs to access your location to function properly. Please allow location access.",
          buttonPositive: "Allow",
          buttonNegative: "Deny",
        }
      );
    } catch (err) {
      //
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        indicatorStyle="white"
      >
        <View style={{ paddingTop: deviceHeight / 9 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <FastImage
              source={Images.blackTruck}
              style={{
                height: deviceHeight / 7.5,
                width: deviceWidth / 2.05,
                alignSelf: "flex-end",
              }}
            />
            <FastImage
              source={Images.redTruck}
              style={{ height: deviceHeight / 7, width: deviceWidth / 2.05 }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: deviceHeight / 90,
              justifyContent: "space-between",
            }}
          >
            <FastImage
              source={Images.longTruck}
              style={{ height: deviceHeight / 5.5, width: deviceWidth / 1.65 }}
            />
            <FastImage
              source={Images.brownTruck}
              style={{ height: deviceHeight / 8, width: deviceWidth / 2.7 }}
            />
          </View>
        </View>
        <Logo />
        <View
          style={{
            paddingHorizontal: deviceWidth / 20,
            marginTop: deviceHeight / 40,
          }}
        >
          <CustomButton
            titleColor={colors.white}
            borderColor={colors.white}
            onPress={() => navigateAndSimpleReset("auth")}
            title="Login"
            backgroundColor={colors.background}
          ></CustomButton>
          <View style={{ marginTop: deviceHeight / 35 }}>
            <CustomButton
              titleColor={colors.white}
              borderColor={colors.white}
              onPress={() =>
                navigation.navigate("RegistrationPersonalDetailScreen")
              }
              title="Become a Partner"
              backgroundColor={colors.background}
            ></CustomButton>
          </View>
        </View>
        <View style={{ paddingHorizontal: 40, marginTop: deviceHeight / 60 }}>
          <Text style={{ color: colors.white, textAlign: "center" }}>
            By contiuing, you agree to FreightRunner's{" "}
            <Text
              onPress={() =>
                navigation.navigate("termsOfService", { isFrom: "Landing" })
              }
              style={styles.underlineBoldText}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              onPress={() =>
                navigation.navigate("PrivacyPolicyScreen", {
                  isFrom: "Landing",
                })
              }
              style={styles.underlineBoldText}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ContactUs", { isFrom: "landing" })
          }
          style={{
            marginTop: deviceHeight / 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.white,
              textAlign: "center",
              textDecorationLine: "underline",
            }}
          >
            Contact Us
          </Text>
        </TouchableOpacity>
        <View style={{ paddingRight: 10 }}>
          <Text style={{ textAlign: "right", color: colors.white }}>
            {Config.API_HOST.includes("dev")
              ? "Dev"
              : Config.API_HOST.includes("stage")
              ? "Stage"
              : ""}{" "}
            V {deviceInfoModule.getVersion()}
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default Landing;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    backgroundColor: colors.background,
    flex: 1,
  },
  buttons: {
    alignSelf: "center",
    marginTop: 10,
    width: "95%",
  },
  bottom: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  signUpButton: {
    marginTop: Platform.OS === "ios" ? -33 : -35,
    fontSize: 18,
    textDecorationLine: "underline",
    fontFamily: "NunitoSans-Regular",
  },
  forgotPasswordContainer: {
    paddingLeft: 2,
    marginTop: 25,
    marginBottom: STANDARD_PADDING,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 13,
    textDecorationLine: "underline",
    fontFamily: "NunitoSans-Regular",
  },
  name: {
    fontSize: 14,
    fontFamily: "NunitoSans-Regular",
  },
  passwordViewContainer: {
    flexDirection: "column",
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
  underlineBoldText: {
    color: colors.white,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
