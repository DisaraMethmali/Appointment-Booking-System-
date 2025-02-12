import React from "react";
import { Container, Typography, Button, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import img1 from "./img1.jpg"; // Import image
import "./Home.css"; // Import the CSS file

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container maxWidth="lg" className="home-container">
        <Grid container spacing={3} alignItems="center">
          {/* Left Side - Text Content */}
          <Grid item xs={15} md={6}>
            <Box className="home-content">
              <Typography variant="h3" className="home-title">
                Effortless Appointment Scheduling
              </Typography>
              <br></br>
              <Typography variant="h6" className="home-description">
                Book appointments with top professionals in just a few clicks.
                Stay ahead with real-time availability and hassle-free scheduling.
              </Typography>
              <Box mt={3}>
                <Button 
                  variant="contained" 
                  sx={{
                    bgcolor: "#0047AB", 
                    color: "white",
                    borderRadius: "25px",
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    '&:hover': { bgcolor: "#003580" }
                  }}
                  onClick={() => navigate("/available-slots")}
                >
                  Book Now
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Image */}
          <Grid item xs={14} md={6}>
            <img src={img1} alt="Booking" className="home-image" />
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <footer className="footer">
        <Typography variant="body2">
          © {new Date().getFullYear()} Appointment Booking. All Rights Reserved.
        </Typography>
      </footer>
    </>
  );
};

export default Home;
