import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LearningpForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    user_id: initialData.user_id || '',
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
        .get(`/api/courses/search?name=${searchQuery}`)
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
    onSubmit(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form className="border rounded-md border-gray-300 p-4 w-full sm:w-auto shadow-lg" onSubmit={handleSubmit}>
        <div className="space-y-6"> {/* Reduced upper margin */}
          <div className="pb-12"> {/* Removed border-b class */}
            <h2 className="text-xl font-sans font-semibold leading-7 text-gray-900 text-center">Learning Path Form</h2>
            <div className="lg:w-[400px] mt-3 grid grid-cols-1 gap-y-4 w-auto mx-auto"> {/* Adjusted width and centered form */}
              {/* Course Search */}
              <div>
                <label htmlFor="course_search" className="block text-sm font-medium leading-6 text-gray-900">
                  Search Course
                </label>
                <div className="mt-2 relative">
                  <input
                    type="text"
                    name="course_search"
                    id="course_search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Type course name..."
                  />
                  {courseSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg">
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
              </div>

              {/* Course ID */}
              <div>
                <label htmlFor="course_id" className="block text-sm font-medium leading-6 text-gray-900">
                  Course ID
                </label>
                <div className="mt-2">  
                  <input
                    type="number"
                    name="course_id"
                    id="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    readOnly
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium leading-6 text-gray-900">
                  Start Date
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="start_date"
                    id="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="end_date" className="block text-sm font-medium leading-6 text-gray-900">
                  End Date
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="end_date"
                    id="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                  Status
                </label>
                <div className="mt-2">
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Select Status</option>
                    <option value="Just Started">Just Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Incomplete">Incomplete</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => window.location.href = '/learningp'}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LearningpForm;