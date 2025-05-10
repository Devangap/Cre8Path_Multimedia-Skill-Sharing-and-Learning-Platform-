import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import LearningpForm from '../../components/Learningp/LearningpForm';

const LearningpEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/learningp/${id}`, { withCredentials: true })
      .then(response => setInitialData(response.data))
      .catch(error => {
        console.error('Error fetching learning progress:', error);
        toast.error('Failed to load learning progress.');
      });
  }, [id]);

  const handleUpdate = (data) => {
    axios
      .put(`http://localhost:8080/api/learningp/${id}`, data, { withCredentials: true })
      .then(() => {
        toast.success('Learning progress successfully updated!');
        setTimeout(() => navigate('/learningp'), 1500);
      })
      .catch(error => {
        console.error('Error updating learning progress:', error);
        toast.error('Failed to update learning progress!');
      });
  };

  if (!initialData) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-xl font-semibold text-center my-4">Edit Learning Progress</h1>
      <LearningpForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
};

export default LearningpEdit;
