import React, { useState, useEffect } from 'react';
import ProfileForm from './ProfileForm';
import ProfilePictureUpload from './ProfilePictureUpload';
import ServiceOfferings from './ServiceOfferings';
import RatingsDisplay from './RatingsDisplay';
import './worker.css';

const ProfileEditPage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    services: [],
    hourlyRate: '',
    description: '',
    profilePicture: '',
    ratings: [],
  });

  const [originalProfile, setOriginalProfile] = useState({ ...profile });

  useEffect(() => {
    // Fetch profile data from API
    // Example: fetchProfile().then(setProfile);
  }, []);

  const handleSaveChanges = () => {
    // Validate and save profile changes
    // Example: updateProfile(profile).then(response => alert('Profile updated successfully!'));
  };

  const handleCancelChanges = () => {
    setProfile(originalProfile);
  };

  return (
    <div className="profile-edit-page">
      <h1 className="titlu">Worker Profile Management</h1>
      <ProfilePictureUpload profile={profile} setProfile={setProfile} />
      <ProfileForm profile={profile} setProfile={setProfile} />
      <ServiceOfferings profile={profile} setProfile={setProfile} />
      <RatingsDisplay ratings={profile.ratings} />
      <div className="button-group">
        <button onClick={handleSaveChanges}>Save Changes</button>
        <button onClick={handleCancelChanges}>Cancel</button>
      </div>
    </div>
  );
};

export default ProfileEditPage;
