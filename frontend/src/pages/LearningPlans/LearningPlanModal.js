import React from "react";
import LearningPlanCreate from "./LearningPlanCreate";
import { useNavigate } from "react-router-dom";

const LearningPlanModal = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
        >
          ×
        </button>
        <LearningPlanCreate />
      </div>
    </div>
  );
};

export default LearningPlanModal;
