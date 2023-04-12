/*************************************************
 * FreightRunner
 * @exports
 * @function CargoTypes.tsx
 * @extends Component
 * Created by Deepak B on 13/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  ViewStyle,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import HeaderWithBack from "../../components/HeaderWithBack";
import CargoTypesLists from "../../components/CargoTypesLists";
import { getUserCargoPreferences } from "../../services/myProfileServices";
import storage from "../../helpers/storage";
import Spinner from "react-native-spinkit";
import colors from "../../styles/colors";
import { MyContext } from "../../../app/context/MyContextProvider";
const deviceHeight = Dimensions.get("window").height;
type Props = { navigation: any };

const CargoTypes: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  const global: any = useContext(MyContext);
  const [cargoListsLoading, setCargoListLoading] = useState(false);
  const [refreshing, isRefreshing] = useState(false);

  useEffect(() => {
    try {
      async function fetchAPI() {
        setCargoListLoading(true);
        const userDetail: any = await storage.get("userData");
        const userCargoPreferences = await getUserCargoPreferences(
          userDetail.user_id
        );
        global.myDispatch({
          type: "GET_USER_CARGO_PREFERENCES_LIST",
          payload: userCargoPreferences.data,
        });
        setCargoListLoading(false);
      }
      fetchAPI();
    } catch (error) {
      console.log("EROR_TRUCKS");
    }
  }, []);

  const _onRefresh = () => {
    isRefreshing(false);
    try {
      async function fetchAPI() {
        setCargoListLoading(true);
        const userDetail = await storage.get("userData");
        const userCargoPreferences = await getUserCargoPreferences(
          userDetail.user_id
        );
        global.myDispatch({
          type: "GET_USER_CARGO_PREFERENCES_LIST",
          payload: userCargoPreferences.data,
        });
        setCargoListLoading(false);
      }
      fetchAPI();
    } catch (error) {
      console.log("EROR_TRUCKS");
    }
  };

  const _renderCargoTypesLists = () => {
    return (
      <FlatList
        data={global.myState.userCargoPreferences}
        renderItem={_renderList}
        keyExtractor={(item) => item.cargoTypeDetails.cargo_type_id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            tintColor={[colors.greyLight]}
            refreshing={refreshing}
            onRefresh={_onRefresh.bind(this)}
          />
        }
      />
    );
  };

  const _renderList = ({ item }) => {
    return (
      <View style={{ marginTop: 15 }}>
        <CargoTypesLists
          cargoName={item.cargoTypeDetails.cargo_type_name}
          cargoImage={
            item.cargoTypeDetails.image
              ? { uri: item.cargoTypeDetails.image }
              : require("../../assets/images/cargoType.png")
          }
          cargoDescription={item.cargoTypeDetails.description}
          isFrom={isFrom}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <HeaderWithBack
        title="TYPES OF CARGO"
        onPress={() => navigation.goBack()}
        isRightText={true}
        rightText="EDIT"
        isFrom={isFrom}
        rightOnPress={() =>
          navigation.navigate("RegistrationTypesCargoDetailScreen", {
            isFrom: "ProfileScreen",
          })
        }
      />
      <View style={{ flex: 1, backgroundColor: "#F5F4F7" }}>
        {cargoListsLoading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner
              isVisible={cargoListsLoading}
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
          _renderCargoTypesLists()
        )}
      </View>
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

export default CargoTypes;
