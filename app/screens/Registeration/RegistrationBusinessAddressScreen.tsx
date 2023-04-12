/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationBusinessAddressScreen.tsx
 * @extends Component
 * Created by Naveen E on 01/06/2022
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
import { saveBusinessAddress } from "../../services/registrationService";
import { fontSizes, STANDARD_PADDING } from "../../styles/globalStyles";
import { extractError } from "../../utilities/errorUtilities";
import colors1 from "../../styles/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import HeaderWithBack from "../../components/HeaderWithBack";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import FastImage from "react-native-fast-image";
import { reverseLookup } from "../../services/mapboxService";
import { getCurrentLocation } from "../../utilities/gpsUtilities";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { GeoPosition } from "react-native-geolocation-service";
import { MyContext } from ".././../../app/context/MyContextProvider";
import Config from "react-native-config";
import storage from "../../helpers/storage";
import { SnackbarContext, SnackbarContextType } from "../../context/SnackbarContext";
import { updateOnbardingStatus } from "../../services/userService";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

let currentPosition: GeoPosition;
let features: any = {};
let addressObj: Object = {};
let currentLocation: any = {};
MapboxGL.setAccessToken(Config.MAPBOX_API_KEY);

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

function RegistrationBusinessAddress({ navigation }: Props) {
  const { setUser, setSetup, signOut } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const { setMessage, setVisible } = useContext<SnackbarContextType>(SnackbarContext);
  const [selectedRole, setSelectedRole] = useState<string>("");
  let [address1, setAddress1] = useState<string>("");
  let [address2, setAddress2] = useState<string>("");
  let [city, setCity] = useState<string>("");
  let [stateName, setState] = useState<string>("");
  let [zipCode, setZipCode] = useState(addressObj);
  let [hideText, setHideText] = useState(false);

  const global = useContext(MyContext);
  let isFromOnboarding = navigation.state.params?.isFromOnboarding;

  console.log("-state", global.myState);
  useEffect(() => {
    getCurrentLocation(position => {
      currentPosition = position;
    });
  }, []);
  // type Props = {
  //   user_id: string;
  //   name: string;
  //   lat: string;
  //   lng: string;
  // };
  const getSelectedCoordinates = async (data, details) => {
    // let arrayData = {
    //   coords: {
    //     latitude: getLocation[0],
    //     longitude: getLocation[1]
    //   }
    // };
    try {
      const userDetail = await storage.get("userData");
      console.log("&***0", data, details);
      await saveBusinessAddress({
        user_id: userDetail.user_id,
        address: data.description,
        lat: details?.geometry?.location.lat,
        long: details?.geometry?.location.lng
      })
        .then(async response => {
          setLoading(false);
          console.log(" Login response", response);
          if (response.status === 201) {
            global.myDispatch({ type: "REGISTER_BUSINESS_INFO_SUCCESS", payload: response });
            const updateOnbardingStatusResponse = await updateOnbardingStatus({
              user_id: userDetail.user_id,
              is_onboard_pending: 2,
              completed_step: 5,
              is_welcome_screen_viewed: 2
            });
            setMessage("Business Address Updated Successfully");
            navigation.navigate("RegistrationServiceAreasScreen");
            setVisible(true);
            setLoading(false);
          }
        })
        .catch(e => {
          setLoading(false);
          Alert.alert("Error", e.response.data.message);
          // returnResponse = e.response;
        });
      // const placeInfo = await reverseLookup(arrayData);
      // if (placeInfo.data.features.length > 0) {
      //   features = placeInfo.data.features[0];
      //   const arrPlaceNames: Array<any> = features.placeName.split(",");
      //   if (arrPlaceNames) {
      //     address1 = arrPlaceNames[0];
      //     address2 = arrPlaceNames[1];
      //     city = arrPlaceNames[arrPlaceNames.length - 3];
      //     const stateZip = arrPlaceNames[arrPlaceNames.length - 2];
      //     const arrStateZip = stateZip.split(" ");
      //     if (arrStateZip.length >= 2) {
      //       zipCode = arrStateZip[arrStateZip.length - 1];
      //       stateName = arrStateZip[arrStateZip.length - 2];
      //     }

      //     addressObj = {
      //       address_line1: address1,
      //       address_line2: address2,
      //       city: city,
      //       state: stateName,
      //       zip_code: zipCode
      //     };
      //   }

      //   currentLocation = addressObj.city;
      //   console.log("&***0", features.placeName);
      //   await saveBusinessAddress({
      //     user_id: userDetail.user_id,
      //     address: features.placeName,
      //     lat: getLocation[0],
      //     long: getLocation[1]
      //   })
      //     .then(async response => {
      //       setLoading(false);
      //       console.log(" Login response", response);
      //       if (response.status === 201) {
      //         global.myDispatch({ type: "REGISTER_BUSINESS_INFO_SUCCESS", payload: response });
      //         // const updateOnbardingStatusResponse = await updateOnbardingStatus({
      //         //   user_id: userDetail.user_id,
      //         //   is_onboard_pending: 2,
      //         //   completed_step: 5,
      //         //   is_welcome_screen_viewed: 2
      //         // });
      //         // setMessage("Business Address Updated Successfully");
      //         // navigation.navigate("RegistrationServiceAreasScreen");
      //         // setVisible(true);
      //         setLoading(false);
      //       }
      //     })
      //     .catch(e => {
      //       setLoading(false);
      //       Alert.alert("Error", e.response.data.message);
      //       // returnResponse = e.response;
      //     });
      // }
    } catch (error) {
      Alert.alert(
        "Error",
        "There was a problem registering your business address. Please try again soon."
      );
      setLoading(false);
    }
  };
  const hideTexts = () => {
    setHideText(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        showOnlyHeader={isFromOnboarding ? true : false}
        title="BUSINESS ADDRESS"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText="SELECT ALL"
        rightOnPress={() => navigation.goBack()}
      ></HeaderWithBack>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <GooglePlacesAutocomplete
          disableScroll={true}
          autoCorrect={false}
          spellCheck={false}
          fetchDetails={true}
          enablePoweredByContainer={false}
          GooglePlacesDetailsQuery={{ fields: "geometry" }}
          keepResultsAfterBlur={true}
          placeholder="Search business address"
          query={{
            key: "AIzaSyDAmOaaNP3Yx-MBnK2wGTqWMBnAaPPEY_0",
            language: "en",
            components: "country:us"
          }}
          renderHeaderComponent={() => {
            return (
              <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                <Text style={{ fontSize: fontSizes.small, color: colors1.grey }}>
                  {hideText === true ? null : "Search Results"}
                </Text>
              </View>
            );
          }}
          renderRightButton={() => {
            return (
              <View
                style={{
                  // position: "absolute",
                  // right: 0,
                  // top: deviceHeight / 25,
                  paddingRight: 10,
                  backgroundColor: "#F5F4F7",
                  borderColor: "#EDEDED",
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 15,
                  height: deviceHeight / 14
                }}
              >
                <FastImage
                  resizeMode={"contain"}
                  source={require("../../../app/assets/images/LocationColor.png")}
                  style={{ height: 25, width: 25 }}
                />
              </View>
            );
          }}
          renderRow={(data, index) => {
            return (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FastImage
                  resizeMode={"contain"}
                  source={require("../../../app/assets/images/LocationGray.png")}
                  style={{ height: 25, width: 25, marginVertical: 12, marginRight: 12 }}
                />
                <View>
                  <Text style={{ color: colors1.background, fontWeight: "600" }}>
                    {data.structured_formatting.main_text}
                  </Text>
                  <Text style={{ color: colors1.grey, fontSize: fontSizes.xSmall, marginTop: 5 }}>
                    {data.structured_formatting.secondary_text}
                  </Text>
                </View>
              </View>
            );
          }}
          listEmptyComponent={() => {
            return (
              <Text
                style={{
                  fontSize: 16,
                  alignSelf: "center",
                  marginTop: 10,
                  // fontFamily: "SofiaPro-Regular",
                  color: "#A19B9B"
                }}
              >
                {hideText === true ? null : "No results founds"}
              </Text>
            );
          }}
          textInputProps={{
            InputComp: TextInput,
            placeholder: "Search business address",
            placeholderTextColor: colors1.black,
            backgroundColor: "#F5F4F7",
            borderColor: "#EDEDED",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            // paddingVertical: deviceHeight / 55,
            // color: '#FFFFF',
            height: deviceHeight / 14,
            borderRadius: 0,
            marginTop: 15,
            // fontFamily: "SofiaPro-Regular",
            returnKeyType: "done",
            focusable: true,
            autoFocus: true,
            autoCorrect: false,
            spellCheck: false,
            clearButtonMode: "never"
          }}
          onPress={(data, details = null) => {
            console.log("----", data, details);
            // let setCoordinates = [
            //   JSON.stringify(details?.geometry?.location.lat),
            //   JSON.stringify(details?.geometry?.location.lng)
            // ];
            getSelectedCoordinates(data, details);
            setHideText(true);
          }}
          styles={{
            row: {
              padding: 10,
              backgroundColor: colors1.white
            }
          }}
        />
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

export default withNavigation(RegistrationBusinessAddress);
