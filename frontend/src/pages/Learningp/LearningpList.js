import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast'; 

const LearningpList = () => {
  const [learningpList, setLearningpList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/learningp')
      .then(response => setLearningpList(response.data))
      .catch(error => console.error('Error fetching learning progress:', error));
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?'); 
    if (!confirmDelete) return;

    axios.delete(`http://localhost:8080/api/learningp/${id}`)
      .then(() => {
        setLearningpList(learningpList.filter(item => item.id !== id));
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold';
      case 'Incomplete':
        return 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold';
      case 'Just Started':
        return 'bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold';
      default:
        return 'bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold';
    }
  };

  return (
    <div className="p-6 ml-64">
      {/* Toaster for toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <h2 className="text-2xl font-semibold mb-4">Learning Progress</h2>
      
      <div className="overflow-x-auto border rounded-lg shadow-md">
        <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Course Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">End Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {(Array.isArray(learningpList) ? learningpList : []).map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-100 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{item.course_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.start_date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.end_date}</td>
                <td className="px-6 py-4">
                  <span className={getStatusColor(item.status)}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 text-sm transform hover:scale-105 transition-transform"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transform hover:scale-105 transition-transform"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LearningpList;
