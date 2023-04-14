/*************************************************
 * FreightRunner
 * @exports
 * @function SelectPaymentMethod.tsx
 * @extends Component
 * Created by Naveen E on 23/0/2022
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
  SafeAreaView,
} from "react-native";
import { CustomButton, Text, View } from "../../../components";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../../context/SnackbarContext";
import { NavigationProps } from "../../../navigation";
import {
  createSubscription,
  getAllPaymentMethods,
  getUserEmails,
  updateUserEmail,
  updateUserProfile,
} from "../../../services/userService";
import colors from "../../../styles/colors";
import FastImage from "react-native-fast-image";
import { MyContext } from "../../../../app/context/MyContextProvider";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import HeaderWithBack from "../../../components/HeaderWithBack";
import Spinner from "react-native-spinkit";
import { fontSizes } from "../../../styles/globalStyles";

type Props = any;

const SelectPaymentMethod: React.FC<Props> = ({ navigation, route }) => {
  let selectedPlan = route.params?.selectedPlan;
  let isFrom = route.params?.isFrom;
  const [loading, setLoading] = useState(false);
  const [isPaymentMethodSelected, setisPaymentMethodSelected] = useState(true);
  const [activateBtnLoading, setactivateBtnLoading] = useState(false);
  const [changeModal, setChangeModal] = useState(0);
  const [deleteACModalVisible, setDeleteACModalVisible] = useState(false);
  const global: any = useContext(MyContext);
  const userProfileDetails =
    global.myState.userProfileDetails &&
    global.myState.userProfileDetails.partnerProfile;

  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  /**
   * To Get all payment methods
   */
  useEffect(() => {
    try {
      async function fetchStateListAPI() {
        setLoading(true);
        await getAllPaymentMethods()
          .then(async (response) => {
            setLoading(false);
            global.myDispatch({
              type: "UPDATE_ALL_PAYMENT_METHODS_SUCESS",
              payload: response.data,
            });
            _checkPaymentMethods(response.data);
          })
          .catch((e) => {
            setLoading(false);
            console.log("getAllPaymentMethods error", e.response);
            Alert.alert("Error", e.response.data.message);
          });
      }
      fetchStateListAPI();
    } catch (error) {}
  }, []);

  const _checkPaymentMethods = (response) => {
    if (
      response.customer_default_source?.object === "bank_account" &&
      response.customer_default_source?.status !== "verified"
    ) {
      Alert.alert(
        "",
        "Ensure that, this bank account is verified with micro deposit to activate Subscription",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Accounts");
            },
          },
        ]
      );
      return false;
    } else {
      return true;
    }
  };

  const _createSubscription = async () => {
    setactivateBtnLoading(true);
    await createSubscription({
      priceId: selectedPlan.priceDetails.id,
      plan_name: selectedPlan?.priceDetails?.recurring?.interval,
    })
      .then(async (response: any) => {
        setactivateBtnLoading(false);
        console.log("Request", response);
        setMessage(
          `Thank you for subscribing to Carrier ${
            selectedPlan?.priceDetails?.recurring?.interval === "year"
              ? "yearly"
              : "monthly"
          } subscription plan.`
        );
        setVisible(true);
        if (isFrom === "loadDetailScreen") {
          navigation.navigate("LoadDetailScreen");
        } else {
          navigation.navigate("SettingsList");
        }
      })
      .catch((e) => {
        setactivateBtnLoading(false);
        console.log("Request", e.response);
        Alert.alert("Error", e.response.data.message);
      });
  };
  console.log("****************TYR", global.myState.allPaymentMethods);
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        title="PREMIUM"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText=""
        isFrom={""}
        rightOnPress={() => {}}
      />
      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner
            isVisible={loading}
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: "white",
              paddingVertical: 20,
              marginVertical: 10,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: colors.black, fontWeight: "600" }}>
              $0 during 30-day trial period, then $
              {selectedPlan?.priceDetails?.unit_amount / 100} for each following{" "}
              {selectedPlan?.priceDetails?.recurring?.interval === "year"
                ? "years"
                : "months"}
              .
            </Text>
          </View>
          <Text
            style={{
              paddingHorizontal: 10,
              fontSize: fontSizes.regular,
              color: "#858C97",
            }}
          >
            Select payment method
          </Text>
          <View
            // onPress={() => {
            //   setisPaymentMethodSelected(!isPaymentMethodSelected);
            // }}
            style={{
              backgroundColor: colors.white,
              flexDirection: "row",
              paddingVertical: deviceHeight / 55,
              marginTop: 15,
              // paddingHorizontal: 15,
              marginHorizontal: 10,
              borderWidth: 1,
              borderColor: isPaymentMethodSelected ? "#000000" : "#EDEDED",
              borderRadius: 10,
            }}
          >
            <FastImage
              resizeMode={"contain"}
              source={
                isPaymentMethodSelected
                  ? require("../../../assets/images/SelectedCircle.png")
                  : require("../../../assets/images/UnSelectedCircle.png")
              }
              style={{
                height: 20,
                width: 20,
                alignSelf: "center",
                marginHorizontal: 15,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: fontSizes.regular,
                  // paddingHorizontal: 15,
                  fontWeight: "600",
                }}
              >
                {global.myState.allPaymentMethods?.customer_default_source
                  ?.object === "bank_account"
                  ? global.myState.allPaymentMethods?.customer_default_source
                      ?.bank_name
                  : global.myState.allPaymentMethods?.customer_default_source?.brand?.toUpperCase()}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    paddingRight: 15,
                    marginTop: 10,
                    color: colors.lightGrey,
                    fontWeight: "600",
                  }}
                >
                  XX -{" "}
                  {
                    global.myState.allPaymentMethods?.customer_default_source
                      ?.last4
                  }
                </Text>
                <View
                  style={{
                    height: "60%",
                    width: 0.5,
                    backgroundColor: colors.background,
                    marginTop: 10,
                    alignSelf: "center",
                  }}
                ></View>
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    paddingHorizontal: 15,
                    marginTop: 10,
                    color: colors.lightGrey,
                    fontWeight: "600",
                    alignSelf: "center",
                  }}
                >
                  {global.myState.allPaymentMethods?.customer_default_source
                    ?.object === "bank_account"
                    ? global.myState.allPaymentMethods?.customer_default_source
                        ?.account_holder_name
                    : global.myState.allPaymentMethods?.customer_default_source
                        ?.name}
                </Text>
              </View>
            </View>
          </View>
          {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text
          onPress={() => navigation.navigate("Accounts")}
          style={{
            paddingHorizontal: 10,
            fontSize: fontSizes.regular,
            color: colors.background,
            marginTop: 15,
            fontWeight: "bold",
            textDecorationLine: "underline"
          }}
        >
          Change
        </Text>
      </View> */}

          <View
            style={{
              paddingHorizontal: 10,
              marginVertical: 30,
              backgroundColor: colors.greyLight,
              paddingVertical: 15,
            }}
          >
            <Text style={{ textAlign: "center" }}>
              By placing this order you agree to our{" "}
              <Text
                onPress={() => navigation.navigate("termsOfService")}
                style={{ fontWeight: "bold", textDecorationLine: "underline" }}
              >
                Terms of Use
              </Text>
            </Text>
          </View>

          <View style={{ paddingHorizontal: 15 }}>
            <CustomButton
              titleColor={colors.white}
              borderColor={colors.background}
              onPress={() => {
                if (_checkPaymentMethods(global.myState.allPaymentMethods)) {
                  _createSubscription();
                }

                // Alert.alert("", selectedPlan.id);
                // navigation.navigate("SelectPaymentMethod")}
              }}
              title="ACTIVATE"
              backgroundColor={colors.background}
              btnLoading={activateBtnLoading}
            ></CustomButton>
          </View>

          <Text
            style={{
              fontSize: fontSizes.small,
              marginVertical: 20,
              textAlign: "center",
            }}
          >
            Cancel anytime. No hidden fees. Guaranteed.
          </Text>
        </ScrollView>
      )}
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

export default SelectPaymentMethod;
