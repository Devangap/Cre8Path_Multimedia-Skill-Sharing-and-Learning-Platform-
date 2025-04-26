import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster  } from 'react-hot-toast';
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
      .then(() => {
        toast.success('Learning progress successfully updated!');
        setTimeout(() => navigate('/learningp'), 2000);
      })
      .catch(error => {
        console.error('Error updating learning progress:', error);
        toast.error('Failed to update learning progress!');
      });
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <h1>Edit Learning Progress</h1>
      <LearningpForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
};

export default LearningpEdit;