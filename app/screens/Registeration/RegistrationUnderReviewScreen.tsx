/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationBusinessInfoScreen.tsx
 * @extends Component
 * Created by Naveen E on 17/05/2022
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
  FlatList
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
import { socket } from "../../utilities/socketInst";
import storage from "../../helpers/storage";

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

function RegistrationUnderReview({ navigation }: Props) {
  const { setUser, setSetup, signOut } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showDiffirentRoleSelected, setShowDifferentRoleSelected] = useState(false);

  useEffect(() => {
    const { state } = navigation;
    if (state.params && state.params.setup && state.params.setupOrgId) {
      setSetup({ setup: true, orgId: state.params.setupOrgId });
    }
  }, [navigation]);

  useEffect(() => {
    try {
      async function fetchAPI() {
        let userDetail: any = await storage.get("userData");
        //Socket to update OnBoarding Status
        socket.on(`global/partner/approval/${userDetail.user_id}`, data => {
          console.log("-OnBoarding Response-", data);
          if (data.status === 1) {
            navigation.navigate("TruckList", { isFromOnboarding: true });
          } else if (data.status === 4) {
            navigation.navigate("RegistrationRejectedScreen");
          }
        });
      }
      fetchAPI();
    } catch (error) {
      console.log("socket error", error);
    }
    return () => {
      async function remove() {
        let userDetail: any = await storage.get("userData");
        socket.off(`global/partner/approval/${userDetail.user_id}`);
      }
      remove();
    };
  }, []);

  const handleGoBack = () => {
    navigation.navigate("LoginScreen");
  };

  return (
    <Screen style={styles.container}>
      <HeaderWithBack
        title="UNDER REVIEW"
        onPress={() => handleGoBack()}
        showOnlyHeader={false}
        isRightText={false}
        rightText="Contact Us"
        rightOnPress={() => navigation.navigate("ContactUs")}
      ></HeaderWithBack>
      {/* <KeyboardAwareScrollView keyboardShouldPersistTaps="handled"> */}
      <View style={{ flex: 1 }}>
        <View style={{ paddingVertical: deviceHeight / 12, alignItems: "center" }}>
          <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
            Thanks for filling out the application.
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              paddingHorizontal: deviceWidth / 20
            }}
          >
            We are reviewing your application and will notify you as soon as we have any update.
          </Text>
        </View>
        <View style={{ alignItems: "center", flex: 0.85 }}>
          <FastImage
            resizeMode={"contain"}
            source={require("../../../app/assets/images/underReview.png")}
            style={{ alignSelf: "center", height: deviceHeight / 3, width: deviceHeight / 3 }}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ContactUs")}
          style={{ paddingVertical: deviceHeight / 35 }}
        >
          <Text style={{ color: "black", textAlign: "center", textDecorationLine: "underline" }}>
            Contact Us
          </Text>
        </TouchableOpacity>
      </View>
      {/* </KeyboardAwareScrollView> */}
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
    backgroundColor: "white"
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

export default withNavigation(RegistrationUnderReview);
