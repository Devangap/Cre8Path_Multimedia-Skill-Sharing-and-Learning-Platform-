import React, { useEffect, useState } from 'react';

const MyLearningPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPlan, setEditingPlan] = useState(null);
  const [editData, setEditData] = useState({});

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

  return (
    <div className="mt-10">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <div className="flex space-x-6 pb-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="min-w-[300px] max-w-xs bg-white rounded-xl shadow-lg p-5 border border-gray-200 transition-transform hover:scale-105"
            >
              <h3 className="text-xl font-bold mb-2 text-purple-700">{plan.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{plan.objective}</p>
              <p className="text-sm text-gray-500 mb-1">Topics: {plan.topics}</p>
              <p className="text-sm text-gray-500 mb-1">Duration: {plan.estimatedDuration || "N/A"}</p>
              <p className="text-sm text-gray-500 mb-1">Visibility: {plan.visibility}</p>
              <p className="text-sm text-gray-500 mb-4">Resources: {plan.resources}</p>

              <div className="flex gap-2 mt-auto">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex-1"
                  onClick={() => handleDelete(plan.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex-1"
                  onClick={() => {
                    setEditData(plan);
                    setEditingPlan(plan);
                  }}
                >
                  Edit
                </button>
              </div>
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
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleEditChange}
              placeholder="Title"
              className="w-full mb-2 p-2 border rounded"
            />
            <textarea
              name="objective"
              value={editData.objective}
              onChange={handleEditChange}
              placeholder="Objective"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="topics"
              value={editData.topics}
              onChange={handleEditChange}
              placeholder="Topics"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="estimatedDuration"
              value={editData.estimatedDuration}
              onChange={handleEditChange}
              placeholder="Duration"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="resources"
              value={editData.resources}
              onChange={handleEditChange}
              placeholder="Resources"
              className="w-full mb-2 p-2 border rounded"
            />
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
              className="w-full text-white font-bold py-2 rounded hover:opacity-90"
              style={{ backgroundColor: "#A367B1" }}
              onClick={handleEditSubmit}
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
