import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid2,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {jwtDecode} from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  fetchCourses,
  updateEnrolledCourse,
} from "../redux/slices/coursesSlice";
import courseApi from "../services/apiService";
import { Link, useNavigate } from "react-router-dom";

const getUsernameFromToken = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];

  if (!token) {
    console.log("No token found in cookies.");
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);
    return decoded.username;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const Homepage = () => {
  const dispatch = useDispatch();
  const { courses, status, error } = useSelector((state) => state.courses);
  const username = getUsernameFromToken();
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const categories = [
    { name: "Programming", icon: "💻" },
    { name: "Design", icon: "🎨" },
    { name: "Marketing", icon: "📈" },
    { name: "Business", icon: "💼" },
    { name: "WebDevelopment", icon: "📷" },
    { name: "Music", icon: "🎵" },
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === "idle") {
          console.log("Fetching all courses...");
          const allCourses = await courseApi.getAllCourses();
          console.log("Fetched courses:", allCourses);
          dispatch(fetchCourses(allCourses));
        }
      } catch (err) {
        console.error("Error fetching courses:", err.message);
      }
    };
    fetchData();
  }, [dispatch, status]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        console.log("Fetching enrolled courses for user:", username);
        const response = await courseApi.getEnrolledCourses(); // Assuming this API call works
        console.log("Enrolled courses:", response);
        setEnrolledCourses(response);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err.message);
      }
    };

    if (username) {
      fetchEnrolledCourses();
    } else {
      console.log("User not logged in. Skipping fetch for enrolled courses.");
    }
  }, [username]);

  const navigate = useNavigate();

  const handleEnroll = async (courseId) => {
    try {
      console.log("Navigating to payment page for course ID:", courseId);
      navigate(`/payment?courseId=${courseId}`);
    } catch (error) {
      console.error("Error enrolling in course:", error.message);
      alert("Error enrolling. Please try again.");
    }
  };

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

  if (status === "loading") {
    console.log("Courses are loading...");
    return <p>Loading courses...</p>;
  }

  if (status === "failed") {
    console.error("Error status in fetching courses:", error);
    return <p>Error: {error}</p>;
  }

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
          Trending Courses
        </Typography>
        <Grid2 container spacing={3}>
          {filteredCourses.map((course, index) => {
            const isEnrolled = enrolledCourses.some((enrolled) => {
              console.log("Comparing course ID:", course._id, "with enrolled ID:", enrolled.course._id);
              return String(enrolled.course._id) === String(course._id);
            });
            console.log(
              `Course ID: ${course._id}, Is Enrolled: ${isEnrolled}`
            );
            return (
              <Grid2 item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.03)", boxShadow: 3 },
                  }}
                >
                  <CardActionArea
                    LinkComponent={Link}
                    to={isEnrolled ? `/course/${course._id}/Material` : `/course/${course._id}`}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={course.thumbnail}
                      alt={course.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {course.title}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ marginTop: 2 }}
                        onClick={() =>
                          isEnrolled
                            ? navigate(`/course/${course._id}/Material`)
                            : handleEnroll(course._id)
                        }
                      >
                        {isEnrolled ? "Goto Course" : "Enroll Now"}
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid2>
            );
          })}
        </Grid2>
      </Container>
      <Footer />
    </>
  );
};

export default Homepage;
