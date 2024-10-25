import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import "../styles/RSVPForm.css";

const RSVPForm = ({ eventTitle, eventId }) => {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim()
    };

    console.log('Submitting RSVP:', {
      eventId,
      data: requestData,
      url: `${process.env.REACT_APP_BACKEND_URL}/api/events/${eventId}/rsvp`
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/events/${eventId}/rsvp`,
        requestData
      );

      console.log('RSVP Response:', response.data);

      setFormData({
        name: "",
        email: "",
        phone: "",
      });
      handleClose();
      setSnackbar({
        open: true,
        message: response.data.message || "RSVP successful!",
        severity: "success"
      });
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      
      // Get the error message from the response
      const errorMessage = error.response?.data?.message || "Error submitting RSVP. Please try again.";
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });

      // Only close the dialog if it's not a duplicate RSVP error
      if (!errorMessage.includes("already RSVP")) {
        handleClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        className="rsvp-button" 
        onClick={handleOpen}
        variant="contained"
        color="primary"
      >
        RSVP for the Event
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>RSVP for {eventTitle}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="dense"
              name="name"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              error={!formData.name.trim()}
              helperText={!formData.name.trim() ? "Name is required" : ""}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              error={!formData.email.trim()}
              helperText={!formData.email.trim() ? "Email is required" : ""}
            />
            <TextField
              margin="dense"
              name="phone"
              label="Phone Number (Optional)"
              type="tel"
              fullWidth
              variant="outlined"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            className="rsvp-submit-button" 
            onClick={handleSubmit}
            disabled={loading || !formData.name.trim() || !formData.email.trim()}
            variant="contained"
            color="primary"
          >
            {loading ? "Submitting..." : "Submit RSVP"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RSVPForm;