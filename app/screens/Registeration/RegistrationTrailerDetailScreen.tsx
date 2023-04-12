/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationTrailerDetailScreen.tsx
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
  TouchableOpacity,
  TextInput,
  Dimensions,
  ImageStyle,
  TextStyle,
  SafeAreaView,
  FlatList,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { CustomButton, Text, View } from "../../components";
import {
  getTrailerTypeList,
  getTrailerTypeConfig,
  createUserTrailer,
  getTrailerHookup,
} from "../../services/registrationService";
import { fontSizes, STANDARD_PADDING } from "../../styles/globalStyles";
import colors1 from "../../styles/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import HeaderWithBack from "../../components/HeaderWithBack";
import FastImage from "react-native-fast-image";
import SelectDropdown from "react-native-select-dropdown";
import { MyContext } from ".././../../app/context/MyContextProvider";
import storage from "../../helpers/storage";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import { getUserTrailerList } from "../../services/myProfileServices";
import { updateOnbardingStatus } from "../../services/userService";
import StandardModal from "../../components/StandardModal";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

function RegistrationTrailerDetailScreen({ navigation, route }) {
  const global = useContext(MyContext);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trailerTypeList, setTrailerTypeList] = useState([]);
  const [trailerTypeConfig, settrailerTypeConfig] = useState({});
  const [selectedOffloadEquipments, setselectedOffloadEquipments] = useState(
    []
  );
  const [selectedTrailerTypeID, setselectedTrailerTypeID] = useState();
  const [selectedTrailerConnectionID, setselectedTrailerConnectionID] =
    useState();
  const [selectedTrailerPlatformID, setselectedTrailerPlatformID] = useState();
  const [selectedTrailerAxleID, setselectedTrailerAxleID] = useState();
  const [selectedTrailerLength, setselectedTrailerLength] = useState("");
  const [selectedTrailerCapacity, setselectedTrailerCapacity] = useState("");
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [isShowModel, setisShowModel] = useState(false);
  const [trailerHookup, settrailerHookup] = useState([]);
  const [selectedHookupID, setselectedHookupID] = useState();

  let isFrom = route.params?.isFrom;
  const typeDropdownRef = useRef({});
  const connectionDropdownRef = useRef({});
  const PlatformDropdownRef = useRef({});
  const axlesDropdownRef = useRef({});

  useEffect(() => {
    if (selectedHookupID) {
      async function fetchTruckBrandNameAPI() {
        const response = await getTrailerTypeList({
          trailer_hookup_id: selectedHookupID,
        });
        setTrailerTypeList(response.data);
      }
      fetchTruckBrandNameAPI();
    }
  }, [selectedHookupID]);

  useEffect(() => {
    try {
      async function fetchTrailerTypeListAPI() {
        // const userToken = await storage.get("userData");
        // console.log('--userToken---',userToken)
        //To get Trailer type list
        // const response = await getTrailerTypeList();
        // setTrailerTypeList(response.data.results);
        //To get Trailer config details
        const trailerTypeConfigResponse = await getTrailerTypeConfig();
        settrailerTypeConfig({ ...trailerTypeConfigResponse.data });

        const hookupResponse: any = await getTrailerHookup();
        settrailerHookup(hookupResponse.data);
      }
      fetchTrailerTypeListAPI();
    } catch (error) {
      Alert.alert("Error", "There was an error. Please try again.");
    }
  }, []);

  const createUserTrailerinfo = async () => {
    if (!selectedTrailerTypeID) {
      Alert.alert("Error", "Please select trailer type");
    }
    // else if (!selectedTrailerConnectionID) {
    //   Alert.alert("Error", "Please select trailer connection");
    // } else if (!selectedTrailerPlatformID) {
    //   Alert.alert("Error", "Please select trailer platform");
    // } else if (!selectedTrailerAxleID) {
    //   Alert.alert("Error", "Please select trailer axles");
    // }
    else if (!selectedTrailerLength) {
      Alert.alert("Error", "Please enter trailer length");
    } else if (!selectedTrailerCapacity) {
      Alert.alert("Error", "Please enter trailer capacity");
    } else {
      const userDetail = await storage.get("userData");
      try {
        setLoading(true);
        await createUserTrailer({
          user_id: userDetail.user_id,
          trailer_type_id: selectedTrailerTypeID,
          trailer_connection_id: 1,
          trailer_platform_id: 1,
          trailer_axle_id: 1,
          offload_equipments: selectedOffloadEquipments,
          length: parseInt(selectedTrailerLength),
          capacity: parseInt(selectedTrailerCapacity),
          trailer_hookup_id: selectedHookupID,
        })
          .then(async (response) => {
            setLoading(false);
            console.log(" Login response", response);
            if (response.status === 201) {
              // global.myDispatch({ type: "LOGIN_SUCCESS", payload: response.data });
              const userToken = await storage.get("tokens"); // Get previous tokens
              setMessage("Trailer created successfully.");
              setVisible(true);
              if (isFrom === "TrailerList") {
                const userTrailerList = await getUserTrailerList(
                  userDetail.user_id,
                  "0",
                  "10"
                );
                global.myDispatch({
                  type: "GET_USER_TRAILER_LIST",
                  payload: userTrailerList.data,
                });
                navigation.goBack();
                // navigation.navigate("TrailerList", { isFrom: "TrailerList" });
              } else {
                setisShowModel(true);
              }
            }
          })
          .catch((e) => {
            setLoading(false);
            console.log("login error", e.response);
            Alert.alert("Error", e.response.data.message);
          });
      } catch (e) {
        Alert.alert(
          "Error",
          "There was a problem registering your email. Please try again soon."
        );
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        title="TRAILER INFO"
        onPress={() => navigation.goBack()}
      ></HeaderWithBack>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
            Enter Trailer Details
          </Text>
          <View style={styles.textInputView}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "gray" }}>
              Trailer Hookup
            </Text>
            <SelectDropdown
              // ref={typeDropdownRef}
              data={trailerHookup}
              // defaultValueByIndex={1}
              // defaultValue={{
              //   title: 'England',
              //   image: require('./Images/England.jpg'),
              // }}
              onSelect={(selectedItem, index) => {
                setselectedHookupID(selectedItem.trailer_hookup_id);
                setselectedTrailerTypeID(undefined);
                typeDropdownRef.current.reset();
              }}
              buttonStyle={styles.dropdown3BtnStyle}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.dropdown3BtnChildStyle}>
                    <Text style={styles.dropdown3BtnTxt}>
                      {selectedItem ? selectedItem.hookup : "Select Hookup"}
                    </Text>
                    {selectedItem && selectedItem.thumbnail ? (
                      <FastImage
                        source={{
                          uri: selectedItem.thumbnail
                            ? selectedItem.thumbnail
                            : "",
                        }}
                        resizeMode="contain"
                        style={{ width: 60, height: 60 }}
                      />
                    ) : null}

                    <FastImage
                      resizeMode={"contain"}
                      source={require("../../../app/assets/images/downArrowNew.png")}
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
                    <Text style={styles.dropdown3RowTxt}>{item.hookup}</Text>
                    <FastImage
                      resizeMode={FastImage.resizeMode.contain}
                      source={{ uri: item.thumbnail ? item.thumbnail : "" }}
                      style={styles.dropdownRowImage}
                    />
                  </View>
                );
              }}
            />
          </View>
          <View
            style={[styles.textInputView, { marginTop: deviceHeight / 55 }]}
          >
            <Text style={{ fontSize: 14, fontWeight: "500", color: "gray" }}>
              Trailer Type
            </Text>
            <SelectDropdown
              disabled={selectedHookupID ? false : true}
              ref={typeDropdownRef}
              data={trailerTypeList}
              // defaultValueByIndex={1}
              // defaultValue={{
              //   title: 'England',
              //   image: require('./Images/England.jpg'),
              // }}
              onSelect={(selectedItem, index) => {
                setselectedTrailerTypeID(selectedItem.trailer_type_id);
              }}
              buttonStyle={styles.dropdown3BtnStyle}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.dropdown3BtnChildStyle}>
                    <Text
                      style={[
                        styles.dropdown3BtnTxt,
                        { color: selectedHookupID ? "#000000" : "lightgray" },
                      ]}
                    >
                      {selectedItem
                        ? selectedItem.trailer_type_name
                        : "Select Type"}
                    </Text>
                    {selectedItem && selectedItem.thumbnail ? (
                      <FastImage
                        source={{
                          uri: selectedItem.thumbnail
                            ? selectedItem.thumbnail
                            : "",
                        }}
                        resizeMode="contain"
                        style={{ width: 60, height: 60 }}
                      />
                    ) : null}

                    <FastImage
                      resizeMode={"contain"}
                      source={require("../../../app/assets/images/downArrowNew.png")}
                      style={{ height: 18, width: 15 }}
                      tintColor={selectedHookupID ? "#000000" : "lightgray"}
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
                      {item.trailer_type_name}
                    </Text>
                    <FastImage
                      resizeMode={FastImage.resizeMode.contain}
                      source={{ uri: item.thumbnail ? item.thumbnail : "" }}
                      style={styles.dropdownRowImage}
                    />
                  </View>
                );
              }}
            />
          </View>

          {/* <View style={[styles.textInputView, { marginTop: deviceHeight / 55 }]}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "gray" }}>Connection</Text>
            <SelectDropdown
              ref={connectionDropdownRef}
              data={trailerTypeConfig.connections}
              // defaultValueByIndex={1}
              // defaultValue={{
              //   title: 'England',
              //   image: require('./Images/England.jpg'),
              // }}
              onSelect={(selectedItem, index) => {
                setselectedTrailerConnectionID(selectedItem.trailer_connection_id);
              }}
              buttonStyle={styles.dropdown3BtnStyle}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.dropdown3BtnChildStyle}>
                    <Text style={styles.dropdown3BtnTxt}>
                      {selectedItem ? selectedItem.connection_name : "Select Connection"}
                    </Text>
                    {selectedItem ? (
                      <FastImage
                        source={selectedItem.image}
                        resizeMode={"contain"}
                        style={{ width: 75, height: 75 }}
                      />
                    ) : (
                      <FastImage
                        resizeMode={"contain"}
                        source={require("../../../app/assets/images/model.png")}
                        style={{ width: 75, height: 75 }}
                      />
                    )}

                    <FastImage
                      resizeMode={"contain"}
                      source={require("../../../app/assets/images/downArrowNew.png")}
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
                    <Text style={styles.dropdown3RowTxt}>{item.connection_name}</Text>
                    <FastImage source={item.image} style={styles.dropdownRowImage} />
                  </View>
                );
              }}
            />
          </View> */}

          {/* <View style={[styles.textInputView, { marginTop: deviceHeight / 55 }]}>
            <Text style={{ fontSize: fontSizes.small, fontWeight: "500", color: "gray" }}>
              Platform
            </Text>
            <SelectDropdown
              ref={PlatformDropdownRef}
              data={trailerTypeConfig.platforms}
              // defaultValueByIndex={1}
              // defaultValue={{
              //   title: 'England',
              //   image: require('./Images/England.jpg'),
              // }}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setselectedTrailerPlatformID(selectedItem.trailer_platform_id);
              }}
              buttonStyle={styles.dropdown3BtnStyle}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.dropdown3BtnChildStyle}>
                    <Text style={styles.dropdown3BtnTxt}>
                      {selectedItem ? selectedItem.platform_name : "Select Platform"}
                    </Text>
                    {selectedItem ? (
                      <FastImage
                        source={selectedItem.image}
                        resizeMode={"contain"}
                        style={{ width: 75, height: 75 }}
                      />
                    ) : (
                      <FastImage
                        resizeMode={"contain"}
                        source={require("../../../app/assets/images/model.png")}
                        style={{ width: 75, height: 75 }}
                      />
                    )}

                    <FastImage
                      resizeMode={"contain"}
                      source={require("../../../app/assets/images/downArrowNew.png")}
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
                    <Text style={styles.dropdown3RowTxt}>{item.platform_name}</Text>
                    <FastImage source={item.image} style={styles.dropdownRowImage} />
                  </View>
                );
              }}
            />
          </View> */}

          {/* <View style={[styles.textInputView, { marginTop: deviceHeight / 55 }]}>
            <Text style={{ fontSize: fontSizes.small, fontWeight: "500", color: "gray" }}>
              Axles
            </Text>
            <SelectDropdown
              ref={axlesDropdownRef}
              data={trailerTypeConfig.axles}
              defaultValueByIndex={1}
              // defaultValue={{
              //   title: 'England',
              //   image: require('./Images/England.jpg'),
              // }}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setselectedTrailerAxleID(selectedItem.trailer_axle_id);
              }}
              buttonStyle={styles.dropdown3BtnStyle}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.dropdown3BtnChildStyle}>
                    <Text style={styles.dropdown3BtnTxt}>
                      {selectedItem ? selectedItem.axle_name : "Select Axles"}
                    </Text>
                    {selectedItem ? (
                      <FastImage
                        source={selectedItem.image}
                        resizeMode={"contain"}
                        style={{ width: 75, height: 75 }}
                      />
                    ) : (
                      <FastImage
                        resizeMode={"contain"}
                        source={require("../../../app/assets/images/model.png")}
                        style={{ width: 75, height: 75 }}
                      />
                    )}

                    <FastImage
                      resizeMode={"contain"}
                      source={require("../../../app/assets/images/downArrowNew.png")}
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
                    <Text style={styles.dropdown3RowTxt}>{item.axle_name}</Text>
                    <FastImage source={item.image} style={styles.dropdownRowImage} />
                  </View>
                );
              }}
            />
          </View> */}

          <View
            style={[
              styles.textInputView,
              { marginTop: deviceHeight / 55, paddingVertical: 10 },
            ]}
          >
            <Text style={{ fontSize: 14, fontWeight: "500", color: "gray" }}>
              Trailer Length (feet)
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 5,
                // paddingHorizontal: 2
              }}
            >
              <TextInput
                editable={!selectedHookupID ? false : true}
                maxLength={2}
                style={{
                  padding: 0,
                  fontWeight: "500",
                  fontSize: 16,
                  flex: 1,
                }}
                onChangeText={(newText) => setselectedTrailerLength(newText)}
                value={selectedTrailerLength}
                placeholder="0"
                keyboardType="number-pad"
                returnKeyType="next"
              />
            </View>
          </View>
          <View
            style={[
              styles.textInputView,
              { marginTop: deviceHeight / 55, paddingVertical: 10 },
            ]}
          >
            <Text style={{ fontSize: 14, fontWeight: "500", color: "gray" }}>
              Capacity in LBS
            </Text>
            <View style={{ flexDirection: "row", marginVertical: 5, flex: 1 }}>
              <TextInput
                editable={!selectedHookupID ? false : true}
                maxLength={6}
                style={{
                  padding: 0,
                  fontWeight: "500",
                  fontSize: 16,
                  flex: 1,
                }}
                onChangeText={(newText) => setselectedTrailerCapacity(newText)}
                value={selectedTrailerCapacity}
                placeholder="0"
                keyboardType="number-pad"
              />
              {/* <Text style={{ marginLeft: 10, fontWeight: "500", fontSize: 16 }}>lbs.</Text> */}
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: deviceWidth / 20,
              marginTop: deviceHeight / 55,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "500", color: "gray" }}>
              Offload Equipments
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              data={trailerTypeConfig.offloadEquipments}
              style={{}}
              renderItem={({ item, index }) => {
                return (
                  <CheckBox
                    disabled={selectedHookupID ? false : true}
                    checkedColor={colors1.background}
                    containerStyle={{
                      backgroundColor: "white",
                      borderWidth: 0,
                      paddingVertical: 5,
                    }}
                    title={item.equipment_name}
                    checked={item.isSelected}
                    onPress={() => {
                      if (item.isSelected) {
                        console.log("-inremove");
                        let selectedArray = [...selectedOffloadEquipments];
                        const index = selectedArray.indexOf(
                          item.offload_equipment_id
                        );
                        if (index > -1) {
                          selectedArray.splice(index, 1); //remove one item only
                        }
                        setselectedOffloadEquipments(selectedArray);
                        //remove value from array
                      } else {
                        console.log("-inadd");
                        //add value to array
                        setselectedOffloadEquipments([
                          ...selectedOffloadEquipments,
                          item.offload_equipment_id,
                        ]);
                      }
                      let value = trailerTypeConfig;
                      value.offloadEquipments[index].isSelected =
                        !value.offloadEquipments[index].isSelected;
                      settrailerTypeConfig({ ...value });
                    }}
                  />
                );
              }}
            />
          </View>

          {/* <View
            style={{
              paddingHorizontal: deviceWidth / 30,
              flexDirection: "column",
              justifyContent: "space-between",
              marginTop: deviceHeight / 55
            }}
          >
            <Text style={{ color: "#0A5F8C", fontSize: 14 }}>
              *Multiple Trailer Option will be available soon*
            </Text>
          </View> */}
        </View>
        <View
          style={{
            marginVertical: deviceHeight / 20,
            paddingHorizontal: deviceWidth / 15,
          }}
        >
          <CustomButton
            titleColor={colors1.white}
            borderColor={colors1.background}
            backgroundColor={
              selectedHookupID && selectedTrailerTypeID
                ? colors1.btnColor
                : "#454545"
            }
            onPress={() => createUserTrailerinfo()}
            // onPress={() => navigation.navigate("RegistrationTypesCargoDetailScreen")}
            title="Submit"
            disableButton={
              selectedHookupID && selectedTrailerTypeID ? false : true
            }
            btnLoading={loading}
          ></CustomButton>
        </View>
      </KeyboardAwareScrollView>
      <StandardModal visible={isShowModel}>
        <View>
          <Text
            style={{
              fontSize: fontSizes.large,
              fontWeight: "700",
              color: "black",
            }}
          >
            {"Add Trailer"}
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: fontSizes.medium,
              fontWeight: "400",
              marginVertical: deviceHeight / 30,
            }}
          >
            {"Are you sure want to add another Trailer?"}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <TouchableOpacity
                onPress={async () => {
                  const userDetail = await storage.get("userData");
                  const updateOnbardingStatusResponse =
                    await updateOnbardingStatus({
                      user_id: userDetail.user_id,
                      is_onboard_pending: 2,
                      completed_step: 2,
                      is_welcome_screen_viewed: 2,
                    });
                  navigation.navigate("RegistrationTypesCargoDetailScreen");
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
                  let value = trailerTypeConfig;
                  const newUsers = value.offloadEquipments.map((user) => ({
                    ...user,
                    isSelected: false, // just for example
                  }));
                  value.offloadEquipments = newUsers;
                  settrailerTypeConfig({ ...value });
                  typeDropdownRef.current.reset();
                  connectionDropdownRef.current.reset();
                  PlatformDropdownRef.current.reset();
                  axlesDropdownRef.current.reset();
                  setselectedTrailerLength("");
                  setselectedTrailerCapacity("");
                  setselectedOffloadEquipments([]);
                  // settrailerTypeConfig(trailerResponse);
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
    </SafeAreaView>
  );
}

type Styles = {
  container: ViewStyle;
  name: ViewStyle;
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
  name: {
    fontSize: 12,
  },
  container: {
    backgroundColor: "white",
    flex: 1,
    // paddingHorizontal: STANDARD_PADDING
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
    flex: 0.8,
    color: "#000000",
    // textAlign: 'center',
    fontWeight: "600",
    fontSize: fontSizes.regular,
  },
  dropdown3DropdownStyle: { backgroundColor: "#EFEFEF", borderRadius: 5 },
  dropdown3RowStyle: {
    // backgroundColor: 'slategray',
    borderBottomColor: "#EFEFEF",
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  dropdownRowImage: { width: 45, height: 45, resizeMode: "contain" },
  dropdown3RowTxt: {
    color: "black",
    fontWeight: "500",
    fontSize: 18,
    // marginHorizontal: 12,
    flex: 1,
  },
  textInputView: {
    paddingHorizontal: deviceWidth / 20,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#F5F4F7",
    borderColor: "#EDEDED",
    borderWidth: 1,
    paddingVertical: 5,
    borderRadius: 8,
    shadowOffset: { width: -2, height: 2 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginHorizontal: 15,
    elevation: 3,
  },
});

export default RegistrationTrailerDetailScreen;
