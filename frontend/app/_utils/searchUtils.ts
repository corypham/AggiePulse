import { Location } from '../types/location';
import { staticLocations } from '../data/staticLocations';
import { isLocationOpen } from './timeUtils';
import { getStatusText } from './businessUtils';

export const searchLocations = (locations: Location[], searchQuery: string): Location[] => {
  if (!searchQuery.trim()) return locations;
  
  // Split the search query into individual words and clean them
  const queryWords = searchQuery.toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 2 && !['and', 'the', 'or'].includes(word));
  
  return locations.filter(location => {
    // Get static location data
    const staticLocation = staticLocations[location.id];
    
    // Function to check if any query word matches a target string
    const matchesAnyWord = (target: string = '') => 
      queryWords.some(word => target.toLowerCase().includes(word));
    
    // Search through various location properties
    const matchesTitle = matchesAnyWord(location.title);
    const matchesDescription = matchesAnyWord(location.description);
    const matchesType = Array.isArray(location.type) 
      ? location.type.some(type => matchesAnyWord(type))
      : matchesAnyWord(location.type);
    
    // Search through features
    const matchesFeatures = staticLocation?.features?.some(
      feature => matchesAnyWord(feature)
    ) || false;
    
    // Search through all amenities
    const matchesAmenities = Object.values(staticLocation?.amenities || {}).some(
      amenityGroup => Array.isArray(amenityGroup) && amenityGroup.some(
        amenity => matchesAnyWord(amenity)
      )
    );

    // Check common keywords and categories
    const commonKeywords: { [key: string]: string[] } = {
      'food': ['restaurant', 'dining', 'cafe', 'cafeteria', 'eatery'],
      'dining': ['restaurant', 'food', 'cafe', 'cafeteria', 'eatery'],
      'study': ['library', 'study room', 'study space', 'quiet'],
      'gym': ['fitness', 'exercise', 'workout', 'sports'],
      'sports': ['gym', 'fitness', 'exercise', 'athletic'],
    };

    // Check if any query word matches common keywords
    const matchesKeywords = queryWords.some(word => {
      const keywords = commonKeywords[word];
      if (!keywords) return false;
      
      return keywords.some(keyword => 
        matchesAnyWord(location.title) || 
        matchesAnyWord(location.description) ||
        (Array.isArray(location.type) && location.type.some(type => type.toLowerCase().includes(keyword)))
      );
    });

    // Check open/closed status
    const isOpen = isLocationOpen(location);
    const matchesStatus = queryWords.some(word => 
      (word === 'open' && isOpen) || 
      (word === 'closed' && !isOpen)
    );

    // Check busyness status
    const busynessStatus = getStatusText(location).toLowerCase();
    const matchesBusyness = matchesAnyWord(busynessStatus);
    
    return matchesTitle || 
           matchesDescription || 
           matchesType || 
           matchesFeatures || 
           matchesAmenities || 
           matchesStatus ||
           matchesBusyness ||
           matchesKeywords;
  });
}; 