import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LearningpForm from '../../components/Learningp/LearningpForm';

const LearningpEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/learningp/${id}`)
      .then(response => setInitialData(response.data))
      .catch(error => console.error('Error fetching learning progress:', error));
  }, [id]);

  const handleUpdate = (data) => {
    axios.put(`http://localhost:8080/api/learningp/${id}`, data)
      .then(() => navigate('/learningp'))
      .catch(error => console.error('Error updating learning progress:', error));
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Learning Progress</h1>
      <LearningpForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
};

export default LearningpEdit;