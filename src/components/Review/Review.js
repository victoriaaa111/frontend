import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './Review.css';

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); // State to track if it's an error
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track if the review was submitted successfully
  const location = useLocation();
  const navigate = useNavigate(); // Hook to handle navigation
  const { userId, orderId } = location.state;

  // useEffect to handle the redirection after 3 seconds
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate('/'); // Redirect to homepage
      }, 3000); // 3 seconds

      // Cleanup the timeout if component unmounts or if isSubmitted changes
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate]);

  const handleSubmit = async () => {
    // Basic validation
    if (rating === 0 || reviewText.trim() === '') {
      setMessage('Please provide a rating and a review text.');
      setIsError(true);
      return; // Stop execution if validation fails
    }

    try {
      const data = {
        userId: userId,
        orderId: orderId,
        rating: rating, // Include the rating
        comment: reviewText // Include the review text
      };

      console.log('Submitting review:', data); // Log the data being sent
      
      const response = await axios.post('http://3.70.72.246:3001/user/add-review', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response.data); // Log the response from the server

      // If the review is successfully submitted
      if (response.status === 200 || response.status === 201) {
        setMessage('Review was sent successfully!');
        setIsError(false); // It's not an error
        setIsSubmitted(true); // Mark the review as submitted
      } else {
        setMessage('Something went wrong. Please try again.');
        setIsError(true); // Mark as error
      }

    } catch (error) {
      // Display a user-friendly error message
      console.error('Error submitting review:', error.response ? error.response.data : error.message);
      setMessage('Error submitting review. Please check your input and try again.');
      setIsError(true); // Mark as error
    }
  };

  return (
    <div className="rating-container">
      <h1>FIXER.MD</h1>

      {isSubmitted ? (
        <p className="message-success">{message}</p> // Display the success message after submission
      ) : (
        <>
          <div className="rating-stars">
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <svg
                  key={index}
                  className="star"
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                  fill={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  height="50"
                  width="50"
                  viewBox="0 0 24 24"
                  style={{ cursor: 'pointer' }}
                >
                  <path d="M12 .587l3.668 7.431 8.214 1.192-5.941 5.787 1.402 8.173L12 18.897l-7.343 3.863 1.402-8.173-5.941-5.787 8.214-1.192z" />
                </svg>
              );
            })}
          </div>

          <textarea
            className="review-text"
            placeholder="Share details of your experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          <div className="buttons">
            <button className="post-btn" onClick={handleSubmit}>
              Post
            </button>
            <button className="cancel-btn" onClick={() => { 
              setRating(0); 
              setReviewText(''); 
              setMessage(''); 
              setIsError(false); 
            }}>
              Cancel
            </button>
          </div>

          {/* Display success or error message */}
          {message && (
            <p className={isError ? 'message-error' : 'message-success'}>
              {message}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Rating;
