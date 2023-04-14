/*************************************************
 * FreightRunner
 * @exports
 * @function AccountDetail.tsx
 * @extends Component
 * Created by Deepak B on 28/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useContext, useState } from "react";
import {
  ViewStyle,
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  SafeAreaView,
} from "react-native";
import HeaderWithBack from "../../components/HeaderWithBack";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import { CustomButton } from "../../components";
import StandardModal from "../../components/StandardModal";
import FastImage from "react-native-fast-image";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import {
  getAllPaymentMethods,
  verifyBankAccount,
} from "../../services/userService";
import { MyContext } from "../../context/MyContextProvider";
type Props = { navigation: any };
const deviceHeight = Dimensions.get("window").height;

const AccountDetail: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  let accountDetail = route.params?.accountDetail;
  const [modalVisible, setModalVisible] = useState(false);
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [deposit1, setdeposit1] = useState("");
  const [deposit2, setdeposit2] = useState("");
  const [verifyAccountLoading, setverifyAccountLoading] = useState(false);
  const [verifyErrorMessage, setverifyErrorMessage] = useState("");
  const global = useContext(MyContext);

  const _verifyAccount = async () => {
    setverifyErrorMessage("");
    setverifyAccountLoading(true);
    await verifyBankAccount({
      object_id: accountDetail.id,
      deposit1,
      deposit2,
    })
      .then(async (response) => {
        if (response) {
          setverifyAccountLoading(false);
          setModalVisible(false);
          setMessage("Bank account verified with micro deposits successfully");
          setVisible(true);
          console.log("verifyBankAccount", response);
          await getAllPaymentMethods()
            .then(async (response) => {
              console.log("getAllPaymentMethods", response);
              // setallPaymentMethods(response.data);
              global.myDispatch({
                type: "UPDATE_ALL_PAYMENT_METHODS_SUCESS",
                payload: response.data,
              });
            })
            .catch((e) => {
              console.log("getAllPaymentMethods error", e.response);
            });
          navigation.navigate("Accounts");
        }
      })
      .catch((e) => {
        setverifyAccountLoading(false);
        console.log("getPaymentMethodDetails error", e.response);
        setverifyErrorMessage(e.response.data.message);
      });
  };
  const tofixTwoDigits = (value) => {
    var with2Decimals;
    console.log("--value-", value);
    if (value.length === 1 && value.charAt(0) === ".") {
      with2Decimals = "0.";
    } else if (value.length === 1 && value.charAt(0) === "0") {
      with2Decimals = "";
    } else if (value.length) {
      with2Decimals = value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    } else {
      with2Decimals = "";
    }

    return with2Decimals;
  };
  console.log("deposit1", deposit1);
  const _viewModal = () => {
    return (
      <StandardModal
        visible={modalVisible}
        handleBackClose={() => {
          setModalVisible(false);
        }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.small,
                fontWeight: "700",
                color: "black",
              }}
            >
              Verify Account
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                setverifyErrorMessage("");
              }}
            >
              <FastImage
                resizeMode={"contain"}
                source={require("../../assets/images/close.png")}
                style={{ height: 23, width: 23 }}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: "black",
              fontSize: fontSizes.small,
              fontWeight: "400",
              paddingVertical: deviceHeight / 50,
              lineHeight: deviceHeight / 35,
            }}
          >
            Please enter the transaction amount entered by Stripe. The
            transaction should be dated within 2 business days of when the
            account was registered with FreightRunner.
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View
                // onPress={() => {
                //   setModalVisible(!modalVisible);
                // }}
                style={{
                  paddingHorizontal: 5,
                  backgroundColor: "#F5F4F7",
                  flexDirection: "row",
                }}
              >
                <FastImage
                  resizeMode={"contain"}
                  source={require("../../assets/images/dollar.png")}
                  style={{ height: 20, width: 20, alignSelf: "center" }}
                />
                <View
                  style={{
                    flexDirection: "column",
                    paddingHorizontal: 5,
                    paddingVertical: Platform.OS === "ios" ? 5 : 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizes.xSmall,
                      color: colors.lightGrey,
                      marginTop: 8,
                    }}
                  >
                    Deposit 1 in cents
                  </Text>
                  <TextInput
                    placeholder="- - - - - - "
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setverifyErrorMessage("");
                      if (!text.match(/[^0-9\.]/)) {
                        //match - To allow only number and dots
                        setdeposit1(tofixTwoDigits(text)); // To restrict with only one dot
                      }
                    }}
                    value={deposit1}
                    // value={deposit1}
                    style={{
                      padding: 0,
                      fontWeight: "600",
                      fontSize: fontSizes.xSmall,
                      paddingVertical: Platform.OS === "ios" ? 7 : 0,
                    }}
                    maxLength={5}
                  ></TextInput>
                </View>
              </View>
            </View>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <View
                style={{
                  paddingHorizontal: 5,
                  backgroundColor: "#F5F4F7",
                  flexDirection: "row",
                }}
              >
                <FastImage
                  resizeMode={"contain"}
                  source={require("../../assets/images/dollar.png")}
                  style={{ height: 20, width: 20, alignSelf: "center" }}
                />
                <View
                  style={{
                    flexDirection: "column",
                    paddingHorizontal: 5,
                    paddingVertical: Platform.OS === "ios" ? 5 : 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizes.xSmall,
                      color: colors.lightGrey,
                      marginTop: 8,
                    }}
                  >
                    Deposit 2 in cents
                  </Text>
                  <TextInput
                    placeholder="- - - - - - "
                    keyboardType="numeric"
                    value={deposit2}
                    onChangeText={(text) => {
                      setverifyErrorMessage("");
                      if (!text.match(/[^0-9\.]/)) {
                        //match - To allow only number and dots
                        setdeposit2(tofixTwoDigits(text)); // To restrict with only one dot
                      }
                    }}
                    style={{
                      padding: 0,
                      fontWeight: "600",
                      fontSize: fontSizes.xSmall,
                      paddingVertical: Platform.OS === "ios" ? 7 : 0,
                    }}
                    maxLength={5}
                  ></TextInput>
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <CustomButton
              titleColor={colors.white}
              borderColor={colors.background}
              onPress={() => {
                _verifyAccount();
              }}
              title="Submit"
              btnLoading={verifyAccountLoading}
              backgroundColor={
                deposit1 === "" ||
                deposit1?.trim().length === 0 ||
                deposit2 === "" ||
                deposit2?.trim().length === 0
                  ? "#454545"
                  : "#1F1F1F"
              }
              disableButton={
                deposit1 === "" ||
                deposit1?.trim().length === 0 ||
                deposit2 === "" ||
                deposit2?.trim().length === 0
                  ? true
                  : false
              }
            ></CustomButton>
          </View>
          {verifyErrorMessage !== "" ? (
            <Text
              style={{ marginTop: 15, color: "#B60F0F", textAlign: "center" }}
            >
              {verifyErrorMessage}
            </Text>
          ) : null}
        </View>
      </StandardModal>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <HeaderWithBack
        title="ACCOUNT"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText="CANCEL"
        isFrom={isFrom}
        rightOnPress={() => navigation.goBack()}
      />
      <View style={{ flex: 1, backgroundColor: "#F5F4F7" }}>
        <View style={{ paddingVertical: deviceHeight / 50 }}>
          <Text
            style={{
              fontSize: fontSizes.regular,
              paddingHorizontal: 15,
              fontWeight: "700",
              color: "black",
            }}
          >
            {"Direct Payment verification"}
          </Text>
        </View>

        <View
          style={{
            // marginTop: 20,
            backgroundColor: colors.white,
            paddingVertical: deviceHeight / 60,
            paddingHorizontal: 15,
          }}
        >
          <Text style={{ fontSize: fontSizes.small, lineHeight: 23 }}>
            If you would like to use this account to make direct payments, you
            must verify the account with Stripe. When you registered the account
            with FreightRunner, Stripe made two small transactions in your
            account. To verify your account for direct payment, tap the button
            below and enter the amount of those transactions.
          </Text>
        </View>
        <View
          style={{ paddingHorizontal: 20, paddingVertical: deviceHeight / 35 }}
        >
          <CustomButton
            titleColor={colors.white}
            borderColor={colors.background}
            onPress={() => {
              _viewModal();
              setModalVisible(!modalVisible);
            }}
            title="Verify Account"
            backgroundColor={colors.background}
          ></CustomButton>
        </View>
        {/* <Text
          style={{
            fontSize: fontSizes.small,
            paddingHorizontal: 15,
            fontWeight: "600",
            color: colors.lightGrey
          }}
        >
          {"Action"}
        </Text>
        <View style={{ paddingHorizontal: 20, paddingVertical: deviceHeight / 45 }}>
          <CustomButton
            titleColor={"#B60F0F"}
            borderColor={"#B60F0F"}
            onPress={() => navigation.navigate("Accounts", { isFrom: "AddAccount" })}
            title="Delete Account"
            backgroundColor={colors.white}
          ></CustomButton>
        </View> */}
        {modalVisible ? _viewModal() : null}
      </View>
    </SafeAreaView>
  );
};

type StyleSet = {
  mainContainer: ViewStyle;
};

const styles = StyleSheet.create<StyleSet>({
  mainContainer: {
    flex: 1,
  },
});

export default AccountDetail;
