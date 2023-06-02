/*************************************************
 * FreightRunner
 * @exports
 * @function BolScreen.tsx
 * @extends Component
 * Created by Naveen E on 24/03/2023
 * Copyright © 2022 FreightRunner. All rights reserved.
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
import {
  createBid,
  getUserTrailerList,
} from "../../services/myProfileServices";
import storage from "../../helpers/storage";
import Spinner from "react-native-spinkit";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import { MyContext } from "../../context/MyContextProvider";
import StandardModal from "../../components/StandardModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
// import RNHTMLtoPDF from "react-native-html-to-pdf";
var moment = require("moment-timezone");
const axios = require("axios");
import {
  deleteAWSImage,
  eSignUploadCompleted,
  shipmentPhotosUploadCompleted,
  uploadESignToS3,
  uploadMultipleImage,
  uploadToS3,
} from "../../services/uploadS3Service";
import WebView from "react-native-webview";
import Signature from "react-native-signature-canvas";
import { getLoadDetails } from "../../services/jobService";

type Props = { navigation: any };

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const BolScreen: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  // let loadDetails = route.params?.loadDetails;
  let loadID = route.params?.loadDetails?.load_id;
  let isFromShipment = route.params?.isFromShipment;
  const [openSignPad, setopenSignPad] = useState(false);
  const global: any = useContext(MyContext);
  let todayDate = moment().format("l");

  useEffect(() => {
    try {
      async function fetchAPI() {
        await _callLoadDetails();
      }
      fetchAPI();
    } catch (error) {
      Alert.alert("Error", "There was an error. Please try again.");
    }
  }, [isFromShipment]);
  const [tempSign, settempSign] = useState("");
  const [showbolAlert, setshowbolAlert] = useState(false);
  const [signLoading, setsignLoading] = useState(false);
  const [loadDetails, setloadDetails] = useState({});
  let shipperSignedDataURL = loadDetails?.bolDetails?.shipper_sign_url;
  const [signature, setSign] = useState(
    loadDetails?.bolDetails?.partner_sign_url
  );

  const _callLoadDetails = async () => {
    await getLoadDetails({ load_id: loadID })
      .then(async (response) => {
        setloadDetails(response.data);
        setSign(response.data?.bolDetails?.partner_sign_url);
        console.log(" Load response", response);
      })
      .catch((e) => {
        console.log("loadDetail error", e.response);
      });
  };

  const handleOK = async (signature: any) => {
    settempSign(signature);
    setshowbolAlert(true);
  };
  console.log("***", loadDetails);
  const handleEmpty = () => {
    Alert.alert("Please E-Sign the BOL Document to Proceed.");
    console.log("Empty");
  };

  const style1 = `.m-signature-pad--footer
    .button {
      background-color: black;
      color: #FFF;
    }`;

  const sourcew = {
    html: `
  <p style='text-align:center;'>
    Hello World!
  </p>`,
  };

  const source = {
    html: `<!DOCTYPE html>
    <html>
    
    <head>
        <title>Billing</title>
    </head>
    
    <body>
        <table style="width:100%;border-collapse:collapse">
            <tr>
                <td style="border:1px solid #000">
                    <div style="display:flex;justify-content:space-between">
                        <div style="margin-left:5px">Date : ${new Date().toLocaleDateString()}</div>
                        <div style="font-weight:700;font-size:x-large">BILL OF LANDING</div>
                        <div style="margin-right:5px;font-weight:700">Page 1 of 2</div>
                    </div>
                </td>
            </tr>
        </table>
        <table style="width:100%;border-collapse:collapse">
            <tr>
                <td style="border:1px solid #000;width:50%;vertical-align:top">
                    <div style="text-align:center;background-color:#000;color:#fff">SHIP FROM</div>
                    <div
                        style="font-size:12px;font-weight:600;margin-left:10px;display:flex;flex-direction:column;justify-content:space-evenly">
                        <div>Name:<span style="font-weight:200">${" "}${
      loadDetails?.shipperData?.shipperProfileDetails?.first_name
    }${loadDetails?.shipperData?.shipperProfileDetails?.last_name}</span></div>
                        <div>Address:${" "}${
      loadDetails?.origin_address_line
    }</div>
                        <div>City/State/Zip:${" "}${
      loadDetails?.origin_address_city
    }, ${loadDetails?.origin_address_state},
                            ${loadDetails?.origin_address_zip}</div>
                        <div style="display:flex;justify-content:space-between">
                            <div>SID#:</div>
                            <div style="margin-right:10px">FOB: <input type="checkbox"></div>
                        </div>
                    </div>
                </td>
                <td style="vertical-align:baseline;border:1px solid #000">
                    <h6 style="margin:5px">Bill Of Lading Number: <u>${
                      loadDetails?.bolDetails?.bol_number
                    }</u></h6>
                    <div style="display:flex;justify-content:center">
                        <h6 style="font-weight:400;margin-top:40px;color:#d3d3d3;text-transform:uppercase">Bar Code Space
                        </h6>
                    </div>
                </td>
        </table>
        <table style="width:100%;border-collapse:collapse">
            <tr>
                <td style="border:1px solid #000;width:50%;vertical-align:top">
                    <div style="text-align:center;background-color:#000;color:#fff">SHIP TO</div>
                    <div
                        style="font-size:12px;font-weight:600;margin-left:10px;display:flex;flex-direction:column;justify-content:space-evenly">
                        <div style="display:flex;justify-content:space-between">
                            <div style="margin:0 0">Name:${" "}${
      loadDetails?.reciever_name
    }</div>
                            <div style="margin:0 10px">Location#:${" "}${
      loadDetails?.reciever_address
    }</div>
                        </div>
                        <div style="margin:0 0">Address:${" "}${
      loadDetails?.reciever_address
    }</div>
                        <div style="margin:0 0">City/State/Zip:${" "} ${
      loadDetails?.reciever_state
    },
                            ${loadDetails?.reciever_city}, ${
      loadDetails?.reciever_zip
    }</div>
                        <div style="display:flex;justify-content:space-between;margin:5px 0">
                            <div>CID#:</div>
                            <div style="margin-right:10px">FOB: <input type="checkbox"></div>
                        </div>
                    </div>
                    <div style="text-align:center;background-color:#000;color:#fff">THIRD PARTY FREIGHT CHARGES BILL TO:
                    </div>
                    <div
                        style="font-size:12px;font-weight:600;margin-left:10px;display:flex;flex-direction:column;justify-content:space-evenly">
                        <div style="margin:0 0">Name:</div>
                        <div style="margin:0 0">Address:</div>
                        <div style="margin:0 0">City/State/Zip:</div>
                    </div>
                    <hr style="margin-bottom:2px">
                    <div style="margin-top:0;margin-left:10px;font-size:20px;font-weight:600">SPECIAL INSTRUCTIONS:</div>
                </td>
                <td style="vertical-align:baseline;border:1px solid #000">
                    <h6 style="margin:5px;font-weight:bolder">CARRIER NAME: _________________________</h6>
                    <div style="margin:5px;font-size:12px;font-weight:600">Trailer Number:</div>
                    <div style="margin:5px;font-size:12px;font-weight:600">Seal Number(s):</div>
                    <hr style="margin:0">
                    <h6 style="margin-top:0;margin-left:5px;margin-bottom:0;font-weight:bolder">SCAC:</h6>
                    <h6 style="margin-top:5px;margin-left:5px;font-weight:bolder;margin-bottom:0">Pro Number:</h6>
                    <div style="display:flex;justify-content:center">
                        <h6 style="font-weight:400;margin-top:18px;color:#d3d3d3;text-transform:uppercase;margin-bottom:0">
                            Bar Code Space</h6>
                    </div>
                    <hr style="margin:0">
                    <h6 style="font-weight:bolder;margin:18px 10px;font-size:12px">Freight Change Tearm :<i>(freight changes
                            are prepaid unless maked otherwise)</i></h6>
                    <div style="display:flex;justify-content:space-between">
                        <h6 style="margin:0 15px;font-weight:bolder">Prepaid ________</h6>
                        <h6 style="margin:0 15px;font-weight:bolder">Collect ________</h6>
                        <h6 style="margin:0 15px;font-weight:bolder">3<sup>rd</sup>Party ________</h6>
                    </div>
                    <hr style="margin:0">
                    <div style="display:flex;justify-content:space-around">
                        <div style="text-align:center;margin:0 10px"><input type="checkbox" style="margin-bottom:0">
                            <p style="margin-top:0;white-space:nowrap">(Check Box)</p>
                        </div>
                        <div>
                            <p style="font-size:10px;font-weight:600;margin-top:25px;margin-bottom:0">Master Bill of
                                Lading:with attached underlying Bills of Lading</p>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
        <table style="width:100%;border-collapse:collapse">
            <tr>
                <td style="border:1px solid #000">
                    <div style="text-align:center;background-color:#000;color:#fff">CUSTOMER ORDER INFORMATION</div>
                </td>
        </table>
        <table style="width:100%;border-collapse:collapse">
            <tr>
                <td style="text-align:center;color:#000;font-size:12px;font-weight:700;border:1px solid #000">CUSTOMER ORDR
                    NUMBER</td>
                <td style="text-align:center;color:#000;font-size:12px;font-weight:700;border:1px solid #000">#PKGS</td>
                <td style="text-align:center;color:#000;font-size:12px;font-weight:700;border:1px solid #000">WEIGHT</td>
                <td colspan="2" style="text-align:center;color:#000;font-size:12px;font-weight:700;border:1px solid #000">
                    PALLET/SLIP<br>
                    <div style="font-weight:500">(circle one)</div>
                </td>
                <td style="text-align:center;color:#000;font-size:12px;font-weight:700;border:1px solid #000">ADDITIONAL
                    SHIPPER INFO</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">Y</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">N</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">Y</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">N</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">Y</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">N</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">Y</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">N</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">Y</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">N</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">Y</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">N</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">Y</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">N</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">Y</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">N</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="font-size:12px;font-weight:700;border:1px solid #000">GRAND TOTAL</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td colspan="3" style="background-color:#d3d3d3"></td>
            </tr>
        </table>
        <table style="width:100%;border-collapse:collapse">
            <tr>
                <td style="border:1px solid #000">
                    <div style="text-align:center;background-color:#000;color:#fff">CARRIER INFORMATION</div>
                </td>
        </table>
        <table style="width:100%;border-collapse:collapse">
            <tr>
                <td colspan="2" style="text-align:center;color:#000;font-size:12px;font-weight:700;border:1px solid #000">
                    HANDLING UNIT</td>
                <td colspan="2" style="text-align:center;color:#000;font-size:12px;font-weight:700;border:1px solid #000">
                    PACKAGE</td>
                <td rowspan="2" style="text-align:center;color:#000;font-size:12px;font-weight:700;border:1px solid #000">
                    WEIGHT</td>
                <td rowspan="2" style="text-align:center;color:#000;font-size:12px;font-weight:700;border:1px solid #000">
                    H.M<br>(x)</td>
                <td rowspan="2"
                    style="text-align:center;color:#000;font-size:12px;font-weight:700;border:1px solid #000;width:45%">
                    COMMODITY DESCRIPTION<div style="font-weight:500;font-weight:700;font-size:10px">Lorem ipsum dolor sit
                        amet consectetur adipisicing elit. Voluptates ea ex provident dolores quibusdam, ratione doloremque
                        magnam aut eligendi aliquam id voluptatem illo totam. Et reiciendis asperiores quisquam autem at.
                    </div>
                </td>
                <td colspan="2"
                    style="text-align:center;color:#000;width:15%;font-size:12px;font-weight:700;border:1px solid #000">LTL
                    ONLY</td>
            </tr>
            <tr>
                <td style="font-weight:700;text-align:center;border:1px solid #000">QTY</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">TYPE</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">QTY</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">TYPE</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">NMFC #</td>
                <td style="font-weight:700;text-align:center;border:1px solid #000">CLASS</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td colspan="4" style="width:10%;text-align:end;color:#d3d3d3;border-right:1px solid #000">RECEIVING</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td colspan="4" style="width:10%;text-align:end;color:#d3d3d3;border-right:1px solid #000">STAMP SPACE</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
            </tr>
            <tr>
                <td style="border-left:1px solid #000">&emsp;</td>
                <td style="background-color:#d3d3d3;border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="background-color:#d3d3d3;border:1px solid #000">&emsp;</td>
                <td style="border:1px solid #000">&emsp;</td>
                <td style="background-color:#d3d3d3;border:1px solid #000">&emsp;</td>
                <td style="text-align:center;font-weight:700;border:1px solid #000">&emsp; GRAND TOTAL</td>
                <td style="background-color:#d3d3d3;border:1px solid #000">&emsp;</td>
                <td style="background-color:#d3d3d3;border:1px solid #000">&emsp;</td>
            </tr>
        </table>
        <table style="width:100%;border-collapse:collapse">
            <tr>
                <td style="border:1px solid #000;width:50%;vertical-align:baseline">
                    <div style="margin-left:5px;font-weight:700;font-size:10px">Where the rate is dependent on value,
                        shippers are required to state specially in writing the agreedor decired value of the property as
                        follows</div>
                    <div style="margin-top:10px;margin-left:5px;font-weight:700;font-size:10px">"The agreed or decided value
                        of the property is specially stated by the shipper to be not exciting</div>
                    <p style="margin:0 10px;margin-top:10px">______________Per______________.*</p>
                </td>
                <td style="width:50%;vertical-align:baseline;border:1px solid #000">
                    <h6 style="margin-left:20px">COD AMOUNT: $ __________________</h6>
                    <div style="display:flex;justify-content:space-around;font-size:12px;font-weight:600">
                        <p style="margin:0">Fee Terms:</p>
                        <p style="margin:0">Collect:<input type="checkbox"></p>
                        <p style="margin:0">Prepaid:<input type="checkbox"></p>
                    </div>
                    <div style="display:flex;justify-content:center;font-size:12px;font-weight:600;margin:10px">Customer
                        Check Acceptable : <input type="checkbox"></div>
                </td>
            </tr>
        </table>
        <table style="width:100%;border-collapse:collapse">
            <tr>
                <td style="border:1px solid #000;width:50%;vertical-align:baseline">
                    <p style="margin:0 5px;font-size:12px;font-weight:700">NOTE Liabillity Limitation for loss or damage in
                        this shipment may be applicable. See 49 U.S.C. = 1406(C)(1)(A)and(B).</p>
            </tr>
        </table>
        <table style="width:100%;border-collapse:collapse">
            <td style="border:1px solid #000;width:50%;vertical-align:baseline">
                <p style="margin-left:5px;font-weight:500;font-weight:700;font-size:10px">RECEIVED , Subject to individually
                    determinded rates or contarcts that have been agreed upon in writting between the carrier and shipper,
                    if applicable, otherwise to the rates classifications and rules that have been ostablised by the carrier
                    and are avaiolable to the shipper , on request, and to all applicable state and fedantal regulerless.
                </p>
            </td>
            <td style="border:1px solid #000;width:50%;vertical-align:baseline">
                <p
                    style="margin:0 5px;font-weight:500;font-weight:700;font-size:10px;font-weight:500;font-weight:700;font-size:10px">
                    The Carrrier shall not make delivery of this shipment without payment of freight and all other lawful
                    changes.</p>
                <div
                    style="margin:0 5px;display: grid;font-weight:700;font-size:10px;justify-content: center;align-items: center;text-align: center;">
                    <br />${
                      shipperSignedDataURL !== null
                        ? `<img src='${shipperSignedDataURL}' alt=''
                        style="width: 150px; height: 35px;" />`
                        : ""
                    }Shipper Signature</div>
            </td>
        </table>
        <table style="width:100%;border-collapse:collapse">
            <td style="border:1px solid #000;width:33%;vertical-align:top">
                <h6 style="margin:0;font-weight:600;margin-left:5px">SIGNNATURE / DATE</h6>
                <div style="margin-left:5px;font-weight:700;font-size:10px">This is conify that the above named materials
                    are properly classified.packged marked and Libbilled and are in propper condition for transactionn
                    according to the applicable regulations of the DOT<br />${
                      shipperSignedDataURL !== null
                        ? `<img
                        src='${shipperSignedDataURL}' alt='' style="width: 200px; height: 60px;" />`
                        : ""
                    }</div>
            </td>
            <td style="border:1px solid #000;width:40%;vertical-align:baseline">
                <div style="display:flex;justify-content:space-evenly">
                    <div style="margin-left:10px">
                        <h6 style="white-space:nowrap;margin-bottom:0;text-decoration:underline">Trailer Loaded:</h6>
                        <div><input type="checkbox"> By Shipper</div>
                        <div><input type="checkbox"> By Driver</div>
                    </div>
                    <div style="margin-left:15px">
                        <h6 style="white-space:nowrap;margin-bottom:0;text-decoration:underline">Freight Loaded:</h6>
                        <div><input type="checkbox"> By Shipper</div>
                        <div><input type="checkbox"> By Driver/pallets said to contain</div>
                        <div><input type="checkbox"> By Driver/Pieces</div>
                    </div>
                </div>
            </td>
            <td style="border:1px solid #000;width:33%;vertical-align:top">
                <h6 style="margin:0;font-weight:600;margin-left:5px">CARRIER SIGNNATURE/PICKUP DATE</h6>
                <div style="margin-right:15px;margin-left:15px;margin-top:20px;font-weight:700;font-size:10px">${
                  signature !== null
                    ? `<img
                        src='${signature}' alt='' style="width: 200px; height: 60px;" />`
                    : ""
                }</div>
            </td>
        </table>
    </body>
    
    </html>
    `,
  };
  // const createPDF = async () => {
  //   let options = {
  //     html: source.html,
  //     fileName: "test",
  //     directory: "Documents",
  //     base64: true,
  //   };

  //   let file = await RNHTMLtoPDF.convert(options);
  //   console.log(file.base64);
  //   // alert(file.filePath);
  // };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderWithBack
        title="Bill of Lading"
        onPress={() => {
          navigation.goBack();
          // if (loadDetails?.bolDetails?.partner_sign_url) {
          //   navigation.goBack();
          // } else {
          //   navigation.pop(2);
          // }

          // setopenAskQuestionModel(false);
        }}
        hideLeftSide={
          loadDetails.status === 5 || loadDetails.status === 4
            ? signature
              ? false
              : true
            : false
        }
        isRightText={signature ? false : true}
        rightText={openSignPad ? "Close" : "E-Sign"}
        isFrom={isFrom}
        rightOnPress={async () => {
          setopenSignPad(!openSignPad);
        }}
      />
      <WebView
        source={source}
        style={{ marginTop: 5, flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
      {/**
       * Chat Screen modal start here
       */}
      <Modal
        visible={openSignPad}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setopenSignPad(false);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            height: deviceHeight,
            paddingVertical: Platform.OS === "android" ? 0 : 25,
            paddingBottom: Platform.OS === "android" ? 10 : null,
          }}
        >
          <View style={{ flex: 1 }}>
            <HeaderWithBack
              title=""
              onPress={() => {
                // setopenAskQuestionModel(false);
              }}
              hideLeftSide={true}
              isRightText={true}
              rightText="Close"
              isFrom={isFrom}
              rightOnPress={async () => {
                setopenSignPad(false);
              }}
            />
            <View style={{ flex: 1 }}>
              {/* <View style={styles.preview}>
                {signature ? (
                  <FastImage
                    resizeMode={"contain"}
                    style={{ width: 335, height: 114 }}
                    source={{ uri: signature }}
                  />
                ) : null}
              </View> */}
              <Signature
                style={{ flex: 1 }}
                onOK={handleOK}
                onEmpty={handleEmpty}
                descriptionText="Sign"
                clearText="Clear"
                confirmText="Save"
                webStyle={style1}
              />
            </View>
          </View>
        </View>
        <StandardModal
          visible={showbolAlert}
          handleBackClose={() => {
            setshowbolAlert(false);
          }}
        >
          <View>
            <Text
              style={{
                fontSize: fontSizes.large,
                fontWeight: "700",
                color: "black",
              }}
            >
              E-Sign
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: fontSizes.medium,
                fontWeight: "400",
                marginVertical: deviceHeight / 30,
              }}
            >
              Are you sure want to E-Sign the BOL Document?
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    setshowbolAlert(false);
                    setsignLoading(false);
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
                    No
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <TouchableOpacity
                  onPress={async () => {
                    setsignLoading(true);

                    // UpLoad Carrier Sign to S3 Bucket
                    const userDetail: any = await storage.get("userData");
                    let fileName = `bill-of-landing/eSign_${userDetail.user_id}_${loadID}`;
                    console.log("fileName", fileName);
                    const response = await uploadESignToS3(
                      fileName,
                      tempSign,
                      global
                    );
                    if (response) {
                      console.log("E-Sign Uploaded", response);
                      let updateResponse = await eSignUploadCompleted({
                        load_id: loadID,
                        partner_sign_url: fileName,
                      });
                      setSign(tempSign);
                      setsignLoading(false);
                      console.log("---updateResponse", updateResponse);
                      setopenSignPad(false);
                      setshowbolAlert(false);
                    }

                    // setshowbolAlert(false);

                    //upload e-sign

                    // _acceptLoad();
                  }}
                  style={{
                    backgroundColor: colors.background,
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderRadius: 30,
                  }}
                >
                  {signLoading ? (
                    <Spinner
                      style={{ alignSelf: "center" }}
                      isVisible={true}
                      size={21}
                      type={"Wave"}
                      color={"white"}
                    />
                  ) : (
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: fontSizes.medium,
                        fontWeight: "600",
                        color: colors.white,
                      }}
                    >
                      Yes
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </StandardModal>
      </Modal>
      {/**
       *  modal ends here
       */}
    </SafeAreaView>
  );
};

// type StyleSet = {
//   mainContainer: ViewStyle;
//   renderListMainView: ViewStyle;
//   verticalLineStyle: ViewStyle;
// };

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

export default BolScreen;
