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

  const handleAddSection = () => {
    navigate(`/instructor/section/new?courseId=${courseId}`);
  };

  const handleAddLesson = (sectionId) => {
    navigate(`/instructor/lesson/new?courseId=${courseId}&sectionId=${sectionId}`);
  };

  const handleEditSection = (sectionId) => {
    navigate(`/instructor/section/edit?courseId=${courseId}&sectionId=${sectionId}`);
  };

  const handleEditLesson = (lessonId) => {
    navigate(`/instructor/lesson/edit?courseId=${courseId}&lessonId=${lessonId}`);
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await courseApi.deleteSection(courseId, sectionId);
      setCourseData((prevData) => ({
        ...prevData,
        sections: prevData.sections.filter((section) => section._id !== sectionId),
      }));
    } catch (err) {
      console.error("Error deleting section:", err);
      alert("Failed to delete section.");
    }
  };

  const handleDeleteLesson = async (sectionId, lessonId) => {
    try {
      await courseApi.deleteLesson(courseId, sectionId, lessonId);
      setCourseData((prevData) => ({
        ...prevData,
        sections: prevData.sections.map((section) =>
          section._id === sectionId
            ? {
                ...section,
                lessons: section.lessons.filter((lesson) => lesson._id !== lessonId),
              }
            : section
        ),
      }));
    } catch (err) {
      console.error("Error deleting lesson:", err);
      alert("Failed to delete lesson.");
    }
  };

  const handleToggleIsFree = async (sectionId, lessonId, isFree) => {
    try {
      await courseApi.updateLessonStatus(courseId, sectionId, lessonId, isFree);
      setCourseData((prevData) => {
        const updatedSections = prevData.sections.map((section) => {
          if (section._id === sectionId) {
            return {
              ...section,
              lessons: section.lessons.map((lesson) =>
                lesson._id === lessonId ? { ...lesson, isFree } : lesson
              ),
            };
          }
          return section;
        });
        return { ...prevData, sections: updatedSections };
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
        onClick={handleAddSection}
        sx={{ mb: 3 }}
      >
        Add New Section
      </Button>
      <Button
        variant="contained"
        color="secondary"
        
        sx={{ mb: 3 }}
      >
        Update Course
      </Button>

      {courseData?.sections?.length > 0 ? (
        <List>
          {courseData.sections.map((section) => (
            <Box key={section._id} sx={{ mb: 3 }}>
              <Typography variant="h6">{section.title}</Typography>
              <Tooltip title={section.description || ""}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    maxWidth: "400px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {section.description}
                </Typography>
              </Tooltip>
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEditSection(section._id)}
                >
                  Edit Section
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteSection(section._id)}
                  startIcon={<DeleteIcon />}
                >
                  Delete Section
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleAddLesson(section._id)}
                >
                  Add Lesson
                </Button>
              </Box>
              {section.lessons.length > 0 && (
                <List>
                  {section.lessons.map((lesson) => (
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
                              section._id,
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
                        <IconButton
                          color="primary"
                          onClick={() => handleEditLesson(lesson._id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteLesson(section._id, lesson._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          ))}
        </List>
      ) : (
        <Typography>No sections available.</Typography>
      )}

      <Footer />
    </Box>
  );
};

export default ManageCoursePage;
