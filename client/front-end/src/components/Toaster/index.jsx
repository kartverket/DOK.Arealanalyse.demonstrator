import { useDispatch, useSelector } from 'react-redux';
import { setErrorMessage } from 'store/slices/appSlice';
import { Alert, Snackbar } from '@mui/material';

export default function Toaster() {
   const errorMessage = useSelector(state => state.app.errorMessage);
   const dispatch = useDispatch();

   function handleCloseError() {
      dispatch(setErrorMessage(null));
   }

   return (
      <Snackbar
         open={errorMessage !== null}
         autoHideDuration={5000}
         onClose={handleCloseError}
         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
         <Alert
            onClose={handleCloseError}
            severity="error"
            sx={{ width: '100%', '& .MuiAlert-message': { fontWeight: 400, fontFamily: 'Roboto-Regular' } }}
         >
            {errorMessage}
         </Alert>
      </Snackbar>
   );
}