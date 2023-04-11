/*************************************************
 * FreightRunner
 * @exports
 * @function MyCommunity.tsx
 * @extends Component
 * Created by Deepak B on 26/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useContext, useState } from "react";
import {
  View,
  ViewStyle,
  Dimensions,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  Linking,
  Platform,
  SafeAreaView,
} from "react-native";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import FastImage from "react-native-fast-image";
import Clipboard from "@react-native-clipboard/clipboard";

import Snackbar from "react-native-snackbar";
import { MyContext } from "../../context/MyContextProvider";
import FRHeader from "../../components/FRHeader";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
type Props = { navigation: any };

const MyCommunity: React.FC<Props> = ({ navigation }) => {
  const [popUp, setPopUp] = useState(false);
  const global = useContext(MyContext);
  const userProfileDetails =
    global.myState.userProfileDetails &&
    global.myState.userProfileDetails.partnerProfile;
  const [referralCode, setReferralCode] = useState(
    userProfileDetails?.partnerProfileDetails?.referral_code
  );

  const openWhatsApp = () => {
    let msg = referralCode;
    if (msg) {
      let url =
        `whatsapp://send?text=Hey! I am Using a Freight Runner Application Download the App with Below Link ` +
        encodeURIComponent("www.thefreightrunner.com") +
        " " +
        `Use Referral Code :` +
        encodeURIComponent(referralCode);
      Linking.openURL(url)
        .then((data) => {})
        .catch(() => {
          Snackbar.show({
            text: "Please install Whatsapp",
            duration: 2000,
          });
        });
    } else {
      Snackbar.show({
        text: "Please enter message",
        duration: 2000,
      });
    }
  };

  const openMail = () => {
    let msg = referralCode;
    if (msg) {
      let url =
        `mailto:?subject=Inviting you to FreightRunner&body=Hey! I am Using a Freight Runner Application Download the App with Below Link ` +
        encodeURIComponent("www.thefreightrunner.com") +
        " " +
        `Use Referral Code :` +
        encodeURIComponent(referralCode);
      Linking.openURL(url)
        .then((data) => {})
        .catch(() => {
          Snackbar.show({
            text: "Please install Mail App",
            duration: 2000,
          });
        });
    } else {
      Snackbar.show({
        text: "Please enter message",
        duration: 2000,
      });
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(referralCode);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <FRHeader title={"MY COMMUNITY"} fontSize={fontSizes.regular} />
      <View style={{ marginHorizontal: 20 }}>
        <Text
          style={{
            fontSize: fontSizes.xLarge,
            textAlign: "center",
            fontWeight: "600",
            marginTop: deviceHeight / 12,
            paddingHorizontal: deviceWidth / 40,
          }}
        >
          Invite Your friend / family to FreightRunner by
        </Text>
        <Text
          style={{
            fontSize: fontSizes.large,
            textAlign: "center",
            marginTop: deviceHeight / 15,
            color: "#808F99",
          }}
        >
          Referral Code
        </Text>
        {/* For long press copy text pop up styles here */}
        <View>
          {popUp && (
            <>
              <TouchableOpacity
                onPress={() => {
                  copyToClipboard();
                  setPopUp(false);
                }}
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  bottom: 35,
                  zIndex: 1,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    backgroundColor: colors.btnColor,
                    padding: 10,
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  Copy Text
                </Text>

                <View
                  style={{
                    backgroundColor: colors.btnColor,
                    height: 16,
                    width: 16,
                    alignSelf: "center",
                    transform: [
                      { rotateZ: "45deg" },
                      { translateY: Math.sqrt(200) * -1 },
                    ],
                  }}
                />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            onPress={() => {
              setPopUp(true);
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.xxLarge,
                textAlign: "center",
                marginTop: deviceHeight / 12,
                color: colors.black,
                fontWeight: "bold",
              }}
            >
              {referralCode}
            </Text>
          </TouchableOpacity>
        </View>
        {/* End */}
        <Text
          style={{
            fontSize: fontSizes.xSmall,
            textAlign: "center",
            marginTop: 15,
            color: colors.black,
          }}
        >
          Click the referral code to copy
        </Text>
      </View>
      <View style={{ flexDirection: "row", marginTop: deviceHeight / 7 }}>
        <View
          style={{
            backgroundColor: colors.greyLight,
            height: 1,
            flex: 1,
            alignSelf: "center",
          }}
        />
        <Text
          style={{
            alignSelf: "center",
            paddingHorizontal: 5,
            fontSize: fontSizes.small,
          }}
        >
          Share Via
        </Text>
        <View
          style={{
            backgroundColor: colors.greyLight,
            height: 1,
            flex: 1,
            alignSelf: "center",
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: deviceWidth / 3.5,
          marginTop: deviceHeight / 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            openWhatsApp();
          }}
        >
          <FastImage
            style={{
              width: 25,
              height: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
            source={require("../../assets/images/whatsapp.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            openMail();
          }}
        >
          <FastImage
            style={{
              width: 25,
              height: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
            source={require("../../assets/images/community_email.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (Platform.OS === "ios") {
              Linking.openURL(
                `sms://?&body=Hey! I am Using a Freight Runner Application Download the App with Below Link ` +
                  encodeURIComponent("www.thefreightrunner.com") +
                  " " +
                  `Use Referral Code :` +
                  encodeURIComponent(referralCode)
              );
            } else {
              Linking.openURL(
                `sms:?&body=Hey! I am Using a Freight Runner Application Download the App with Below Link ` +
                  encodeURIComponent("www.thefreightrunner.com") +
                  " " +
                  `Use Referral Code :` +
                  encodeURIComponent(referralCode)
              );
            }
          }}
        >
          <FastImage
            style={{
              width: 25,
              height: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
            source={require("../../assets/images/community_sms.png")}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

type StyleSet = {
  mainContainer: ViewStyle;
};

const styles = StyleSheet.create<StyleSet>({
  mainContainer: {
    backgroundColor: "#F5F4F7",
    flex: 1,
  },
});
export const hitSlopConfig = {
  top: 10,
  left: 10,
  bottom: 10,
  right: 10,
};

export default MyCommunity;
