import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import courseApi from "../../services/apiService";

const ManageCoursePage = () => {
  const { courseId } = useParams(); // Fetch course ID from URL params
  const [courseData, setCourseData] = useState(null); // Store course details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await courseApi.getCourseById(courseId); // Fetch course details
        setCourseData(response.course); // Use the `course` field from the response
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleAddLesson = () => {
    navigate(`/instructor/lesson/new?courseId=${courseId}`);
  };

  const handleEditLesson = (lessonId) => {
    navigate(`/instructor/lesson/edit?courseId=${courseId}&lessonId=${lessonId}`);
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await courseApi.deleteLesson(courseId, lessonId);
      setCourseData((prevData) => ({
        ...prevData,
        lessons: prevData.lessons.filter((lesson) => lesson._id !== lessonId),
      }));
    } catch (err) {
      console.error("Error deleting lesson:", err);
      alert("Failed to delete lesson.");
    }
  };

  const handleToggleIsFree = async (lessonId, isFree) => {
    try {
      await courseApi.updateLessonStatus(courseId, lessonId, isFree);
      setCourseData((prevData) => {
        const updatedLessons = prevData.lessons.map((lesson) =>
          lesson._id === lessonId ? { ...lesson, isFree } : lesson
        );
        return { ...prevData, lessons: updatedLessons };
      });
    } catch (err) {
      console.error("Error updating lesson free/paid status:", err);
      alert("Failed to update lesson status.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Manage Course: {courseData?.title || "Loading..."}
      </Typography>
      <Tooltip title={courseData?.description || ""}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            maxWidth: "600px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {courseData?.description}
        </Typography>
      </Tooltip>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddLesson}
        sx={{ mb: 3 }}
      >
        Add Lesson
      </Button>

      {courseData?.lessons?.length > 0 ? (
        <List>
          {courseData.lessons.map((lesson) => (
            <ListItem key={lesson._id} sx={{ pl: 4 }}>
              <ListItemText
                primary={lesson.title}
                secondary={
                  <Tooltip title={lesson.description || ""}>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: "300px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {lesson.description}
                    </Typography>
                  </Tooltip>
                }
              />
              <ListItemSecondaryAction>
                <RadioGroup
                  row
                  value={lesson.isFree ? "free" : "paid"}
                  onChange={(e) =>
                    handleToggleIsFree(
                      lesson._id,
                      e.target.value === "free"
                    )
                  }
                >
                  <FormControlLabel
                    value="free"
                    control={<Radio />}
                    label="Free"
                  />
                  <FormControlLabel
                    value="paid"
                    control={<Radio />}
                    label="Paid"
                  />
                </RadioGroup>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`/quiz/create/new?lessonId=${lesson._id}`)}
                  sx={{ marginRight: 2 }}
                >
                  Create Quiz
                </Button>
                <IconButton
                  color="primary"
                  onClick={() => handleEditLesson(lesson._id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteLesson(lesson._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No lessons available.</Typography>
      )}

      <Footer />
    </Box>
  );
};

export default ManageCoursePage;
