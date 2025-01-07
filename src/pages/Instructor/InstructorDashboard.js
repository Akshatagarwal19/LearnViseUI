import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid2,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import courseApi from "../../services/apiService"; // Assuming this API fetches courses from backend

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigate hook to navigate programmatically

  // Fetch courses when the component is mounted
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseApi.getAllCourses();
        setCourses(response);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Navigate to the course creation page
  const handleCreateCourse = () => {
    navigate("/instructor/course/new"); // Replace with your actual create course path
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Instructor Dashboard
      </Typography>

      {loading && <CircularProgress />}

      {error && (
        <Typography color="error" variant="h6" gutterBottom>
          {error}
        </Typography>
      )}

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateCourse}
          sx={{ width: "100%", padding: "10px" }}
        >
          Create New Course
        </Button>
      </Box>

      {courses.length > 0 ? (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Your Courses
          </Typography>
          <Grid2 container spacing={2}>
            {courses.map((course) => (
              <Grid2 item xs={12} sm={6} key={course._id}>
                <Card>
                  <CardContent>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                    <Typography variant="h6">{course.title}</Typography>
                    <Typography color="textSecondary">
                      {course.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Price: ${course.price}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mt: 2 }}
                    >
                      Manage
                    </Button>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      ) : (
        !loading && <Typography>No courses available.</Typography>
      )}

      {/* Create Course Button */}

      <Footer />
    </Box>
  );
};

export default InstructorDashboard;
