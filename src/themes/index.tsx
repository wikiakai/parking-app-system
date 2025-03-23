import { amber, orange, blue } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: blue,
    secondary: amber,
  },
});

export default theme;
