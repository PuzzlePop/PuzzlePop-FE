import { useEffect, useState } from "react";

const defaultProps = {
  autoClosing: false,
};

export const useSnackbar = ({ autoClosing, ...props } = defaultProps) => {
  const [isShowSnackbar, setIsShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  useEffect(() => {
    if (autoClosing) {
      setTimeout(() => {
        setIsShowSnackbar(false);
        setSnackMessage("");
      }, 1500);
    }
  }, [autoClosing]);

  return {
    isShowSnackbar,
    setIsShowSnackbar,
    snackMessage,
    setSnackMessage,
  };
};
