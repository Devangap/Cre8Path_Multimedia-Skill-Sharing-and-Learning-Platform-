import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: 1,
    question: "Which multimedia skill are you most interested in learning?",
    options: [
      "Photography",
      "Videography",
      "Graphic Designing",
      "Animation",
      "Music Production",
      "UI/UX",
      "Content Creation",
      "Advertising",
      "Marketing",
    ],
  },
  {
    id: 2,
    question: "What is your current skill level in that area?",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    id: 3,
    question: "What type of content would you prefer to learn from?",
    options: ["Video tutorials", "Written guides", "Interactive activities"],
  },
  {
    id: 4,
    question: "How much time can you commit weekly to learning on Cre8Path?",
    options: ["< 1 hour", "1–3 hours", "3–5 hours", "5+ hours"],
  },
];

const Questionnaire = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    const questionId = currentQuestion.id;
  
    if (questionId === 1) {
      const currentSelections = answers[questionId] || [];
      const updatedSelections = currentSelections.includes(option)
        ? currentSelections.filter((item) => item !== option)
        : [...currentSelections, option];
  
      setAnswers({
        ...answers,
        [questionId]: updatedSelections,
      });
    } else {
      setAnswers({
        ...answers,
        [questionId]: option,
      });
    }
  };
  

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // ✅ When finished answering all questions:
      fetch("http://localhost:8080/api/v1/demo/complete-questionnaire", {
        method: "POST",
        credentials: "include",
      })
      .then(() => {
        localStorage.setItem("questionnaireCompleted", "true"); // Mark complete locally
        navigate("/profile-form");
      })
      .catch(() => {
        alert("Something went wrong while saving your preferences.");
      });
    }
  };
  
  

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <h2 className="text-2xl font-bold text-green-600">
          Thank you! Your preferences have been saved. 🎉
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white border shadow-md p-6 rounded-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {currentQuestion.question}
        </h2>

        <div className="space-y-2">
        {currentQuestion.options.map((option) => {
  const isSelected =
    currentQuestion.id === 1
      ? (answers[currentQuestion.id] || []).includes(option)
      : answers[currentQuestion.id] === option;

  return (
    <label
      key={option}
      className={`block px-4 py-2 border rounded cursor-pointer ${
        isSelected ? "bg-violet-600 text-white" : "hover:bg-violet-100"
      }`}
    >
      <input
        type={currentQuestion.id === 1 ? "checkbox" : "radio"}
        name={`question-${currentQuestion.id}`}
        value={option}
        checked={isSelected}
        onChange={() => handleOptionSelect(option)}
        className="hidden"
      />
      {option}
    </label>
  );
})}

        </div>

        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          className="mt-6 bg-violet-600 text-white px-6 py-2 rounded hover:bg-violet-700 disabled:opacity-50 w-full"
        >
          {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;
