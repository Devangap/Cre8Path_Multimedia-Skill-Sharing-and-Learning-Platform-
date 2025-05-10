import React, { useState } from 'react';


const LearningpForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || '',
    start_date: initialData.start_date || '',
    end_date: initialData.end_date || '',
    status: initialData.status || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data before submission:', formData);
    onSubmit(formData); // Call onSubmit from parent component
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form className="border rounded-md border-gray-300 p-6 w-full max-w-md shadow-xl" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold text-center mb-6">Learning Progress Form</h2>

        {/* Title */}
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mb-4 w-full rounded-md border py-1.5 px-3 shadow-sm ring-1 ring-gray-300"
          required
        />

        {/* Description */}
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mb-4 w-full rounded-md border py-1.5 px-3 shadow-sm ring-1 ring-gray-300"
          required
        />

        {/* Category */}
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mb-4 w-full rounded-md border py-1.5 px-3 shadow-sm ring-1 ring-gray-300"
          required
        >
          <option value="">Select Category</option>
          <option value="Photography">Photography</option>
          <option value="Videography">Videography</option>
          <option value="Animation">Animation</option>
          <option value="Graphic Designing">Graphic Designing</option>
          <option value="Music Production">Music Production</option>
          <option value="UI/UX">UI/UX</option>
          <option value="Content Creation">Content Creation</option>
          <option value="Advertising">Advertising</option>
          <option value="Marketing">Marketing</option>
        </select>

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
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LearningpForm;
