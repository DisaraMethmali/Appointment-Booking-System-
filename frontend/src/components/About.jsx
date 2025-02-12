import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "./Home.css"; // Using the same CSS

const About = () => {
  return (
    <>
      <Container maxWidth="lg" className="home-container">
        <Box className="home-content">
          <Typography variant="h4" className="home-title">
            About Us
          </Typography>
          <Typography variant="body1" className="home-description">
            Our mission is to provide a seamless appointment booking experience with trusted professionals.
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

export default About;
