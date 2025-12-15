import axios from 'axios';

const API_URL = 'http://localhost:80/api'; 

export const loginUser = async (credentials) => {
      
  const response = await axios.post(`${API_URL}/login`, credentials);
  
  return response.data; 
};