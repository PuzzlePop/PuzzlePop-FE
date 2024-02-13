import Snackbar from "@mui/material/Snackbar";

export default function Toast({ message, open, onClose }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      onClose={onClose}
      message={<h1 style={{ textAlign: "center" }}>{message}</h1>}
    />
  );
}
