import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CourseTable from "../../components/Instructor/CourseTable";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const sampleCourses = [
    { id: 1, title: "React Basics", category: "Web Development", price: "$50", students: 100 },
    { id: 2, title: "Advanced Node.js", category: "Backend", price: "$80", students: 100 },
    { id: 3, title: "UI/UX Design", category: "Design", price: "$79", students: 100 },
];

const InstructorCourses = () => {
    return (
        <Box sx={{ padding: 3 }}>
            <Navbar />
            <Typography variant="h4" gutterBottom>
                Manage Courses
            </Typography>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => {window.location.href = "/instructor/course/new";}}>
                Add New Course
            </Button>
            <CourseTable courses={sampleCourses}/>
            <Footer />
        </Box>
    );
};

export default InstructorCourses;