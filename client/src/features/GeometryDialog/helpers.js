import axios from 'axios';

const CONVERT_API_BASE_URL = import.meta.env.VITE_CONVERT_API_BASE_URL;

export async function parseJsonFile(file) {
   try {
      const text = await file.text();
      return JSON.parse(text);
   } catch (error) {
      console.error(error);
      return null;
   }
}

export async function getFileContents(file) {
   const fileType = getFileType(file);

   if (fileType !== 'geojson') {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('transform', true);
      
      const url = `${CONVERT_API_BASE_URL}/convert/${fileType}/outline`;

      try {
         const response = await axios.post(url, formData);
         return JSON.stringify(response.data, null, 3);  
      } catch (error) {
         console.error(error);
         return '';
      }
   } else {
      return await file.text();
   }
}

function getExtension(file) {
   return file.name.split('.').pop();
}

export function getFileType(file) {
   const extension = getExtension(file);

   switch (extension) {
      case 'json':
      case 'geojson':
         return 'geojson';
      case 'sos':
      case 'sosi':
         return 'sosi'
      case 'gml':
         return 'gml';
      default:
         return null;
   }
}