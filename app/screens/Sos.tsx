/*************************************************
 * FreightRunner
 * @exports
 * @function Sos.tsx
 * @extends Component
 * Created by Naveen E on 06/12/2022
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
  Linking,
} from "react-native";
import { CustomButton, Screen, Text, View } from "../components";
import { fontSizes, formLabel, STANDARD_PADDING } from "../styles/globalStyles";
import colors1 from "../styles/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import HeaderWithBack from "../components/HeaderWithBack";
import FastImage from "react-native-fast-image";
import StandardModal from "../components/StandardModal";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

function SosScreen({ navigation, route }) {
  let isFrom = route.params?.isFrom;
  const [showAlert, setshowAlert] = useState(false);
  const [isVoiceAlert, setisVoiceAlert] = useState(false);
  const [isTextAlert, setisTextAlert] = useState(false);
  const [showMessageInput, setshowMessageInput] = useState(false);
  const [messageText, setmessageText] = useState("");
  return (
    <Screen style={styles.container}>
      <HeaderWithBack
        title="SOS ALERT"
        onPress={() => {
          if (isFrom === "landing") {
            navigation.navigate("Landing");
          } else {
            navigation.goBack();
          }
        }}
        showOnlyHeader={false}
        isRightText={false}
        rightText="SELECT ALL"
        rightOnPress={() => navigation.goBack()}
      ></HeaderWithBack>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}></View>
        <FastImage
          resizeMode={"contain"}
          source={require("../../app/assets/images/bell.png")}
          style={{ height: 120, width: 120, alignSelf: "center" }}
        />
        <Text
          style={{
            color: colors1.background,
            paddingHorizontal: 10,
            fontSize: fontSizes.xxLarge,
            fontWeight: "600",
            textAlign: "center",
            paddingVertical: 20,
          }}
        >
          Emergency help Needed?
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ alignItems: "center", marginVertical: 20 }}>
            <Text
              style={{
                color: colors1.background,
                paddingHorizontal: 15,
                fontSize: fontSizes.medium,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              How do you want to send an emergency alert to our Customer Service
              ?
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
          <CustomButton
            titleColor={colors1.white}
            borderColor=""
            // onPress={{}}
            onPress={() => {
              setisTextAlert(false);
              setisVoiceAlert(true);
              setshowAlert(true);
            }}
            title="Voice"
            backgroundColor={colors1.background}
            btnLoading={false}
          ></CustomButton>
        </View>

        <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
          <CustomButton
            titleColor={colors1.background}
            borderColor=""
            // onPress={{}}
            onPress={() => {
              setisTextAlert(true);
              setshowAlert(true);
            }}
            title="Text"
            backgroundColor={colors1.white}
            btnLoading={false}
          ></CustomButton>
        </View>
      </View>

      {/* Model for sos Start here*/}
      <StandardModal
        visible={showAlert}
        handleBackClose={() => {
          setshowAlert(false);
        }}
      >
        <KeyboardAwareScrollView>
          <View>
            <Text
              style={{
                fontSize: fontSizes.large,
                fontWeight: "700",
                color: "black",
              }}
            >
              Sos Alert
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: fontSizes.medium,
                fontWeight: "400",
                marginVertical: deviceHeight / 40,
              }}
            >
              {isTextAlert
                ? showMessageInput
                  ? "Type in here the message that you would like to pass on to the customer service"
                  : "Are you sure want to send an emergency alert message to our customer service?"
                : "Are you sure want to send an emergency alert call to our customer service?"}
            </Text>
            {showMessageInput ? (
              <>
                <View
                  style={{
                    backgroundColor: "#F5F4F7",
                    borderColor: "#EDEDED",
                    borderWidth: 1,
                    height: 100,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    // marginBottom: deviceHeight / 40
                  }}
                >
                  <Text
                    style={{
                      color: "#858C97",
                      fontSize: fontSizes.small,
                      fontWeight: "500",
                    }}
                  >
                    Message
                  </Text>
                  <TextInput
                    placeholder="Enter the Message"
                    multiline
                    numberOfLines={3}
                    maxLength={250}
                    onChangeText={(text) => setmessageText(text)}
                    value={messageText}
                    style={{
                      fontSize: fontSizes.regular,
                      padding: 0,
                      textAlignVertical: "top",
                      height: 65,
                      fontWeight: Platform.OS === "android" ? "400" : "500",
                    }}
                    keyboardType="default"
                    returnKeyType="next"
                    onSubmitEditing={() => {}}
                  />
                </View>
                <View style={{ alignItems: "flex-end", marginTop: 5 }}>
                  <Text style={{ fontSize: 12 }}>{messageText.length}/250</Text>
                </View>
              </>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    setshowMessageInput(false);
                    setmessageText("");
                    setshowAlert(false);
                  }}
                  style={{
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: "#B60F0F",
                  }}
                >
                  <Text
                    style={{
                      color: "#B60F0F",
                      textAlign: "center",
                      fontSize: fontSizes.medium,
                      fontWeight: "600",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, paddingLeft: 10 }}>
                <TouchableOpacity
                  disabled={
                    showMessageInput
                      ? messageText.trim().length
                        ? false
                        : true
                      : false
                  }
                  onPress={async () => {
                    if (isTextAlert) {
                      if (showMessageInput) {
                        if (Platform.OS === "ios") {
                          Linking.openURL(
                            `sms://${"+18064388512"}?&body=${messageText}`
                          ).then((data) => {
                            setshowMessageInput(false);
                            setmessageText("");
                            setshowAlert(false);
                          });
                        } else {
                          Linking.openURL(
                            `sms:${"+18064388512"}?&body=${messageText}`
                          ).then((data) => {
                            setshowMessageInput(false);
                            setmessageText("");
                            setshowAlert(false);
                          });
                        }
                      } else {
                        setshowMessageInput(true);
                      }
                    } else {
                      let phoneNumber = "";
                      if (Platform.OS === "android") {
                        phoneNumber = `tel:${"+18064388512"}`;
                      } else {
                        phoneNumber = `telprompt:${"+18064388512"}`;
                      }
                      Linking.openURL(phoneNumber)
                        .then((data) => {
                          console.log("then", data), setshowAlert(false);
                        })
                        .catch((err) => {
                          Alert.alert("can't open this url");
                          throw err;
                        });
                      // Linking.canOpenURL(phoneNumber)
                      //   .then(supported => {
                      //     if (supported) {
                      //       Linking.openURL(phoneNumber)
                      //         .then(data => {
                      //           console.log("then", data), setshowAlert(false);
                      //         })
                      //         .catch(err => {
                      //           Alert.alert("can't open this url");
                      //           throw err;
                      //         });
                      //     } else {
                      //       Alert.alert("can't open this url");
                      //     }
                      //     return false;
                      //   })
                      //   .catch(err => {
                      //     console.log("can't open this url");
                      //   });
                    }
                  }}
                  style={{
                    backgroundColor: showMessageInput
                      ? messageText.trim().length
                        ? colors1.background
                        : "#454545"
                      : colors1.background,
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderRadius: 30,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: fontSizes.medium,
                      fontWeight: "600",
                      color: colors1.white,
                    }}
                  >
                    {showMessageInput ? "Send" : "Yes"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </StandardModal>
      {/* Model for sos Ends here*/}
    </Screen>
  );
}

type Styles = {
  buttons: ViewStyle;
  container: ViewStyle;
  bottom: ViewStyle;
  signUpButton: ViewStyle;
  name: ViewStyle;
  termsBotton: ViewStyle;
  termsLink: ViewStyle;
  dropdown3BtnStyle: ViewStyle;
  dropdown3BtnChildStyle: ViewStyle;
  dropdown3BtnImage: ImageStyle;
  dropdown3BtnTxt: TextStyle;
  dropdown3DropdownStyle: ViewStyle;
  dropdown3RowStyle: ViewStyle;
  dropdown3RowChildStyle: ViewStyle;
  dropdownRowImage: ImageStyle;
  dropdown3RowTxt: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  buttons: {
    alignSelf: "center",
    marginTop: 10,
    width: "95%",
  },
  bottom: {
    flexDirection: "row",
    marginLeft: 25,
    alignSelf: "center",
    marginTop: 20,
  },
  termsBotton: {
    flexDirection: "row",
    marginLeft: Platform.OS === "ios" ? 30 : 5,
    marginTop: -15,
  },
  termsLink: {
    marginTop: -13,
    marginLeft: Platform.OS === "ios" ? -25 : 0,
  },
  signUpButton: {
    marginTop: -15,
    marginLeft: -25,
  },
  name: {
    fontSize: 12,
  },
  container: {
    backgroundColor: "white",
    // paddingHorizontal: STANDARD_PADDING
  },
  dropdown3BtnStyle: {
    width: "100%",
    paddingHorizontal: 0,
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdown3BtnImage: { width: 45, height: 45, resizeMode: "cover" },
  dropdown3BtnTxt: {
    flex: 0.8,
    color: "#444",
    // textAlign: 'center',
    fontWeight: "600",
    fontSize: 18,
  },
  dropdown3DropdownStyle: { backgroundColor: "#EFEFEF", borderRadius: 5 },
  dropdown3RowStyle: {
    // backgroundColor: 'slategray',
    borderBottomColor: "#EFEFEF",
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  dropdownRowImage: { width: 45, height: 45, resizeMode: "contain" },
  dropdown3RowTxt: {
    color: "black",
    fontWeight: "500",
    fontSize: 18,
    // marginHorizontal: 12,
    flex: 1,
  },
});

export default SosScreen;
