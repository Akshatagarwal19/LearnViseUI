import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courseApi from '../../services/apiService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Card, CardContent, CardMedia, Typography, Button, Container, Grid2, CircularProgress } from '@mui/material';

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const courses = await courseApi.getEnrolledCourses(); // Fetch enrolled courses
        // We need to extract the course data from each enrollment object
        const courseData = courses.map((enrollment) => enrollment.course);
        setEnrolledCourses(courseData);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Courses
        </Typography>
        {enrolledCourses.length === 0 ? (
          <Typography variant="h6">You are not enrolled in any courses.</Typography>
        ) : (
          <Grid2 container spacing={4}>
            {enrolledCourses.map((course) => (
              <Grid2 item key={course._id} xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.thumbnail || 'https://via.placeholder.com/300'}
                    alt={course.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {course.description.slice(0, 100)}...
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/course/${course._id}/Material`)}
                      sx={{ mt: 2 }}
                    >
                      Go to Course
                    </Button>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default MyCourses;
