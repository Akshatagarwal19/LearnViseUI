import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import Navbar from '../../components/Navbar'; // Import Navbar component
import Footer from '../../components/Footer'; // Import Footer component
import { useSearchParams, useNavigate } from "react-router-dom";
import courseApi from '../../services/apiService'; // Import the API service

const QuizCreationForm = () => {
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctOption: [] },
  ]);
  const [loading, setLoading] = useState(false); // Local loading state
  const [error, setError] = useState(null); // Local error state
  const [success, setSuccess] = useState(false); // Local success state
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const navigate = useNavigate();

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    const correctAnswers = updatedQuestions[qIndex].correctOption;
    if (correctAnswers.includes(oIndex)) {
      updatedQuestions[qIndex].correctOption = correctAnswers.filter(
        (ans) => ans !== oIndex
      );
    } else {
      updatedQuestions[qIndex].correctOption.push(oIndex);
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctOption: [] },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!lessonId) {
      console.error('Error: Lesson ID is undefined');
      return;
    }
    const formattedQuestions = questions.map((q) => ({
      questionText: q.questionText,
      options: q.options,
      correctOption: q.correctOption[0], // Assuming a single correct option
    }));

    const quizData = {
      questions: formattedQuestions,
    };

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      console.log('Sending Quiz Data:', { lessonId, quizData });
      const response = await courseApi.createQuiz({ lessonId, quizData });
      console.log('Quiz created successfully:', response);
      setSuccess(true);
      const courseId = response.course._id;
      navigate(`/instructor/ManageCourses/${courseId}`);
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error.message);
      setError(error.response?.data || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar /> {/* Render Navbar at the top */}
      <Box>
        <Typography variant="h4">Create Quiz</Typography>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">Quiz created successfully!</Typography>}
        {questions.map((question, qIndex) => (
          <Box key={qIndex} mt={2}>
            <TextField
              fullWidth
              label={`Question ${qIndex + 1}`}
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              margin="normal"
            />
            {question.options.map((option, oIndex) => (
              <Box key={oIndex} display="flex" alignItems="center" mt={1}>
                <TextField
                  fullWidth
                  label={`Option ${oIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                />
                <Button
                  variant={
                    question.correctOption.includes(oIndex) ? 'contained' : 'outlined'
                  }
                  onClick={() => handleCorrectAnswerChange(qIndex, oIndex)}
                  sx={{ ml: 2 }}
                >
                  Correct
                </Button>
              </Box>
            ))}
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeQuestion(qIndex)}
              sx={{ mt: 2 }}
            >
              Remove Question
            </Button>
          </Box>
        ))}
        <Button variant="contained" onClick={addQuestion} sx={{ mt: 3 }}>
          Add Question
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 3, ml: 2 }}
          disabled={loading}
        >
          Submit Quiz
        </Button>
      </Box>
      <Footer /> {/* Render Footer at the bottom */}
    </>
  );
};

export default QuizCreationForm;
