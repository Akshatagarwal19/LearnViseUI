import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./Quiz.css";
import soundCorrect from "./sounds/correct.mp3";
import soundWrong from "./sounds/wrong.mp3";  // Add wrong sound import
import soundComplete from "./sounds/completed.wav";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// Create audio instances
const correctSound = new Audio(soundCorrect);
const wrongSound = new Audio(soundWrong);  // Create wrong sound instance
const completeSound = new Audio(soundComplete);

const getOptionClass = (
  optionIndex,
  selectedAnswer,
  correctAnswer,
  answerSubmitted
) => {
  if (!answerSubmitted) {
    return "option-button";
  }

  if (optionIndex === correctAnswer) {
    return "option-button correct";
  }

  if (optionIndex === selectedAnswer && optionIndex !== correctAnswer) {
    return "option-button incorrect";
  }

  return "option-button disabled";
};

// Other components remain the same
const QuizProgress = ({ current, total }) => (
  <div className="progress-container">
    <div className="progress-text">
      Question {current + 1}/{total}
    </div>
  </div>
);

const Timer = ({ time }) => (
  <div className="timer-container">
    <div className="timer-circle">
      <span className="timer-text">{time}</span>
      <span className="timer-unit">s</span>
    </div>
  </div>
);

const Question = ({ question }) => (
  <div className="question-box">
    <h2 className="question-text">{question}</h2>
  </div>
);

const Options = ({
  options,
  onAnswer,
  answerSubmitted,
  selectedAnswer,
  correctAnswer,
}) => (
  <div className="options-box">
    {options.map((option, idx) => (
      <button
        key={idx}
        onClick={() => onAnswer(idx)}
        className={getOptionClass(
          idx,
          selectedAnswer,
          correctAnswer,
          answerSubmitted
        )}
        disabled={answerSubmitted}
      >
        {option}
      </button>
    ))}
  </div>
);



const Quiz = ({ questions, onComplete }) => {
  const [screen, setScreen] = useState("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const handleTimeUp = () => {
    if (!answerSubmitted) {
      setAnswerSubmitted(true);
      wrongSound.play();  // Play wrong sound when time is up
    }
  };

  useEffect(() => {
    let interval;
    if (screen === "quiz" && !answerSubmitted) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, answerSubmitted]);

  const handleStart = () => {
    setScreen("quiz");
    setTimer(30);
    setAnswers([]);  // Reset answers when starting
  };

  const handleAnswer = (answerIndex) => {
    if (!answerSubmitted) {
      setSelectedAnswer(answerIndex);
      setAnswerSubmitted(true);
  
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answerIndex;
      setAnswers(newAnswers);

      // Play sound based on whether answer is correct
      const currentQuestion = questions[currentQuestionIndex];
      console.log('Current Question Data:', currentQuestion);
      console.log('All Questions:', questions);
      console.log('Answer Checking Details:');
      console.log('Selected Answer Index:', answerIndex);
      console.log('Selected Option:', currentQuestion.options[answerIndex]);
      console.log('Correct Option Index:', currentQuestion.correctAnswer);
      console.log('Correct Option:', currentQuestion.options[currentQuestion.correctAnswer]);
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      console.log('Is Correct?', isCorrect);
      if (isCorrect) {
        correctSound.play();
      } else {
        wrongSound.play();
      }
    }
  };

  const calculateScore = () => {
    return answers.reduce((total, answerIndex, questionIndex) => {
      const currentQuestion = questions[questionIndex];
      
      // Log score calculation details
      console.log(`Score Calculation for Question ${questionIndex + 1}:`);
      console.log('User Selected Index:', answerIndex);
      console.log('User Selected Option:', currentQuestion.options[answerIndex]);
      console.log('Correct Option Index:', currentQuestion.correctOption);
      console.log('Correct Option:', currentQuestion.options[currentQuestion.correctAnswer]);
      
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      console.log('Is Answer Correct?', isCorrect);
      
      return isCorrect ? total + 1 : total;
    }, 0);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      const finalScore = calculateScore();
      setScore(finalScore);
      completeSound.play();
      setScreen("result");  // Switch to result screen
      onComplete(answers);  // Call onComplete with answers
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(30);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
    }
  };

  const getTimerClass = () => {
    if (timer <= 5) return "quiz-content red";
    if (timer <= 15) return "quiz-content yellow";
    return "quiz-content green";
  };

  const renderResultChart = () => {
    if (level === 1) {
      return (
        <div className="result-bar-container">
          <div className="result-bar">
            <div
              className="result-bar-fill"
              style={{ width: `${(score / questions.length) * 100}%` }}
            />
          </div>
          <div className="result-markers">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      );
    } else {
      const chartData = {
        labels: ["Correct", "Incorrect"],
        datasets: [
          {
            data: [score, questions.length - score],
            backgroundColor: ["#4ade80", "#e5e7eb"],
          },
        ],
      };

      return (
        <div className="chart-container">
          <Pie
            data={chartData}
            options={{ plugins: { legend: { display: true } } }}
          />
        </div>
      );
    }
  };

  const retryQuiz = () => {
    setScreen("start");
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimer(30);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setAnswers([]);
  };

  return (
    <div className="app-container">
      {screen === "start" && (
        <div className="start-screen">
          <div className="title-banner">
            <h1>Quiz Time</h1>
          </div>
          <button onClick={handleStart} className="start-button">
            Start Now
          </button>
        </div>
      )}
      {screen === "quiz" && (
        <div className="quiz-wrapper">
          <div className={getTimerClass()}>
            <div className="quiz-header">
              <div className="title-banner">
                <span>Quiz Time</span>
              </div>
              <div className="quiz-status">
                <QuizProgress
                  current={currentQuestionIndex}
                  total={questions.length}  // Changed from sampleQuestions to questions
                />
                <Timer time={timer} />
              </div>
            </div>
            <div className="quiz-content">
              <Question question={questions[currentQuestionIndex]?.question} />
              <Options
                options={questions[currentQuestionIndex]?.options}
                onAnswer={handleAnswer}
                answerSubmitted={answerSubmitted}
                selectedAnswer={selectedAnswer}
                correctAnswer={questions[currentQuestionIndex]?.correctAnswer}  // Changed from sampleQuestions
              />
              {answerSubmitted && (
                <div className="next-button-container">
                  <button onClick={handleNextQuestion} className="next-button">
                    {currentQuestionIndex === questions.length - 1
                      ? "Submit Quiz"
                      : "Next Question"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {screen === "result" && (
        <div className="result-screen">
          <div className="title-banner">
            <h2>Quiz Result</h2>
          </div>
          <div className="chart-wrapper">{renderResultChart()}</div>
          <p className="result-message">
            You scored {score} out of {questions.length}!
            {score === questions.length 
              ? " Perfect score! Excellent work!" 
              : score >= questions.length * 0.7 
                ? " Great job!" 
                : " Keep practicing!"}
          </p>
          <button onClick={retryQuiz} className="retry-button">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;