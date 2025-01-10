import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const InstructorDashboard = React.lazy(() => import("./pages/Instructor/InstructorDashboard"));
const InstructorCourses = React.lazy(() => import("./pages/Instructor/InstructorCourses"));
const StudentCourses = React.lazy(() => import("./pages/Student/MyCourses"));
const CourseForm = React.lazy(() => import("./pages/Instructor/CourseForm"));
const SectionForm = React.lazy(() => import("./pages/Instructor/SectionForm"));
const LessonForm = React.lazy(() => import("./pages/Instructor/LessonForm"));
const CourseListing = React.lazy(() => import("./pages/CourseListing"));
const CourseDetails = React.lazy(() => import("./pages/CourseDetails"));

const App = () => (
  <Router>
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}><CircularProgress/></div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<CourseListing />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/courses" element={<InstructorCourses />}/>
        <Route path="/Student/MyCourses" element={<StudentCourses />}/>
        <Route path="/instructor/course/new" element={<CourseForm />}/>
        <Route path="/instructor/section/new" element={<SectionForm />}/>
        <Route path="/instructor/lesson/new" element={<LessonForm />}/>
        <Route path="/instructor/course/:id/edit" element={<CourseForm />}/>
      </Routes>
    </Suspense>
  </Router>
);

export default App;