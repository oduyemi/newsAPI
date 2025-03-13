"use client";
import React from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

export const Register: React.FC = () => {
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
          padding: 3,
          maxWidth: 400,
          width: "100%",
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{ marginBottom: 3, fontWeight: "bold" }}
        >
          Register
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* First Name */}
          <TextField
            label="First Name"
            name="fname"
            variant="outlined"
            fullWidth
            autoComplete="off"
            InputLabelProps={{ shrink: true }}
          />

          {/* Last Name */}
          <TextField
            label="Last Name"
            name="lname"
            variant="outlined"
            fullWidth
            autoComplete="off"
            InputLabelProps={{ shrink: true }}
          />

          {/* Email */}
          <TextField
            label="Email Address"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            autoComplete="off"
            InputLabelProps={{ shrink: true }}
          />

          {/* Password */}
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            autoComplete="off"
            InputLabelProps={{ shrink: true }}
          />

          {/* Confirm Password */}
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            variant="outlined"
            fullWidth
            autoComplete="off"
            InputLabelProps={{ shrink: true }}
          />

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: "12px",
              fontSize: "16px",
              fontWeight: "medium",
              "&:hover": { backgroundColor: "#02848b" },
            }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
