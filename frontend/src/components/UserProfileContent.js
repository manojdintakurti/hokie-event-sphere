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
import axios from "axios";
import "../styles/UserProfile.css";

const interestOptions = [
    "Technology",
    "Sports",
    "Music",
    "Art",
    "Travel",
    "Gaming",
    "Fitness",
    "Social Events",
    "Others"
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



const GEOCODING_API_KEY = process.env.REACT_APP_GEOCODING_API_KEY;

const UserProfileContent = ({ formData, setFormData, onSave }) => {
    const { user } = useUser();

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            fullName: `${user?.firstName || ""} ${user?.lastName || ""}`,
            emailAddresses: user?.emailAddresses?.[0]?.emailAddress || "",
            phoneNumber: user?.phoneNumbers?.[0]?.phoneNumber || "",
            imageUrl: user?.imageUrl || "",
        }));

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
                            address: {
                                ...address,
                                coordinates: { latitude, longitude },
                            },
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

    const handleInterestToggle = (interest) => {
        setFormData((prevData) => ({
            ...prevData,
            interests: prevData.interests.includes(interest)
                ? prevData.interests.filter((i) => i !== interest)
                : [...prevData.interests, interest],
        }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/events/profile/save`,
                formData
            );

            console.log("User data submitted:", response.data);
            alert("Profile updated successfully!");
            onSave();
        } catch (error) {
            console.error("Error saving profile data:", error);
            alert("Failed to update profile. Please try again.");
        }
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

    return (
        <StyledCard>
            <CardContent sx={{ p: 2 }}>
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
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Select
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
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="emailAddresses"
                                value={formData.emailAddresses}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Street"
                                name="street"
                                value={formData.address.street}
                                onChange={handleAddressChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.address.city}
                                onChange={handleAddressChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                value={formData.address.state}
                                onChange={handleAddressChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Postal Code"
                                name="postalCode"
                                value={formData.address.postalCode}
                                onChange={handleAddressChange}
                            />
                        </Grid>
                    </Grid>

                    <Typography sx={{ mt: 3, fontWeight: "bold" }}>Interests</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                        {interestOptions.map((interest) => (
                            <Chip
                                key={interest}
                                label={interest}
                                onClick={() => handleInterestToggle(interest)}
                                color={
                                    formData.interests.includes(interest) ? "primary" : "default"
                                }
                                variant={
                                    formData.interests.includes(interest) ? "filled" : "outlined"
                                }
                            />
                        ))}
                    </Box>

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
