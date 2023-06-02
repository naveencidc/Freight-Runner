/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationTruckDetailScreen.tsx
 * @extends Component
 * Created by Naveen E on 12/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Alert,
  StyleSheet,
  ViewStyle,
  Platform,
  TextInput,
  Dimensions,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Formik } from "formik";
import {
  CustomButton,
  SimpleInput as Input,
  Text,
  View,
} from "../../components";
import {
  getVehileDetails,
  createUserTruck,
  getTruckBrandName,
  getTruckModelName,
  getPowerType,
} from "../../services/registrationService";
import { fontSizes, STANDARD_PADDING } from "../../styles/globalStyles";
import { extractError } from "../../utilities/errorUtilities";
import colors1 from "../../styles/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import HeaderWithBack from "../../components/HeaderWithBack";
import FastImage from "react-native-fast-image";
import SelectDropdown from "react-native-select-dropdown";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import storage from "../../helpers/storage";
import { getUserTruckList } from "../../services/myProfileServices";
import { MyContext } from ".././../../app/context/MyContextProvider";
import { updateOnbardingStatus } from "../../services/userService";
import StandardModal from "../../components/StandardModal";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

type FormProps = {
  vinNumber: string;
};

const initialValues: FormProps = {
  vinNumber: "",
};

let pushArray = [];
function RegistrationTruckDetailScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [vinSuccess, setVINSuccess] = useState(false);
  const [vehileDetails, setVehileDetails] = useState({});
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [truckBrandName, setTruckBrandName] = useState([]);
  const [truckModelName, setTruckModelName] = useState([]);
  const [year, setYear] = useState();
  const [selectedBrandId, setSelectedBrandId] = useState();
  const [selectedModelId, setSelectedModelId] = useState();
  const [isShowModel, setisShowModel] = useState(false);
  const [selectedPowerTypeId, setselectedPowerTypeId] = useState();
  const [powerTypeList, setpowerTypeList] = useState([]);
  const [selectedTrailerCapacity, setselectedTrailerCapacity] = useState("");

  let isFrom = route.params?.isFrom;
  const global = useContext(MyContext);
  const makeDropdownRef = useRef({});
  const modelDropdownRef = useRef({});
  const yearDropdoenRef = useRef({});
  const powerTypeListRef = useRef({});

  useEffect(() => {
    if (selectedBrandId) {
      async function fetchTruckBrandNameAPI() {
        const truckModelNameResponse = await getTruckModelName(selectedBrandId)
          .then(async (response) => {
            setTruckModelName(response?.data);
          })
          .catch((e) => {
            setTruckModelName([]);
            // Alert.alert("Error", e.response.data.message);
            Alert.alert("", e.response.data.message, [
              {
                text: "OK",
                onPress: () => {
                  makeDropdownRef.current.reset();
                  yearDropdoenRef.current.reset();
                  setSelectedBrandId(undefined);
                },
              },
            ]);
            // returnResponse = e.response;
          });
      }
      fetchTruckBrandNameAPI();
    }
  }, [selectedBrandId]);

  useEffect(() => {
    try {
      async function fetchTruckBrandNameAPI() {
        const powertype = await getPowerType();
        setpowerTypeList(powertype.data);
        // const userToken = await storage.get("userData");
        // console.log('--userToken---',userToken)
        //To get Trailer type list
        const truckBrandNameResponse = await getTruckBrandName();
        setTruckBrandName(truckBrandNameResponse.data);
      }
      fetchTruckBrandNameAPI();
    } catch (error) {
      Alert.alert("Error", "There was an error. Please try again.");
    }
    // fetching current year to previous years
    const year = new Date().getFullYear();
    const years = Array.from(new Array(50), (val, index) => index - year);
    years.map((year, index) => {
      let getYear = "" + year;
      while (getYear.charAt(0) === "-") {
        getYear = getYear.substring(1);
      }
      pushArray.push(getYear);
    });
  }, []);

  const handleText = (text) => {
    setYear(text);
  };

  const _validateTruckDetails = async () => {
    const userDetail = await storage.get("userData");
    setLoading(true);
    try {
      const createUserTruckResponse = await createUserTruck({
        user_id: userDetail.user_id,
        model_id:
          vehileDetails && vehileDetails.model_id
            ? vehileDetails.model_id
            : selectedModelId,
        brand_id:
          vehileDetails && vehileDetails.brand_id
            ? vehileDetails.brand_id
            : selectedBrandId,
        year: vehileDetails && vehileDetails.year ? vehileDetails.year : year,
        vin: vehileDetails.vin,
        power_type_id: selectedPowerTypeId,
      });
      if (createUserTruckResponse) {
        setMessage("Truck created successfully.");
        setVisible(true);
        if (isFrom === "TruckList") {
          const userTruckList = await getUserTruckList(
            userDetail.user_id,
            "0",
            "10"
          );
          global.myDispatch({
            type: "GET_USER_TRUCK_LIST",
            payload: userTruckList.data,
          });
          navigation.navigate("TruckList", { isFrom: "TruckList" });
        } else {
          setLoading(false);

          setisShowModel(true);
        }
      }
    } catch (e) {
      const error = extractError(e);
      Alert.alert(
        "Error",
        error
          ? error
          : "There is an issue in Adding truck now. Please try again later."
      );
      setLoading(false);
    }
  };

  const createUserTruckDetails = async () => {
    if (
      selectedBrandId === undefined &&
      selectedModelId === undefined &&
      vinSuccess
    ) {
      _validateTruckDetails();
    } else if (
      selectedBrandId === undefined ||
      selectedModelId === undefined ||
      (year === undefined && !vinSuccess)
    ) {
      Alert.alert("Error", "Please provide valid truck details");
    } else if (year.trim().length < 4) {
      Alert.alert("Error", "Please enater valid year");
    } else {
      _validateTruckDetails();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        showOnlyHeader={isFrom === "TruckList" ? false : true}
        title="MAKE & MODEL"
        onPress={() => navigation.goBack()}
      ></HeaderWithBack>
      <KeyboardAwareScrollView
        style={{}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Formik
          initialValues={initialValues}
          render={({ handleBlur, errors, values, touched, setFieldValue }) => {
            return (
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    paddingHorizontal: deviceWidth / 20,
                    color: colors1.background,
                    fontSize: fontSizes.large,
                    fontWeight: "600",
                    paddingVertical: deviceHeight / 40,
                  }}
                >
                  Enter Truck Details
                </Text>

                <View
                  style={[
                    styles.textInputView,
                    { paddingVertical: 5, marginBottom: deviceHeight / 55 },
                  ]}
                >
                  <Text
                    style={{ fontSize: 14, fontWeight: "500", color: "gray" }}
                  >
                    Power Type
                  </Text>

                  <SelectDropdown
                    ref={powerTypeListRef}
                    data={powerTypeList}
                    onSelect={(selectedItem, index) => {
                      console.log("-selectedItemselectedItem-", selectedItem);
                      setselectedPowerTypeId(selectedItem.power_type_id);
                    }}
                    buttonStyle={styles.dropdown3BtnStyle}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      return (
                        <View style={[styles.dropdown3BtnChildStyle, {}]}>
                          <Text style={styles.dropdown3BtnTxt}>
                            {selectedItem && selectedItem.type
                              ? selectedItem.type
                              : "Select Power Type"}
                          </Text>
                          <FastImage
                            resizeMode={"contain"}
                            source={require("../../../app/assets/images/downArrow.png")}
                            style={{ height: 18, width: 15 }}
                          />
                        </View>
                      );
                    }}
                    dropdownStyle={styles.dropdown3DropdownStyle}
                    rowStyle={styles.dropdown3RowStyle}
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <View style={styles.dropdown3RowChildStyle}>
                          <Text style={styles.dropdown3RowTxt}>
                            {item.type}
                          </Text>
                          <FastImage
                            resizeMode="contain"
                            source={{ uri: item.logo ? item.logo : "" }}
                            style={styles.dropdownRowImage}
                          />
                        </View>
                      );
                    }}
                  />
                </View>

                <View style={styles.textInputView}>
                  <View style={{ flexDirection: "row", marginVertical: 0 }}>
                    <Input
                      editable={selectedPowerTypeId ? true : false}
                      label="VIN"
                      autoCapitalize="none"
                      isFrom="TruckDetailScreen"
                      autoCorrect={false}
                      style={{
                        fontSize: fontSizes.regular,
                        // fontWeight: "500",
                        marginTop: 5,
                      }}
                      onChangeText={async (text) => {
                        setFieldValue("vinNumber", text);
                        if (text.length === 17) {
                          const vehileResponse = await getVehileDetails(text);
                          setVehileDetails(vehileResponse.data);
                          setVINSuccess(true);
                        }
                      }}
                      onBlur={handleBlur("vinNumber")}
                      value={values.vinNumber}
                      placeholder="Enter VIN number"
                      placeholderTextColor={
                        selectedPowerTypeId ? "#000000" : "lightgray"
                      }
                      keyboardType="default"
                      returnKeyType="next"
                      onEndEditing={async (text) => {
                        if (text && text.nativeEvent.text === 17) {
                          const vehileResponse = await getVehileDetails(
                            text.nativeEvent.text
                          );
                          setVehileDetails(vehileResponse.data);
                          setVINSuccess(true);
                        }
                      }}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.textInputView,
                    { paddingVertical: 5, marginTop: deviceHeight / 55 },
                  ]}
                >
                  <Text
                    style={{ fontSize: 14, fontWeight: "500", color: "gray" }}
                  >
                    Select Make
                  </Text>

                  <SelectDropdown
                    disabled={selectedPowerTypeId ? false : true}
                    ref={makeDropdownRef}
                    data={truckBrandName}
                    onSelect={(selectedItem, index) => {
                      console.log("-selectedItemselectedItem-", selectedItem);
                      setSelectedBrandId(selectedItem.brand_id);
                      modelDropdownRef.current.reset();
                    }}
                    buttonStyle={styles.dropdown3BtnStyle}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      return (
                        <View style={[styles.dropdown3BtnChildStyle, {}]}>
                          <Text
                            style={[
                              styles.dropdown3BtnTxt,
                              {
                                color: selectedPowerTypeId
                                  ? "#000000"
                                  : "lightgray",
                              },
                            ]}
                          >
                            {vehileDetails.brand_name
                              ? vehileDetails.brand_name
                              : selectedItem
                              ? selectedItem.brand_name
                              : "Select Make"}
                          </Text>
                          {!vehileDetails.brand_name ? (
                            <>
                              {selectedItem ? (
                                <FastImage
                                  resizeMode={"contain"}
                                  source={{
                                    uri: selectedItem.logo
                                      ? selectedItem.logo
                                      : "",
                                  }}
                                  // style={styles.dropdown3BtnImage}
                                  style={{ width: 55, height: 55 }}
                                />
                              ) : null}
                              <FastImage
                                resizeMode={"contain"}
                                source={require("../../../app/assets/images/downArrow.png")}
                                style={{ height: 18, width: 15 }}
                                tintColor={
                                  selectedPowerTypeId ? "#000000" : "lightgray"
                                }
                              />
                            </>
                          ) : null}
                        </View>
                      );
                    }}
                    dropdownStyle={styles.dropdown3DropdownStyle}
                    rowStyle={styles.dropdown3RowStyle}
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <View style={styles.dropdown3RowChildStyle}>
                          <Text style={styles.dropdown3RowTxt}>
                            {item.brand_name}
                          </Text>
                          <FastImage
                            resizeMode="contain"
                            source={{ uri: item.logo ? item.logo : "" }}
                            style={styles.dropdownRowImage}
                          />
                        </View>
                      );
                    }}
                  />
                </View>

                <View
                  style={[
                    styles.textInputView,
                    { paddingVertical: 5, marginTop: deviceHeight / 55 },
                  ]}
                >
                  <Text
                    style={{ fontSize: 14, fontWeight: "500", color: "gray" }}
                  >
                    Select Model
                  </Text>
                  <SelectDropdown
                    disabled={selectedBrandId ? false : true}
                    ref={modelDropdownRef}
                    data={truckModelName}
                    onSelect={(selectedItem, index) => {
                      setSelectedModelId(selectedItem.model_id);
                    }}
                    buttonStyle={styles.dropdown3BtnStyle}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      return (
                        <View style={styles.dropdown3BtnChildStyle}>
                          <Text
                            style={[
                              styles.dropdown3BtnTxt,
                              {
                                color: selectedBrandId
                                  ? "#000000"
                                  : "lightgray",
                              },
                            ]}
                          >
                            {vehileDetails.model_name
                              ? vehileDetails.model_name
                              : selectedItem
                              ? selectedItem.model_name
                              : "Select Model"}
                          </Text>
                          {!vehileDetails.model_name ? (
                            <>
                              {selectedItem ? (
                                <FastImage
                                  source={{
                                    uri: selectedItem.image
                                      ? selectedItem.image
                                      : "",
                                  }}
                                  resizeMode="contain"
                                  style={{ width: 55, height: 55 }}
                                />
                              ) : null}

                              <FastImage
                                resizeMode={"contain"}
                                source={require("../../../app/assets/images/downArrow.png")}
                                style={{ height: 18, width: 15 }}
                                tintColor={
                                  selectedBrandId ? "#000000" : "lightgray"
                                }
                              />
                            </>
                          ) : null}
                        </View>
                      );
                    }}
                    dropdownStyle={styles.dropdown3DropdownStyle}
                    rowStyle={styles.dropdown3RowStyle}
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <View style={styles.dropdown3RowChildStyle}>
                          <Text style={styles.dropdown3RowTxt}>
                            {item.model_name}
                          </Text>
                          <FastImage
                            resizeMode={FastImage.resizeMode.contain}
                            source={{ uri: item.image ? item.image : "" }}
                            style={styles.dropdownRowImage}
                          />
                        </View>
                      );
                    }}
                  />
                </View>
                <View
                  style={[
                    styles.textInputView,
                    { paddingVertical: 5, marginTop: deviceHeight / 55 },
                  ]}
                >
                  <Text
                    style={{ fontSize: 14, fontWeight: "500", color: "gray" }}
                  >
                    Select Year
                  </Text>
                  <SelectDropdown
                    disabled={selectedBrandId && selectedModelId ? false : true}
                    ref={yearDropdoenRef}
                    data={pushArray}
                    onSelect={(selectedItem, index) => {
                      setYear(selectedItem);
                    }}
                    buttonStyle={styles.dropdown3BtnStyle}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      return (
                        <View style={styles.dropdown3BtnChildStyle}>
                          <TextInput
                            editable={
                              selectedBrandId && selectedModelId ? true : false
                            }
                            maxLength={4}
                            style={[styles.dropdown3BtnTxt]}
                            placeholder="Enter Year"
                            placeholderTextColor={
                              selectedBrandId && selectedModelId
                                ? colors1.black
                                : "lightgray"
                            }
                            value={
                              vehileDetails ? vehileDetails.year : selectedItem
                            }
                            onChangeText={(text) => handleText(text)}
                            defaultValue={year}
                            keyboardType="number-pad"
                            returnKeyType="done"
                          ></TextInput>

                          <FastImage
                            resizeMode={"contain"}
                            source={require("../../../app/assets/images/downArrow.png")}
                            style={{ height: 18, width: 15 }}
                            tintColor={
                              selectedBrandId && selectedModelId
                                ? colors1.black
                                : "lightgray"
                            }
                          />
                        </View>
                      );
                    }}
                    dropdownStyle={styles.dropdown3DropdownStyle}
                    rowStyle={styles.dropdown3RowStyle}
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <View style={styles.dropdown3RowChildStyle}>
                          <Text style={styles.dropdown3RowTxt}>{item}</Text>
                        </View>
                      );
                    }}
                  />
                </View>

                {/* <View
                  style={[
                    styles.textInputView,
                    { marginTop: deviceHeight / 55, paddingVertical: 10 }
                  ]}
                >
                  <Text style={{ fontSize: 14, fontWeight: "500", color: "gray" }}>
                    Max Load Capacity(Lbs)
                  </Text>
                  <View style={{ flexDirection: "row", marginVertical: 5, flex: 1 }}>
                    <TextInput
                      // editable={!selectedHookupID ? false : true}
                      maxLength={6}
                      style={{
                        padding: 0,
                        fontWeight: "500",
                        fontSize: 16,
                        flex: 1
                      }}
                      onChangeText={newText => setselectedTrailerCapacity(newText)}
                      value={selectedTrailerCapacity}
                      placeholder="0"
                      keyboardType="number-pad"
                    />
                    <Text style={{ marginLeft: 10, fontWeight: "500", fontSize: 16 }}>lbs.</Text>
                  </View>
                </View> */}

                <View
                  style={{
                    marginVertical: deviceHeight / 6,
                    paddingHorizontal: deviceWidth / 15,
                  }}
                >
                  <CustomButton
                    titleColor={colors1.white}
                    borderColor={colors1.btnColor}
                    btnLoading={loading}
                    onPress={() => createUserTruckDetails()}
                    title="Submit"
                    backgroundColor={
                      vinSuccess
                        ? colors1.btnColor
                        : selectedBrandId === undefined ||
                          selectedModelId === undefined ||
                          year === undefined ||
                          (year === "" && !vinSuccess)
                        ? "#454545"
                        : colors1.btnColor
                    }
                    disableButton={
                      vinSuccess
                        ? false
                        : selectedBrandId === undefined ||
                          selectedModelId === undefined ||
                          year === undefined ||
                          (year === "" && !vinSuccess)
                        ? true
                        : false
                    }
                  ></CustomButton>
                </View>
                <StandardModal visible={isShowModel}>
                  <View>
                    <Text
                      style={{
                        fontSize: fontSizes.large,
                        fontWeight: "700",
                        color: "black",
                      }}
                    >
                      {"Add Truck"}
                    </Text>
                    <Text
                      style={{
                        color: "black",
                        fontSize: fontSizes.medium,
                        fontWeight: "400",
                        marginVertical: deviceHeight / 30,
                      }}
                    >
                      {"Are you sure want to add another truck?"}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <TouchableOpacity
                          onPress={async () => {
                            const userDetail = await storage.get("userData");
                            const updateOnbardingStatusResponse =
                              await updateOnbardingStatus({
                                user_id: userDetail.user_id,
                                is_onboard_pending: 2,
                                completed_step: 1,
                                is_welcome_screen_viewed: 2,
                              });
                            navigation.navigate(
                              "RegistrationTrailerDetailScreen"
                            );
                            setisShowModel(false);
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
                            Next
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={{ flex: 1, paddingLeft: 10 }}>
                        <TouchableOpacity
                          onPress={async () => {
                            setFieldValue("vinNumber", "");
                            makeDropdownRef.current.reset();
                            modelDropdownRef.current.reset();
                            yearDropdoenRef.current.reset();
                            setSelectedBrandId(undefined);
                            setSelectedModelId(undefined);
                            setVehileDetails({});
                            setYear(undefined);
                            setisShowModel(false);
                          }}
                          style={{
                            backgroundColor: colors1.background,
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
                              color: colors1.white,
                            }}
                          >
                            {"Add"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </StandardModal>
              </View>
            );
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
  textInputView: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  buttons: {
    alignSelf: "center",
    marginTop: 10,
    width: "95%",
  },
  bottom: {
    flexDirection: "row",
    marginLeft: 25,
    alignSelf: "center",
    marginTop: 20,
  },
  termsBotton: {
    flexDirection: "row",
    marginLeft: Platform.OS === "ios" ? 30 : 5,
    marginTop: -15,
  },
  termsLink: {
    marginTop: -13,
    marginLeft: Platform.OS === "ios" ? -25 : 0,
  },
  signUpButton: {
    marginTop: -15,
    marginLeft: -25,
  },
  name: {
    fontSize: 12,
  },
  container: {
    backgroundColor: "white",
  },
  dropdown3BtnStyle: {
    width: "100%",
    paddingHorizontal: 0,
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F4F7",
  },
  dropdown3BtnImage: { width: 45, height: 45, resizeMode: "cover" },
  dropdown3BtnTxt: {
    flex: 0.9,
    color: "#000000",
    fontSize: fontSizes.regular,
  },
  dropdown3DropdownStyle: { backgroundColor: "#F5F4F7", borderRadius: 5 },
  dropdown3RowStyle: {
    borderBottomColor: "#EFEFEF",
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  dropdownRowImage: { width: 45, height: 45, resizeMode: "contain" },
  dropdown3RowTxt: {
    color: "black",
    fontWeight: "500",
    fontSize: 18,
    flex: 1,
  },
  textInputView: {
    paddingHorizontal: deviceWidth / 20,
    flexDirection: "column",
    justifyContent: "space-between",

    backgroundColor: "#F5F4F7",
    borderColor: "#EDEDED",
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 8,
    shadowOffset: { width: -2, height: 2 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginHorizontal: 15,
    elevation: 3,
  },
});

export default RegistrationTruckDetailScreen;
