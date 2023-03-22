import camelCaseKeys from "camelcase-keys-deep";

function camelCaseResponseTransformer(data: any) {
  return (data && data !== " " && camelCaseKeys(JSON.parse(data))) || data;
}

export default camelCaseResponseTransformer;
