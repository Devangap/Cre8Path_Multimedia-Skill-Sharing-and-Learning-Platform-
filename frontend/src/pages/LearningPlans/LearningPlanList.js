import React, { useEffect, useState } from "react";

const LearningPlanList = () => {
  const [learningPlans, setLearningPlans] = useState([]);

  const fetchLearningPlans = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/learning-plans/my-plans', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setLearningPlans(data);
      } else {
        console.error('Failed to fetch learning plans');
      }
    } catch (err) {
      console.error('Error fetching learning plans:', err.message);
    }
  };

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  if (learningPlans.length === 0) {
    return <div className="text-center text-gray-600">No learning plans yet.</div>;
  }

  return (
    <div className="mt-24">
      <h2 className="text-2xl font-bold mb-6">My Learning Plans</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {learningPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">{plan.topic}</h3>
            <p className="text-gray-600 text-sm">Timeline: {plan.timeline}</p>
            <p className="text-gray-500 text-sm">Status: {plan.status}</p>
            <p className="text-gray-500 text-sm">Start: {plan.startDate}</p>
            <p className="text-gray-500 text-sm">End: {plan.endDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPlanList;
