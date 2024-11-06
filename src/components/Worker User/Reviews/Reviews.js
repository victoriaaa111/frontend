import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../../context/AuthProvider';
import "./Reviews.css";

const ReviewsWorker = () => {
  const { auth } = useContext(AuthContext);
  const { workerId } = auth;

  const [reviews, setReviews] = useState([]);
  const [overallRating, setOverallRating] = useState(null); // Now storing overall rating fetched from the API
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedReviewId, setExpandedReviewId] = useState(null);

  const generateBorderColor = (rating) => {
    if (rating >= 4) {
      return 'green';
    } else if (rating < 4 && rating >= 3) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  // Fetch overall rating for the worker
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/worker/${workerId}`);
        const rating = response.data.rating; // Assuming 'rating' field in API response
        setOverallRating(rating);
      } catch (err) {
        setError('Failed to fetch overall rating. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRating();
  }, [workerId]);

  // Fetch reviews for the worker
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/worker/reviews/${workerId}`);
        const reviewsData = response.data;

        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to fetch reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [workerId]);

  // Toggle expanded review
  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviewId((prevId) => (prevId === reviewId ? null : reviewId));
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='reviews-list'>
      <h1 id="title">Worker Reviews</h1>

      {/* Display the overall rating fetched from the API */}
      {overallRating !== null ? (
        <p>Overall Rating: {overallRating.toFixed(1)} / 5</p>
      ) : (
        <p>No overall rating available yet.</p>
      )}

      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review._id} style={{ borderLeft: `6px solid ${generateBorderColor(review.rating)}` }}>
              <div className="review-main" onClick={() => toggleReviewExpansion(review._id)} style={{ cursor: 'pointer' }}>
                <p><strong>Customer:</strong> <span style={{color:`#555`}}>{review.userId.fullName}</span></p>
                <p><strong>Rating:</strong><span style={{color:`#555`}}> {review.rating} / 5</span></p>
                <p><strong>Detailed Feedback:</strong> <span style={{color:`#555`}}> {review.comment}</span></p>
              </div>

              {expandedReviewId === review._id && (
                <div className="review-details">
                  <p><strong>Service Provided:</strong> <span style={{color:`#555`}}> {review.orderId.service}</span></p>
                  <p><strong>Review Date:</strong> <span style={{color:`#555`}}> {new Date(review.date).toLocaleDateString()}</span></p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews available yet.</p>
      )}
    </div>
  );
};

export default ReviewsWorker;
