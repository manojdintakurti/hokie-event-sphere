import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/system";
import { purple } from "@mui/material/colors";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const interestOptions = [
  "Technology",
  "Sports",
  "Music",
  "Art",
  "Travel",
  "Gaming",
  "Fitness",
  "Cooking",
];

// Styled Components (keeping your existing styled components)
const StyledCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #ffffff, #ffffff)",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  borderRadius: "15px",
  padding: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: "100px",
  height: "100px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
  },
  "& label.Mui-focused": {
    color: purple[500],
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ccc",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
  "& .MuiSelect-select": {
    padding: "10px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: "10px 20px",
  borderRadius: "8px",
  fontWeight: "bold",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
  color: "#ffffff",
  background: "#7c3aed",
  "&:hover": {
    background: "#6d28d9",
  },
}));

const UserProfilePage = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    country: "",
    language: "",
    emailAddresses: "",
    phoneNumber: "",
    interests: [],
    imageUrl: "",
    imageFile: null,
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`${API_URL}/api/user-profile/${user.id}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const profileData = await response.json();
            setFormData(prev => ({
              ...prev,
              ...profileData,
              fullName: profileData.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`,
              emailAddresses: profileData.emailAddresses || user?.emailAddresses[0]?.emailAddress || "",
            }));
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          showNotification('Failed to load profile data', 'error');
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Create FormData object for multipart/form-data
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'address') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'imageFile' && formData[key]) {
          submitData.append('image', formData[key]);
        } else if (key !== 'imageFile') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add userId
      submitData.append('userId', user.id);

      const response = await fetch(`${API_URL}/api/user-profile`, {
        method: 'POST',
        credentials: 'include',
        body: submitData,
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const data = await response.json();
      showNotification('Profile updated successfully');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('Failed to update profile: ' + error.message, 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#4a4a4a" }}>
          Welcome, {user?.firstName || "User"}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {new Date().toLocaleDateString()}
        </Typography>

        <StyledCard>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <StyledAvatar src={formData.imageUrl} alt="Profile Picture" />
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                  {formData.fullName}
                </Typography>
                <Typography color="text.secondary">
                  {formData.emailAddresses}
                </Typography>
                <label htmlFor="icon-button-file">
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="icon-button-file"
                    type="file"
                    onChange={handlePhotoUpload}
                  />
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledSelect
                    fullWidth
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select Gender</em>
                    </MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </StyledSelect>
                </Grid>
                {/* Rest of your form fields remain the same */}
                {/* ... */}

                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
                    Interests
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {interestOptions.map((interest) => (
                      <Chip
                        key={interest}
                        label={interest}
                        clickable
                        onClick={() => handleInterestToggle(interest)}
                        sx={{
                          "&.MuiChip-root.MuiChip-filled": {
                            backgroundColor: "#7c3aed",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#6a27db",
                            },
                          },
                          "&.MuiChip-outlined": {
                            borderColor: "#e5e7eb",
                            "&:hover": {
                              backgroundColor: "rgba(124, 58, 237, 0.04)",
                            },
                          },
                        }}
                        color={formData.interests.includes(interest) ? "primary" : "default"}
                        variant={formData.interests.includes(interest) ? "filled" : "outlined"}
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <StyledButton
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    sx={{ mt: 4, float: "right" }}
                  >
                    {saving ? <CircularProgress size={24} /> : "Save Profile"}
                  </StyledButton>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </StyledCard>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfilePage;