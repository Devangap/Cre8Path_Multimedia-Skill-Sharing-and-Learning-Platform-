import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const MyLearningPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPlan, setEditingPlan] = useState(null);
  const [editData, setEditData] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  const fetchLearningPlans = async () => {
    try {
      const response = await fetch('http://localhost:8080/learning-plans/my-plans', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const text = await response.text();
      if (!response.ok) throw new Error('Error: ' + response.status + ' - ' + text);

      const json = JSON.parse(text);
      setPlans(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this learning plan?")) return;
    try {
      const res = await fetch(`http://localhost:8080/learning-plans/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
      setOpenMenuId(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:8080/learning-plans/${editingPlan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Failed to update');

      const updated = await res.json();
      setPlans((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setEditingPlan(null);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="mt-10">
      <div className="overflow-x-auto">
        <div className="flex space-x-6 pb-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative min-w-[300px] max-w-xs bg-white rounded-xl shadow-lg p-5 border border-gray-200 transition-transform hover:scale-105 flex flex-col justify-between"
            >
              {/* Ellipsis Menu */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setOpenMenuId(openMenuId === plan.id ? null : plan.id)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none text-xl"
                >
                  ⋮
                </button>
                {openMenuId === plan.id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-50">
                    <button
                      onClick={() => {
                        setEditData(plan);
                        setEditingPlan(plan);
                        setOpenMenuId(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-purple-700">{plan.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{plan.objective}</p>
                <p className="text-sm text-gray-500 mb-1">Topics: {plan.topics}</p>
                <p className="text-sm text-gray-500 mb-1">Duration: {plan.estimatedDuration || "N/A"}</p>
                <p className="text-sm text-gray-500 mb-1">Visibility: {plan.visibility}</p>
                <p className="text-sm text-gray-500 mb-4">Resources: {plan.resources}</p>
              </div>

              <button
                onClick={() => navigate(`/learning-plans/${plan.id}`)}
                className="w-full mt-2 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl font-bold"
              onClick={() => setEditingPlan(null)}
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-purple-600">Edit Learning Plan</h3>

            <label className="text-sm font-semibold mb-1 block">Title</label>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleEditChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="text-sm font-semibold mb-1 block">Objective</label>
            <textarea
              name="objective"
              value={editData.objective}
              onChange={handleEditChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="text-sm font-semibold mb-1 block">Topics</label>
            <input
              type="text"
              name="topics"
              value={editData.topics}
              onChange={handleEditChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="text-sm font-semibold mb-1 block">Estimated Duration</label>
            <input
              type="text"
              name="estimatedDuration"
              value={editData.estimatedDuration}
              onChange={handleEditChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="text-sm font-semibold mb-1 block">Resources</label>
            <input
              type="text"
              name="resources"
              value={editData.resources}
              onChange={handleEditChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="text-sm font-semibold mb-1 block">Visibility</label>
            <select
              name="visibility"
              value={editData.visibility}
              onChange={handleEditChange}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>

            <button
              onClick={handleEditSubmit}
              className="w-full text-white font-bold py-2 rounded hover:opacity-90"
              style={{ backgroundColor: "#A367B1" }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLearningPlans;
