import React, { useEffect } from "react";
import {
  CardContent,
  Box,
  Typography,
  Grid,
  MenuItem,
  Chip,
  Avatar,
  TextField,
  Select,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/system";
import Card from "@mui/material/Card";
import { useUser } from "@clerk/clerk-react";
import axios from "axios"; // Clerk hook for user information
import "../styles/UserProfile.css";

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

const StyledCard = styled(Card)(({ theme }) => ({
  background: "#ffffff",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  borderRadius: "20px",
  padding: theme.spacing(4),
  maxWidth: 1000,
  margin: "0 auto",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "#1a1a1a",
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  borderBottom: "2px solid #7c3aed",
  display: "inline-block",
}));

const FormSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const GEOCODING_API_KEY = process.env.REACT_APP_GEOCODING_API_KEY;

const UserProfileContent = ({ formData, setFormData, onSave }) => {
  const { user } = useUser(); // Fetch user data from Clerk
  useEffect(() => {
    // Prefill form data with user details if available
    setFormData((prevData) => ({
      ...prevData,
      fullName: `${user?.firstName || ""} ${user?.lastName || ""}`,
      emailAddresses: user?.emailAddresses?.[0]?.emailAddress || "",
      phoneNumber: user?.phoneNumbers?.[0]?.phoneNumber || "",
      imageUrl: user?.imageUrl || "",
    }));

    // Check if address fields are empty and get user's location if they are
    if (
      !formData.address.street &&
      !formData.address.city &&
      !formData.address.state
    ) {
      getUserLocation();
    }
  }, [user, setFormData]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await fetchAddressFromCoords(latitude, longitude);
          if (address) {
            setFormData((prevData) => ({
              ...prevData,
              address: address,
            }));
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fetchAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${GEOCODING_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].components;
        return {
          street: location.road || "",
          city: location.city || location.town || location.village || "",
          state: location.state || "",
          postalCode: location.postcode || "",
          country: location.country || "",
        };
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value,
      },
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData((prevData) => ({
      ...prevData,
      interests: prevData.interests.includes(interest)
        ? prevData.interests.filter((i) => i !== interest)
        : [...prevData.interests, interest],
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setFormData((prevData) => ({ ...prevData, imageUrl: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send formData to the backend /profile/save endpoint
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/events/profile/save`,
        formData
      );

      console.log("User data submitted:", response.data);
      alert("Profile updated successfully!");
      onSave(); // Close the dialog after saving
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <StyledCard>
      <CardContent sx={{ p: 2 }}>
        {/* Profile Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            p: 3,
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
          }}
        >
          <Avatar
            src={formData.imageUrl}
            sx={{
              width: "120px",
              height: "120px",
              boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.1)",
              border: "4px solid white",
            }}
          />
          <Box sx={{ ml: 3 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "600", color: "#1a1a1a", mb: 1 }}
            >
              {formData.fullName}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
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
              <Button
                variant="outlined"
                startIcon={<PhotoCamera />}
                component="span"
                sx={{
                  borderColor: "#7c3aed",
                  color: "#7c3aed",
                  "&:hover": {
                    borderColor: "#6a27db",
                    backgroundColor: "rgba(124, 58, 237, 0.04)",
                  },
                }}
              >
                Change Photo
              </Button>
            </label>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <FormSection>
            <SectionTitle>Personal Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: "white" }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    sx={{ backgroundColor: "white" }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: "white" }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="language-label">Language</InputLabel>
                  <Select
                    labelId="language-label"
                    label="Language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    sx={{ backgroundColor: "white" }}
                  >
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                    <MenuItem value="French">French</MenuItem>
                    <MenuItem value="German">German</MenuItem>
                    <MenuItem value="Chinese">Chinese</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </FormSection>

          {/* Contact Information Section */}
          <FormSection>
            <SectionTitle>Contact Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    label="Email Address"
                    name="emailAddresses"
                    value={formData.emailAddresses}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: "white" }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: "white" }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </FormSection>

          {/* Address Section */}
          <FormSection>
            <SectionTitle>Address Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    label="Street"
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: "white" }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    label="City"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: "white" }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    label="State"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: "white" }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    label="Postal Code"
                    name="postalCode"
                    value={formData.address.postalCode}
                    onChange={handleAddressChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: "white" }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </FormSection>

          {/* Interests Section */}
          <FormSection>
            <SectionTitle>Interests</SectionTitle>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {interestOptions.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  clickable
                  onClick={() => handleInterestToggle(interest)}
                  sx={{
                    fontSize: "0.9rem",
                    height: "32px",
                    "&.MuiChip-root.MuiChip-filled": {
                      backgroundColor: "#7c3aed",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#6a27db",
                      },
                    },
                    "&.MuiChip-outlined": {
                      borderColor: "#7c3aed",
                      color: "#7c3aed",
                      "&:hover": {
                        backgroundColor: "rgba(124, 58, 237, 0.04)",
                      },
                    },
                  }}
                  color={
                    formData.interests.includes(interest)
                      ? "primary"
                      : "default"
                  }
                  variant={
                    formData.interests.includes(interest)
                      ? "filled"
                      : "outlined"
                  }
                />
              ))}
            </Box>
          </FormSection>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
              mb: 2,
              py: 1.5,
              bgcolor: "#7c3aed",
              fontSize: "1rem",
              fontWeight: "600",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                bgcolor: "#6a27db",
              },
            }}
          >
            Save Changes
          </Button>
        </form>
      </CardContent>
    </StyledCard>
  );
};

export default UserProfileContent;
