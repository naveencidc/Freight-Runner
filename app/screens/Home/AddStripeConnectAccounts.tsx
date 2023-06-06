/*************************************************
 * FreightRunner
 * @exports
 * @function AddStripeConnectAccounts.tsx
 * @extends Component
 * Created by Naveen E on 02/09/2022
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
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import HeaderWithBack from "../../components/HeaderWithBack";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import { CustomButton } from "../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DatePicker from "react-native-date-picker";
import FastImage from "react-native-fast-image";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";
type Props = { navigation: any };
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
let updateDate: any = {};
import { NetworkInfo } from "react-native-network-info";
import NetInfo from "@react-native-community/netinfo";
import { getStateList } from "../../services/registrationService";
import {
  createStripeConnectedAccount,
  getAccountDetails,
  getAllPaymentMethods,
  getUserConnectedAccountDetails,
} from "../../services/userService";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import { MyContext } from "../../context/MyContextProvider";
import WebView from "react-native-webview";
import { CheckBox } from "react-native-elements";

const AddStripeConnectAccounts: React.FC<Props> = ({ navigation, route }) => {
  const global = useContext(MyContext);
  const userProfileDetails =
    global.myState.userProfileDetails &&
    global.myState.userProfileDetails.partnerProfile;
  let isFrom = route.params?.isFrom;
  let stripeOnboardingDetail = route.params?.stripeOnboardingDetail;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);

  const [stateList, setStateList] = useState([]);
  const [name, setname] = useState("");
  const [firstName, setfirstName] = useState(
    userProfileDetails.partnerProfileDetails.first_name
  );
  const [lastName, setlastName] = useState(
    userProfileDetails.partnerProfileDetails.last_name
  );
  const [email, setemail] = useState(userProfileDetails.email);
  const [tax_id, settax_id] = useState("");
  const [line1, setline1] = useState("");
  const [line2, setline2] = useState("");
  const [city, setcity] = useState(
    userProfileDetails.partnerProfileDetails.city
  );
  const [state, setstate] = useState("");
  const [postalCode, setpostalCode] = useState(
    userProfileDetails.partnerProfileDetails.zip_code
  );
  const [phoneNumber, setphoneNumber] = useState(
    userProfileDetails.partnerProfileDetails.mobile_number.slice(2)
  );
  const [url, seturl] = useState("");
  const [ip, setip] = useState("");
  const [loading, setLoading] = useState(false);
  const [ssn, setssn] = useState("");
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [showStripModel, setshowStripModel] = useState(false);
  const [business_type, setbusiness_type] = useState("individual");
  const [stripeOnboardingUrl, setstripeOnboardingUrl] = useState("");
  const [isIndividual, setisIndividual] = useState(true);
  const [selectedIndex, setselectedIndex] = useState();

  const ref_fullName = useRef();
  const ref_email = useRef();
  const ref_taxId = useRef();
  const ref_phone = useRef();
  const ref_webSite = useRef();
  const ref_addressLine1 = useRef();
  const ref_addressLine2 = useRef();
  const ref_city = useRef();
  const ref_state = useRef();
  const ref_zipCode = useRef();
  useEffect(() => {
    if (global.myState.connectedAccountDetails?.id) {
      setstripeOnboardingUrl(stripeOnboardingDetail.url);
      setshowStripModel(true);
    }
  }, []);
  useEffect(() => {
    NetInfo.fetch().then((state: any) => {
      if (!state.details.ipAddress) {
        NetworkInfo.getIPAddress().then((ipAddress: any) => {
          setip(ipAddress);
        });
      }
      setip(state.details.ipAddress);
    });
  }, []);

  const getStateName = (stateList, stateCode) => {
    let stateObj = stateList.find((e) => e.code == stateCode);
    let index = stateList.findIndex((obj) => obj.code === stateCode);
    return stateObj?.name;
  };
  useEffect(() => {}, [selectedIndex]);
  useEffect(() => {
    try {
      async function fetchStateListAPI() {
        const response = await getStateList();
        setstate(
          getStateName(
            response.data,
            userProfileDetails.partnerProfileDetails.state
          )
        );
        setStateList(response.data);
        let index = response.data.findIndex(
          (obj) => obj.code === userProfileDetails.partnerProfileDetails.state
        );
        setselectedIndex(index);
      }
      fetchStateListAPI();
    } catch (error) {}
  }, []);

  const getStripeConnectAccountDetails = async () => {
    await getAccountDetails()
      .then(async (connectedAccountResponse) => {
        if (connectedAccountResponse) {
          console.log("getAccountDetails", connectedAccountResponse);
          global.myDispatch({
            type: "UPDATE_CONNECTED_ACCOUNT_DETAIL_SUCESS",
            payload: connectedAccountResponse.data,
          });
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log("getAccountDetails error", e.response);
        // Alert.alert("Error", e.response.data.error);
      });
    // navigation.goBack();
  };
  const _validateEmail = (text) => {
    if (text.trim().length > 0) {
      let reg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (reg.test(text) === false) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const isValidUrl = (urlString) => {
    var urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
  };
  const _checkOnboardingState = async (state: object) => {
    console.log("-state---", state);
    if (state.title === "FreightRunner Verification") {
      console.log("---INside");
      await getUserConnectedAccountDetails()
        .then(async (response) => {
          console.log("--getUserConnectedAccountDetails-", response);
          if (response.data) {
            console.log("--3333-", response);
            if (response.data.created) {
              //Stripe Onboarding success
              //Call Connect account details api and paymenthods list api
              // To get user connected account details
              await getAccountDetails()
                .then(async (connectedAccountResponse) => {
                  if (connectedAccountResponse) {
                    console.log("getAccountDetails", connectedAccountResponse);
                    global.myDispatch({
                      type: "UPDATE_CONNECTED_ACCOUNT_DETAIL_SUCESS",
                      payload: connectedAccountResponse.data,
                    });
                    // To get user payment method if connected account is  available
                    await getAllPaymentMethods()
                      .then(async (response) => {
                        setLoading(false);
                        global.myDispatch({
                          type: "UPDATE_ALL_PAYMENT_METHODS_SUCESS",
                          payload: response.data,
                        });
                      })
                      .catch((e) => {
                        setLoading(false);
                        console.log("getAllPaymentMethods error", e.response);
                        Alert.alert("Error", e.response.data.message);
                      });
                  }
                })
                .catch((e) => {
                  setLoading(false);
                  console.log("getAccountDetails error", e.response);
                  // Alert.alert("Error", e.response.data.error);
                });
              setMessage("Account created successfully.");
              setVisible(true);
              setshowStripModel(false);
              navigation.goBack();
            } else {
              //Stripe Onboarding failure
              Alert.alert(
                "",
                "Something went wrong. Try connecting your account again",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      setshowStripModel(false);
                      navigation.goBack();
                    },
                  },
                ]
              );
            }
          }

          console.log("getUserConnectedAccountDetails", response);
        })
        .catch((e) => {
          //Stripe Onboarding failure
          console.log("getUserConnectedAccountDetails error", e.response);
          Alert.alert("", e.response.data.message, [
            {
              text: "OK",
              onPress: () => {
                setshowStripModel(false);
                getStripeConnectAccountDetails();
                navigation.goBack();
              },
            },
          ]);
        });
    }
  };
  const _handleIndualSubmit = async () => {
    if (firstName === "" || firstName.trim().length === 0) {
      Alert.alert("", "Please enter first name");
    } else if (lastName === "" || lastName.trim().length === 0) {
      Alert.alert("", "Please enter last name");
    } else if (_validateEmail(email) === false) {
      Alert.alert("", "Please enter a valid email");
    } else if (ssn === "" || ssn.trim().length === 0) {
      Alert.alert("", "Please enter a valid sss number");
    } else if (phoneNumber === "" || phoneNumber.trim().length === 0) {
      Alert.alert("", "Please enter a valid phone number");
    } else if (url === "" || url.trim().length === 0 || !isValidUrl(url)) {
      Alert.alert("", "Please enter a valid website URL");
    } else if (date === "" || date.trim().length === 0) {
      Alert.alert("", "Please enter a valid date");
    } else if (line1 === "" || line1.trim().length === 0) {
      Alert.alert("", "Please enter a valid address line 1");
    }
    //  else if (line1 === "" || line2.trim().length === 0) {
    //   Alert.alert("", "Please enter a valid address line 2");
    // }
    else if (city === "" || city.trim().length === 0) {
      Alert.alert("", "Please enter city");
    } else if (state === "" || state.trim().length === 0) {
      Alert.alert("", "Please select a state");
    } else if (postalCode === "" || postalCode.trim().length === 0) {
      Alert.alert("", "Please enter postalCode");
    } else {
      setLoading(true);
      let params = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email,
        business_type: "individual",
        dob_day: date.split("-")[0],
        dob_month: date.split("-")[1],
        dob_year: date.split("-")[2],
        ssn: ssn,
        city: city,
        line1: line1,
        line2: line2.trim(),
        state: state,
        postalCode: postalCode,
        phoneNumber: phoneNumber,
        url: url,
        ip: ip,
      };
      console.log("----****----", params);
      await createStripeConnectedAccount({
        params: params,
      })
        .then(async (response) => {
          setLoading(false);
          console.log("createStripeConnectedAccount", response);
          if (response.status === 201) {
            console.log("createStripeConnectedAccount", response);
            setstripeOnboardingUrl(response.data.url);
            setshowStripModel(true);
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log("createStripeConnectedAccount", e.response);
          Alert.alert("", e.response.data.message);
          // returnResponse = e.response;
        });
    }
  };
  const _handleSubmit = async () => {
    if (firstName === "" || firstName.trim().length === 0) {
      Alert.alert("", "Please enter first name");
    } else if (lastName === "" || lastName.trim().length === 0) {
      Alert.alert("", "Please enter last name");
    } else if (tax_id === "" || tax_id.trim().length === 0) {
      Alert.alert("Error", "Please enter a valid tax id");
    } else if (phoneNumber === "" || phoneNumber.trim().length === 0) {
      Alert.alert("Error", "Please enter a valid phone number");
    } else if (url === "" || url.trim().length === 0 || !isValidUrl(url)) {
      Alert.alert("Error", "Please enter a valid website URL");
    } else if (line1 === "" || line1.trim().length === 0) {
      Alert.alert("Error", "Please enter a valid address line 1");
    } else if (line1 === "" || line2.trim().length === 0) {
      Alert.alert("Error", "Please enter a valid address line 2");
    } else if (city === "" || city.trim().length === 0) {
      Alert.alert("Error", "Please enter city");
    } else if (state === "" || state.trim().length === 0) {
      Alert.alert("Error", "Please select a state");
    } else if (postalCode === "" || postalCode.trim().length === 0) {
      Alert.alert("Error", "Please enter postalCode");
    } else {
      setLoading(true);
      console.log("--_handleSubmit-");
      let params = {
        fullName: firstName.trim() + lastName.trim(),
        email: email,
        business_type: "company",
        tax_id: tax_id,
        line1: line1,
        line2: line2,
        city: city,
        state: state,
        postalCode: postalCode,
        phoneNumber: phoneNumber,
        url: url,
        ip: ip,
      };
      console.log("----****----", params);
      await createStripeConnectedAccount({
        params: params,
      })
        .then(async (response) => {
          setLoading(false);
          console.log("createStripeConnectedAccount", response);
          if (response.status === 201) {
            console.log("createStripeConnectedAccount", response);
            setstripeOnboardingUrl(response.data.url);
            setshowStripModel(true);
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log("createStripeConnectedAccount", e.response);
          Alert.alert("", e.response.data.message);
          // returnResponse = e.response;
        });
    }
  };
  const stripeAccountNotVerified = () => {
    return (
      <View style={{ marginTop: 0 }}>
        <View style={{ backgroundColor: colors.white }}>
          <Text
            style={{
              fontSize: fontSizes.small,
              lineHeight: 22,
              paddingHorizontal: 15,
              paddingVertical: deviceHeight / 60,
            }}
          >
            FreightRunner does not store the information below. The information
            you provide below is used strictly used to verify identity in
            accordance with banking regulations.
          </Text>
        </View>

        <View
          style={{
            // backgroundColor: colors.white,
            paddingVertical: deviceHeight / 70,
            paddingHorizontal: 15,
          }}
        >
          <Text style={{ fontSize: fontSizes.small, color: colors.lightGrey }}>
            Business Type
          </Text>
          <View style={{ flexDirection: "row" }}>
            <CheckBox
              containerStyle={{
                backgroundColor: "transparent",
                paddingHorizontal: 0,
                borderWidth: 0,
              }}
              title="Individual"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="black"
              checked={isIndividual}
              onPress={() => setisIndividual(true)}
            />
            <CheckBox
              containerStyle={{
                backgroundColor: "transparent",
                paddingHorizontal: 0,
                borderWidth: 0,
              }}
              title="Company"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="black"
              checked={!isIndividual}
              onPress={() => setisIndividual(false)}
            />
          </View>
        </View>

        <View style={{}}>
          {/* <View
            style={{
              backgroundColor: colors.white,
              paddingVertical: deviceHeight / 50,
              paddingHorizontal: 15
            }}
          >
            <Text style={{ fontSize: fontSizes.small, color: colors.lightGrey }}>Full Name</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder=""
              keyboardType="default"
              value={name}
              onChangeText={setname}
              style={{
                padding: 0,
                fontWeight: "600",
                fontSize: fontSizes.regular,
                marginTop: 5
              }}
              returnKeyType="next"
              onSubmitEditing={() => ref_email.current.focus()}
              blurOnSubmit={false}
            ></TextInput>
          </View> */}
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
              First Name
            </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder=""
              keyboardType="default"
              value={firstName}
              onChangeText={setfirstName}
              style={{
                padding: 0,
                fontWeight: "600",
                fontSize: fontSizes.regular,
                marginTop: 5,
              }}
              returnKeyType="next"
              // onSubmitEditing={() => ref_email.current.focus()}
              // blurOnSubmit={false}
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
              Last Name
            </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder=""
              keyboardType="default"
              value={lastName}
              onChangeText={setlastName}
              style={{
                padding: 0,
                fontWeight: "600",
                fontSize: fontSizes.regular,
                marginTop: 5,
              }}
              returnKeyType="next"
              onSubmitEditing={() => ref_email.current.focus()}
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
              Email Address
            </Text>
            <TextInput
              editable={false}
              ref={ref_email}
              value={email}
              onChangeText={setemail}
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
              returnKeyType="next"
              onSubmitEditing={() => ref_taxId.current.focus()}
              blurOnSubmit={false}
            ></TextInput>
          </View>
          {isIndividual ? (
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
                SSN
              </Text>
              <TextInput
                ref={ref_taxId}
                value={ssn}
                onChangeText={setssn}
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
                returnKeyType="next"
                onSubmitEditing={() => ref_phone.current.focus()}
                blurOnSubmit={false}
              ></TextInput>
            </View>
          ) : (
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
                Tax Id
              </Text>
              <TextInput
                ref={ref_taxId}
                value={tax_id}
                onChangeText={settax_id}
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
                returnKeyType="next"
                onSubmitEditing={() => ref_phone.current.focus()}
                blurOnSubmit={false}
              ></TextInput>
            </View>
          )}

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
              Phone Number
            </Text>
            <TextInput
              ref={ref_phone}
              maxLength={10}
              placeholder=""
              value={phoneNumber}
              onChangeText={setphoneNumber}
              keyboardType="phone-pad"
              style={{
                padding: 0,
                fontWeight: "600",
                fontSize: fontSizes.regular,
                marginTop: 5,
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => ref_webSite.current.focus()}
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
              Website URL
            </Text>
            <TextInput
              ref={ref_webSite}
              placeholder=""
              keyboardType="default"
              value={url}
              onChangeText={seturl}
              style={{
                padding: 0,
                fontWeight: "600",
                fontSize: fontSizes.regular,
                marginTop: 5,
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => ref_addressLine1.current.focus()}
              blurOnSubmit={false}
            ></TextInput>
          </View>
        </View>
        {isIndividual ? (
          <View
            style={{
              backgroundColor: colors.white,
              paddingVertical: deviceHeight / 50,
              paddingHorizontal: 15,
              marginTop: 15,
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{ fontSize: fontSizes.small, color: colors.lightGrey }}
            >
              Birthday
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TextInput
                placeholder=""
                value={date.toString()}
                style={{
                  padding: 0,
                  fontWeight: "600",
                  fontSize: fontSizes.regular,
                  marginTop: 5,
                }}
              ></TextInput>
              <TouchableOpacity onPress={() => setOpen(true)}>
                <FastImage
                  resizeMode={"contain"}
                  source={require("../../../app/assets/images/calendar.png")}
                  style={{ height: 18, width: 15 }}
                />
              </TouchableOpacity>

              <DatePicker
                modal
                mode={"date"}
                open={open}
                date={new Date()}
                onConfirm={(getDate) => {
                  setOpen(false);
                  updateDate = moment(getDate).format("DD-MM-YYYY");
                  setDate(updateDate);
                }}
                maximumDate={new Date()}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
          </View>
        ) : null}

        <View
          style={{
            backgroundColor: colors.white,
            paddingVertical: deviceHeight / 50,
            paddingHorizontal: 15,
            marginTop: 15,
          }}
        >
          <Text style={{ fontSize: fontSizes.small, color: colors.lightGrey }}>
            Address Line 1
          </Text>
          <TextInput
            ref={ref_addressLine1}
            value={line1}
            onChangeText={setline1}
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
            returnKeyType="next"
            onSubmitEditing={() => ref_addressLine2.current.focus()}
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
          <Text style={{ fontSize: fontSizes.small, color: colors.lightGrey }}>
            Address Line 2
          </Text>
          <TextInput
            ref={ref_addressLine2}
            value={line2}
            onChangeText={setline2}
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
            returnKeyType="next"
            onSubmitEditing={() => ref_city.current.focus()}
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
          <Text style={{ fontSize: fontSizes.small, color: colors.lightGrey }}>
            City
          </Text>
          <TextInput
            ref={ref_city}
            placeholder=""
            keyboardType="default"
            value={city}
            onChangeText={setcity}
            style={{
              padding: 0,
              fontWeight: "600",
              fontSize: fontSizes.regular,
              marginTop: 5,
            }}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            blurOnSubmit={false}
          ></TextInput>
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            flexDirection: "column",
            justifyContent: "space-between",
            marginTop: 15,
            backgroundColor: colors.white,
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.small,
              color: colors.lightGrey,
              marginTop: 10,
            }}
          >
            State
          </Text>
          <SelectDropdown
            data={stateList}
            defaultValueByIndex={selectedIndex}
            onSelect={(selectedItem, index) => {
              setstate(selectedItem.code);
            }}
            buttonStyle={{ width: "100%", paddingHorizontal: 0 }}
            renderCustomizedButtonChild={(selectedItem, index) => {
              return (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: colors.white,
                  }}
                >
                  <TextInput
                    style={{
                      padding: 0,
                      fontWeight: "600",
                      fontSize: fontSizes.regular,
                    }}
                    value={selectedItem ? selectedItem.name : ""}
                  ></TextInput>

                  <FastImage
                    resizeMode={"contain"}
                    source={require("../../../app/assets/images/downArrow.png")}
                    style={{ height: 18, width: 15 }}
                  />
                </View>
              );
            }}
            dropdownStyle={{ backgroundColor: colors.white, borderRadius: 5 }}
            rowStyle={{
              borderBottomColor: "lightgray",
              height: 45,
              borderBottomWidth: 0.2,
            }}
            renderCustomizedRowChild={(item, index) => {
              return (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingHorizontal: 18,
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: 18,
                      flex: 1,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: colors.white,
            paddingVertical: deviceHeight / 50,
            paddingHorizontal: 15,
            marginTop: 15,
          }}
        >
          <Text style={{ fontSize: fontSizes.small, color: colors.lightGrey }}>
            Zip Code
          </Text>
          <TextInput
            ref={ref_zipCode}
            maxLength={6}
            placeholder=""
            keyboardType="number-pad"
            value={postalCode}
            onChangeText={setpostalCode}
            style={{
              padding: 0,
              fontWeight: "600",
              fontSize: fontSizes.regular,
              marginTop: 5,
            }}
            returnKeyType="done"
          ></TextInput>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      {!global.myState.connectedAccountDetails?.id ? (
        <View style={{ flex: 1 }}>
          <HeaderWithBack
            title="ACCOUNT"
            onPress={() => navigation.goBack()}
            isRightText={true}
            rightText="CANCEL"
            isFrom={isFrom}
            rightOnPress={() => {
              navigation.goBack();
            }}
          />
          <View style={{ flex: 1, backgroundColor: "#F5F4F7" }}>
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
                  Stripe Connect Account
                </Text>
              </View>

              <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {stripeAccountNotVerified()}
              </KeyboardAwareScrollView>
            </View>

            <View style={{ paddingVertical: 15, paddingHorizontal: 15 }}>
              <CustomButton
                titleColor={colors.white}
                borderColor={colors.background}
                onPress={
                  () => {
                    // setshowStripModel(true);
                    if (isIndividual) {
                      _handleIndualSubmit();
                    } else {
                      _handleSubmit();
                    }
                  }
                  // _handleSubmit()
                  //  navigation.navigate("Accounts", { isFrom: "AddAccount" })
                }
                title="Submit"
                backgroundColor={colors.background}
                btnLoading={loading}
              ></CustomButton>
            </View>
          </View>
        </View>
      ) : null}

      <Modal visible={showStripModel} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            height: deviceHeight,
            paddingVertical: Platform.OS === "android" ? 0 : 25,
            paddingBottom: Platform.OS === "android" ? 10 : null,
          }}
        >
          <HeaderWithBack
            title="Stripe Onboarding"
            onPress={() => {}}
            hideLeftSide={true}
            isRightText={false}
            rightText="Close"
            isFrom={isFrom}
            rightOnPress={async () => {}}
          />
          <View style={{ flex: 1 }}>
            <WebView
              domStorageEnabled={true}
              javaScriptEnabled={true}
              startInLoadingState={true}
              renderLoading={() => (
                <ActivityIndicator
                  color="black"
                  size="large"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              )}
              automaticallyAdjustContentInsets={true}
              useWebKit={true}
              // onLoadEnd={() => setusMapLoading(false)}
              bounces={false}
              scrollEnabled={true}
              style={{ height: deviceHeight / 2, width: deviceWidth }}
              // ref={webviewRef}
              scalesPageToFit={false}
              mixedContentMode="compatibility"
              // onMessage={onMessage}
              source={{
                uri: stripeOnboardingUrl,
              }}
              onNavigationStateChange={(navState) => {
                _checkOnboardingState(navState);
              }}
            />
          </View>
        </View>
      </Modal>
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

export default AddStripeConnectAccounts;
