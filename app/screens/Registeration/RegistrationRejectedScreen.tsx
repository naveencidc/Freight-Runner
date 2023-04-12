/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationRejectedScreen.tsx
 * @extends Component
 * Created by Naveen E on 30/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ViewStyle, Platform, Dimensions } from "react-native";

import { CustomButton, Screen, Text, View } from "../../components";
import { fontSizes } from "../../styles/globalStyles";
import colors1 from "../../styles/colors";
import FastImage from "react-native-fast-image";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

function RegistrationRejectedScreen({ navigation, route }) {
  return (
    <Screen style={styles.container}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "black",
            alignItems: "center",
            paddingTop: deviceHeight / 40,
          }}
        >
          <Text
            style={{
              color: colors1.white,
              fontSize: fontSizes.large,
              fontWeight: "600",
            }}
          >
            Hold on, We have hit
          </Text>
          <Text
            style={{
              color: colors1.white,
              fontSize: fontSizes.large,
              fontWeight: "600",
            }}
          >
            an issue here!!!
          </Text>

          <FastImage
            resizeMode={"contain"}
            source={require("../../../app/assets/images/Rejected.png")}
            style={{
              alignSelf: "center",
              height: 155,
              width: "100%",
              marginTop: deviceHeight / 20,
            }}
          />
        </View>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: fontSizes.medium,
                fontWeight: "600",
                paddingHorizontal: deviceWidth / 5,
              }}
            >
              Looks like we can't approve your onboarding request at this time.
              Check your mail or give as a call to get the onboarding
              successful.
            </Text>
          </View>
          <View
            style={{
              marginBottom: deviceHeight / 35,
              paddingHorizontal: deviceWidth / 25,
            }}
          >
            <CustomButton
              titleColor={colors1.white}
              borderColor={"#1F1F1F"}
              onPress={() => navigation.navigate("ContactUs")}
              title="Contact Us"
              backgroundColor={colors1.background}
            ></CustomButton>
          </View>
        </View>
      </View>
    </Screen>
  );
}

type Styles = {
  container: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: "white",
    // paddingHorizontal: STANDARD_PADDING
  },
});

export default RegistrationRejectedScreen;
