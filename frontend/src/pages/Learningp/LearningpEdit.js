import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import LearningpForm from '../../components/Learningp/LearningpForm';

const LearningpEdit = () => {
  const { id } = useParams();  // Get the id from the URL
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  // Fetch the learning progress data on component mount or when the id changes
  useEffect(() => {
    console.log('Fetching data for id:', id);  // Debug log to check if id is passed correctly

    axios
      .get(`http://localhost:8080/api/learningp/${id}`, { withCredentials: true })
      .then((response) => {
        console.log('Fetched data:', response.data); // Debug log to ensure data is fetched
        if (response.data) {
          setInitialData(response.data);
        } else {
          toast.error('Learning progress data not found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching learning progress:', error);
        toast.error('Failed to load learning progress.');
      });
  }, [id]);  // Re-fetch when `id` changes

  // Handle form submission for updating the data
  const handleUpdate = (data) => {
    console.log('Updating with data:', data);  // Debug log to check what data is being sent for update
    axios
      .put(`http://localhost:8080/api/learningp/${id}`, data, { withCredentials: true })
      .then(() => {
        toast.success('Learning progress successfully updated!');
        setTimeout(() => navigate('/feed'), 1500);
      })
      .catch((error) => {
        console.error('Error updating learning progress:', error);
        toast.error('Failed to update learning progress!');
      });
  };

  if (!initialData) return <div className="p-4 text-center">Loading...</div>;  // If data is not yet available, show loading

  return (
    <div>
      <Toaster position="top-right" />
      {/* <h1 className="text-xl font-semibold text-center my-4">Edit Learning Progress</h1> */}
      <LearningpForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
};

export default LearningpEdit;
