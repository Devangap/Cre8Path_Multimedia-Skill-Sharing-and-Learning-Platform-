import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 

const LearningPlanDetails = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`http://localhost:8080/learning-plans/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch learning plan.");
        const data = await res.json();
        setPlan(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPlan();
  }, [id]);

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!plan) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
    {/* Header container */}
    <div className="max-w-4xl mx-auto bg-purple-700 rounded-t-2xl shadow-md p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">{plan.title}</h1>
        <p className="text-sm text-purple-200 mt-1">
          Created by <span className="font-semibold text-white">{plan.createdBy || "User"}</span> on{" "}
          {plan.createdDate || "N/A"}
        </p>
      </div>

      <button
        className="bg-white text-purple-700 hover:bg-purple-100 font-semibold px-5 py-2 rounded-md transition shadow"
        onClick={() => navigate(`/profile/${plan.createdBy || "user"}`, { state: { tab: "learningProgress" } })}
      >
        + Follow Plan
      </button>
    </div>



      {/* Main content card */}
      <div className="max-w-4xl mx-auto space-y-6">
      {/* Objective */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">🎯 Objective</h2>
        <p className="text-gray-700">{plan.objective}</p>
      </div>

      {/* Topics */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">📚 Topics</h2>
        <p className="text-gray-700">{plan.topics}</p>
      </div>

      {/* Estimated Duration */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">⏱ Estimated Duration</h2>
        <p className="text-gray-700">{plan.estimatedDuration || "Not specified"}</p>
      </div>

      {/* Resources */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">📦 Resources</h2>
        <p className="text-gray-700 whitespace-pre-line">{plan.resources || "No resources listed."}</p>
      </div>

      {/* Visibility */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">🔒 Visibility</h2>
        <p
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            plan.visibility === "Public"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {plan.visibility}
        </p>
      </div>
    </div>


    </div>
  );
};

export default LearningPlanDetails;
