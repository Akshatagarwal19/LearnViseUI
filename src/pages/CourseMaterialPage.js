import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, Button, LinearProgress, Dialog } from "@mui/material";
import { useParams } from "react-router-dom";
import courseApi from "../services/apiService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Quiz from "../components/Quiz/Quiz";
import axiosInstance from '../services/apiService';


const CourseMaterialsPage = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState({});
    const [currentLesson, setCurrentLesson] = useState(null);
    const [progressData, setProgressData] = useState({ completedLessons: [], progressPercentage: 0 });
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizContent, setQuizContent] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchCourseDetails = async () => {
          try {
            const courseResponse = await courseApi.getCourseById(id);
            console.log("Course Details Response:", courseResponse);
      
            const fetchedCourseData = courseResponse.course;
            setCourseData(fetchedCourseData);
            
            if (!fetchedCourseData) {
              throw new Error("Course data is missing in the response");
            }
            
            // Use fetchedCourseData instead of courseData
            if (fetchedCourseData.lessons && fetchedCourseData.lessons.length > 0) {
              setCurrentLesson(fetchedCourseData.lessons[0]);
              console.log("Initial currentLesson set to:", fetchedCourseData.lessons[0]);
            } else {
              console.warn("No lessons available for this course");
            }
      
            const progressResponse = await courseApi.getCourseProgress(id);
            console.log("Progress API Response:", progressResponse);

            setProgressData({
                completedLessons: progressResponse?.progress.completedLessons || [],
                progressPercentage: progressResponse?.progress.progressPercentage || 0,
            });
          } catch (error) {
            console.error("Error fetching course details or progress:", error);
          }
        };
      
        fetchCourseDetails();
      }, [id]); // Remove courseData from dependencies

    const fetchQuizContent = async (lessonId) => {
        if (!lessonId) {
            console.error("Lesson ID is undefined");
            return;
          }
        try {
            const response = await fetch(`http://localhost:3001/api/Quiz/${lessonId}/get`);
            const result = await response.json();
            
            if (result.success && result.data) {
                setQuizContent(result.data);
                console.log(result.data);
                setShowQuiz(true);
            } else {
                throw new Error("Failed to fetch quiz content");
            }
        } catch (error) {
            console.error("Error fetching quiz:", error);
            // You might want to show an error message to the user here
        }
    };

     // Assuming this is where axiosInstance is defined

     const submitQuizAndComplete = async (lessonId, answers) => {
      try {
          console.log("Submitting quiz answers:", answers);
  
          // Use courseApi to make the API call
          const response = await courseApi.markLessonCompleted(id, lessonId, { answers });
  
          if (response.success) {
              // Update progress
              setProgressData((prev) => {
                  const completedLessons = [...prev.completedLessons, lessonId];
                  const progressPercentage =
                      (completedLessons.length / courseData.lessons.length) * 100;
  
                  return {
                      ...prev,
                      completedLessons,
                      progressPercentage,
                  };
              });
  
              setShowQuiz(false);
              setQuizContent(null);
          }
  
          return response.success;
      } catch (error) {
          console.error("Error submitting quiz:", error.response?.data || error.message);
          return false;
      }
    };

    const formatQuizForComponent = (quizData) => {
        return quizData.questions.map(q => ({
            question: q.questionText,
            options: q.options,
            correctAnswer: q.correctOption // Note: The Quiz component will need to handle 0-based index
        }));
    };

    const renderContent = () => {
        if (!currentLesson) {
            return <Typography variant="body1">No lesson selected.</Typography>;
        }

        switch (currentLesson.contentType) {
            case "video":
                return <video src={currentLesson.fileUrl} controls style={{ width: "100%" }} />;
            case "pdf":
                return <iframe src={currentLesson.fileUrl} title="Pdf Viewer" style={{ width: "100%", height: "600px" }} />;
            case "excel":
                return <iframe src={currentLesson.fileUrl} title="Excel Viewer" style={{ width: "100%", height: "600px" }} />;
            default:
                return <Typography>Unsupported File Type</Typography>;
        }
    };

    return (
      <>
        <Navbar />
        <Box sx={{ display: "flex", minHeight: "90vh" }}>
          {/* Sidebar */}
          <Box sx={{ width: "25%", bgcolor: "#f5f5f5", padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lessons
            </Typography>
            <List>
              {courseData?.lessons?.map((lesson) => (
                <ListItem
                  key={lesson.id}
                  button
                  selected={currentLesson?.id === lesson.id}
                  onClick={() => setCurrentLesson(lesson)}
                  sx={{
                    backgroundColor:
                      currentLesson?.id === lesson.id
                        ? "#e0e0e0"
                        : "transparent",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    position: "relative",
                    paddingRight: "40px",
                  }}
                >
                  <Typography>{lesson.title}</Typography>
                  {(progressData.completedLessons || []).includes(
                    lesson.id
                  ) && (
                    <Box
                      sx={{
                        position: "absolute",
                        right: "8px",
                        color: "green",
                      }}
                    >
                      ✓
                    </Box>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              {courseData?.title || "Loading course..."}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {currentLesson?.title || "Select a lesson to start learning"}
            </Typography>
            <Typography variant="body1" component="p">
              {currentLesson?.description || ""}
            </Typography>
            <Box sx={{ marginBottom: 2 }}>{renderContent()}</Box>

            <Box sx={{ marginY: 2 }}>
              <Typography variant="body1">
                Course Progress: {progressData.progressPercentage.toFixed(0)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progressData.progressPercentage}
              />
            </Box>

            <Button
              variant="contained"
              onClick={() => {
                console.log("Current lesson on button click:", currentLesson);
                if (currentLesson?._id) {
                  fetchQuizContent(currentLesson._id);
                } else {
                  console.error("No lesson selected");
                }
              }}
              disabled={
                !currentLesson ||
                progressData.completedLessons.includes(currentLesson?._id) ||
                loading
              }
              sx={{ marginBottom: 2, marginRight: 2 }}
            >
              Take Lesson Quiz
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                const currentIndex = courseData?.lessons?.findIndex(
                  (l) => l.id === currentLesson?.id
                );
                if (
                  currentIndex !== -1 &&
                  currentIndex < courseData.lessons.length - 1
                ) {
                  setCurrentLesson(courseData.lessons[currentIndex + 1]);
                }
              }}
              disabled={
                !currentLesson ||
                currentLesson?._id ===
                  courseData?.lessons[courseData?.lessons.length - 1]?._id
              }
            >
              Next lesson
            </Button>
          </Box>
        </Box>
        {/* Quiz Dialog */}
        <Dialog
          open={showQuiz}
          fullWidth
          maxWidth="md"
          onClose={() => setShowQuiz(false)}
        >
          <Box sx={{ p: 2 }}>
            {quizContent && (
              <Quiz
                questions={formatQuizForComponent(quizContent)}
                onComplete={(answers) =>
                  submitQuizAndComplete(currentLesson?._id, answers)
                }
              />
            )}
          </Box>
        </Dialog>
        <Footer />
      </>
    );
};

export default CourseMaterialsPage;