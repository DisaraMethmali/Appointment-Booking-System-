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
    <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: "none" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Navigation Links */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", gap: 6 }}>
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: "none", color: "darkblue" }}>
            Home
          </Typography>
          <Typography variant="h6" component={Link} to="/about" sx={{ textDecoration: "none", color: "darkblue" }}>
            About
          </Typography>
          <Typography variant="h6" component={Link} to="/blog" sx={{ textDecoration: "none", color: "darkblue" }}>
            Blog
          </Typography>
          <Typography variant="h6" component={Link} to="/available-slots" sx={{ textDecoration: "none", color: "darkblue" }}>
            Bookings
          </Typography>
        </Box>

        {/* User Authentication Section */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {token ? (
            <>
              <Typography
                variant="h6"
                component={Link}
                to="/my-appointments"
                sx={{
                  textDecoration: "none",
                  color: "darkblue",
                  cursor: "pointer",
                }}
              >
                My Appointments
              </Typography>

              {user?.isAdmin && (
                <Typography
                  variant="body1"
                  component={Link}
                  to="/admin"
                  sx={{
                    textDecoration: "none",
                    color: "darkblue",
                    cursor: "pointer",
                  }}
                >
                  Admin
                </Typography>
              )}

              <Button
                sx={{
                  bgcolor: "darkblue",
                  color: "white",
                  '&:hover': { bgcolor: "#003366" },
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
                  bgcolor: "darkblue",
                  color: "white",
                  '&:hover': { bgcolor: "#003366" },
                }}
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                sx={{
                  bgcolor: "darkblue",
                  color: "white",
                  '&:hover': { bgcolor: "#003366" },
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
