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
      // Validate all answers exist
      if (!answers[1] || !answers[2] || !answers[3] || !answers[4]) {
        alert("Please answer all questions.");
        return;
      }
  
      fetch("http://localhost:8080/api/v1/demo/complete-questionnaire", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interests: (answers[1] || []).join(","),

          skillLevel: answers[2],
          contentType: answers[3],
          timeCommitment: answers[4],
        }),
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save questionnaire");
        return res.text();
      })
      .then(() => {
        setSubmitted(true);    // ✅ show thank you screen
        localStorage.setItem("questionnaireCompleted", "true");
        setTimeout(() => navigate("/profile-form"), 1000);   // nice delay
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong while saving your preferences.");
      });
    }
  };
  
  
  

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <h2 className="text-2xl font-bold text-green-600">
         
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-100 to-white px-6 py-12">
      <div className="bg-white shadow-xl border border-violet-200 rounded-2xl p-10 w-full max-w-4xl transition-all duration-300">
        <h2 className="text-2xl font-bold mb-8 text-center text-violet-900">
          {currentQuestion.question}
        </h2>
  
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {currentQuestion.options.map((option) => {
            const isSelected =
              currentQuestion.id === 1
                ? (answers[currentQuestion.id] || []).includes(option)
                : answers[currentQuestion.id] === option;
  
            return (
              <label
              key={option}
              className={`block text-center px-4 py-3 border-2 rounded-lg cursor-pointer font-medium transition ${
                isSelected
                  ? "bg-violet-200 text-[#4B2E6F] border-[#4B2E6F]"
                  : "border-gray-300 hover:bg-violet-50"
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
          disabled={!answers[currentQuestion.id] || (Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].length === 0)}
          className="mt-10 bg-[#A367B1] text-white py-3 px-8 rounded-lg font-semibold hover:bg-violet-800 transition disabled:opacity-50 block mx-auto"
        >
          {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
  
};

export default Questionnaire;
