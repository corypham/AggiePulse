import { FilterCategory } from '../types/location';

export const filterCategories: FilterCategory[] = [
  {
    id: 'open',
    label: 'Open',
    type: 'status'
  },
  {
    id: 'closed',
    label: 'Closed',
    type: 'status'
  },
  {
    id: 'very-busy',
    label: 'Very Busy',
    type: 'busyness'
  },
  {
    id: 'fairly-busy',
    label: 'Fairly Busy',
    type: 'busyness'
  },
  {
    id: 'not-busy',
    label: 'Not Busy',
    type: 'busyness'
  },
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
  }
]; 