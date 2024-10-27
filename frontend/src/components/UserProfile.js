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
        // Prefill form data with user details if available
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                fullName: `${user?.firstName || ''} ${user?.lastName || ''}`,
                emailAddresses: user?.emailAddresses?.[0]?.emailAddress || '',
                phoneNumber: user?.phoneNumbers?.[0]?.phoneNumber || '',
                imageUrl: user?.imageUrl || '',
            }));
        }
    }, [user]);

    // Define the onSave function to handle form submission
    const handleSave = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/profile/save`, formData);
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
