import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import LearningpForm from '../../components/Learningp/LearningpForm';

const LearningpCreate = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      console.log('Submitting form data:', formData);
      await axios.post('http://localhost:8080/api/learningp', formData, {
        withCredentials: true
      });
      toast.success('Learning progress saved!');
      setTimeout(() => navigate('/feed'), 1500);
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Submission failed.');
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      {/* <h1 className="text-xl font-semibold text-center mt-5">Create Own Learning Progress</h1> */}
      <LearningpForm onSubmit={handleCreate} />
    </>
  );
};

export default LearningpCreate;
