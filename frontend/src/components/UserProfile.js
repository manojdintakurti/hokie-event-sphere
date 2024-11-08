import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import UserProfileContent from "./UserProfileContent";
import axios from 'axios';

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
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/events/profile`, {
                    params: { email: user?.emailAddresses }
                });
                
                const profileData = response.data;
                setFormData((prevData) => ({
                    ...prevData,
                    fullName: profileData.fullName || '',
                    gender: profileData.gender || '',
                    country: profileData.country || '',
                    language: profileData.language || '',
                    emailAddresses: profileData.emailAddresses || '',
                    phoneNumber: profileData.phoneNumber || '',
                    interests: profileData.interests || [],
                    imageUrl: profileData.imageUrl || '',
                    address: {
                        street: profileData.address?.street || '',
                        city: profileData.address?.city || '',
                        state: profileData.address?.state || '',
                        postalCode: profileData.address?.postalCode || '',
                        country: profileData.address?.country || '',
                    },
                }));
            } catch (error) {
                console.log(`${process.env.REACT_APP_BACKEND_URL}/api/events/profile`,user.email)
                console.error('Error fetching profile data:', error);
            }
        };

        // Only fetch if user data is available
        if (user) {
            fetchProfileData();
        }
    }, [user]);

    // Define the onSave function to handle form submission
    const handleSave = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/events/profile/save`, formData);
            console.log('Profile saved successfully:', response.data);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#4a4a4a' }}>
                    Welcome, {user?.firstName || 'User'}
                </Typography>
                
                {/* Pass formData, setFormData, and handleSave as props */}
                <UserProfileContent
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleSave}
                />
            </Box>
        </Container>
    );
};

export default UserProfilePage;
