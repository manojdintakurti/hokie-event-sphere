import React, { useState, useEffect } from "react";
import { useUser } from '@clerk/clerk-react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import UserProfileContent from "./UserProfileContent";
import axios from "axios";
const ProfileDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    country: "",
    language: "",
    emailAddresses: "",
    phoneNumber: "",
    interests: [],
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });
  const { isSignedIn, user } = useUser();
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                if (!isSignedIn) return;
                const userEmail = user?.primaryEmailAddress?.emailAddress;
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/events/profile`, {
                    params: { email: userEmail },
                });
                const profileData = response.data;
                const isProfileComplete = profileData && profileData.address && profileData.interests && profileData.interests.length > 0;

                if (!isProfileComplete) {
                    setOpen(true);
                } else {
                    setFormData(profileData);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // Profile not found, open the profile completion dialog
                    setOpen(true);
                } else {
                    console.error('Error fetching profile data:', error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [isSignedIn, user]);

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Please update your Profile</DialogTitle>
      <DialogContent>
        {/* Pass handleClose as onSave to UserProfileContent */}
        <UserProfileContent
          formData={formData}
          setFormData={setFormData}
          onSave={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
