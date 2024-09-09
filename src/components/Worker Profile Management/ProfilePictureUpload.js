import React, { useRef, useState } from 'react';

const ProfilePictureUpload = ({ profile, setProfile }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(profile.profilePicture);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 2000000) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setProfile(prevProfile => ({ ...prevProfile, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file (max 2MB).');
    }
  };

  return (
    <div className="profile-picture-upload">
      <img src={preview} alt="Profile Preview" />
      <button onClick={() => fileInputRef.current.click()}>Change Picture</button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePictureUpload;
