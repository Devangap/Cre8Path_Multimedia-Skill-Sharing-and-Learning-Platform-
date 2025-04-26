import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LearningpForm from '../../components/Learningp/LearningpForm';

const LearningpCreate = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const handleCreate = (data) => {
    axios.post('http://localhost:8080/api/learningp', data)
      .then(() => {
        setSuccessMessage('Learning progress successfully submitted!');
        setTimeout(() => navigate('/learningp'), 2000);
      })
      .catch(error => console.error('Error creating learning progress:', error));
  };

  return (
    <div>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <LearningpForm onSubmit={handleCreate} />
    </div>
  );
};

export default LearningpCreate;