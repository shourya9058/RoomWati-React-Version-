import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { ChatProvider } from './context/ChatContext';
import { VisitProvider } from './context/VisitContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import FloatingChatNotification from './components/chat/FloatingChatNotification';

import ProtectedRoute from './components/common/ProtectedRoute';

// Core Pages
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Visits from './pages/Visits';

// Footer & Resource Pages
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import PrivacyTerms from './pages/PrivacyTerms';
import HostResources from './pages/HostResources';
import CommunityGuidelines from './pages/CommunityGuidelines';
import HelpCenter from './pages/HelpCenter';
import SitemapPage from './pages/SitemapPage';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ToastProvider>
          <ChatProvider>
            <VisitProvider>
              <Router>
                <ScrollToTop />
                <FloatingChatNotification />
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/listings" element={<Listings />} />
                      <Route 
                        path="/listings/new" 
                        element={
                          <ProtectedRoute>
                            <CreateListing />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="/listings/:id" element={<ListingDetail />} />
                      <Route 
                        path="/listings/:id/edit" 
                        element={
                          <ProtectedRoute>
                            <EditListing />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/messages" 
                        element={
                          <ProtectedRoute>
                            <Messages />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/visits" 
                        element={
                          <ProtectedRoute>
                            <Visits />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/verify-otp" element={<VerifyOtp />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Footer Section Routes */}
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/privacy" element={<PrivacyTerms />} />
                      <Route path="/terms" element={<PrivacyTerms />} />
                      <Route path="/host-resources" element={<HostResources />} />
                      <Route path="/guidelines" element={<CommunityGuidelines />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/sitemap" element={<SitemapPage />} />

                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </VisitProvider>
          </ChatProvider>
        </ToastProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

