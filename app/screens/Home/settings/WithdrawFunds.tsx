/*************************************************
 * FreightRunner
 * @exports
 * @function WithdrawFunds.tsx
 * @extends Component
 * Created by Naveen E on 26/09/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { FC, useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageStyle,
  ScrollView,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  Platform,
  Dimensions,
  ActivityIndicator,
  TextInput,
  FlatList,
  SafeAreaView,
} from "react-native";
import { CustomButton, Text, View } from "../../../components";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../../context/SnackbarContext";
import {
  getUserConnectedAccountBalance,
  withdrawUserAmount,
} from "../../../services/userService";
import colors from "../../../styles/colors";
import { STANDARD_PADDING, fontSizes } from "../../../styles/globalStyles";
import FastImage from "react-native-fast-image";
import { MyContext } from "../../../../app/context/MyContextProvider";
import StandardModal from "../../../components/StandardModal";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import HeaderWithBack from "../../../components/HeaderWithBack";
import Spinner from "react-native-spinkit";
const valid = /^\d*\.?(?:\d{1,2})?$/; // onlyNumberAndADot

type Props = any;

const WithdrawFunds: React.FC<Props> = ({ navigation }) => {
  const [balanceLoading, setbalanceLoading] = useState(false);
  const [isShowBankList, setisShowBankList] = useState(false);
  const [withdrawModalVisible, setwithdrawModalVisible] = useState(false);
  const [withdrawAmount, setwithdrawAmount] = useState("");
  const [disableButton, setdisableButton] = useState(true);
  const [changeModal, setChangeModal] = useState(0);
  const [withdrawLoading, setwithdrawLoading] = useState(false);
  const [deleteACModalVisible, setDeleteACModalVisible] = useState(false);
  const global: any = useContext(MyContext);
  const userProfileDetails =
    global.myState.userProfileDetails &&
    global.myState.userProfileDetails.partnerProfile;
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState({});
  const [connectAccountBalance, setconnectAccountBalance] = useState({});

  useEffect(() => {
    try {
      async function fetchStateListAPI() {
        setbalanceLoading(true);
        await getUserConnectedAccountBalance()
          .then(async (response: any) => {
            setbalanceLoading(false);
            setconnectAccountBalance(response.data);
            console.log("getUserConnectedAccountBalance", response);
          })
          .catch((e) => {
            setbalanceLoading(false);
            console.log("getUserConnectedAccountBalance error", e.response);
            Alert.alert("", e.response.data.message, [
              {
                text: "OK",
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]);
          });
      }
      fetchStateListAPI();
    } catch (error) {}
  }, []);

  // useEffect(() => {
  //   try {
  //     async function fetchStateListAPI() {
  //       setLoading(true);
  //       await getAllPaymentMethods()
  //         .then(async (response: any) => {
  //           setLoading(false);
  //           console.log("getAllPaymentMethods", response);
  //           let defaultPaymentMethod = response.data.bank.data.filter(
  //             (element, index) => element.default_for_currency === true
  //           )[0];
  //           // setallPaymentMethods(response.data);
  //           console.log("defaultPaymentMethod", defaultPaymentMethod);
  //           setDefaultPaymentMethod(defaultPaymentMethod);
  //           global.myDispatch({
  //             type: "UPDATE_ALL_PAYMENT_METHODS_SUCESS",
  //             payload: response.data
  //           });
  //         })
  //         .catch(e => {
  //           setLoading(false);
  //           console.log("getAllPaymentMethods error", e.response);
  //           // Alert.alert("Error", e.response.data.message);
  //         });
  //     }
  //     fetchStateListAPI();
  //   } catch (error) {}
  // }, []);

  const _submitWithdraw = async () => {
    console.log("submitWithdraw", withdrawAmount);
    if (withdrawAmount === "" || withdrawAmount.trim().length === 0) {
      Alert.alert("", "Please enter a withdraw amount");
    } else if (parseFloat(withdrawAmount) <= 0) {
      Alert.alert("", "Please enter a withdraw amount");
    } else {
      setwithdrawLoading(true);
      await withdrawUserAmount({ amount: parseFloat(withdrawAmount) * 100 })
        .then(async (response: any) => {
          setwithdrawLoading(false);
          setwithdrawAmount("");
          setMessage(
            `$ ${withdrawAmount} has been withdrawn from connected account`
          );
          setVisible(true);
          setwithdrawModalVisible(false);
          navigation.goBack();
          console.log("getUserConnectedAccountBalance", response);
        })
        .catch((e) => {
          setwithdrawLoading(false);
          console.log("getUserConnectedAccountBalance error", e.response);
          Alert.alert("", e.response.data.message);
          // Alert.alert("", e.response.data.message, [
          //   {
          //     text: "OK",
          //     onPress: () => {
          //       navigation.goBack();
          //     }
          //   }
          // ]);
        });
    }
    console.log("Naveen");
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        title="WITHDRAW FUNDS"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText=""
        isFrom={""}
        rightOnPress={() => {}}
      />
      {balanceLoading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner
            isVisible={balanceLoading}
            size={30}
            type={"Wave"}
            color={"black"}
          />
          <Text
            style={{
              textAlign: "center",
              marginTop: deviceHeight / 40,
              fontSize: 16,
              color: "black",
            }}
          >
            Loading...
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 20 }}>
          {/* <Text style={{ color: colors.labelGray, paddingVertical: 10 }}>Balance</Text> */}
          <View
            // start={{ x: 0, y: -0.5 }}
            // end={{ x: 0, y: 1 }}
            // colors={["#000000", "#353535"]}
            style={{
              backgroundColor: "black",
              borderRadius: 20,
              paddingLeft: 15,
              paddingRight: 10,
              paddingTop: 20,
              shadowColor: "black",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.8,
              shadowRadius: 4.65,

              elevation: 7,
            }}
          >
            {/* <LinearGradient
            start={{ x: 0, y: -0.5 }}
            end={{ x: 0, y: 1 }}
            colors={["#000000", "#353535"]}
            style={{}}
          > */}
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: fontSizes.regular,
              }}
            >
              Available Balance
            </Text>
            <Text
              style={{
                fontSize: fontSizes.xxLarge,
                fontWeight: "bold",
                color: "white",
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.xLarge,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                $
              </Text>{" "}
              {connectAccountBalance.available
                ? connectAccountBalance.available[0].amount / 100
                : "0"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                paddingTop: 70,
                paddingBottom: 10,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ alignItems: "center", justifyContent: "flex-end" }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: fontSizes.medium,
                  }}
                >
                  {userProfileDetails &&
                    userProfileDetails.partnerProfileDetails.first_name}{" "}
                  {userProfileDetails &&
                    userProfileDetails.partnerProfileDetails.last_name}
                </Text>
              </View>
              <FastImage
                resizeMode="contain"
                source={require("../../../assets/images/fr_logo.png")}
                style={{
                  height: 30,
                  width: 30,
                }}
              />
            </View>
            {/* </LinearGradient> */}
          </View>

          <View
            style={{
              paddingVertical: deviceHeight / 20,
              paddingHorizontal: deviceWidth / 10,
            }}
          >
            <CustomButton
              btnLoading={withdrawLoading}
              titleColor={colors.background}
              borderColor={colors.background}
              onPress={() => {
                setwithdrawModalVisible(true);
              }}
              title="Withdraw"
              titleSize={16}
              backgroundColor={colors.white}
              isFrom={"withdraw"}
              disableButton={
                connectAccountBalance.available
                  ? connectAccountBalance.available[0].amount / 100 === 0
                    ? true
                    : false
                  : true
              }
            ></CustomButton>
          </View>
        </View>
      )}

      <StandardModal
        visible={withdrawModalVisible}
        handleBackClose={() => {
          setwithdrawModalVisible(false);
        }}
      >
        {/* <KeyboardAwareScrollView> */}
        <View style={{ paddingVertical: 10 }}>
          <View style={{}}>
            <Text
              style={{
                fontSize: fontSizes.medium,
                fontWeight: "600",
                color: colors.background,
              }}
            >
              Withdraw Funds
            </Text>
            <TouchableOpacity
              style={{
                alignSelf: "center",
                position: "absolute",
                right: 0,
              }}
              onPress={() => {
                setwithdrawModalVisible(false);
                setwithdrawAmount("");
              }}
            >
              <FastImage
                resizeMode="contain"
                source={require("../../../assets/images/close.png")}
                style={{
                  height: 25,
                  width: 25,
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "#F5F4F7",
              borderColor: "#EDEDED",
              borderWidth: 1,
              paddingHorizontal: 15,
              paddingVertical: deviceHeight / 96,
              marginTop: deviceHeight / 48,
            }}
          >
            <Text
              style={{
                color: "#858C97",
                fontSize: fontSizes.small,
                fontWeight: "500",
              }}
            >
              Amount ($)
            </Text>
            <TextInput
              autoCapitalize="none"
              placeholder=""
              maxLength={50}
              onChangeText={(text) => {
                if (
                  text.trim().length === 0 ||
                  parseFloat(text) <= 0 ||
                  parseFloat(text) >
                    connectAccountBalance.available[0].amount / 100
                ) {
                  setdisableButton(true);
                } else {
                  setdisableButton(false);
                }
                if (!valid.test(text)) {
                  //
                } else {
                  setwithdrawAmount(text.replace(/[^0-9\.]/g, "")); // To allow only number
                }

                // setwithdrawAmount(text);
              }}
              value={withdrawAmount}
              style={{
                fontSize: fontSizes.regular,
                padding: 0,
                marginTop: 5,
                fontWeight: "500",
              }}
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={() => {}}
            />
          </View>
          {/* <Text
              style={{
                color: "#858C97",
                fontSize: fontSizes.small,
                fontWeight: "500",
                marginTop: deviceHeight / 50
              }}
            >
              Destination
            </Text> */}

          <TouchableOpacity
            disabled={disableButton}
            onPress={() => {
              _submitWithdraw();
            }}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderRadius: 32,
              borderWidth: 1,
              backgroundColor: disableButton ? "#454545" : colors.btnColor,
              marginBottom: deviceHeight / 55,
              marginTop: deviceHeight / 30,
            }}
          >
            {withdrawLoading ? (
              <Spinner
                style={{ alignSelf: "center" }}
                isVisible={withdrawLoading}
                size={21}
                type={"Wave"}
                color={"white"}
              />
            ) : (
              <Text
                style={{
                  color: colors.white,
                  textAlign: "center",
                  fontSize: fontSizes.regular,
                  fontWeight: "500",
                }}
              >
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </View>
        {/* </KeyboardAwareScrollView> */}
      </StandardModal>
    </SafeAreaView>
  );
};

type PorfileStyleSheet = {
  container: ViewStyle;
};

const styles = StyleSheet.create<PorfileStyleSheet>({
  container: {
    backgroundColor: "#F5F4F7",
    flex: 1,
  },
});

export default WithdrawFunds;
