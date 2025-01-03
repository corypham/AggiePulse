import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  // your firebase config here
  projectId: "your-project-id",  // Make sure this is included
  // ... other config
};

const app = initializeApp(firebaseConfig);

export default app;  // Add default export 