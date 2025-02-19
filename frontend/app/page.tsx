import { useEffect } from 'react';
import { LocationService } from './services/locationService';

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Initializing app - fetching location data...');
        // This will trigger the bulk API call
        const locations = await LocationService.getAllLocationsData();
        console.log('Received locations:');
      } catch (error) {
        console.error('Error fetching initial data:');
      }
    };

    fetchData();
  }, []);

  // Rest of your component code
} 