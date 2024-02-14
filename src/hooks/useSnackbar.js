import { useState } from "react";

export const useSnackbar = () => {
  const [isShowSnackbar, setIsShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  return {
    isShowSnackbar,
    setIsShowSnackbar,
    snackMessage,
    setSnackMessage,
  };
};
