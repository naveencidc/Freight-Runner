/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationUnderReviewScreen.tsx
 * @extends Component
 * Created by Naveen E on 17/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import React, { useContext, useEffect, useState } from "react";
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
} from "react-native";
import { Screen, Text, View } from "../../components";
import HeaderWithBack from "../../components/HeaderWithBack";
import FastImage from "react-native-fast-image";
import { socket } from "../../utilities/socketInst";
import storage from "../../helpers/storage";
import { navigateAndSimpleReset } from "../../utils/Utility";
import { MyContext } from "../../context/MyContextProvider";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

type FormProps = {
  email: string;
  role: string;
  terms_accepted: boolean;
};

const initialValues: FormProps = {
  email: "",
  role: "",
  terms_accepted: true,
};

function RegistrationUnderReviewScreen({ navigation, route }) {
  const global: any = useContext(MyContext);
  useEffect(() => {
    try {
      async function fetchAPI() {
        let userDetail: any = await storage.get("userData");
        //Socket to update OnBoarding Status
        socket.on(`global/partner/approval/${userDetail.user_id}`, (data) => {
          console.log("-OnBoarding Response-", data);
          if (data.status === 1) {
            navigation.navigate("TruckList", { isFromOnboarding: true });
          } else if (data.status === 4) {
            navigation.navigate("RegistrationRejectedScreen");
          }
        });
      }
      fetchAPI();
    } catch (error) {
      console.log("socket error", error);
    }
    return () => {
      async function remove() {
        let userDetail: any = await storage.get("userData");
        socket.off(`global/partner/approval/${userDetail.user_id}`);
      }
      remove();
    };
  }, []);

  const handleGoBack = async () => {
    await storage.remove("tokens");
    navigateAndSimpleReset("auth");
    global.myDispatch({
      type: "LOGOUT",
    });
  };

  return (
    <Screen style={styles.container}>
      <HeaderWithBack
        title="UNDER REVIEW"
        onPress={() => handleGoBack()}
        showOnlyHeader={false}
        isRightText={false}
        rightText="Contact Us"
        rightOnPress={() => navigation.navigate("ContactUs")}
      ></HeaderWithBack>
      {/* <KeyboardAwareScrollView keyboardShouldPersistTaps="handled"> */}
      <View style={{ flex: 1 }}>
        <View
          style={{ paddingVertical: deviceHeight / 12, alignItems: "center" }}
        >
          <Text
            style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
          >
            Thanks for filling out the application.
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              paddingHorizontal: deviceWidth / 20,
            }}
          >
            We are reviewing your application and will notify you as soon as we
            have any update.
          </Text>
        </View>
        <View style={{ alignItems: "center", flex: 0.85 }}>
          <FastImage
            resizeMode={"contain"}
            source={require("../../../app/assets/images/underReview.png")}
            style={{
              alignSelf: "center",
              height: deviceHeight / 3,
              width: deviceHeight / 3,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ContactUs")}
          style={{ paddingVertical: deviceHeight / 35 }}
        >
          <Text
            style={{
              color: "black",
              textAlign: "center",
              textDecorationLine: "underline",
            }}
          >
            Contact Us
          </Text>
        </TouchableOpacity>
      </View>
      {/* </KeyboardAwareScrollView> */}
    </Screen>
  );
}

type Styles = {
  container: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: "white",
    // paddingHorizontal: STANDARD_PADDING
  },
});

export default RegistrationUnderReviewScreen;
