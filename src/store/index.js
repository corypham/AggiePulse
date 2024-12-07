import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './slices/locationSlice';
import userReducer from './slices/userSlice';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.aggiepulse.com',
  timeout: 10000,
});

export const store = configureStore({
  reducer: {
    locations: locationReducer,
    user: userReducer,
  },
});

export const MAP_INITIAL_REGION = {
  latitude: 38.54138,
  longitude: -121.75388,
  latitudeDelta: 0.0222,
  longitudeDelta: 0.0121,
};

export const CROWD_LEVELS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
}; 