import React, { useEffect, useState } from "react";
import axios from "axios";


function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");
        setProfile(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred");
      }
    };

    fetchProfile();
  }, []);
  const api = axios.create({
    baseURL: "http://localhost:5000", 
    withCredentials: true, 
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : profile ? (
        <div className="bg-white p-6 rounded shadow-md w-80 text-center">
          <p className="text-lg font-semibold">Welcome, {profile.user.username}!</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;