import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: {
      light: "#5c67a3",
      main: "#ff9933",
      dark: "#2e355b",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff79b0",
      main: "#ff4081",
      dark: "#c60055",
      contrastText: "#fff",
    },
    openTitle: "white",
    protectedTitle: "#396",
    type: "light",
  },
});

export default theme;
