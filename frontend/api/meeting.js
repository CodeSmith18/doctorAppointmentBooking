import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000/api/meetings' });

// Helper to get token from localStorage (or wherever you store it)
const getToken = () => localStorage.getItem('token'); // adjust if stored elsewhere

// Add token to headers in each request
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const createMeeting = (data) => API.post('/create', data, authHeaders());
export const getMeetings = () => API.get('/', authHeaders());
export const joinMeeting = (data) => API.post('/join', data, authHeaders());
