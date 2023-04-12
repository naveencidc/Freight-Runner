/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationInsuranceRequirementsScreen.tsx
 * @extends Component
 * Created by Naveen E on 16/05/2022
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
  SafeAreaView
} from "react-native";
import { CheckBox, colors } from "react-native-elements";
import { Dropdown } from "react-native-material-dropdown";
import { withNavigation } from "react-navigation";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Button,
  CustomButton,
  LinkButton,
  Logo,
  Screen,
  SimpleInput as Input,
  Text,
  View
} from "../../components";
import { SessionContext } from "../../context/SessionContextProvider";
import { NavigationProps } from "../../navigation";
import { registerUser } from "../../services/registrationService";
import { fontSizes, STANDARD_PADDING } from "../../styles/globalStyles";
import { extractError } from "../../utilities/errorUtilities";
import colors1 from "../../styles/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import HeaderWithBack from "../../components/HeaderWithBack";
import FastImage from "react-native-fast-image";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import ImagePicker from "react-native-image-picker";
import SelectDropdown from "react-native-select-dropdown";
import { getUserProfileDetails, updateOnbardingStatus } from "../../services/userService";
import storage from "../../helpers/storage";
import { MyContext } from "../../context/MyContextProvider";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

type Props = NavigationProps;
type FormProps = {
  email: string;
  role: string;
  terms_accepted: boolean;
};

const initialValues: FormProps = {
  email: "",
  role: "",
  terms_accepted: true
};

function RegistrationInsuranceRequirmentDetail({ navigation }: Props) {
  const { setUser, setSetup, signOut } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showDiffirentRoleSelected, setShowDifferentRoleSelected] = useState(false);
  const global = useContext(MyContext);
  let isFromOnboarding = navigation.state.params?.isFromOnboarding;

  useEffect(() => {
    try {
      async function fetchStateListAPI() {
        const userDetail = await storage.get("userData");
        await getUserProfileDetails(userDetail.user_id)
          .then(async (response: any) => {
            console.log("user profile status", response.data);
            global.myDispatch({ type: "GET_USER_PROFILE_DETAILS", payload: response.data });
          })
          .catch(e => {
            console.log("Navigation failed", e.response);
            navigation.navigate("Login");
          });
      }
      fetchStateListAPI();
    } catch (error) {
      Alert.alert("Error", "There was an error. Please try again.");
    }
  }, []);

  const userProfileDetails =
    global.myState.userProfileDetails && global.myState.userProfileDetails.partnerProfile;

  const handleGoBack = () => {
    setSetup({ setup: false, orgId: "" });
    signOut();
    navigation.navigate("Login");
  };
  console.log("----$$$", userProfileDetails);
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        showOnlyHeader={isFromOnboarding ? true : false}
        title="INSURANCE REQUIREMENTS"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText="SELECT ALL"
        rightOnPress={() => navigation.goBack()}
      ></HeaderWithBack>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            backgroundColor: colors1.white,
            paddingVertical: deviceHeight / 60,
            borderBottomColor: "#EDEDED",
            borderBottomWidth: 1
          }}
        >
          <Text
            style={{
              paddingHorizontal: deviceWidth / 20,
              color: colors1.background,
              fontSize: 18,
              fontWeight: "600"
            }}
          >
            Make sure you meet our Insurance Requirements
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#F9F9F9",
            paddingHorizontal: deviceWidth / 20,
            paddingVertical: deviceHeight / 40
          }}
        >
          <Text style={{ color: "#858C97", fontSize: fontSizes.small, fontWeight: "600" }}>
            Before you proceed with your application as an independent operator, we want you to make
            sure you have the required insurance coverage listed below
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", paddingTop: deviceHeight / 40 }}
          >
            <Text style={{ fontSize: 10 }}>{"\u2B24"}</Text>
            <View style={{ paddingHorizontal: deviceHeight / 50 }}>
              <Text style={{ color: "#2F30ED", fontWeight: "bold", fontSize: 20 }}>$1,000,000</Text>
              <Text style={{ color: "#858C97", fontSize: fontSizes.small, fontWeight: "600" }}>
                General Liability Insurance
              </Text>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", paddingTop: deviceHeight / 40 }}
          >
            <Text style={{ fontSize: 10 }}>{"\u2B24"}</Text>
            <View style={{ paddingHorizontal: deviceHeight / 50 }}>
              <Text style={{ color: "#2F30ED", fontWeight: "bold", fontSize: 20 }}>$1,000,000</Text>
              <Text style={{ color: "#858C97", fontSize: fontSizes.small, fontWeight: "600" }}>
                Auto Liability Liability Insurance
              </Text>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", paddingTop: deviceHeight / 40 }}
          >
            <Text style={{ fontSize: 10 }}>{"\u2B24"}</Text>
            <View style={{ paddingHorizontal: deviceHeight / 50 }}>
              <Text style={{ color: "#2F30ED", fontWeight: "bold", fontSize: 20 }}>$50,000</Text>
              <Text style={{ color: "#858C97", fontSize: fontSizes.small, fontWeight: "600" }}>
                Non Owned Trailer, $1,000 Deductible
              </Text>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", paddingTop: deviceHeight / 40 }}
          >
            <Text style={{ fontSize: 10 }}>{"\u2B24"}</Text>
            <View style={{ paddingHorizontal: deviceHeight / 50 }}>
              <Text style={{ color: "#2F30ED", fontWeight: "bold", fontSize: 20 }}>$150,000</Text>
              <Text style={{ color: "#858C97", fontSize: fontSizes.small, fontWeight: "600" }}>
                Cargo, $1,000 Deductible
              </Text>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", paddingTop: deviceHeight / 40 }}
          >
            <Text style={{ fontSize: 10 }}>{"\u2B24"}</Text>
            <View style={{ paddingHorizontal: deviceHeight / 50 }}>
              <Text style={{ color: "#2F30ED", fontWeight: "bold", fontSize: 20 }}>$150,000</Text>
              <Text style={{ color: "#858C97", fontSize: fontSizes.small, fontWeight: "600" }}>
                Reefer Breakdown, $2500 Deductible
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#FBF8EC",
            paddingHorizontal: deviceWidth / 20,
            paddingVertical: deviceHeight / 60,
            borderBottomWidth: 1,
            borderBottomColor: "#EDEDED"
          }}
        >
          <View style={{}}>
            <Text style={{ color: "#2F2F2F", fontWeight: "bold", fontSize: fontSizes.small }}>
              LUXET TRANSPORT LOGISTICS LLC
            </Text>
            <Text style={{ color: "#2F2F2F", fontWeight: "600", fontSize: fontSizes.xSmall }}>
              must be listed as additional insured.
            </Text>
          </View>

          <View style={{ paddingTop: deviceHeight / 60 }}>
            <Text style={{ color: "#2F2F2F", fontWeight: "bold", fontSize: fontSizes.small }}>
              LUXET TRANSPORT LOGISTICS LLC, PO BOX 632,
            </Text>
            <Text style={{ color: "#2F2F2F", fontWeight: "bold", fontSize: fontSizes.small }}>
              HOUSTON, TX, 79114
            </Text>
            <Text style={{ color: "#2F2F2F", fontWeight: "600", fontSize: fontSizes.xSmall }}>
              must be listed as Certificate Holder
            </Text>
          </View>
        </View>

        <View style={{ marginTop: deviceHeight / 50, paddingHorizontal: deviceWidth / 20 }}>
          <CustomButton
            titleColor={colors1.white}
            borderColor={"#1F1F1F"}
            onPress={async () => {
              const userDetail = await storage.get("userData");
              const updateOnbardingStatusResponse = await updateOnbardingStatus({
                user_id: userDetail.user_id,
                is_onboard_pending: 2,
                completed_step: 4,
                is_welcome_screen_viewed: 2
              });
              if (userProfileDetails.partnerProfileDetails.is_business === 1) {
                //If user account is business account
                navigation.navigate("RegistrationBusinessAddressScreen", {
                  isFromOnboarding: isFromOnboarding
                });
              } else {
                //If user account is personal account
                navigation.navigate("RegistrationServiceAreasScreen", {
                  isFromOnboarding: isFromOnboarding
                });
              }
            }}
            title="Got it"
            backgroundColor={colors1.background}
          ></CustomButton>
          <Text
            style={{
              textDecorationLine: "underline",
              color: "#000000",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: fontSizes.small,
              paddingVertical: deviceHeight / 70
            }}
          >
            {" "}
            Email Details to my Insureance Agent
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
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
    width: "95%"
  },
  bottom: {
    flexDirection: "row",
    marginLeft: 25,
    alignSelf: "center",
    marginTop: 20
  },
  termsBotton: {
    flexDirection: "row",
    marginLeft: Platform.OS === "ios" ? 30 : 5,
    marginTop: -15
  },
  termsLink: {
    marginTop: -13,
    marginLeft: Platform.OS === "ios" ? -25 : 0
  },
  signUpButton: {
    marginTop: -15,
    marginLeft: -25
  },
  name: {
    fontSize: 12
  },
  container: {
    backgroundColor: "white",
    flex: 1
    // paddingHorizontal: STANDARD_PADDING
  },
  dropdown3BtnStyle: {
    width: "100%",
    paddingHorizontal: 0
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dropdown3BtnImage: { width: 45, height: 45, resizeMode: "cover" },
  dropdown3BtnTxt: {
    flex: 0.8,
    color: "#444",
    // textAlign: 'center',
    fontWeight: "600",
    fontSize: 18
  },
  dropdown3DropdownStyle: { backgroundColor: "#EFEFEF", borderRadius: 5 },
  dropdown3RowStyle: {
    // backgroundColor: 'slategray',
    borderBottomColor: "#EFEFEF",
    height: 50
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 18
  },
  dropdownRowImage: { width: 45, height: 45, resizeMode: "contain" },
  dropdown3RowTxt: {
    color: "black",
    fontWeight: "500",
    fontSize: 18,
    // marginHorizontal: 12,
    flex: 1
  }
});

export default withNavigation(RegistrationInsuranceRequirmentDetail);
