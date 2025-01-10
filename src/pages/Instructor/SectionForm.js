import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import courseApi from "../../services/apiService";
import Navbar from "../../components/Navbar";

const SectionForm = ({ courseId: propCourseId }) => {
  const [searchParams] = useSearchParams();
  const courseId = propCourseId || searchParams.get("courseId");
  console.log("Course ID:", courseId);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "", // Optional
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sectionId, setSectionId] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const requestData = {
        title: form.title,
        description: form.description,
        ...(form.price && { price: parseFloat(form.price) }), // Include price only if provided
      };

      const response = await courseApi.addSection(courseId, requestData);
      // const sectionId = response.data?.section?.id;

      setSuccess("Section created successfully!");
      setSectionId(response.data.section.id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create section");
    }
  };

  return (
    <>
      <Navbar />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 2,
          border: "1px solid #ddd",
          borderRadius: 2,
          marginBottom: 2,
        }}
      >
        <Typography variant="h6">Add a New Section</Typography>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={2}
          required
        />
        <TextField
          label="Price (Optional)"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
        />
        {error && <Typography color="error">{error}</Typography>}
        {success && (
          <Typography color="success.main">
            {success}
            <Button
              variant="outlined"
              color="primary"
              sx={{ marginLeft: 2 }}
              onClick={() =>
                navigate(`/instructor/lesson/new?courseId=${courseId}&sectionId=${sectionId}`)
              }
            >
            Create Lesson
            </Button>
          </Typography>
        )}
        <Button variant="contained" type="submit">
          Create Section
        </Button>
      </Box>
    </>
  );
};

export default SectionForm;
