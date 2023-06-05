/*************************************************
 * FreightRunner
 * @exports
 * @function AddCardDetail.tsx
 * @extends Component
 * Created by Naveen E on 27/09/2022
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
type Props = { navigation: any };
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
let updateDate: any = {};

import {
  addbankaccount,
  addCard,
  getAllPaymentMethods,
  getCardToken,
} from "../../services/userService";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import { MyContext } from "../../context/MyContextProvider";
// import { CardField, useStripe } from "@stripe/stripe-react-native";

const AddCardDetail: React.FC<Props> = ({ navigation, route }) => {
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
  const [isCardValid, setisCardValid] = useState(false);
  const [cardDetail, setcardDetail] = useState({});
  const [cardHolderName, setcardHolderName] = useState("");
  const [cardNumber, setcardNumber] = useState("");
  const [cardExpMonth, setcardExpMonth] = useState("");
  const [cardExpYear, setcardExpYear] = useState("");
  const [cardCVV, setcardCVV] = useState("");

  const ref_card_number = useRef();
  const ref_card_exp_month = useRef();
  const ref_card_exp_year = useRef();
  const ref_card_cvv = useRef();

  // useEffect(() => {
  //   if (cardNumber.length === 4) setcardNumber(cardNumber + " ");
  //   else if (cardNumber.length === 9) {
  //     setcardNumber(cardNumber + " ");
  //   } else if (cardNumber.length === 14) {
  //     setcardNumber(cardNumber + " ");
  //   }
  // }, [cardNumber]);

  const _handleSubmit = async () => {
    const last2 = new Date().getFullYear().toString().slice(-2);
    if (cardHolderName === "" || cardHolderName.trim().length === 0) {
      Alert.alert("", "Please enter card holder name");
    } else if (cardNumber === "" || cardNumber.trim().length === 0) {
      Alert.alert("", "Please enter a card number");
    } else if (cardNumber.trim().length < 16) {
      Alert.alert("", "Please enter a valid card number");
    } else if (
      cardExpMonth === "" ||
      cardExpMonth.trim().length === 0 ||
      parseInt(cardExpMonth) > 12 ||
      parseInt(cardExpMonth) <= 0
    ) {
      Alert.alert("", "Please enter a valid expiry month");
    } else if (
      cardExpYear === "" ||
      cardExpYear.trim().length === 0 ||
      parseInt(cardExpYear) < parseInt(last2)
    ) {
      Alert.alert("", "Please enter a expiry year");
    } else if (cardCVV === "" || cardCVV.trim().length === 0) {
      Alert.alert("", "Please enter a valid CVV");
    } else {
      setloading(true);
      await getCardToken({
        name: cardHolderName,
        number: cardNumber,
        expMonth: parseInt(cardExpMonth),
        expYear: parseInt(cardExpYear),
        cvc: cardCVV,
      })
        .then(async (tokenRes) => {
          if (tokenRes.data) {
            await addCard({
              name: cardHolderName,
              last_4_digits: tokenRes.data.card.last4,
              primary: isEnabled ? 1 : 2,
              stripe_token: tokenRes.data.id,
            })
              .then(async (response) => {
                setloading(false);
                if (response.status === 201) {
                  setMessage("Card added successfully.");
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
                console.log("add card", e.response);
                Alert.alert("Error", e.response.data.message);
                // returnResponse = e.response;
              });
          }
        })
        .catch((err) => {
          setloading(false);
          Alert.alert("", err.message);
          console.log("got error:::::::::", err);
          return;
        });
      // await createStripeBankAccountToken({
      //   accountHolderName: accountHolderName,
      //   accountHolderType: "company",
      //   accountNumber: accountNumber,
      //   routingNumber: routingNumber
      // })
      //   .then(async tokenRes => {
      //     if (tokenRes) {
      //       await addbankaccount({
      //         name: tokenRes.bankAccount.accountHolderName,
      //         last_4_digits: tokenRes.bankAccount.last4,
      //         routing_number: routingNumber,
      //         primary: isEnabled ? 1 : 2,
      //         stripe_token: tokenRes.tokenId
      //       })
      //         .then(async response => {
      //           setloading(false);
      //           console.log("createStripeConnectedAccount", response);
      //           if (response.status === 201) {
      //             setMessage("Bank account added successfully.");
      //             setVisible(true);
      //             await getAllPaymentMethods()
      //               .then(async paymentMethodResponse => {
      //                 console.log("getAllPaymentMethods", paymentMethodResponse);
      //                 // setallPaymentMethods(response.data);
      //                 global.myDispatch({
      //                   type: "UPDATE_ALL_PAYMENT_METHODS_SUCESS",
      //                   payload: paymentMethodResponse.data
      //                 });
      //               })
      //               .catch(e => {
      //                 console.log("getAllPaymentMethods error", e.response);
      //                 Alert.alert("Error", e.response.data.message);
      //               });
      //             navigation.goBack();
      //           }
      //         })
      //         .catch(e => {
      //           setloading(false);
      //           console.log("addbankaccount", e.response);
      //           Alert.alert("Error", e.response.data.message);
      //           // returnResponse = e.response;
      //         });
      //     }
      //   })
      //   .catch(e => {
      //     setloading(false);
      //     console.log("-error", e.message);
      //     Alert.alert("Error", e.message);
      //   });
    }
  };

  // const handleFieldParamsChange = data => {
  //   console.log("---------######11", data);
  //   setisCardValid(data.valid);
  //   setcardDetail({
  //     number: data.values.number.trim(),
  //     expMonth: data.values.expiry.split("/")[0],
  //     expYear: data.values.expiry.split("/")[1],
  //     cvc: data.values.cvc,
  //     type: data.values.type
  //   });
  //   // console.log("-params-", params.expMonth);
  //   // console.log(`
  //   //   Valid: ${valid}
  //   //   Number: ${params.number || "-"}
  //   //   Month: ${params.expMonth || "-"}
  //   //   Year: ${params.expYear || "-"}
  //   //   CVC: ${params.cvc || "-"}
  //   // `);
  // };

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
      <KeyboardAwareScrollView
        extraHeight={80}
        extraScrollHeight={80}
        style={{ flex: 1, backgroundColor: "#F5F4F7" }}
      >
        <View
          style={{ paddingVertical: deviceHeight / 40, paddingHorizontal: 15 }}
        >
          <Text
            style={{
              fontSize: fontSizes.regular,
              alignItems: "center",
              fontWeight: "600",
            }}
          >
            Add Card
          </Text>
        </View>
        <View style={{}}>
          <View
            style={{
              backgroundColor: "black",
              marginHorizontal: 30,
              padding: 20,
              borderRadius: 15,
              paddingVertical: 30,
              marginBottom: 5,
              shadowColor: "black",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.7,
              shadowRadius: 4.65,
              elevation: 7,
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.regular,
                fontWeight: "800",
                color: colors.white,
                marginBottom: 20,
              }}
            >
              {cardHolderName.trim().length
                ? cardHolderName.trim().toLocaleUpperCase()
                : "XXXXX XXXXX"}
            </Text>
            <Text
              style={{
                fontSize: fontSizes.regular,
                fontWeight: "600",
                color: colors.white,
                marginBottom: 20,
              }}
            >
              {cardNumber?.length
                ? cardNumber?.length > 4
                  ? cardNumber.match(/(\d{4})/g).join(" ")
                  : cardNumber
                : "XXXX XXXX XXXX XXXX"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 15,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: fontSizes.xSmall,
                    color: colors.white,
                    fontWeight: "600",
                  }}
                >
                  VALID {"\n"} UPTO
                </Text>
                <View style={{ marginHorizontal: 20, alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      marginBottom: 5,
                      color: colors.white,
                    }}
                  >
                    MONTH / YEAR
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizes.small,
                      color: colors.white,

                      fontWeight: "600",
                    }}
                  >
                    {cardExpMonth
                      ? cardExpMonth.length === 1
                        ? `0${cardExpMonth}`
                        : cardExpMonth
                      : "XX"}{" "}
                    /{" "}
                    {cardExpYear
                      ? cardExpYear.length === 1
                        ? `0${cardExpYear}`
                        : cardExpYear
                      : "XX"}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: fontSizes.xSmall,
                    fontWeight: "600",
                  }}
                >
                  CVV
                </Text>
                <Text
                  style={{
                    color: colors.white,
                    marginHorizontal: 10,
                    fontSize: fontSizes.small,
                    fontWeight: "600",
                  }}
                >
                  {cardCVV ? cardCVV : "XXX"}
                </Text>
              </View>
            </View>
          </View>

          {/* <View
            style={{
              backgroundColor: colors.white,
              paddingVertical: deviceHeight / 50,
              paddingHorizontal: 15,
              marginTop: 20
            }}
          >
            <Text style={{ fontSize: fontSizes.small, color: colors.lightGrey }}>Card Details</Text>
            <PaymentCardTextField
              // ref={ref => {
              //   this.paymentCardInput = ref;
              // }}
              style={{
                color: colors.background,
                margin: 0
              }}
              numberPlaceholder={"Card number"}
              disabled={false}
              onParamsChange={handleFieldParamsChange}
            />
          </View> */}
          <View style={{ paddingHorizontal: 15 }}>
            <View
              style={{
                backgroundColor: colors.white,
                paddingVertical: deviceHeight / 50,
                paddingHorizontal: 15,
                marginTop: 20,
                borderWidth: 1,
                borderColor: "#EDEDED",
                borderBottomWidth: 1,
                borderRadius: 8,
                shadowOffset: { width: -2, height: 2 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 3,
                // marginHorizontal: 10
              }}
            >
              <Text
                style={{ fontSize: fontSizes.small, color: colors.lightGrey }}
              >
                Card Holder Name
              </Text>
              <TextInput
                maxLength={30}
                value={cardHolderName}
                onChangeText={(text) => {
                  let reg = /^[A-Za-z ]+$/;
                  if (reg.test(text)) {
                    setcardHolderName(text);
                  } else if (text === "") {
                    setcardHolderName(text);
                  }
                }}
                placeholder=""
                keyboardType="default"
                style={{
                  padding: 0,
                  fontWeight: "600",
                  fontSize: fontSizes.regular,
                  marginTop: 5,
                }}
                autoCapitalize="sentences"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => ref_card_number.current.focus()}
                blurOnSubmit={false}
              ></TextInput>
            </View>

            <View
              style={{
                backgroundColor: colors.white,
                paddingVertical: deviceHeight / 50,
                paddingHorizontal: 15,
                marginTop: 15,
                borderWidth: 1,
                borderColor: "#EDEDED",
                borderBottomWidth: 1,
                borderRadius: 8,
                shadowOffset: { width: -2, height: 2 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 3,
              }}
            >
              <Text
                style={{ fontSize: fontSizes.small, color: colors.lightGrey }}
              >
                Card Number
              </Text>
              <TextInput
                ref={ref_card_number}
                maxLength={16}
                value={cardNumber}
                onChangeText={(text) => {
                  setcardNumber(text);
                }}
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
                onSubmitEditing={() => ref_card_exp_month.current.focus()}
                blurOnSubmit={false}
              ></TextInput>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <View
                style={{
                  backgroundColor: colors.white,
                  paddingVertical: deviceHeight / 50,
                  paddingHorizontal: 15,
                  marginTop: 15,
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#EDEDED",
                  borderBottomWidth: 1,
                  borderRadius: 8,
                  shadowOffset: { width: -2, height: 2 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 3,
                }}
              >
                <Text
                  style={{ fontSize: fontSizes.small, color: colors.lightGrey }}
                >
                  Exp.Month
                </Text>
                <TextInput
                  ref={ref_card_exp_month}
                  maxLength={2}
                  value={cardExpMonth}
                  onChangeText={(text) => {
                    if (parseInt(text) > 0 && parseInt(text) < 13) {
                      setcardExpMonth(text);
                    } else if (text === "") {
                      setcardExpMonth(text);
                    }
                  }}
                  placeholder=""
                  keyboardType="default"
                  style={{
                    padding: 0,
                    fontWeight: "600",
                    fontSize: fontSizes.regular,
                    marginTop: 5,
                  }}
                  keyboardType="number-pad"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={() => ref_card_exp_year.current.focus()}
                  blurOnSubmit={false}
                ></TextInput>
              </View>
              <View
                style={{
                  backgroundColor: colors.white,
                  paddingVertical: deviceHeight / 50,
                  paddingHorizontal: 15,
                  marginTop: 15,
                  flex: 1,
                  marginHorizontal: 10,
                  borderWidth: 1,
                  borderColor: "#EDEDED",
                  borderBottomWidth: 1,
                  borderRadius: 8,
                  shadowOffset: { width: -2, height: 2 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 3,
                }}
              >
                <Text
                  style={{ fontSize: fontSizes.small, color: colors.lightGrey }}
                >
                  Exp.Year
                </Text>
                <TextInput
                  ref={ref_card_exp_year}
                  maxLength={2}
                  value={cardExpYear}
                  onChangeText={(text) => {
                    setcardExpYear(text);
                  }}
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
                  returnKeyType="done"
                  onSubmitEditing={() => ref_card_cvv.current.focus()}
                  blurOnSubmit={false}
                ></TextInput>
              </View>
              <View
                style={{
                  backgroundColor: colors.white,
                  paddingVertical: deviceHeight / 50,
                  paddingHorizontal: 15,
                  marginTop: 15,
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#EDEDED",
                  borderBottomWidth: 1,
                  borderRadius: 8,
                  shadowOffset: { width: -2, height: 2 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 3,
                }}
              >
                <Text
                  style={{ fontSize: fontSizes.small, color: colors.lightGrey }}
                >
                  CVV
                </Text>
                <TextInput
                  ref={ref_card_cvv}
                  maxLength={3}
                  value={cardCVV}
                  onChangeText={(text) => {
                    setcardCVV(text);
                  }}
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
                  returnKeyType="done"
                ></TextInput>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingVertical: deviceHeight / 20,
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
          <View style={{ paddingHorizontal: 15 }}>
            <CustomButton
              titleColor={colors.white}
              borderColor={colors.background}
              onPress={() => _handleSubmit()}
              // onPress={() => navigation.navigate("Accounts", { isFrom: "AddAccount" })}
              title="Submit"
              backgroundColor={
                cardHolderName.length &&
                cardNumber.length &&
                cardExpMonth.length &&
                cardExpYear.length &&
                cardCVV.length
                  ? colors.background
                  : "#454545"
              }
              btnLoading={loading}
              disableButton={
                cardHolderName.length &&
                cardNumber.length &&
                cardExpMonth.length &&
                cardExpYear.length &&
                cardCVV.length
                  ? false
                  : true
              }
            ></CustomButton>
          </View>
        </View>
      </KeyboardAwareScrollView>
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

export default AddCardDetail;
