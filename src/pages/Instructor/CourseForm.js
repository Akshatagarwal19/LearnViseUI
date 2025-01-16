import React, { useState } from "react";
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import courseApi from "../../services/apiService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import LessonForm from "./LessonForm";

const categories = [
  "WebDevelopment",
  "Design",
  "Marketing",
  "Business",
  "Photography",
  "Music",
];

const levels = ["Beginner", "Intermediate", "Advanced"];

const CoursePage = () => {
  const [form, setForm] = useState({ title: "", description: "", price: "", language: "", level: "", category: "", thumbnail: null });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courseId, setCourseId] = useState(null);

  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, thumbnail: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await courseApi.createCourse(formData);

      console.log("Full Response:", response); // Log full response for debugging

      const courseId = response.data?.course?._id; // Access _id under the course key
      if (!courseId) {
        throw new Error("Course ID (_id) is missing in the response");
      }
      setSuccess("Course created successfully!");
      setCourseId(response.data.course._id);
      console.log("Response:", response.data.course._id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    }
  };

  return (
    <>
      <Navbar />
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: "auto", display: "flex", flexDirection: "column", gap: 2, padding: 2, boxShadow: 3, borderRadius: 2 }} >
        <Typography variant="h4" gutterBottom>
          Create a New Course
        </Typography>
        <TextField label="Title" name="title" value={form.title} onChange={handleChange} required />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={4} required />
        <TextField label="Price" name="price" type="number" value={form.price} onChange={handleChange} required />
        <TextField label="Language" name="language" value={form.language} onChange={handleChange} required />
        <FormControl fullWidth required>
          <InputLabel>Level</InputLabel>
          <Select name="level" value={form.level} onChange={handleChange}>
            {levels.map((level, index) => (
              <MenuItem key={index} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select name="category" value={form.category} onChange={handleChange}>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" component="label">
          Upload Thumbnail
          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
        </Button>
        {error && <Typography color="error">{error}</Typography>}
        {success && (
          <Typography color="success.main">
            {success}
            <Button variant="outlined" color="primary" sx={{ marginLeft: 2 }} onClick={() => navigate(`/instructor/lesson/new?courseId=${courseId}`)} >
              Add Lesson
            </Button>
          </Typography>
        )}
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
      {courseId && <LessonForm courseId={courseId} />}
      <Footer />
    </>
  );
};

export default CoursePage;
