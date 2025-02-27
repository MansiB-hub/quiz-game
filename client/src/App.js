import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import "./App.css";

// GraphQL Queries & Mutations
const GET_QUESTIONS = gql`
  query GetQuestions {
    getQuestions {
      _id
      question
      options
      answer
    }
  }
`;

const SUBMIT_SCORE = gql`
  mutation SubmitScore($name: String!, $score: Int!) {
    submitScore(name: $name, score: $score) {
      name
      score
    }
  }
`;

const GET_LEADERBOARD = gql`
  query GetLeaderboard {
    getLeaderboard {
      name
      score
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_QUESTIONS);
  const [submitScore] = useMutation(SUBMIT_SCORE);
  const [page, setPage] = useState("home");
  const [username, setUsername] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  if (loading) return <h2>Loading Questions...</h2>;
  if (error) return <h2>Error loading questions! {error.message}</h2>;
  if (!data || !data.getQuestions || data.getQuestions.length === 0) {
    return <h2>No Questions Found!</h2>;
  }

  const questions = data.getQuestions;

  const handleAnswer = (option) => {
    setSelectedOption(option);
  };

  const nextQuestion = () => {
    if (selectedOption) {
      const isCorrect = selectedOption === questions[currentQuestion].answer;
      if (isCorrect) setScore(score + 1);

      setUserAnswers([
        ...userAnswers,
        {
          question: questions[currentQuestion].question,
          selected: selectedOption,
          correct: questions[currentQuestion].answer,
          isCorrect,
        },
      ]);

      setSelectedOption(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        submitScore({ variables: { name: username, score } })
          .then(() => console.log("Score submitted successfully"))
          .catch((err) => console.error("Error submitting score:", err));

        setPage("score");
      }
    } else {
      alert("Please select an answer before proceeding!");
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(userAnswers[currentQuestion - 1]?.selected || null);
    }
  };

  return (
    <div className="container">
      {page === "home" && (
        <div className="home-container">
          <h1>Welcome to the Quiz Game</h1>
        <div className="input-container">  <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          /></div>
          <button
            className="start-btn"
            onClick={() => {
              if (username.trim() === "") {
                alert("Please enter your name to start the quiz!");
              } else {
                setPage("quiz");
              }
            }}
          >
            Start Quiz
          </button>
        </div>
      )}

      {page === "quiz" && (
        <div className="quiz-container">
          <h1>Quiz Game</h1>
          <h2 className="question">{questions[currentQuestion]?.question}</h2>
          <div className="options-container">
            {questions[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedOption === option ? "selected" : ""}`}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="nav-buttons">
            {currentQuestion > 0 && (
              <button className="prev-btn" onClick={previousQuestion}>
                Previous
              </button>
            )}
            <button className="next-btn" onClick={nextQuestion}>
              {currentQuestion < questions.length - 1 ? "Next" : "Finish"}
            </button>
          </div>
        </div>
      )}

      {page === "score" && (
        <div className="score-container">
          <h1>Quiz Completed!</h1>
          <h2 className="score">{username}, Your Score: {score} / {questions.length}</h2>
          <button className="review-btn" onClick={() => setShowAnswers(!showAnswers)}>
            {showAnswers ? "Hide Answers" : "View Answers"}
          </button>
          <button className="leaderboard-btn" onClick={() => setPage("leaderboard")}>
            View Leaderboard
          </button>
          <button className="home-btn" onClick={() => setPage("home")}>Home</button>

          {showAnswers && (
            <div className="answer-list">
              {userAnswers.map((item, index) => (
                <div key={index} className={`answer-item ${item.isCorrect ? "correct" : "wrong"}`}>
                  <p><strong>Q{index + 1}: {item.question}</strong></p>
                  <p>Your Answer: {item.selected}</p>
                  <p>Correct Answer: {item.correct}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {page === "leaderboard" && <Leaderboard setPage={setPage} />}
    </div>
  );
}

// Leaderboard Component
const Leaderboard = ({ setPage }) => {
  const { loading, error, data } = useQuery(GET_LEADERBOARD);

  if (loading) return <h2>Loading Leaderboard...</h2>;
  if (error) return <h2>Error loading leaderboard! {error.message}</h2>;

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.getLeaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.name}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="home-btn" onClick={() => setPage("home")}>Home</button>
    </div>
  );
};

export default App;
