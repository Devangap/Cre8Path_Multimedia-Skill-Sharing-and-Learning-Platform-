import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast'; 
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const LearningpList = () => {
  const [learningpList, setLearningpList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/learningp/user-learningp', { withCredentials: true })
      .then(response => setLearningpList(response.data))
      .catch(error => {
        console.error('Error fetching learning progress:', error);
        toast.error('Failed to load learning progress!');
      });
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?'); 
    if (!confirmDelete) return;

    axios
      .delete(`http://localhost:8080/api/learningp/${id}`, { withCredentials: true })
      .then(() => {
        setLearningpList(prev => prev.filter(item => item.id !== id));
        toast.success('Deleted successfully!'); 
      })
      .catch(error => {
        console.error('Error deleting learning progress:', error);
        toast.error('Failed to delete!'); 
      });
  };

  const handleEdit = (id) => {
    navigate(`/learningp/edit/${id}`);
  };

  const calculateDaysLeft = (start_date, end_date) => {
    const end = new Date(end_date);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Incomplete': return 'bg-red-100 text-red-700';
      case 'Just Started': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="p-6 ml-64">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Learning Progress</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(Array.isArray(learningpList) ? learningpList : []).map((item) => {
          const daysLeft = calculateDaysLeft(item.start_date, item.end_date);
          return (
            <div key={item.id} className="bg-white p-6 border rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 relative">
              <h3 className="font-semibold text-xl text-gray-800">Course #{item.course_id}</h3>
              <p className="text-sm mt-3 text-gray-600">Start Date: {item.start_date}</p>
              <p className="text-sm mt-1 text-gray-600">Days Left: <span className="font-bold">{daysLeft}</span></p>
              <p className={`text-xs mt-4 ${getStatusColor(item.status)} px-3 py-1 rounded-full inline-block`}>{item.status}</p>
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transform hover:scale-110 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-110 transition"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningpList;
