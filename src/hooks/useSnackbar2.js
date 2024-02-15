import { useCallback, useEffect, useMemo, useState } from "react";

const defaultProps = {
  autoClosing: false,
};

export const useSnackbar2 = ({ autoClosing, ...props } = defaultProps) => {
  const [snackMessage, setSnackMessage] = useState("");

  const isShowSnackbar = useMemo(() => snackMessage !== "", [snackMessage]);

  const onClose = useCallback(() => {
    setSnackMessage("");
  }, []);

  useEffect(() => {
    if (autoClosing) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [autoClosing, onClose]);

  return {
    snackMessage,
    isShowSnackbar,
    onClose,
    setSnackMessage,
  };
};
