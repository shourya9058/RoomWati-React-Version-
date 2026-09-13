import React, { useState, useEffect } from 'react';
import Hero from '../components/home/Hero';
import CategoryPills from '../components/home/CategoryPills';
import FeaturedListings from '../components/home/FeaturedListings';
import WhyRoomWati from '../components/home/WhyRoomWati';
import TestimonialBar from '../components/home/TestimonialBar';
import LandlordModal from '../components/home/LandlordModal';
import api from '../services/api';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedListings();
  }, [selectedCategory]);

  const fetchFeaturedListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (selectedCategory && selectedCategory !== 'all') {
        if (selectedCategory === 'single') {
          params.roomType = 'single';
        } else if (selectedCategory === 'shared') {
          params.roomType = 'shared';
        } else if (selectedCategory === 'studio') {
          params.roomType = 'studio';
        } else if (selectedCategory === 'entire_apartment') {
          params.roomType = 'entire_apartment';
        } else if (selectedCategory === 'furnished') {
          params.furnished = 'furnished';
        } else if (selectedCategory === 'buy') {
          params.q = 'apartment';
        } else if (selectedCategory === 'budget') {
          params.maxPrice = '15000';
        }
      }

      const res = await api.getListings(params);
      setListings(res.listings || []);
    } catch (err) {
      console.error('Failed to load featured listings:', err);
      setError('Could not load featured stays right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. Immersive Hero Section with Floating Search Capsule */}
      <Hero />

      {/* 2. Category Navigation Bar (Centered with Active Red Underline) */}
      <CategoryPills
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* 3. Featured Stays 4-Card Grid */}
      <FeaturedListings
        listings={listings}
        loading={loading}
        error={error}
        onRetry={fetchFeaturedListings}
      />

      {/* 4. Why Choose RoomWati (2-Column Split Layout with Photo & Polaroid) */}
      <WhyRoomWati />

      {/* 5. Review Quote Bar (Aditi Sharma, 5 Stars) */}
      <TestimonialBar />

      {/* 6. Automatic Landlord CTA Modal (Delayed smooth entrance on landing) */}
      <LandlordModal />

    </div>
  );
}
