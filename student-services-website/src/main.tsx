import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize sample data
const initializeSampleData = () => {
  const accommodations = [
    {
      accommodationID: 'acc_1',
      name: 'Sunset Dorm',
      location: 'North Campus',
      capacity: 50,
      pricePerNight: 150,
      description: 'Modern dorm with great facilities',
      amenities: ['WiFi', 'Laundry', 'Study Room'],
    },
    {
      accommodationID: 'acc_2',
      name: 'Ocean View Apartments',
      location: 'South Campus',
      capacity: 30,
      pricePerNight: 250,
      description: 'Luxury apartments with ocean views',
      amenities: ['WiFi', 'Gym', 'Pool', 'Parking'],
    },
    {
      accommodationID: 'acc_3',
      name: 'Campus Central',
      location: 'Central Campus',
      capacity: 100,
      pricePerNight: 120,
      description: 'Budget-friendly rooms near campus',
      amenities: ['WiFi', 'Common Room'],
    },
  ];

  const transport = [
    {
      transportID: 'trans_1',
      type: 'Bus',
      schedule: 'Daily 8:00 AM',
      seatsAvailable: 40,
      pricePerSeat: 5,
      route: 'Campus to Downtown',
    },
    {
      transportID: 'trans_2',
      type: 'Shuttle',
      schedule: 'Every 30 minutes',
      seatsAvailable: 15,
      pricePerSeat: 3,
      route: 'Campus Loop',
    },
  ];

  const meals = [
    {
      mealID: 'meal_1',
      name: 'Beef Burger Combo',
      type: 'REGULAR',
      price: 12,
      calories: 800,
      description: 'Juicy burger with fries and soda',
    },
    {
      mealID: 'meal_2',
      name: 'Grilled Chicken Salad',
      type: 'HEALTHY',
      price: 10,
      calories: 400,
      description: 'Fresh salad with grilled chicken',
    },
  ];

  const clubs = [
    {
      clubID: 'club_1',
      name: 'Photography Club',
      description: 'Learn and practice photography',
      membershipFee: 25,
      memberCount: 45,
      category: 'Arts',
    },
    {
      clubID: 'club_2',
      name: 'Coding Club',
      description: 'Weekly coding challenges and workshops',
      membershipFee: 20,
      memberCount: 80,
      category: 'Technology',
    },
    {
      clubID: 'club_3',
      name: 'Debate Society',
      description: 'Improve your public speaking skills',
      membershipFee: 15,
      memberCount: 60,
      category: 'Academic',
    },
  ];

  // Only initialize if not already done
  if (!localStorage.getItem('accommodations')) {
    localStorage.setItem('accommodations', JSON.stringify(accommodations));
    localStorage.setItem('transport', JSON.stringify(transport));
    localStorage.setItem('meals', JSON.stringify(meals));
    localStorage.setItem('clubs', JSON.stringify(clubs));
    localStorage.setItem('bookings', JSON.stringify([]));
    localStorage.setItem('payments', JSON.stringify([]));
    localStorage.setItem('notifications', JSON.stringify([]));
    localStorage.setItem('users', JSON.stringify([]));
    localStorage.setItem('students', JSON.stringify([]));
    localStorage.setItem('admins', JSON.stringify([]));
    console.log('✅ Sample data initialized');
  }
};

initializeSampleData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
