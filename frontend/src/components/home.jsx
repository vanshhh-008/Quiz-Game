import { useState, useEffect } from "react";

const questions = [
  {
    type: "multiple-choice",
    question: "1. Which planet is closest to the Sun?",
    options: ["A. Venus", "B. Mercury", "C. Earth", "D. Mars"],
    answer: "B. Mercury",
  },
  {
    type: "multiple-choice",
    question: "2. Which data structure organizes items in a First-In, First-Out (FIFO) manner?",
    options: ["A. Stack", "B. Queue", "C. Tree", "D. Graph"],
    answer: "B. Queue",
  },
  {
    type: "multiple-choice",
    question: "3. Which of the following is primarily used for structuring web pages?",
    options: ["A. Python", "B. Java","C. HTML","D. C++"],
    answer: "C. HTML",
  },
  {
    type: "multiple-choice",
    question: "4. Which chemical symbol stands for Gold?",
    options: ["A. Au", "B. Gd", "C. Ag", "D. Pt"],
    answer: "A. Au",
  },
  {
    type: "multiple-choice",
    question: "5. Which of these processes is not typically involved in refining petroleum?",
    options: ["A. Fractional distillation","B. Cracking","C. Polymerization","D. Filtration"],
    answer: "D. Filtration",
  },

  //integer type questions

  
  {
    type: "fill-in-the-blank",
    question: "6. What is the value of 12 + 28?",
    answer: "40",
  },
  {
    type: "fill-in-the-blank",
    question: "7. How many states are there in the United States?",
    answer: "50",
  },
  {
    type: "fill-in-the-blank",
    question: "8. In which year was the Declaration of Independence signed?",
    answer: "1776",
  },
  {
    type: "fill-in-the-blank",
    question: "9. What is the value of pi rounded to the nearest integer?",
    answer: "3",
  },
  {
    type: "fill-in-the-blank",
    question: "10. If a car travels at 60 mph for 2 hours, how many miles does it travel?",
    answer: "120",
  },
];

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState([]);
  const [timer, setTimer] = useState(30);
  const [textAnswer, setTextAnswer] = useState("");

  useEffect(() => {
    if (timer === 0) {
      handleTimeout();
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleNext = () => {
    if (questions[currentQuestion].type === "multiple-choice" && !selectedOption) {
      alert("Please select an answer!");
      return;
    }
    if (questions[currentQuestion].type === "fill-in-the-blank" && !textAnswer.trim()) {
      alert("Please enter your answer!");
      return;
    }

    updateHistory();

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
      setTextAnswer("");
      setTimer(30);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(history[currentQuestion - 1]?.selected || "");
      setTextAnswer(history[currentQuestion - 1]?.selected || "");
      setTimer(30);
    }
  };

  const handleTimeout = () => {
    updateHistory();

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
      setTextAnswer("");
      setTimer(30);
    } else {
      setShowResult(true);
    }
  };
  const HandleSave = async () => {
    try {
      const response = await fetch("http://localhost:4000/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          history.map((entry) => ({
            question: entry.question,
            selectedAnswer: entry.selected,
            correctAnswer: entry.correct,
            Score: entry.isCorrect ? 1 : 0, // 1 for correct, 0 for incorrect
            timestamp: new Date().toISOString(), // Add timestamp
          }))
        ),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Quiz results saved successfully to the database !!");
      } else {
        alert("Failed to save results: " + data.message);
      }
    } catch (error) {
      console.error("Error saving quiz results:", error);
      alert("An error occurred while saving results.");
    }
  };
  

 

  const updateHistory = () => {
    let answerGiven =
      questions[currentQuestion].type === "multiple-choice"
        ? selectedOption
        : textAnswer.trim();

    const newHistory = [...history];
    newHistory[currentQuestion] = {
      question: questions[currentQuestion].question,
      selected: answerGiven || "No Answer",
      correct: questions[currentQuestion].answer,
      isCorrect: answerGiven.toLowerCase() === questions[currentQuestion].answer.toLowerCase(),
    };
    setHistory(newHistory);

    if (answerGiven.toLowerCase() === questions[currentQuestion].answer.toLowerCase()) {
      setScore(score + 1);
    }
  };

  return (
  
    <div className="container mt-5">
      {!showResult ? (
        <>
          <h2 style={{ margin: "8px", padding: "10px", fontSize: "22px" }}>
            Q-{questions[currentQuestion].question}
          </h2>

          <h3
            style={{
              color: timer <= 5 ? "red" : "black",
              fontSize: "20px",
              margin: "12px",
              padding: "10px",
            }}
          >
            Time Left: {timer}s
          </h3>

          <div className="mt-3">
            {questions[currentQuestion].type === "multiple-choice" ? (
              questions[currentQuestion].options.map((option, index) => (
                <div key={index}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      name="quiz"
                      style={{ margin: "8px", padding: "10px", fontSize: "22px" }}
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => setSelectedOption(option)}
                      type="radio"
                      id={`option-${index}`}
                    />
                    <label className="form-check-label" htmlFor={`option-${index}`}>
                      <span style={{ margin: "25px", padding: "8px", fontSize: "20px" }}>
                        {option}
                      </span>
                    </label>
                  </div>
                </div>
              ))
            ) : (
              <input
                type="text"
                className="form-control"
                placeholder="Enter your answer"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                style={{ margin: "12px", padding: "10px", fontSize: "20px" }}
              />
            )}
          </div>

          <div className="mt-3 d-flex justify-content-between">
            <button
              style={{ margin: "8px", padding: "10px", fontSize: "20px" }}
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="btn btn-primary"
            >
              Previous
            </button>
            <button
              type="button"
              style={{ margin: "8px", padding: "10px", fontSize: "20px", width: "120px" }}
              onClick={handleNext}
              className="btn btn-primary"
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
          
        </>
         
      ) : (
        <>
          <h2 className="text-2xl font-bold" style={{ textAlign: "center", padding: "2%" }}>
            Quiz Completed!
          </h2>
          <p className="text-lg mt-2" style={{ textAlign: "center" }}>
            Your Score: {score} / {questions.length}
          </p>

          <h3 style={{ textAlign: "center", marginTop: "20px" }}>Answer History</h3>
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Selected Answer</th>
                <th>Correct Answer</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.question}</td>
                  <td>{entry.selected}</td>
                  <td>{entry.correct}</td>
                  <td>{entry.isCorrect ? "✔ Correct" : "✘ Incorrect"}</td>
                </tr>
              ))}
            </tbody>
          </table>
<div className="d-flex justify-content-between">
<button type="button" onClick={HandleSave} className="btn btn-primary" style={{marginBottom:'5%'}}>
              Save Score
            </button>

          <div className="text-center">
            <button type="button" onClick={() => window.location.reload()} className="btn btn-primary" style={{marginBottom:'5%'}}>
              Restart Quiz
            </button>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
