export default function TabPanel(props) {
   const { children, value, index, ...other } = props;

   return (
      <div
         id={`tabpanel-${index}`}
         hidden={value !== index}
         {...other}
      >
         {value === index && children}
      </div>
   );
}