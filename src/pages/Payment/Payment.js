import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css'; // Add CSS for styling
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course; // Retrieve course data passed via state
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert('Payment successfull! You have been enrolled in the course.');
      navigate('/Student/MyCourses', { state: { course } });
    }, 2000); // Simulate payment processing delay
  };

  return (
    <>
    <Navbar />
    <div className="payment-page">
      <h1>Payment for {course?.title || 'Course'}</h1>
      <div className="course-details">
        <img src={course?.thumbnail} alt="Course Thumbnail" />
        <h2>{course?.title}</h2>
        <p>Price: ${course?.price}</p>
      </div>
      <form className="payment-form">
        <label>
          Card Number
          <input type="text" placeholder="1234 5678 9012 3456" />
        </label>
        <label>
          Expiry Date
          <input type="text" placeholder="MM/YY" />
        </label>
        <label>
          CVV
          <input type="text" placeholder="123" />
        </label>
        <button type="button" onClick={handlePayment} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default PaymentPage;
