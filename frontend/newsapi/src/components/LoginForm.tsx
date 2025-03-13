"use client";
import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = () => {
    // Handle login logic here
    console.log("Email:", email, "Password:", password);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
      }}
    >
      <Paper
        sx={{
          position: "relative",
          maxWidth: 400,
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 3 }}>
          Login
        </Typography>

        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Email Field */}
          <TextField
            label="Email Address"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            autoComplete="off"
            sx={{ mb: 2 }}
          />

          {/* Password Field */}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            autoComplete="off"
            sx={{ mb: 2 }}
          />

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              mt: 3,
              "&:hover": { backgroundColor: "teal" },
            }}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
