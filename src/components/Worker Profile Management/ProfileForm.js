import React from 'react';
import { useForm } from 'react-hook-form';

const ProfileForm = ({ profile, setProfile }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: profile,
  });

  const onSubmit = (data) => {
    setProfile(prevProfile => ({ ...prevProfile, ...data }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Name:
        <input {...register('name', { required: true })} />
        {errors.name && <span>Name is required</span>}
      </label>
      <label>
        Email:
        <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
        {errors.email && <span>Valid email is required</span>}
      </label>
      <label>
        Phone Number:
        <input {...register('phoneNumber', { required: true })} />
        {errors.phoneNumber && <span>Phone number is required</span>}
      </label>
      <label>
        Address:
        <input {...register('address')} />
      </label>
      <label>
        Hourly Rate:
        <input type="number" {...register('hourlyRate', { required: true })} />
        {errors.hourlyRate && <span>Hourly rate is required</span>}
      </label>
      <label>
        Description:
        <textarea {...register('description')} />
      </label>
      <button type="submit">Update Details</button>
    </form>
  );
};

export default ProfileForm;
