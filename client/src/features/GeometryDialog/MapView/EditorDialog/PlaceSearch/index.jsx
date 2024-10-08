import { useEffect, useMemo, useState } from 'react';
import { placeSearch } from 'utils/api';
import { Autocomplete, TextField, Typography } from '@mui/material';
import debounce from 'lodash.debounce';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import styles from './PlaceSearch.module.scss';

export default function PlaceSearch({ onChange }) {
   const [value, setValue] = useState(null);
   const [inputValue, setInputValue] = useState('');
   const [options, setOptions] = useState([]);

   const _fetch = useMemo(
      () => {
         return debounce(query => {
            const _query = query.replace(/\s+/g, ' ').trim();

            if (_query.length >= 2) {
               placeSearch(_query)
                  .then(response => {
                     setOptions(response.features);
                  });
            }
         }, 500)
      },
      []
   );

   useEffect(
      () => {
         let active = true;

         if (inputValue === '') {
            setOptions(value ? [value] : []);
            return;
         }

         _fetch(inputValue, results => {
            if (active) {
               let newOptions = [];

               if (value) {
                  newOptions = [value];
               }

               if (results) {
                  newOptions = [...newOptions, ...results];
               }

               setOptions(newOptions);
            }
         });

         return () => {
            active = false;
         };
      },
      [value, inputValue, _fetch]
   );

   return (
      <Autocomplete
         sx={{ width: 300 }}
         getOptionLabel={option => typeof option === 'string' ? option : option.properties.name}
         filterOptions={(x) => x}
         options={options}
         autoComplete
         includeInputInList
         filterSelectedOptions
         value={value}
         noOptionsText="Ingen steder funnet"
         isOptionEqualToValue={options => options.id}
         onChange={(event, newValue) => {
            setOptions(newValue ? [newValue, ...options] : options);
            setValue(newValue);
            onChange(newValue);
         }}
         onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
         }}
         renderInput={params => (
            <TextField
               {...params}
               placeholder="Finn et sted..."
               size="small"
               fullWidth
               sx={{
                  '> .MuiInputBase-root': {
                     backgroundColor: '#ffffff'
                  }
               }}
            />
         )}
         renderOption={(props, option) => {
            return (
               <li {...props} key={option.id} >
                  <div className={styles.result}>
                     <div className={styles.icon}>
                        <LocationOnIcon sx={{ color: 'text.secondary' }} />
                     </div>
                     <div className={styles.place}>
                        <span>{option.properties.name}</span>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                           {option.properties.municipality}
                        </Typography>
                     </div>
                  </div>
               </li>
            );
         }}
      />
   )
}