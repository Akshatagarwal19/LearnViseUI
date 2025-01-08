import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courseApi from '../../services/apiService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Card, CardContent, CardMedia, Typography, Button, Container, Grid2, CircularProgress } from '@mui/material';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await courseApi.getEnrolledCourses();
        setCourses(response);
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
        {courses.length > 0 ? (
          <Grid2 container spacing={4}>
            {courses.map((course) => (
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
                      onClick={() => navigate(`/course/${course._id}`)}
                      sx={{ mt: 2 }}
                    >
                      Go to Course
                    </Button>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        ) : (
          <Typography variant="body1" color="textSecondary">
            You haven't enrolled in any courses yet. Explore and enroll in courses to start learning!
          </Typography>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default MyCourses;
