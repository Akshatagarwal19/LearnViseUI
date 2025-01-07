import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  LinearProgress,
} from "@mui/material";
import Navbar from "../../components/Navbar"; // Adjust the import paths as per your structure
import Footer from "../../components/Footer";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);

  // Mock data (Replace this with API fetch later)
  useEffect(() => {
    const mockCourses = [
      {
        id: "1",
        title: "React Basics",
        thumbnail: "https://via.placeholder.com/300x150?text=React+Basics",
        progress: 75,
        description: "Learn the basics of React.",
        instructor: "John Doe",
        lastAccessed: "Introduction to Props",
      },
      {
        id: "2",
        title: "Node.js Mastery",
        thumbnail: "https://via.placeholder.com/300x150?text=Node.js+Mastery",
        progress: 40,
        description: "Become a Node.js expert.",
        instructor: "Jane Smith",
        lastAccessed: "Express.js Basics",
      },
    ];
    setCourses(mockCourses);
  }, []);

  return (
    <Box>
      <Navbar />
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Courses
        </Typography>
        {courses.length > 0 ? (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="150"
                    image={course.thumbnail}
                    alt={course.title}
                  />
                  <CardContent>
                    <Typography variant="h6">{course.title}</Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {course.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Instructor: {course.instructor}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Last Accessed: {course.lastAccessed}
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      <Typography variant="body2">Progress:</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ mt: 0.5, textAlign: "right" }}
                      >
                        {course.progress}%
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      fullWidth
                    >
                      Resume
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No courses found.</Typography>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default MyCourses;
