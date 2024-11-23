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
  CircularProgress,
} from "@mui/material";
import "../styles/RSVPForm.css";

const RSVPForm = ({ eventTitle, eventId }) => {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
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
      email: sessionStorage.getItem("userEmail"), // Fetch email from session storage
      phone: formData.phone.trim(),
    };

    console.log("Submitting RSVP:", {
      eventId,
      data: requestData,
      url: `${process.env.REACT_APP_BACKEND_URL}/api/events/${eventId}/rsvp`,
    });

    try {
      const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/events/${eventId}/rsvp`,
          requestData
      );

      console.log("RSVP Response:", response.data);

      setFormData({
        name: "",
        phone: "",
      });
      handleClose();
      setSnackbar({
        open: true,
        message: response.data.message || "RSVP successful!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error submitting RSVP:", error);

      // Get the error message from the response
      const errorMessage =
          error.response?.data?.message ||
          "Error submitting RSVP. Please try again.";

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
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
            disableElevation
        >
          RSVP for the Event
        </Button>

        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              style: {
                borderRadius: "8px",
              },
            }}
        >
          <DialogTitle>RSVP for {eventTitle}</DialogTitle>
          <DialogContent dividers>
            <form onSubmit={handleSubmit} className="rsvp-form">
              <TextField
                  margin="normal"
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
                  margin="normal"
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  fullWidth
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
              />
            </form>
          </DialogContent>
          <DialogActions className="rsvp-dialog-actions">
            <Button
                onClick={handleClose}
                disabled={loading}
                className="cancel-button"
                variant="outlined"
            >
              Cancel
            </Button>
            <Button
                onClick={handleSubmit}
                disabled={loading || !formData.name.trim()}
                variant="contained"
                className="submit-button"
            >
              {loading ? (
                  <div className="loading-wrapper">
                    <CircularProgress size={20} color="inherit" />
                    <span>Submitting...</span>
                  </div>
              ) : (
                  "Submit RSVP"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
              onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
              severity={snackbar.severity}
              variant="filled"
              className="rsvp-alert"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
  );
};

export default RSVPForm;
