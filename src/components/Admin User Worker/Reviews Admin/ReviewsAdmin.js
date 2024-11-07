import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ReviewsAdmin = () => {
  const location = useLocation();
  const { workerId } = location.state || {};

  const [reviews, setReviews] = useState([]);
  const [overallRating, setOverallRating] = useState(null); // Fetch the overall rating from API
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [newOverallRating, setNewOverallRating] = useState(overallRating);
  const [editingRating, setEditingRating] = useState({}); // State to track editing mode for each review
  const [ratingValue, setRatingValue] = useState({}); // State to track rating input values

  // Fetch the overall rating for the worker
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/worker/${workerId}`);
        const rating = response.data.rating; // Assuming 'rating' field in API response
        setOverallRating(rating);
        setNewOverallRating(rating); // Initialize with current rating for editing
      } catch (err) {
        setError('Failed to fetch overall rating. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (workerId) fetchRating();
  }, [workerId]);

  // Generates border color based on rating
  const generateBorderColor = (rating) => {
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'yellow';
    return 'red';
  };

  // Fetch reviews for the worker
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/admin/reviews/${workerId}`);
      const reviewsData = response.data;
      setReviews(reviewsData);
    } catch (err) {
      setError('Failed to fetch reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workerId) fetchReviews();
  }, [workerId]);

  // Update overall rating
  const handleUpdateOverallRating = async () => {
    if (newOverallRating < 1 || newOverallRating > 5) {
      setError('Overall rating must be between 1 and 5.');
      return;
    }
    try {
      await axios.put(`http://localhost:3001/admin/worker/update-rating/${workerId}`, {
        rating: newOverallRating,
      });
      setOverallRating(newOverallRating); // Update overall rating state
    } catch (err) {
      setError('Failed to update overall rating. Please try again.');
    }
  };

  // Handle rating input change
  const handleRatingChange = (reviewId, value) => {
    setRatingValue((prev) => ({
      ...prev,
      [reviewId]: value, // Update only the specific review's rating
    }));
  };

  // Edit existing rating and save to the database
  const handleEditRating = async (reviewId) => {
    const updatedRating = ratingValue[reviewId];

    if (updatedRating < 1 || updatedRating > 5) {
      setError('Rating must be between 1 and 5.');
      return;
    }

    try {
      await axios.put(`http://localhost:3001/admin/edit/review/${reviewId}`, {
        rating: updatedRating,
      });
      fetchReviews(); // Refresh reviews after editing
      setEditingRating((prev) => ({ ...prev, [reviewId]: false })); // Exit edit mode
    } catch (err) {
      setError('Failed to update review. Please try again.');
    }
  };

  // Delete a rating
  const handleDeleteRating = async (reviewId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this review?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/admin/delete/review/${reviewId}`);
        fetchReviews(); // Refresh reviews after deletion
      } catch (err) {
        setError('Failed to delete review. Please try again.');
      }
    }
  };

  // Toggle expanded review
  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviewId((prevId) => (prevId === reviewId ? null : reviewId));
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='reviews-list'>
      <h1 id="title">Worker Reviews</h1>

      {/* Display and update the overall rating */}
      {overallRating !== null ? (
        <div>
          <p>Overall Rating: {overallRating.toFixed(1)} / 5</p>
          <input
            type='number'
            value={newOverallRating}
            onChange={(e) => setNewOverallRating(Number(e.target.value))}
            min={1}
            max={5}
            step={0.1}
          />
          <button onClick={handleUpdateOverallRating}>Update Overall Rating</button>
        </div>
      ) : (
        <p>No overall rating available yet.</p>
      )}

      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review._id} style={{ borderLeft: `6px solid ${generateBorderColor(review.rating)}`, marginBottom: '20px' }}>
              <div className="review-main" onClick={() => toggleReviewExpansion(review._id)} style={{ cursor: 'pointer' }}>
                <p><strong>Customer:</strong> {review.userId.fullName}</p>

                {editingRating[review._id] ? (
                  <div>
                    <input
                      type='number'
                      value={ratingValue[review._id] || ''} // Controlled input for rating
                      onChange={(e) => handleRatingChange(review._id, Number(e.target.value))}
                      min={1}
                      max={5}
                    />
                    <button onClick={() => handleEditRating(review._id)}>Save</button>
                    <button onClick={() => setEditingRating((prev) => ({ ...prev, [review._id]: false }))}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p><strong>Rating:</strong> {review.rating} / 5</p>
                )}

                <p><strong>Detailed Feedback:</strong> {review.comment}</p>

                {expandedReviewId === review._id && (
                  <div className="review-details">
                    <p><strong>Service Provided:</strong> {review.orderId.service}</p>
                    <p><strong>Review Date:</strong> {new Date(review.date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Always visible buttons */}
              <div className="buttons-section" style={{ marginTop: expandedReviewId === review._id ? '10px' : '0' }}>
                {!editingRating[review._id] && (
                  <>
                    <button onClick={() => setEditingRating((prev) => ({ ...prev, [review._id]: true }))}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteRating(review._id)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews available yet.</p>
      )}
    </div>
  );
};

export default ReviewsAdmin;
