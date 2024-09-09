import React from 'react';

const RatingsDisplay = ({ ratings }) => (
  <div className="ratings-display">
    <h2>Ratings</h2>
    <ul>
      {ratings.map((rating, index) => (
        <li key={index}>{rating}</li>
      ))}
    </ul>
  </div>
);

export default RatingsDisplay;
