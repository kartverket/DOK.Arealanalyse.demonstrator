import { forwardRef, useState, useEffect, useRef } from 'react';
import { NumericFormat } from 'react-number-format';
import { FormControl, TextField } from '@mui/material';

const IntegerField = forwardRef(({ name, value, label, onChange, error, helperText, required = false, ...inputProps }, ref) => {
   const [_value, setValue] = useState(value.toString());
   const valueRef = useRef(value);

   useEffect(
      () => {
         setValue(value);
         valueRef.current = value;
      },
      [value]
   );

   return (
      <FormControl fullWidth>
         <NumericFormat
            {...inputProps}
            value={_value}
            decimalScale={0}
            inputRef={ref}
            label={label}
            onChange={event => {
               const newValue = event.value;
               setValue(newValue !== '' ? newValue : '0');
            }}
            onBlur={event => {
               const newValue = event.target.value;
               const parsed = parseInt(newValue !== '' ? newValue : '0');
               setValue(parsed);
               onChange({ target: { name, value: parsed }});
               valueRef.current = parsed;
            }}
            allowNegative={false}
            allowLeadingZeros={true}
            autoComplete="off"
            customInput={TextField}
            required={required}
            error={error}
            helperText={helperText}
         />
      </FormControl>
   );
});

IntegerField.displayName = 'IntegerField';

export default IntegerField;