import React, { useState } from "react";

export const SnackbarContext = React.createContext<SnackbarContextType>({} as SnackbarContextType);

export type SnackbarContextType = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  visible: boolean;
  duration: number;
};

export const SnackbarProvider: React.FC = props => {
  const [message, setMessage] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(2000);
  const state = {
    message,
    setMessage,
    setVisible,
    visible,
    duration,
    setDuration
  };

  return <SnackbarContext.Provider value={state} {...props} />;
};
