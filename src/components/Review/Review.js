import React, { useState } from 'react';
import './Review.css';

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [image, setImage] = useState(null);

  const handleFileUpload = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleSubmit = () => {
    console.log('Rating:', rating);
    console.log('Review:', reviewText);
    console.log('Uploaded Image:', image);
    // Submit logic here
  };

  return (
    <div className="rating-container">
      <h2>FIXER.MD</h2>
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
              style={{ cursor: 'pointer' }}  // Optional: Add pointer cursor for better UX
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

      <div className="file-upload">
        <label htmlFor="fileInput" className="file-upload-label">
          <svg
            className="camera-icon"
            fill="#000"
            height="24"
            width="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm0 22.4c-5.718 0-10.4-4.682-10.4-10.4S6.282 1.6 12 1.6 22.4 6.282 22.4 12 17.718 22.4 12 22.4zM8 7.2v1.6h1.6V7.2zm1.6-2.4c.436 0 .8.364.8.8s-.364.8-.8.8-.8-.364-.8-.8.364-.8.8-.8zM16 7.2v8.8H8V7.2h8zm0-1.6H8V4.8h8z" />
          </svg>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="buttons">
        <button className="cancel-btn" onClick={() => { /* reset form logic */ }}>
          Cancel
        </button>
        <button className="post-btn" onClick={handleSubmit}>
          Post
        </button>
      </div>
    </div>
  );
};

export default Rating;
