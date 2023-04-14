/*************************************************
 * FreightRunner
 * @exports
 * @function BankAccountDetails.tsx
 * @extends Component
 * Created by Naveen E on 06/09/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useContext, useEffect, useState } from "react";
import {
  ViewStyle,
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import HeaderWithBack from "../../components/HeaderWithBack";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import { CustomButton } from "../../components";
import StandardModal from "../../components/StandardModal";
import FastImage from "react-native-fast-image";
import {
  deletePaymentMethod,
  getAccountDetails,
  getAllPaymentMethods,
  getPaymentMethodDetails,
  updateDefaultPayment,
  verifyBankAccount,
} from "../../services/userService";
import Spinner from "react-native-spinkit";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import { MyContext } from "../../context/MyContextProvider";

type Props = { navigation: any };
const deviceHeight = Dimensions.get("window").height;

const BankAccountDetails: React.FC<Props> = ({ navigation, route }) => {
  let accountDetail = route.params?.accountDetail;
  let isFrom = route.params?.isFrom;
  let isCustomer = route.params?.isCustomer;
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [makeDefaultLoading, setmakeDefaultLoading] = useState(false);
  const [showDeleteModel, setshowDeleteModel] = useState(false);
  const [bankAccountDetails, setbankAccountDetails] = useState({});
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [deposit1, setdeposit1] = useState("");
  const [deposit2, setdeposit2] = useState("");
  const [verifyAccountLoading, setverifyAccountLoading] = useState(false);
  const global = useContext(MyContext);
  console.log("isFrom", isFrom);
  /**
   * To Get all payment methods
   */
  useEffect(() => {
    try {
      async function fetchStateListAPI() {
        setLoading(true);
        await getPaymentMethodDetails({
          paymentMethodDtls: accountDetail.id,
          type: isCustomer ? "customer" : "connect",
        })
          .then(async (response) => {
            if (response) {
              setLoading(false);
              console.log("getPaymentMethodDetails", response);
              setbankAccountDetails(response.data);
            }
          })
          .catch((e) => {
            setLoading(false);
            console.log("getPaymentMethodDetails error", e.response);
            // Alert.alert("Error", e.response.data.error);
          });
      }
      fetchStateListAPI();
    } catch (error) {}
  }, []);
  const _deletePaymentMethod = async () => {
    setdeleteLoading(true);
    await deletePaymentMethod({
      paymentMethodDtls: accountDetail.id,
    })
      .then(async (response) => {
        if (response) {
          setdeleteLoading(false);
          setshowDeleteModel(false);
          setMessage(
            isFrom === "cardList"
              ? "Card deleted successfully."
              : "Bank account deleted successfully."
          );
          setVisible(true);
          await getAllPaymentMethods()
            .then(async (paymentMethodResponse) => {
              if (paymentMethodResponse) {
                global.myDispatch({
                  type: "UPDATE_ALL_PAYMENT_METHODS_SUCESS",
                  payload: paymentMethodResponse.data,
                });
              }
            })
            .catch((e) => {
              console.log("getAccountDetails error", e.response);
              // Alert.alert("Error", e.response.data.error);
            });
          navigation.goBack();
        }
      })
      .catch((e) => {
        setdeleteLoading(false);
        console.log("deletePaymentMethod error", e.response);
        Alert.alert("Error", e.response.data.message);
      });
  };

  const _updateDefaultPayment = async () => {
    setmakeDefaultLoading(true);
    await updateDefaultPayment({
      paymentMethodDtls: accountDetail.id,
    })
      .then(async (response) => {
        if (response) {
          setmakeDefaultLoading(false);
          console.log("updateDefaultPayment", response);
          setMessage("Default account changed successfully.");
          setVisible(true);
          await getAllPaymentMethods()
            .then(async (paymentMethodResponse) => {
              if (paymentMethodResponse) {
                console.log("getAccountDetails", paymentMethodResponse);
                global.myDispatch({
                  type: "UPDATE_ALL_PAYMENT_METHODS_SUCESS",
                  payload: paymentMethodResponse.data,
                });
              }
            })
            .catch((e) => {
              console.log("getAccountDetails error", e.response);
              // Alert.alert("Error", e.response.data.error);
            });
          navigation.goBack();
        }
      })
      .catch((e) => {
        setmakeDefaultLoading(false);
        console.log("deletePaymentMethod error", e.response);
        Alert.alert("Error", e.response.data.message);
      });
  };
  const _verifyAccount = async () => {
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
          navigation.goBack();
        }
      })
      .catch((e) => {
        setverifyAccountLoading(false);
        console.log("getPaymentMethodDetails error", e.response);
        // Alert.alert("Error", e.response.data.error);
      });
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={{ flex: 1 }}>
        {/* <StatusBar barStyle="dark-content" /> */}
        <HeaderWithBack
          title="ACCOUNT"
          onPress={() => navigation.goBack()}
          isRightText={false}
          rightText=""
          rightOnPress={() => navigation.goBack()}
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
          <View style={{ flex: 1, backgroundColor: "#F5F4F7" }}>
            <View
              style={{
                paddingVertical: deviceHeight / 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 15,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.medium,

                  fontWeight: "700",
                  color: "black",
                }}
              >
                {isFrom === "cardList" ? "Manage Card" : "Manage Account"}
              </Text>
              {bankAccountDetails.status === "verified" ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FastImage
                    resizeMode={"contain"}
                    source={require("../../assets/images/passwordChecked.png")}
                    style={{
                      height: 20,
                      width: 20,
                      alignSelf: "center",
                      right: 5,
                    }}
                  />
                  <Text
                    style={{
                      color: "#1C9151",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    Verified
                  </Text>
                </View>
              ) : null}
            </View>
            {isFrom === "cardList" ? (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    // marginTop: 20,
                    backgroundColor: colors.white,
                    paddingVertical: deviceHeight / 60,
                    paddingHorizontal: 15,
                  }}
                >
                  {bankAccountDetails?.name ? (
                    <View style={{ marginBottom: 20 }}>
                      <Text
                        style={{
                          fontSize: fontSizes.regular,
                          color: colors.lightGrey,
                          fontWeight: "400",
                          marginBottom: 8,
                        }}
                      >
                        Card Holder Name
                      </Text>
                      <Text
                        style={{
                          fontSize: fontSizes.regular,
                          color: colors.background,
                          fontWeight: "500",
                        }}
                      >
                        {bankAccountDetails?.name?.toUpperCase()}
                      </Text>
                    </View>
                  ) : null}

                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.lightGrey,
                        fontWeight: "400",
                        marginBottom: 8,
                      }}
                    >
                      Card Number
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.background,
                        fontWeight: "500",
                      }}
                    >
                      xxxx - xxxx - xxxx -{bankAccountDetails.last4}
                    </Text>
                  </View>

                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.lightGrey,
                        fontWeight: "400",
                        marginBottom: 8,
                      }}
                    >
                      Expiry Month
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.background,
                        fontWeight: "500",
                      }}
                    >
                      {bankAccountDetails?.exp_month?.toString().length === 1
                        ? `0${bankAccountDetails.exp_month}`
                        : bankAccountDetails.exp_month}
                    </Text>
                  </View>

                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.lightGrey,
                        fontWeight: "400",
                        marginBottom: 8,
                      }}
                    >
                      Expiry Year
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.background,
                        fontWeight: "500",
                      }}
                    >
                      {bankAccountDetails.exp_year}
                    </Text>
                  </View>

                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.lightGrey,
                        fontWeight: "400",
                        marginBottom: 8,
                      }}
                    >
                      Brand
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.background,
                        fontWeight: "500",
                      }}
                    >
                      {bankAccountDetails?.brand?.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    // marginTop: 20,
                    backgroundColor: colors.white,
                    paddingVertical: deviceHeight / 60,
                    paddingHorizontal: 15,
                  }}
                >
                  {isCustomer ? (
                    <View style={{ marginBottom: 20 }}>
                      <Text
                        style={{
                          fontSize: fontSizes.regular,
                          color: colors.lightGrey,
                          fontWeight: "400",
                          marginBottom: 8,
                        }}
                      >
                        Account Holder Name
                      </Text>
                      <Text
                        style={{
                          fontSize: fontSizes.regular,
                          color: colors.background,
                          fontWeight: "500",
                        }}
                      >
                        {bankAccountDetails.account_holder_name}
                      </Text>
                    </View>
                  ) : null}

                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.lightGrey,
                        fontWeight: "400",
                        marginBottom: 8,
                      }}
                    >
                      Bank
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.background,
                        fontWeight: "500",
                      }}
                    >
                      {bankAccountDetails.bank_name}
                    </Text>
                  </View>

                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.lightGrey,
                        fontWeight: "400",
                        marginBottom: 8,
                      }}
                    >
                      Account Number
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.background,
                        fontWeight: "500",
                      }}
                    >
                      xxxx - xxxx - xxxx -{bankAccountDetails.last4}
                    </Text>
                  </View>

                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.lightGrey,
                        fontWeight: "400",
                        marginBottom: 8,
                      }}
                    >
                      Account Routing Number
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.background,
                        fontWeight: "500",
                      }}
                    >
                      {bankAccountDetails.routing_number}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            {/* <>
              {isFrom !== "cardList" &&
              bankAccountDetails.status &&
              bankAccountDetails.status !== "verified" ? (
                <View>
                  <View style={{ paddingVertical: deviceHeight / 50 }}>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        paddingHorizontal: 15,
                        fontWeight: "700",
                        color: "black"
                      }}
                    >
                      {"Direct Payment verification"}
                    </Text>
                  </View>

                  <View
                    style={{
                      // marginBottom: 10,
                      backgroundColor: colors.white,
                      paddingVertical: deviceHeight / 60,
                      paddingHorizontal: 15
                    }}
                  >
                    <Text style={{ fontSize: fontSizes.small, lineHeight: 23 }}>
                      If you would like to use this account to make direct payments, you must verify
                      the account with Stripe. When you registered the account with FreightRunner,
                      Stripe made two small transactions in your account. To verify your account for
                      direct payment, tap the button below and enter the amount of those
                      transactions.
                    </Text>
                  </View>
                </View>
              ) : null}
            </> */}

            <View style={{ marginTop: 20 }}>
              {isFrom !== "cardList" &&
              bankAccountDetails.status &&
              bankAccountDetails.status !== "verified" ? (
                <View style={{ paddingHorizontal: 20 }}>
                  <CustomButton
                    titleColor={colors.white}
                    borderColor={colors.background}
                    onPress={() => {
                      navigation.navigate("AccountDetail", {
                        accountDetail: bankAccountDetails,
                      });
                      // setModalVisible(!modalVisible);
                    }}
                    title="Verify Account"
                    backgroundColor={colors.background}
                    btnLoading={makeDefaultLoading}
                  ></CustomButton>
                </View>
              ) : null}
              {!bankAccountDetails.default_source && isCustomer ? (
                <>
                  {isFrom === "cardList" ? (
                    <View style={{ paddingHorizontal: 20 }}>
                      <CustomButton
                        titleColor={colors.white}
                        borderColor={colors.background}
                        onPress={() => {
                          _updateDefaultPayment();
                        }}
                        title="Make default"
                        backgroundColor={colors.background}
                        btnLoading={makeDefaultLoading}
                      ></CustomButton>
                    </View>
                  ) : (
                    <>
                      {bankAccountDetails.status &&
                      bankAccountDetails.status === "verified" ? (
                        <View style={{ paddingHorizontal: 20 }}>
                          <CustomButton
                            titleColor={colors.white}
                            borderColor={colors.background}
                            onPress={() => {
                              _updateDefaultPayment();
                            }}
                            title="Make default"
                            backgroundColor={colors.background}
                            btnLoading={makeDefaultLoading}
                          ></CustomButton>
                        </View>
                      ) : null}
                    </>
                  )}
                </>
              ) : (
                <View>
                  {isCustomer ? (
                    <View
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: deviceHeight / 45,
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            borderColor: "#1C9151",
                            borderWidth: 1,
                            padding: 8,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              color: "#1C9151",
                              fontWeight: "bold",
                              fontSize: 14,
                            }}
                          >
                            This is the Primary Account
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              )}
              {!bankAccountDetails.default_source && isCustomer ? (
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: deviceHeight / 45,
                  }}
                >
                  <CustomButton
                    titleColor={"#B60F0F"}
                    borderColor={"#B60F0F"}
                    // onPress={() => navigation.navigate("Accounts", { isFrom: "AddAccount" })}
                    onPress={() => {
                      setshowDeleteModel(true);
                      // _deletePaymentMethod();
                    }}
                    title={
                      isFrom === "cardList" ? " Delete Card" : "Delete Account"
                    }
                    backgroundColor={colors.white}
                    btnLoading={deleteLoading}
                    isFrom={"deleteBtn"}
                  ></CustomButton>
                </View>
              ) : null}
            </View>
          </View>
        )}
      </View>
      {/* Model for Logout Start here*/}
      <StandardModal
        visible={showDeleteModel}
        handleBackClose={() => {
          setshowDeleteModel(false);
        }}
      >
        <View>
          <Text
            style={{
              fontSize: fontSizes.large,
              fontWeight: "700",
              color: "black",
            }}
          >
            {"Delete"}
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: fontSizes.medium,
              fontWeight: "400",
              marginVertical: deviceHeight / 30,
            }}
          >
            {isFrom === "cardList"
              ? "Are you sure want to delete your card?"
              : "Are you sure want to delete your account?"}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setshowDeleteModel(false);
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
                onPress={async () => {
                  _deletePaymentMethod();
                }}
                style={{
                  backgroundColor: colors.background,
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
                    color: colors.white,
                  }}
                >
                  {"Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </StandardModal>
      {/* Model for Logout Ends here*/}
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

export default BankAccountDetails;
