import React, { useEffect, useState } from 'react';

const MyLearningPlans = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPlans = async () => {
      try {
        const response = await fetch('http://localhost:8080/learning-plans/my-plans', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const text = await response.text();

        if (!response.ok) {
          throw new Error('Error: ' + response.status + ' - ' + text);
        }

        const json = JSON.parse(text);
        setPlans(json);
      } catch (err) {
        console.error('Failed to fetch learning plans:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPlans();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">My Learning Plans</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && plans.length === 0 && !error && (
        <p>No learning plans found.</p>
      )}

      {!loading && plans.length > 0 && (
        <div className="overflow-x-auto">
          <div className="flex space-x-6 pb-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="min-w-[300px] max-w-xs bg-white rounded-xl shadow-lg p-5 border border-gray-200 transition-transform hover:scale-105"
              >
                <h3 className="text-xl font-bold mb-2 text-purple-700">{plan.topic}</h3>
                <p className="text-sm text-gray-600 mb-2">{plan.resources}</p>
                <p className="text-sm text-gray-500">Timeline: {plan.timeline}</p>
                <p className="text-sm text-gray-500">Status: {plan.status}</p>
                <p className="text-sm text-gray-500">Start: {plan.startDate}</p>
                <p className="text-sm text-gray-500">End: {plan.endDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLearningPlans;
