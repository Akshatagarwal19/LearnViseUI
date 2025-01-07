import React from "react";
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";

const CourseCard = ({ course }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={course.image || "/placeholder.png"} // Placeholder for missing images
        alt={course.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5">
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {course.description.substring(0, 100)}...
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} href={`/courses/${course.id}`}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
