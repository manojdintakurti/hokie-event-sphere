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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Form submitted:', formData);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/events/${eventId}/rsvp`,
        formData
      );
      console.log("Response from server:", response.data);

      setFormData({
        name: "",
        email: "",
        phone: "",
      });
      handleClose();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
    }
  };

  return (
    <>
      <Button className="rsvp-button" onClick={handleOpen}>
        RSVP for the Event
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
            />
            <TextField
              margin="dense"
              name="phone"
              label="Phone Number"
              type="tel"
              fullWidth
              variant="outlined"
              value={formData.phone}
              onChange={handleChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button className="rsvp-submit-button" onClick={handleSubmit}>
            Submit RSVP
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          className="rsvp-alert"
        >
          You have successfully RSVP'd for the event!
        </Alert>
      </Snackbar>
    </>
  );
};

export default RSVPForm;
