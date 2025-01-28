import React, { useState } from 'react';
import { useLocation, useNavigate,useSearchParams } from 'react-router-dom';
import './PaymentPage.css'; // Add CSS for styling
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import courseApi from '../../services/apiService'; // API service for backend requests

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course; // Retrieve course data passed via state
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");

  const handlePayment = async () => {
    setIsProcessing(true);
    

    try {
      // Simulate payment delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Enroll user in the course
      const response = await courseApi.enrollCourse(courseId);
      if (response) {
        alert('Payment successful! You have been enrolled in the course.');
        navigate('/Student/MyCourses', { state: { course } });
      } else {
        throw new Error('Enrollment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during payment/enrollment:', error.message);
      alert('Payment or enrollment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
