import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Grid2, Button, Card, CardContent, CardMedia, CardActionArea, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchCourses, updateEnrolledCourse, checkEnrollmentStatus } from "../redux/slices/coursesSlice";
import courseApi from "../services/apiService";
import { Link } from 'react-router-dom';

const getUsernameFromToken = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken=")) // Updated to 'authToken'
    ?.split("=")[1]; // Get the token from localStorage (or cookies)

  if (!token) return null; // If no token exists, return null

  try {
    const decoded = jwtDecode(token); // Decode the JWT token
    return decoded.username; // Extract the username from the decoded token
  } catch (error) {
    console.error("Error decoding token", error);
    return null;
  }
};

const Homepage = () => {
  const dispatch = useDispatch();
  const { courses, status, error } = useSelector((state) => state.courses);
  const username = getUsernameFromToken(); // Get the username from the token

  const categories = [
    { name: "Programming", icon: "💻" },
    { name: "Design", icon: "🎨" },
    { name: "Marketing", icon: "📈" },
    { name: "Business", icon: "💼" },
    { name: "Photography", icon: "📷" },
    { name: "Music", icon: "🎵" },
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  // Fetch courses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === "idle") {
          const allCourses = await courseApi.getAllCourses(); // Fetch courses via API service
          dispatch(fetchCourses(allCourses));
        }
      } catch (err) {
        console.error("Error fetching courses:", err.message);
      }
    };
    fetchData();
  }, [dispatch, status]);

  const handleEnroll = async (courseId) => {
    try {
      const response = await courseApi.enrollCourse(courseId);
      if (response) {
        alert("Enrolled Successfully");
        dispatch(updateEnrolledCourse(courseId));
      }
    } catch (error) {
      console.error("Error enrolling in course:", error.message);
      alert("Error enrolling. Please try again.");
    }
  };

  // Filter courses based on selected filters
  const filteredCourses = Array.isArray(courses)
    ? courses.filter((course) => {
        const matchesCategory = selectedCategory
          ? course.category === selectedCategory
          : true;
        const matchesDifficulty = selectedDifficulty
          ? course.difficulty === selectedDifficulty
          : true;
        return matchesCategory && matchesDifficulty;
      })
    : [];

  if (status === "loading") return <p>Loading courses...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <>
      <Navbar />
      <Box
        sx={{
          height: { xs: "60vh", sm: "50vh", md: "50vh" },
          backgroundImage: "url(bg2.webp)",
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
            Welcome {username || "Guest"}
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
            size="large"
            sx={{
              padding: { xs: "10px 20px", sm: "12px 24px" },
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            Explore Courses
          </Button>
        </Box>
      </Box>

      <Container sx={{ marginTop: 4, marginBottom: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ marginBottom: 3, fontWeight: 600, color: "primary.main" }}
        >
          Filter Courses
        </Typography>
        <Box display="flex" gap={2} sx={{ marginBottom: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {difficulties.map((level, index) => (
                <MenuItem key={index} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Typography
          variant="h4"
          gutterBottom
          sx={{ marginBottom: 3, fontWeight: 600, color: "primary.main" }}
        >
          Trending Courses
        </Typography>
        <Grid2 container spacing={3}>
          {filteredCourses.map((course, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 3,
                  },
                }}
              >
                <CardActionArea LinkComponent={Link} to={`/course/${course._id}`}>
                  <CardMedia component="img" height="200" image={course.thumbnail} alt={course.title} />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.level}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ marginTop: 2 }}
                      onClick={() => handleEnroll(course._id)}
                      disabled={course.isEnrolled}
                    >
                      {course.isEnrolled ? "Goto Course" : "Enroll Now"}
                    </Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>

      <Footer />
    </>
  );
};

export default Homepage;
