import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LearningPlanDetails = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`http://localhost:8080/learning-plans/${id}`, {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Failed to fetch plan.");
        const data = await res.json();
        setPlan(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPlan();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!plan) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-700 text-white px-8 py-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{plan.title}</h2>
          <p className="text-sm">General - {plan.createdBy || "User"}</p>
        </div>
        <div className="text-sm">1 of 1 Completed</div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-2 flex space-x-6 text-sm font-medium text-gray-600">
          <button className="border-b-2 border-purple-600 text-purple-700 pb-2">OVERVIEW</button>
          <button>MODULE</button>
          <button>SESSIONS</button>
          <button>FILES</button>
          <button>NOTES</button>
          <button>DISCUSSION</button>
          <button>FEEDBACK</button>
        </div>
      </div>

      {/* Main content and sidebar */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
        {/* Left content */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Learning outcomes</h3>
            <p className="mb-6">{plan.objective}</p>

            <h3 className="text-lg font-semibold mb-2">About course</h3>
            <p>{plan.description || "Empower the learner to grow and achieve their goals."}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80">
          <div className="bg-white p-6 rounded shadow space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">CREATED BY</p>
              <div className="mt-1 text-sm font-semibold text-gray-800">{plan.createdBy || "User"}</div>
              <p className="text-xs text-gray-400">{plan.createdDate || "2025-05-07"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">COURSE ADMIN</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{plan.createdBy || "User"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">TRAINER</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">N/A</p>
            </div>

            <button className="w-full border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-50">
              SUGGEST THIS COURSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanDetails;
