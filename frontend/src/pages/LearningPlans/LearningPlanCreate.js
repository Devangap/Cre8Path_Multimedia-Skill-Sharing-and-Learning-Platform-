import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LearningPlanCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: "",
    resources: "",
    timeline: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/learning-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Learning Plan created successfully!");
        navigate("/profile/me"); // where you want to redirect
      } else {
        const errorMsg = await res.text();
        alert("Error: " + errorMsg);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Learning Plan</h2>

        <div className="space-y-4">
          <input
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Topic"
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="resources"
            value={formData.resources}
            onChange={handleChange}
            placeholder="Resources (YouTube, Udemy, etc.)"
            rows="3"
            className="w-full p-2 border rounded"
          />
          <input
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            placeholder="Timeline (eg: 3 months)"
            className="w-full p-2 border rounded"
          />
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"/>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-white"
            >
              <option value="">Select Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded"
          >
            Create Learning Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default LearningPlanCreate;
