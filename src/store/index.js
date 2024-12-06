import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './locationSlice';
import userReducer from './userSlice';
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
  latitude: 33.72689000,
  longitude: -117.76233300,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const CROWD_LEVELS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
}; 