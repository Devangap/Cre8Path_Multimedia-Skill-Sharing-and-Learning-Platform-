import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast';
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const LearningpList = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLearningPlans = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/learningp/user-learningp", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure that cookies (if required) are included
      });

      if (res.ok) {
        const data = await res.json();
        setLearningPlans(data); // Save data to the state
      } else {
        console.error("Failed to fetch learning plans");
      }
    } catch (err) {
      console.error("Error fetching learning plans:", err.message);
    } finally {
      setLoading(false); // Set loading to false when data is fetched
    }
  };

  useEffect(() => {
    fetchLearningPlans(); // Call the API on component mount
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this learning plan?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/learningp/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      setLearningPlans((prev) => prev.filter((plan) => plan.id !== id));
      toast.success("Deleted successfully"); // Update state
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/learningp/edit/${id}`); // Navigate to edit page
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Incomplete':
        return 'bg-red-100 text-red-700';
      case 'Just Started':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const calculateDaysLeft = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeLeft = end - today;
    const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24));
    return daysLeft < 0 ? 0 : daysLeft; // Return 0 if days left are negative
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (learningPlans.length === 0) return <p className="text-center text-gray-600">No learning plans yet.</p>;

  return (
    <div>
    <Toaster position="top-right" />
    <div className="max-w-7xl mx-auto mr-7 p-6">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">My Learning Progress</h2> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-20 ">
        {learningPlans.map((plan) => {
          const daysLeft = calculateDaysLeft(plan.start_date, plan.end_date);
          return (
            <div key={plan.id} className="bg-white rounded-lg shadow-md p-4 transition hover:shadow-lg w-72 border-2">
              <h3 className="text-lg font-semibold mb-2 text-purple-700">{plan.title}</h3>
              <p className="text-gray-600 mb-2">{plan.description}</p>
              <p className="text-sm text-gray-500 mb-1">Category: {plan.category}</p>

              <div className={`px-3 py-1 mb-2 text-sm font-semibold rounded-full ${getStatusColor(plan.status)} inline-block`}>
                {plan.status}
              </div>

              <div className="text-sm text-gray-500 mb-1">
                <span className="font-bold">{daysLeft}</span> days left
              </div>

              <div className="flex gap-2 mt-2 justify-end">
                <button
                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                  onClick={() => handleDelete(plan.id)}
                >
                  <FaTrashAlt />
                </button>
                <button
                  className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
                  onClick={() => handleEdit(plan.id)}
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default LearningpList;
