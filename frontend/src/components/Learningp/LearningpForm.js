import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LearningpForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    course_id: initialData.course_id || '',
    start_date: initialData.start_date || '',
    end_date: initialData.end_date || '',
    status: initialData.status || '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [courseSuggestions, setCourseSuggestions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery) {
      axios
        .get(`http://localhost:8080/api/courses/search?name=${searchQuery}`, { withCredentials: true })
        .then((response) => setCourseSuggestions(response.data))
        .catch((error) => console.error('Error fetching course suggestions:', error));
    } else {
      setCourseSuggestions([]);
    }
  }, [searchQuery]);

  const handleCourseSelect = (courseId) => {
    setFormData({ ...formData, course_id: courseId });
    setSearchQuery('');
    setCourseSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data before submission:', formData);
    onSubmit(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form className="border rounded-md border-gray-300 p-6 w-full max-w-md shadow-xl" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold text-center mb-6">Learning Path Form</h2>

        {/* Search + Autocomplete */}
        <label className="block text-sm font-medium text-gray-700">Search Course</label>
        <div className="relative mb-4">
          <input
            type="text"
            name="course_search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-md border py-1.5 px-3 shadow-sm ring-1 ring-gray-300 focus:ring-indigo-500"
            placeholder="Type course name..."
          />
          {courseSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border mt-1 rounded w-full shadow">
              {courseSuggestions.map((course) => (
                <li
                  key={course.id}
                  onClick={() => handleCourseSelect(course.id)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {course.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Course ID */}
        <label className="block text-sm font-medium text-gray-700">Course ID</label>
        <input
          type="number"
          name="course_id"
          value={formData.course_id}
          readOnly
          className="mb-4 w-full rounded-md border py-1.5 px-3 shadow-sm ring-1 ring-gray-300"
        />

        {/* Start Date */}
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          className="mb-4 w-full rounded-md border py-1.5 px-3 shadow-sm ring-1 ring-gray-300"
        />

        {/* End Date */}
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          className="mb-4 w-full rounded-md border py-1.5 px-3 shadow-sm ring-1 ring-gray-300"
        />

        {/* Status */}
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mb-6 w-full rounded-md border py-1.5 px-3 shadow-sm ring-1 ring-gray-300"
        >
          <option value="">Select Status</option>
          <option value="Just Started">Just Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Incomplete">Incomplete</option>
          <option value="Completed">Completed</option>
        </select>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => (window.location.href = '/learningp')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LearningpForm;
