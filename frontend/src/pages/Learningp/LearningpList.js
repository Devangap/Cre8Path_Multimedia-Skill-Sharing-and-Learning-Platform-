import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LearningpList = () => {
  const [learningpList, setLearningpList] = useState([]);

  useEffect(() => {
    axios.get('/api/learningp')
      .then(response => setLearningpList(response.data))
      .catch(error => console.error('Error fetching learning progress:', error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`/api/learningp/${id}`)
      .then(() => setLearningpList(learningpList.filter(item => item.id !== id)))
      .catch(error => console.error('Error deleting learning progress:', error));
  };

  return (
    <div>
      <h1>Learning Progress List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Course ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {learningpList.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.user_id}</td>
              <td>{item.course_id}</td>
              <td>{item.start_date}</td>
              <td>{item.end_date}</td>
              <td>{item.status}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LearningpList;