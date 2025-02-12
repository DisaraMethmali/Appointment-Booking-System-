import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "white" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo / Title */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "blue", fontWeight: "bold" }}
        >
          Appointments
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {token ? (
            <>
              {user?.isAdmin && (
                <Typography
                  variant="body1"
                  component={Link}
                  to="/admin"
                  sx={{
                    textDecoration: "none",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Admin
                </Typography>
              )}
              <Typography
                variant="body1"
                component={Link}
                to="/my-appointments"
                sx={{
                  textDecoration: "none",
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                My Appointments
              </Typography>
              <Button
                sx={{
                  bgcolor: "darkblue", // Dark blue background
                  color: "white", // White text color
                  '&:hover': {
                    bgcolor: "#003366", // Darker blue on hover
                  }
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                sx={{
                  bgcolor: "darkblue", // Dark blue background
                  color: "white", // White text color
                  '&:hover': {
                    bgcolor: "#003366", // Darker blue on hover
                  }
                }}
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                sx={{
                  bgcolor: "darkblue", // Dark blue background
                  color: "white", // White text color
                  '&:hover': {
                    bgcolor: "#003366", // Darker blue on hover
                  }
                }}
                component={Link}
                to="/signup"
              >
                Signup
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}



