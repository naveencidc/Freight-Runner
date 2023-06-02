/*************************************************
 * FreightRunner
 * @exports
 * @function PdfViewer.tsx
 * @extends Component
 * Created by Naveen E on 10/05/2023
 * Copyright © 2023 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Platform,
  Modal,
  Alert,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import HeaderWithBack from "../../components/HeaderWithBack";
import colors from "../../styles/colors";
import Pdf from "react-native-pdf";
var moment = require("moment-timezone");
const axios = require("axios");

type Props = { navigation: any };

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const PdfViewer: React.FC<Props> = ({ navigation, route }) => {
  let loadDetails = route.params?.loadDetails;
  console.log("loadDetails", loadDetails);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderWithBack
        title="Rate Contract"
        onPress={() => {
          navigation.goBack();
        }}
        hideLeftSide={false}
        isRightText={false}
        rightText={"Close"}
        isFrom={""}
        rightOnPress={async () => {}}
      />
      <Pdf
        source={{ uri: loadDetails.rc_pdf_url, cache: true }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  renderListMainView: {
    borderWidth: 1,
    borderColor: "white",
    marginTop: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    flex: 1,
    elevation: Platform.OS === "android" ? 1 : 20,
    shadowColor: "#52006A",
    shadowOffset: { width: -2, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    height:
      deviceHeight <= 685
        ? 350
        : Platform.OS === "android"
        ? deviceHeight / 1.9
        : deviceHeight / 2.1,
  },
  verticalLineStyle: {
    flex: 1,
    width: 1,
    borderWidth: 1,
    borderRadius: 1,
    borderColor: colors.greyLight,
    borderStyle: "dashed",
    position: "absolute",
    bottom: -38,
    top: -3,
    left: 5,
    right: 0,
  },
  preview: {
    width: deviceWidth,
    height: 114,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10,
  },
});

export default PdfViewer;
