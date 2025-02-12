import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate(response.data.isAdmin ? '/admin' : '/');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
