export const extractError = (error: ApiError): string | undefined => {
  const errorMessage = error.response.data?.error;
  const errorMessageObject = error.response?.data?.errors;

  if (errorMessage) return errorMessage;

  if (errorMessageObject) {
    const [errorTitle, explanationArray] = Object.entries(errorMessageObject)[0];
    // @ts-ignore
    return `${errorTitle} ${explanationArray[0]}`;
  }

  return;
};
