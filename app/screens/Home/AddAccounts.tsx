/*************************************************
 * FreightRunner
 * @exports
 * @function AddAccounts.tsx
 * @extends Component
 * Created by Deepak B on 24/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ViewStyle,
  Dimensions,
  StyleSheet,
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import HeaderWithBack from "../../components/HeaderWithBack";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import { CustomButton } from "../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FastImage from "react-native-fast-image";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";
type Props = { navigation: any };
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
let updateDate: any = {};

import {
  addbankaccount,
  getAllPaymentMethods,
  getBankAccountToken,
} from "../../services/userService";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import { MyContext } from "../../context/MyContextProvider";

const AddAccounts: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [accountNumber, setaccountNumber] = useState("");
  const [routingNumber, setroutingNumber] = useState("");
  const [accountHolderName, setaccountHolderName] = useState("");
  const [accountNIckName, setaccountNIckName] = useState("");
  const [loading, setloading] = useState(false);
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const global = useContext(MyContext);
  const ref_routingNumber = useRef();
  const ref_accountHolderName = useRef();
  const ref_accountNickName = useRef();

  const _handleSubmit = async () => {
    if (accountNumber === "" || accountNumber.trim().length === 0) {
      Alert.alert("Error", "Please enter account number");
    } else if (
      routingNumber === "" ||
      routingNumber.trim().length === 0 ||
      routingNumber.trim().length < 9
    ) {
      Alert.alert("Error", "Please provide a valid routing number");
    } else if (
      accountHolderName === "" ||
      accountHolderName.trim().length === 0
    ) {
      Alert.alert("Error", "Please enter account holder name");
    } else {
      setloading(true);
      await getBankAccountToken({
        accountHolderName: accountHolderName,
        accountNumber: accountNumber,
        routingNumber: routingNumber,
      })
        .then(async (tokenRes: any) => {
          if (tokenRes.data) {
            await addbankaccount({
              name: tokenRes.data.bank_account.account_holder_name,
              last_4_digits: tokenRes.data.bank_account.last4,
              routing_number: routingNumber,
              primary: isEnabled ? 1 : 2,
              stripe_token: tokenRes.data.id,
            })
              .then(async (response) => {
                setloading(false);
                console.log("createStripeConnectedAccount", response);
                if (response.status === 201) {
                  setMessage("Bank account added successfully.");
                  setVisible(true);
                  await getAllPaymentMethods()
                    .then(async (paymentMethodResponse) => {
                      global.myDispatch({
                        type: "UPDATE_ALL_PAYMENT_METHODS_SUCESS",
                        payload: paymentMethodResponse.data,
                      });
                    })
                    .catch((e) => {
                      console.log("getAllPaymentMethods error", e.response);
                      Alert.alert("Error", e.response.data.message);
                    });
                  navigation.goBack();
                }
              })
              .catch((e) => {
                setloading(false);
                console.log("addbankaccount", e.response);
                Alert.alert("Error", e.response.data.message);
                // returnResponse = e.response;
              });
          }
        })
        .catch((e) => {
          setloading(false);
          console.log("-error", e.message);
          Alert.alert("Error", e.message);
        });
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <HeaderWithBack
        title="ACCOUNT"
        onPress={() => navigation.goBack()}
        isRightText={true}
        rightText="CANCEL"
        isFrom={isFrom}
        rightOnPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: "#F5F4F7" }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              paddingVertical: deviceHeight / 40,
              paddingHorizontal: 15,
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.regular,
                alignItems: "center",
                fontWeight: "600",
              }}
            >
              Add Bank Account
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <View
              style={{
                backgroundColor: colors.white,
                paddingVertical: deviceHeight / 50,
                paddingHorizontal: 15,
              }}
            >
              <Text
                style={{ fontSize: fontSizes.small, color: colors.lightGrey }}
              >
                Account Number
              </Text>
              <TextInput
                value={accountNumber}
                onChangeText={setaccountNumber}
                placeholder=""
                keyboardType="number-pad"
                style={{
                  padding: 0,
                  fontWeight: "600",
                  fontSize: fontSizes.regular,
                  marginTop: 5,
                }}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => ref_routingNumber.current.focus()}
                blurOnSubmit={false}
              ></TextInput>
            </View>
            <View
              style={{
                backgroundColor: colors.white,
                paddingVertical: deviceHeight / 50,
                paddingHorizontal: 15,
                marginTop: 15,
              }}
            >
              <Text
                style={{ fontSize: fontSizes.small, color: colors.lightGrey }}
              >
                Routing Number
              </Text>
              <TextInput
                maxLength={9}
                ref={ref_routingNumber}
                value={routingNumber}
                onChangeText={setroutingNumber}
                placeholder=""
                keyboardType="number-pad"
                style={{
                  padding: 0,
                  fontWeight: "600",
                  fontSize: fontSizes.regular,
                  marginTop: 5,
                }}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => ref_accountHolderName.current.focus()}
                blurOnSubmit={false}
              ></TextInput>
            </View>
            <View
              style={{
                backgroundColor: colors.white,
                paddingVertical: deviceHeight / 50,
                paddingHorizontal: 15,
                marginTop: 15,
              }}
            >
              <Text
                style={{ fontSize: fontSizes.small, color: colors.lightGrey }}
              >
                {"Account holder name"}
              </Text>
              <TextInput
                ref={ref_accountHolderName}
                value={accountHolderName}
                onChangeText={(e) => {
                  setaccountHolderName(e.replace(/[^a-zA-Z ]/g, "")); // To allow only characters
                }}
                placeholder=""
                keyboardType="default"
                style={{
                  padding: 0,
                  fontWeight: "600",
                  fontSize: fontSizes.regular,
                  marginTop: 5,
                }}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              ></TextInput>
            </View>
            {/* <View
              style={{
                backgroundColor: colors.white,
                paddingVertical: deviceHeight / 50,
                paddingHorizontal: 15,
                marginTop: 15
              }}
            >
              <Text style={{ fontSize: fontSizes.small, color: colors.lightGrey }}>
                {"Account nick name(optional)"}
              </Text>
              <TextInput
                ref={ref_accountNickName}
                value={accountNIckName}
                onChangeText={setaccountNIckName}
                placeholder=""
                keyboardType="default"
                style={{
                  padding: 0,
                  fontWeight: "600",
                  fontSize: fontSizes.regular,
                  marginTop: 5
                }}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              ></TextInput>
            </View> */}
            <View
              style={{
                flexDirection: "row",
                marginTop: deviceHeight / 20,
                paddingHorizontal: 15,
              }}
            >
              <Switch
                trackColor={{ false: colors.greyLight, true: colors.greyLight }}
                thumbColor={isEnabled ? colors.background : colors.white}
                ios_backgroundColor={colors.greyLight}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
              <Text
                style={{
                  fontSize: fontSizes.regular,
                  alignSelf: "center",
                  color: isEnabled ? colors.black : colors.lightGrey,
                  paddingHorizontal: 10,
                }}
              >
                Make default
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          paddingVertical: 15,
          paddingHorizontal: 15,
          backgroundColor: "#F5F4F7",
        }}
      >
        <CustomButton
          titleColor={colors.white}
          borderColor={colors.background}
          onPress={() => _handleSubmit()}
          // onPress={() => navigation.navigate("Accounts", { isFrom: "AddAccount" })}
          title="Submit"
          backgroundColor={colors.background}
          btnLoading={loading}
        ></CustomButton>
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

export default AddAccounts;
