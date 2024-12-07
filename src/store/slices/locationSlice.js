import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  locations: [],
  selectedLocation: null,
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
  },
});

export const { setLocations, setSelectedLocation } = locationSlice.actions;
export default locationSlice.reducer;
