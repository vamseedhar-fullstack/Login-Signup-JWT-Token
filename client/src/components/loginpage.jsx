import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AlertMessage from "./AlertMessage"; // Import the AlertMessage component
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import "./loginpage.css";

export const Loginpage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpValid, setOtpValid] = useState(null); // State to track OTP validation result
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState(''); // State for new password
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setAlertSeverity("warning");
      setAlertMessage("Please fill in all fields.");
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4005/loginn", {
        username,
        password,
      });
      if (response.data.success) {
        const role = response.data.role;
        setAlertSeverity("success");
        setAlertMessage(`Welcome, ${role}!`);
        setAlertOpen(true);
        localStorage.setItem("role", role);
        setTimeout(() => {
          Cookies.set("token", response.data.token);
          navigate(`/${role.toLowerCase()}`, { state: { username, role } });
        }, 1000);
      } else {
        setAlertSeverity("error");
        setAlertMessage("Invalid credentials");
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAlertSeverity("error");
      setAlertMessage(
        "An error occurred during login. Please try again later."
      );
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setOtpSent(false); // Reset OTP sent state when closing the dialog
    setOtp(""); // Clear OTP input when closing the dialog
    setOtpValid(null); // Reset OTP validation state when closing the dialog
  };

  const handleSendResetEmail = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4005/forgot-password",
        { email }
      );
      if (response.data.success) {
        setAlertSeverity("success");
        setAlertMessage("Password reset email sent!");
        setAlertOpen(true);
        setOtpSent(true); 
      } else {
        setAlertSeverity("error");
        setAlertMessage("This mail is not registered. Use registered mail to send OTP");
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage("This mail is not registered. Use registered mail to send OTP ");
      setAlertOpen(true);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post("http://localhost:4005/verify-otp", {
        email,
        otp,
      });
      if (response.data.success) {
        setOtpValid(true); // OTP is correct
        setAlertSeverity("success");
        setAlertMessage("OTP verified! Please reset your password.");
        setAlertOpen(true);
        // Redirect to reset password page or perform necessary action
      } else {
        setOtpValid(false); // OTP is incorrect
        setAlertSeverity("error");
        setAlertMessage("Invalid OTP. Please try again.");
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage("Invalid OTP. Please try again.");
      setAlertOpen(true);
      setOtpValid(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setAlertSeverity('error');
      setAlertMessage('Passwords do not match.');
      setAlertOpen(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4005/change-password', {
        email,
        newPassword,
      });
      if (response.data.success) {
        setAlertSeverity('success');
        setAlertMessage('Password updated successfully.');
        setAlertOpen(true);
        setNewPassword('');
        setConfirmPassword('');
        window.location.reload();
      } else {
        setAlertSeverity('error');
        setAlertMessage('Failed to update password.');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setAlertSeverity('error');
      setAlertMessage('An error occurred while updating password.');
      setAlertOpen(true);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="login-body">
      <div className="loginPage-container">
        <div className="loginPage-card">
          <Typography variant="h5" component="h2" className="loginPage-title">
            Log in
          </Typography>
          <div className="loginPage-inputBox">
            <input
              type="text"
              required="required"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className="loginPage-user">Username</span>
          </div>

          <div className="loginPage-inputBox">
            <TextField
              required
              type={showPassword ? 'text' : 'password'}
              label="Password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <button className="loginPage-enter" onClick={handleLogin}>
            {loading ? "Logging in..." : "Enter"}
          </button>

          <button
            className="loginPage-forgotPassword"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>
        </div>

        <AlertMessage
          open={alertOpen}
          severity={alertSeverity}
          message={alertMessage}
          handleClose={handleAlertClose}
        />

        <Dialog open={forgotPasswordOpen} onClose={handleForgotPasswordClose}>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your email address. We will send you an OTP to reset your password.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {otpSent && (
              <>
                <TextField
                  margin="dense"
                  id="otp"
                  label="OTP"
                  type="text"
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
               
                {otpValid === false && (
                  <Typography variant="caption" color="error">
                    Invalid OTP. Please try again.
                  </Typography>
                )}
                {otpValid === true && (
                  <>
                    <TextField
                      margin="dense"
                      id="newPassword"
                      label="New Password"
                      type={showNewPassword ? 'text' : 'password'}
                      fullWidth
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={!otpValid} // Disable if OTP is not valid
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowNewPassword} edge="end">
                              {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      margin="dense"
                      id="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={!otpValid} // Disable if OTP is not valid
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleForgotPasswordClose} color="primary">
              Cancel
            </Button>
            {!otpSent ? (
              <Button onClick={handleSendResetEmail} color="primary">
                Send
              </Button>
            ) : (
              <>
                {!otpValid ? (
                  <Button onClick={handleVerifyOTP} color="primary">
                    Verify OTP
                  </Button>
                ) : (
                  <Button onClick={handleChangePassword} color="primary">
                    Change Password
                  </Button>
                )}
              </>
            )}
          </DialogActions>
        </Dialog>

      </div>
    </div>
  );
};
