export type Color =
  | "#000000"
  | "#141517"
  | "#154F77"
  | "#288AEC"
  | "#3c3e41"
  | "#518d3f"
  | "#5c6778"
  | "#808080"
  | "#86939e"
  | "#88929D"
  | "#9ea5ac"
  | "#a9c6a0"
  | "#c4c4c4"
  | "#d8d8d8"
  | "#e4e6e8"
  | "#e7e7e7"
  | "#e83d3d"
  | "#ed8e4f"
  | "#f2f2f2"
  | "#ffd762"
  | "#ffffff"
  | "#2FBDB0"
  | "#FC3259"
  | "#005E8A"
  | "#D70761"
  | "rgba(0,0,0,0)"
  | "rgba(40,138,236,0.7)"
  | "#1F1F1F";

type Colors = {
  [index: string]: Color;
  background: "#000000";
  black: "#141517";
  blueOverlay: "rgba(40,138,236,0.7)";
  disabledBackgroundGrey: "#e4e6e8";
  disabledTextGrey: "#9ea5ac";
  green: "#518d3f";
  grey: "#808080";
  greyAccent: "#5c6778";
  greyDark: "#3c3e41";
  greyLight: "#d8d8d8";
  iconBoxGrey: "#e7e7e7";
  inputUnderlineGrey: "#c4c4c4";
  labelGray: "#86939e";
  lightGreen: "#a9c6a0";
  lightTextGrey: "#88929D";
  mainText: "#3c3e41";
  orangeAccent: "#ed8e4f";
  primary: "#005E8A";
  red: "#e83d3d";
  secondary: "#ffd762";
  secondaryText: "#5c6778";
  transparent: "rgba(0,0,0,0)";
  white: "#ffffff";
  pink: "#D70761";
  lightGrey: "#808F99";
  btnColor: "#1F1F1F";
};

const colors: Colors = {
  background: "#000000",
  black: "#141517",
  blue: "#154F77",
  blueOverlay: "rgba(40,138,236,0.7)",
  disabledBackgroundGrey: "#e4e6e8",
  disabledTextGrey: "#9ea5ac",
  green: "#518d3f",
  grey: "#808080",
  greyAccent: "#5c6778",
  greyDark: "#3c3e41",
  greyLight: "#d8d8d8",
  iconBoxGrey: "#e7e7e7",
  inputUnderlineGrey: "#c4c4c4",
  labelGray: "#86939e",
  lightGreen: "#a9c6a0",
  lightTextGrey: "#88929D",
  mainText: "#3c3e41",
  orangeAccent: "#ed8e4f",
  primary: "#005E8A",
  red: "#e83d3d",
  secondary: "#ffd762",
  secondaryText: "#5c6778",
  transparent: "rgba(0,0,0,0)",
  white: "#ffffff",
  pink: "#D70761",
  lightGrey: "#808F99",
  btnColor: "#1F1F1F"
};

export default colors;
