import { FilterCategory } from '../types/location';

export const filterCategories: FilterCategory[] = [
  {
    id: 'study',
    label: 'Study',
    type: 'study',
    icon: '📚'
  },
  {
    id: 'gym',
    label: 'Gym',
    type: 'gym',
    icon: '💪'
  },
  {
    id: 'dining',
    label: 'Dining',
    type: 'dining',
    icon: '🍽️'
  },
  {
    id: 'not-busy',
    label: 'Not Busy',
    type: 'not-busy',
    icon: '✨'
  },
  {
    id: 'fairly-busy',
    label: 'Fairly Busy',
    type: 'status',
    icon: '🔸'
  },
  {
    id: 'very-busy',
    label: 'Very Busy',
    type: 'status',
    icon: '🔴'
  }
]; 