import React, { useState, useEffect } from 'react';
import { CardContent, Box, Typography, IconButton, Divider, Grid, MenuItem, Chip, Avatar, TextField, Select, Button } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import { purple } from '@mui/material/colors';
import { useUser } from "@clerk/clerk-react"; // Clerk hook for user information

const interestOptions = ["Technology", "Sports", "Music", "Art", "Travel", "Gaming", "Fitness", "Cooking"];

const StyledCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff, #ffffff)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
    padding: theme.spacing(3),
}));

const UserProfileContent = ({ formData, setFormData, onSave }) => {
    const { user } = useUser(); // Fetch user data from Clerk

    useEffect(() => {
        // Prefill form data with user details if available
        setFormData((prevData) => ({
            ...prevData,
            fullName: `${user?.firstName || ''} ${user?.lastName || ''}`,
            emailAddresses: user?.emailAddresses?.[0]?.emailAddress || '',
            phoneNumber: user?.phoneNumbers?.[0]?.phoneNumber || '',
            imageUrl: user?.imageUrl || '',
        }));
    }, [user, setFormData]);

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
            reader.onload = () => setFormData((prevData) => ({ ...prevData, imageUrl: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('User data submitted:', formData);
        alert('Profile updated successfully!');
        onSave(); // Close the dialog after saving
    };

    return (
        <StyledCard>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar src={formData.imageUrl} sx={{ width: '100px', height: '100px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)' }} />
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
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                variant="outlined"
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
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Select
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
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="emailAddresses"
                                value={formData.emailAddresses}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Street"
                                name="street"
                                value={formData.address.street}
                                onChange={handleAddressChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.address.city}
                                onChange={handleAddressChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                value={formData.address.state}
                                onChange={handleAddressChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
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

                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 4 }}>
                        Save Profile
                    </Button>
                </form>
            </CardContent>
        </StyledCard>
    );
}

export default UserProfileContent;
