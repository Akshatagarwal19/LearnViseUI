import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import courseApi from '../services/apiService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Typography, Card, CircularProgress, Container, Box } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await courseApi.getCourseById(id);
        setCourseData(courseResponse);

        const enrollmentResponse = await courseApi.checkEnrollmentStatus(id);
        setIsEnrolled(enrollmentResponse.isEnrolled);
      } catch (error) {
        console.error('Error fetching course details:', error);
        alert('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);
  

  const enrollInCourse = async () => {
    try {
      await courseApi.enrollCourse(id);
      alert('Enrollment successful!');
      setIsEnrolled(true);

      const updatedCourse = await courseApi.getCourseById(id);
      setCourseData(updatedCourse);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!courseData?.course?.title) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
        Course not found.
      </Typography>
    );
  }

  const renderLessons = (lessons) =>
    lessons
      ?.filter((lesson) => isEnrolled || lesson.freeAccess)
      ?.map((lesson) => (
        <li key={lesson._id} style={{ marginBottom: '10px' }}>
          <PlayCircleIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
          <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">
            {lesson.title} {lesson.freeAccess === 0 ? <span style={{ color: '#28a745' }}>(Free)</span> : null}
          </a>
        </li>
      ));
  

  return (
    <>
      <Navbar />
      <Box sx={{ backgroundColor: '#f7f7f7', padding: 2 }}>
        <Container>
          <Typography variant="h3" gutterBottom>
            {courseData.course.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Created by {courseData.course.instructor?.name || 'Unknown Instructor'}
          </Typography>
          <Box display="flex" alignItems="center" gap={1} sx={{ marginBottom: 1 }}>
            <StarIcon sx={{ color: '#FFD700' }} />
            <Typography variant="body2" color="textSecondary">
              4.5 (1200 ratings)
            </Typography>
          </Box>
          <Typography variant="body1" component="p">
            {courseData.course.description}
          </Typography>
          <img src={courseData.course.thumbnail} alt={courseData.course.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }} />
        </Container>
      </Box>
      <Container>
        <Card elevation={3} sx={{ padding: 2, marginBottom: 2, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            ${courseData.course.price}
          </Typography>
          <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={enrollInCourse} disabled={isEnrolled} >
            {isEnrolled ? 'Enrolled' : 'Enroll Now'}
          </Button>
        </Card>
        <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>
          {isEnrolled ? 'Course Content' : 'Free Lessons'}
        </Typography>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {renderLessons(courseData.course.lessons)}
        </ul>
      </Container>
      <Footer />
    </>
  );
};

export default CourseDetails;
