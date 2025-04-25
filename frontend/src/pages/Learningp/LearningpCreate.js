import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LearningpForm from '../../components/Learningp/LearningpForm';

const LearningpCreate = () => {
  const navigate = useNavigate();

  const handleCreate = (data) => {
    axios.post('/api/learningp', data)
      .then(() => navigate('/learningp'))
      .catch(error => console.error('Error creating learning progress:', error));
  };

  return (
    <div>
      <h1>Create Learning Progress</h1>
      <LearningpForm onSubmit={handleCreate} />
    </div>
  );
};

export default LearningpCreate;