import React from 'react';
import { useUser } from "@clerk/clerk-react";

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import UserProfileContent from "./UserProfileContent";

const UserProfilePage = () => {

const user= useUser();
    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#4a4a4a' }}>
                    Welcome, {user?.firstName || 'User'}
                </Typography>
                <UserProfileContent />
            </Box>
        </Container>
    );
};

export default UserProfilePage;
