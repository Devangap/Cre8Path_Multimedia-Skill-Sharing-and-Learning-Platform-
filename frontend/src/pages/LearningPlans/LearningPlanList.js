import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LearningPlanList = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLearningPlans = async () => {
    try {
      const res = await fetch("http://localhost:8080/learning-plans/my-plans", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setLearningPlans(data);
      } else {
        console.error("Failed to fetch learning plans");
      }
    } catch (err) {
      console.error("Error fetching learning plans:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this learning plan?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/learning-plans/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setLearningPlans((prev) => prev.filter((plan) => plan.id !== id));
      alert("Deleted successfully");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (learningPlans.length === 0) return <p className="text-center text-gray-600">No learning plans yet.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Learning Plans</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {learningPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-md p-4 transition hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2 text-purple-700">{plan.title}</h3>
            <p className="text-gray-600 mb-2">{plan.objective}</p>
            <p className="text-sm text-gray-500 mb-1">Topics: {plan.topics}</p>
            <p className="text-sm text-gray-500 mb-1">Estimated Duration: {plan.estimatedDuration || "N/A"}</p>
            <p className="text-sm text-gray-500 mb-1">Visibility: {plan.visibility}</p>
            <p className="text-sm text-gray-500 mb-2">Resources: {plan.resources}</p>

            <div className="flex gap-2 mt-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(plan.id)}
              >
                Delete
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => navigate(`/learning-plans/${plan.id}/edit`)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPlanList;
