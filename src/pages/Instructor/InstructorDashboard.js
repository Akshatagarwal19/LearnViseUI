import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  CardActions,
  CardMedia,
  Chip,
  CardHeader,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import courseApi from "../../services/apiService";
import { jwtDecode } from "jwt-decode";
import AddIcon from "@mui/icons-material/Add";


const CourseCard = ({ course, onManage }) => (
  <Card
    sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden", height: "100%" }}
  >
    <CardMedia
      component="img"
      height="180"
      image={`http://localhost:3001${course.thumbnail}`}
      alt={course.title}
      sx={{ objectFit: "cover", borderBottom: "2px solid #e0e0e0" }}
    />
    <CardContent sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        {course.title}
      </Typography>
      <Typography
        color="textSecondary"
        noWrap
        sx={{ fontSize: 14, lineHeight: "1.4" }}
      >
        {course.description}
      </Typography>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Typography variant="body2" color="textSecondary">
          ${course.price}
        </Typography>
        <Chip label={course.level} size="small" color="primary" />
      </Box>
    </CardContent>
    <CardActions sx={{ padding: 2 }}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        sx={{ width: "100%" }}
        onClick={onManage}
      >
        Manage
      </Button>
    </CardActions>
  </Card>
);

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        // Get the JWT token from cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("authToken=")) // Updated to 'authToken'
          ?.split("=")[1];

        // Decode the token to extract the instructor's ID
        const decodedToken = jwtDecode(token);
        const instructorId = decodedToken.id; // Assuming 'id' is the instructor's ID in the token

        // Fetch all courses (or filter them on the backend if possible)
        const response = await courseApi.getAllCourses();

        // Filter the courses based on the instructor's ID
        const instructorCourses = response.filter(
          (course) => course.instructor._id === instructorId
        );

        setCourses(instructorCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []); // Run only once on mount

  const handleCreateCourse = () => {
    navigate("/instructor/course/new");
  };

  const handleManageCourse = (courseId) => {
    navigate(`/instructor/ManageCourses/${courseId}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Navbar />
      <Box
        sx={{
          height: { xs: "60vh", sm: "50vh", md: "50vh" },
          backgroundImage: "url(/bg2.webp)", // Correct URL for the background image
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          position: "relative",
          paddingTop: { xs: "20%", sm: "15%", md: "10%" },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            maxWidth: { xs: "90%", sm: "80%", md: "700px" },
            padding: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              marginBottom: { xs: 2, sm: 3 },
              fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
            }}
          >
            Welcome Instructor
          </Typography>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 500,
              marginBottom: { xs: 3, sm: 4 },
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
            }}
          >
            Start Your Journey Now
          </Typography>
          <Button
              variant="contained"
              color="primary"
              onClick={handleCreateCourse}
              sx={{
                padding: { xs: "10px 20px", sm: "12px 24px" },
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
            >
              Create New Course
            </Button>
        </Box>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box mt={2}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      )}

      {!loading && !error && (
        <>
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateCourse}
              sx={{
                width: "30%",
                padding: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AddIcon sx={{ mr: 1 }} />
              Create New Course
            </Button>
          </Box>

          {courses.length > 0 ? (
            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Your Courses
              </Typography>
              <Grid container spacing={4} justifyContent="flex-start">
                {courses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course._id}>
                    <CourseCard
                      course={course}
                      onManage={() => handleManageCourse(course._id)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box mt={4} textAlign="center">
              <Card sx={{ maxWidth: 600, margin: "0 auto", padding: 3 }}>
                <CardHeader title="No Courses Yet" />
                <CardContent>
                  <Typography variant="h6">
                    You haven’t created any courses yet.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCreateCourse}
                    sx={{ mt: 2 }}
                  >
                    Start Creating Your First Course
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </>
      )}

      <Footer />
    </Box>
  );
};

export default InstructorDashboard;
