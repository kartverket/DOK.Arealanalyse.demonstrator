import { createTheme } from '@mui/material/styles';

const theme = createTheme({
   typography: {
      allVariants: {
         fontFamily: 'Roboto-Regular',
         letterSpacing: 0
      },
      body1: {
         fontSize: 14
      }
   },
   components: {
      MuiButton: {
         styleOverrides: {
            text: {
               lineHeight: 'unset'
            },
            root: {
               padding: '6px 30px'
            }
         }
      },
      MuiAlert: {
         styleOverrides: {
            root: {
               padding: '12px 24px',
               fontSize: '14px',
               alignItems: 'center'
            },
            message: {
               fontFamily: 'Roboto-Medium',
               fontWeight: 500,
               color: 'rgba(0, 0, 0, 0.87)'
            },
            icon: {
               fontSize: '30px'
            }
         }
      },
   }
});

export default theme;