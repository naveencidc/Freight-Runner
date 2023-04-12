/*************************************************
 * FreightRunner
 * @exports
 * @function WelcomeScreen.tsx
 * @extends Component
 * Created by Naveen E on 05/07/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Alert,
  StyleSheet,
  ViewStyle,
  Platform,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ImageStyle,
  TextStyle,
  FlatList,
  Image,
  PermissionsAndroid,
  ScrollView,
  StatusBar
} from "react-native";
import { CheckBox, colors } from "react-native-elements";
import { Dropdown } from "react-native-material-dropdown";
import { withNavigation } from "react-navigation";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Button,
  CustomButton,
  LinkButton,
  Logo,
  Screen,
  SimpleInput as Input,
  Text,
  View
} from "../../components";
import { SessionContext } from "../../context/SessionContextProvider";
import { NavigationProps } from "../../navigation";
import { fontSizes, STANDARD_PADDING } from "../../styles/globalStyles";
import { extractError } from "../../utilities/errorUtilities";
import colors1 from "../../styles/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FastImage from "react-native-fast-image";
import { SnackbarContext, SnackbarContextType } from "../../context/SnackbarContext";
import storage from "../../helpers/storage";
var axios = require("axios");
import LinearGradient from "react-native-linear-gradient";
import { MyContext } from "../../context/MyContextProvider";
import { getUserProfileDetails, updateOnbardingStatus } from "../../services/userService";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

type Props = NavigationProps;

function WelcomeScreen({ navigation }: Props) {
  const { setUser, setSetup, signOut } = useContext(SessionContext);
  const { setMessage, setVisible } = useContext<SnackbarContextType>(SnackbarContext);
  const global = useContext(MyContext);
  let userProfileDetails = global.myState.userProfileDetails;
  let userFirstName = userProfileDetails.partnerProfile?.partnerProfileDetails?.first_name;
  console.log("trying", userFirstName);

  useEffect(() => {
    try {
      async function fetchStateListAPI() {
        const userDetail = await storage.get("userData");
        await getUserProfileDetails(userDetail.user_id)
          .then(async (response: any) => {
            console.log("user profile status", response.data);
            global.myDispatch({ type: "GET_USER_PROFILE_DETAILS", payload: response.data });
          })
          .catch(e => {
            console.log("Navigation failed", e.response);
            navigation.navigate("Login");
          });
      }
      fetchStateListAPI();
    } catch (error) {
      Alert.alert("Error", "There was an error. Please try again.");
    }
  }, []);

  useEffect(() => {}, []);

  return (
    <Screen style={styles.container}>
      {/* <StatusBar backgroundColor={"white"} barStyle="dark-content" /> */}
      {/* <KeyboardAwareScrollView keyboardShouldPersistTaps="handled"> */}
      <View style={{ flex: 1 }}>
        <LinearGradient
          start={{ x: 0, y: -0.5 }}
          end={{ x: 0, y: 1 }}
          colors={["#000000", "#353535"]}
          style={{
            flex: 0.35,
            backgroundColor: colors1.background,
            paddingLeft: 20,
            justifyContent: "flex-end"
          }}
        >
          <FastImage
            resizeMode={"contain"}
            source={require("../../../app/assets/images/fr_new_logo.png")}
            style={{
              // alignSelf: "center",
              width: 220,
              height: 100
            }}
          />
        </LinearGradient>
        <View
          style={{ flex: 1, flexDirection: "column", padding: 15, backgroundColor: colors1.white }}
        >
          <View style={{ paddingVertical: 20 }}>
            {userFirstName && userFirstName.length ? (
              <Text style={styles.headerText}>{userFirstName},</Text>
            ) : null}

            <Text style={styles.headerText}>Welcome to the FreightRunner</Text>
            <Text style={styles.headerText}>Family :)</Text>
          </View>

          <Text
            style={{ fontSize: fontSizes.xSmall, paddingRight: deviceWidth / 10, color: "#757E8E" }}
          >
            We are extremely happy to welcome you to FreightRunner Partner Family. Thank you so much
            for your patience. We hope you have a great time with us :).
          </Text>
          <Text style={{ fontSize: fontSizes.xSmall, color: "#757E8E", marginVertical: 15 }}>
            You are all set to hit the road
          </Text>
          <Text
            style={{ fontSize: fontSizes.xSmall, color: "#757E8E", paddingRight: deviceWidth / 10 }}
          >
            You can reach out to us at +1(313) 627 2212 if you have any questions.
          </Text>
        </View>
      </View>
      <View style={{ padding: deviceHeight / 50 }}>
        <CustomButton
          titleColor={colors1.white}
          borderColor=""
          onPress={async () => {
            const userDetail = await storage.get("userData");
            const updateOnbardingStatusResponse = await updateOnbardingStatus({
              user_id: userDetail.user_id,
              is_onboard_pending: 1,
              completed_step: 8,
              is_welcome_screen_viewed: 1
            });
            navigation.navigate("Home");
          }}
          title="Take me to Dashboard"
          backgroundColor={colors1.btnColor}
        ></CustomButton>
      </View>
    </Screen>
  );
}

type Styles = {
  container: ViewStyle;
  headerText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: "white"
    // paddingHorizontal: STANDARD_PADDING
  },
  headerText: {
    color: colors1.background,
    fontWeight: "600",
    fontSize: 22
  }
});

export default withNavigation(WelcomeScreen);
