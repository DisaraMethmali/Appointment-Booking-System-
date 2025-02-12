import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "./Home.css"; // Using the same CSS

const Blog = () => {
  return (
    <>
      <Container maxWidth="lg" className="home-container">
        <Box className="home-content">
          <Typography variant="h4" className="home-title">
            Latest Articles & Health Tips
          </Typography>
          <Typography variant="body1" className="home-description">
            Stay informed with the latest healthcare insights and appointment booking tips.
          </Typography>
        </Box>
      </Container>

      {/* Footer */}
      <footer className="footer">
        <Typography variant="body2">© 2025 Appointment Booking. All Rights Reserved.</Typography>
      </footer>
    </>
  );
};

export default Blog;
