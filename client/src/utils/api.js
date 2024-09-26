import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function convert(file, fileType) {
   const url = `${API_BASE_URL}/convert/${fileType}/outline`;
   const formData = new FormData();

   formData.append('file', file);
   formData.append('transform', true);

   try {
      const response = await axios.post(url, formData);
      return response.data;
   } catch (error) {
      console.error(error);
      return null;
   }
}

export async function validate(geoJson) {
   const url = `${API_BASE_URL}/validate`;
   const formData = new FormData();
   const blob = new Blob([JSON.stringify(geoJson)], { type: 'application/json' });

   formData.append('file', blob);

   try {
      const response = await axios.post(url, formData);
      return response.data;
   } catch (error) {
      console.error(error);
      return false;
   }
}