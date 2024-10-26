import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/system';
import {purple} from "@mui/material/colors";

const interestOptions = ["Technology", "Sports", "Music", "Art", "Travel", "Gaming", "Fitness", "Cooking"];
const GEOCODING_API_KEY = '751c583798a84b50bc9e2cecfdc750b9'; // Replace with your OpenCage API key

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff, #ffffff)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
    padding: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: '100px',
    height: '100px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    },
    '& label.Mui-focused': {
        color: purple,
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ccc',
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    '& .MuiSelect-select': {
        padding: '10px',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
    color: "#ffffff",
    background: "#7c3aed"

}));

const UserProfilePage = () => {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        country: '',
        language: '',
        emailAddresses: '',
        phoneNumber: '',
        interests: [],
        imageUrl: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
        },
    });

    useEffect(() => {
        // Prefill form data with user details if available
        setFormData({
            fullName: `${user?.firstName || ''} ${user?.lastName || ''}`,
            gender: '',
            country: '',
            language: '',
            emailAddresses: user?.emailAddresses[0]?.emailAddress || '',
            phoneNumber: user?.phoneNumbers ? user.phoneNumbers[0]?.phoneNumber : '',
            interests: [],
            imageUrl: user?.imageUrl || '',
            address: {
                street: '',
                city: '',
                state: '',
                postalCode: '',
                country: '',
            },
        });

        // Get the user's current location on page load
        getUserLocation();
    }, [user]);

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
                    street: location.road || '',
                    city: location.city || location.town || location.village || '',
                    state: location.state || '',
                    postalCode: location.postcode || '',
                    country: location.country || '',
                };
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            address: {
                ...prevData.address,
                [name]: value
            }
        }));
    };

    const handleInterestToggle = (interest) => {
        setFormData((prevData) => ({
            ...prevData,
            interests: prevData.interests.includes(interest)
                ? prevData.interests.filter((i) => i !== interest)
                : [...prevData.interests, interest]
        }));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setFormData({ ...formData, imageUrl: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('User data submitted:', formData);
        alert('Profile updated successfully!');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#4a4a4a' }}>
                    Welcome, {user?.firstName || 'User'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {new Date().toLocaleDateString()}
                </Typography>

                <StyledCard>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <StyledAvatar
                                src={formData.imageUrl}
                                alt="Profile Picture"
                            />
                            <Box sx={{ ml: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>{formData.fullName}</Typography>
                                <Typography color="text.secondary">{formData.emailAddresses}</Typography>
                                <label htmlFor="icon-button-file">
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
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
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledSelect
                                        fullWidth
                                        label="Language"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        displayEmpty
                                    >
                                        <MenuItem value="">
                                            <em>Select Language</em>
                                        </MenuItem>
                                        <MenuItem value="English">English</MenuItem>
                                        <MenuItem value="Spanish">Spanish</MenuItem>
                                        <MenuItem value="French">French</MenuItem>
                                        <MenuItem value="German">German</MenuItem>
                                        <MenuItem value="Chinese">Chinese</MenuItem>
                                    </StyledSelect>
                                </Grid>
                                <Grid item xs={12}>
                                    <StyledTextField
                                        fullWidth
                                        label="Email Address"
                                        name="emailAddresses"
                                        value={formData.emailAddresses}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <StyledTextField
                                        fullWidth
                                        label="Phone Number"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="Street"
                                        name="street"
                                        value={formData.address.street}
                                        onChange={handleAddressChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="City"
                                        name="city"
                                        value={formData.address.city}
                                        onChange={handleAddressChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="State"
                                        name="state"
                                        value={formData.address.state}
                                        onChange={handleAddressChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="Postal Code"
                                        name="postalCode"
                                        value={formData.address.postalCode}
                                        onChange={handleAddressChange}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>Interests</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                {interestOptions.map((interest) => (
                                    <Chip
                                        key={interest}
                                        label={interest}
                                        clickable
                                        onClick={() => handleInterestToggle(interest)}
                                        sx={{
                                            '&.MuiChip-root.MuiChip-filled': {
                                                backgroundColor: "#7c3aed",
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#6a27db'
                                                }
                                            },
                                            '&.MuiChip-outlined': {
                                                borderColor: '#e5e7eb',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(124, 58, 237, 0.04)'
                                                }
                                            }
                                        }}
                                        color={formData.interests.includes(interest) ? 'primary' : 'default'}
                                        variant={formData.interests.includes(interest) ? 'filled' : 'outlined'}
                                    />
                                ))}
                            </Box>

                            <StyledButton type="submit" variant="contained" color="#7c3aed" sx={{ mt: 4, float: 'right' }}>
                                Save Profile
                            </StyledButton>
                        </form>
                    </CardContent>
                </StyledCard>
            </Box>
        </Container>
    );
};

export default UserProfilePage;
