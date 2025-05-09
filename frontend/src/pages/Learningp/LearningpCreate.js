import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster  } from 'react-hot-toast';
import LearningpForm from '../../components/Learningp/LearningpForm';

const LearningpCreate = () => {
  const navigate = useNavigate();

  const handleCreate = (data) => {
    axios.post('http://localhost:8080/api/learningp', data)
      .then(() => {
        toast.success('Learning progress successfully submitted!');
        setTimeout(() => navigate('/learningp'), 2000);
      })
      .catch(error => {
        console.error('Error creating learning progress:', error);
        toast.error('Failed to submit learning progress!');
      });
  };

  return (
    <>
    
    <Toaster position="top-right" reverseOrder={false} />
    <LearningpForm onSubmit={handleCreate} /> 
    </>

      
  );
};

export default LearningpCreate;