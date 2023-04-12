/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationTypesCargoDetailScreen.tsx
 * @extends Component
 * Created by Naveen E on 13/05/2022
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
  RefreshControl,
  SafeAreaView
} from "react-native";
import { withNavigation } from "react-navigation";
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
import { NavigationProps } from "../../navigation";
import { fontSizes, STANDARD_PADDING } from "../../styles/globalStyles";
import colors1 from "../../styles/colors";
import HeaderWithBack from "../../components/HeaderWithBack";
import FastImage from "react-native-fast-image";
import Spinner from "react-native-spinkit";
import { getUserCargoPreferences } from "../../services/myProfileServices";
import { getCargoTypeList, createUserCargoTypes } from "../../services/registrationService";
import storage from "../../helpers/storage";
import { SnackbarContext, SnackbarContextType } from "../../context/SnackbarContext";
import { updateOnbardingStatus } from "../../services/userService";
import { MyContext } from "../../../app/context/MyContextProvider";
import CargoTypesLists from "../../components/CargoTypesLists";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
type Props = NavigationProps;
let brforeChangeList = [];

function RegistrationTypesCargoDetail({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [cargoListLoading, setcargoListLoading] = useState(false);
  const [disableButton, setdisableButton] = useState(false);
  const [cargoTypeList, setCargoTypeList] = useState([]);
  const [isPulltoRefershLoading, setisPulltoRefershLoading] = useState(false);
  const [selectedCargoTypeIDList, setselectedCargoTypeIDList] = useState([]);
  const [isAllSelected, setisAllSelected] = useState(false);
  const { setMessage, setVisible } = useContext<SnackbarContextType>(SnackbarContext);
  const global = useContext(MyContext);
  let isFrom = navigation.state.params?.isFrom;
  let isFromOnboarding = navigation.state.params?.isFromOnboarding;

  useEffect(() => {
    try {
      async function fetchCargoTypeListAPI() {
        setcargoListLoading(true);
        const response = await getCargoTypeList();
        // set API data to Selected data
        let tempArray = [...selectedCargoTypeIDList];
        let attachSelectedData: Array<string> = [];
        if (isFrom === "ProfileScreen") {
          setdisableButton(true);
          global.myState.userCargoPreferences.map(item => {
            attachSelectedData.push({ ...item.cargoTypeDetails, isSelected: true });
            tempArray.push(item.cargoTypeDetails.cargo_type_id);
          });
          if (global.myState.userCargoPreferences.length === response.data.results.length) {
            setisAllSelected(true);
          }
          setselectedCargoTypeIDList(tempArray);
          let fetchData = mergeArrays(response.data.results, attachSelectedData);
          brforeChangeList = tempArray;
          setCargoTypeList(fetchData);
          setcargoListLoading(false);
        } else {
          setCargoTypeList(response.data.results);
          setcargoListLoading(false);
        }
      }
      fetchCargoTypeListAPI();
    } catch (error) {
      Alert.alert("Error", "There was an error accepting this job. Please try again.");
    }
  }, []);
  useEffect(() => {
    if (selectedCargoTypeIDList.length === cargoTypeList.length) {
      if (selectedCargoTypeIDList.length) {
        setisAllSelected(true);
      }
    }
    if (isFrom === "ProfileScreen") {
      if (brforeChangeList.length !== selectedCargoTypeIDList.length) {
        setdisableButton(false);
      } else {
        const containsAll = brforeChangeList.every(element => {
          return selectedCargoTypeIDList.indexOf(element) !== -1;
        });
        setdisableButton(containsAll);
      }
    }
  }, [selectedCargoTypeIDList]);

  // let check cargo_type_id for two array data
  const mergeArrays = (arr1 = [], arr2 = []) => {
    let res = [];
    res = arr1.map(obj => {
      const index = arr2.findIndex(el => el["cargo_type_id"] == obj["cargo_type_id"]);
      const { isSelected } = index !== -1 ? arr2[index] : {};
      return {
        ...obj,
        isSelected
      };
    });
    return res;
  };

  const _onRefresh = () => {
    //  Api Call
    setisPulltoRefershLoading(true);
    setTimeout(() => {
      setisPulltoRefershLoading(false);
    }, 3000);
  };

  const createUserCargoType = async () => {
    setLoading(true);
    if (!selectedCargoTypeIDList.length) {
      Alert.alert("Error", "Please select cargo type");
      setLoading(false);
    } else {
      const userDetail = await storage.get("userData");
      try {
        await createUserCargoTypes({
          user_id: userDetail.user_id,
          cargo_type_id: selectedCargoTypeIDList
        })
          .then(async response => {
            setLoading(false);
            if (response.status === 201) {
              if (isFrom !== "ProfileScreen") {
                const updateOnbardingStatusResponse = await updateOnbardingStatus({
                  user_id: userDetail.user_id,
                  is_onboard_pending: 2,
                  completed_step: 3,
                  is_welcome_screen_viewed: 2
                });
              }
              setMessage("Cargo preferences created successfully.");
              setVisible(true);
              if (isFrom === "ProfileScreen") {
                const userCargoPreferences = await getUserCargoPreferences(userDetail.user_id);
                global.myDispatch({
                  type: "GET_USER_CARGO_PREFERENCES_LIST",
                  payload: userCargoPreferences.data
                });
                navigation.navigate("CargoTypes");
              } else {
                navigation.navigate("RegistrationInsuranceRequirementsScreen", {
                  isFromOnboarding: isFromOnboarding
                });
              }
            }
          })
          .catch(e => {
            setLoading(false);
            console.log("login error", e.response);
            Alert.alert("Error", e.response.data.message);
            // returnResponse = e.response;
          });
      } catch (e) {
        Alert.alert("Error", "There was a error creating cargo type. Please try again later.");
        setLoading(false);
      }
    }
  };

  const _renderItem = ({ index, item }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          if (item.isSelected) {
            setisAllSelected(false);
            let array = [...cargoTypeList];
            array[index].isSelected = undefined;
            await setCargoTypeList(array);
            let selectedArray = [...selectedCargoTypeIDList];
            const selectedindex = selectedArray.indexOf(item.cargo_type_id);
            if (selectedindex > -1) {
              selectedArray.splice(selectedindex, 1); //remove one item only
              setselectedCargoTypeIDList(selectedArray);
            }
          } else {
            let array = [...cargoTypeList];
            array[index].isSelected = true;
            setCargoTypeList(array);
            setselectedCargoTypeIDList([...selectedCargoTypeIDList, item.cargo_type_id]);
          }
        }}
      >
        <CargoTypesLists
          cargoName={item.cargo_type_name}
          cargoImage={
            item.image ? { uri: item.image } : require("../../../app/assets/images/cargoType.png")
          }
          cargoDescription={item.description}
          isSelected={item.isSelected}
          isFrom={isFrom}
        />
      </TouchableOpacity>
    );
  };

  const _renderFlatList = () => {
    return (
      <FlatList
        keyExtractor={(item, index) => item.cargo_type_id.toString()}
        showsVerticalScrollIndicator={false}
        data={cargoTypeList}
        renderItem={_renderItem}
        onEndReachedThreshold={0.4}
        onEndReached={() => {}}
        refreshControl={
          <RefreshControl
            tintColor={[colors1.background]}
            refreshing={isPulltoRefershLoading}
            onRefresh={_onRefresh}
          />
        }
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        showOnlyHeader={isFromOnboarding ? true : false}
        title="TYPES OF CARGO"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText={selectedCargoTypeIDList.length ? "CLEAR ALL" : "SELECT ALL"}
        rightOnPress={async () => {
          let array = [...cargoTypeList];
          let tempArray = [...selectedCargoTypeIDList];
          array.forEach(object => {
            if (selectedCargoTypeIDList.length) {
              object.isSelected = false;
              tempArray = [];
            } else {
              object.isSelected = true;
              tempArray.push(object.cargo_type_id);
            }
          });
          setselectedCargoTypeIDList(tempArray);
          setCargoTypeList(array);
        }}
      ></HeaderWithBack>
      <View style={{ paddingHorizontal: deviceWidth / 20, flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              setisAllSelected(!isAllSelected);
              //
              let array = [...cargoTypeList];
              let tempArray = [];
              array.forEach(object => {
                if (isAllSelected) {
                  object.isSelected = false;
                  tempArray = [];
                } else {
                  object.isSelected = true;
                  tempArray.push(object.cargo_type_id);
                }
              });
              setselectedCargoTypeIDList(tempArray);
              setCargoTypeList(array);
              //
            }}
          >
            <FastImage
              resizeMode={"contain"}
              source={
                isAllSelected
                  ? require("../../../app/assets/images/SelectedCircle.png")
                  : require("../../../app/assets/images/unselect.png")
              }
              style={{ height: 20, width: 20, margin: 10 }}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: colors1.background,
              fontSize: 18,
              fontWeight: "600",
              paddingVertical: deviceHeight / 60
            }}
          >
            Select your Cargo Perferences
          </Text>
        </View>

        <View style={{ flex: 1, backgroundColor: "white", padding: 5 }}>
          {cargoListLoading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Spinner isVisible={cargoListLoading} size={40} type={"Wave"} color={"black"} />
              <Text
                style={{
                  textAlign: "center",
                  marginTop: deviceHeight / 40,
                  fontSize: 16,
                  color: "black"
                }}
              >
                Loading...
              </Text>
            </View>
          ) : (
            _renderFlatList()
          )}
        </View>
        <View style={{ paddingHorizontal: deviceWidth / 25 }}>
          <CustomButton
            titleColor={colors1.white}
            borderColor={disableButton ? "#454545" : "#1F1F1F"}
            title={`Proceed with ${selectedCargoTypeIDList.length} Selections`}
            backgroundColor={disableButton ? "#454545" : "#1F1F1F"}
            onPress={() => createUserCargoType()}
            btnLoading={loading}
            disableButton={disableButton}
          ></CustomButton>
        </View>
      </View>
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
  }
});

export default withNavigation(RegistrationTypesCargoDetail);
