import React from "react";
import { useAuth } from "../Context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading...</p>; // or redirect to login
  }

  return (
    <h1>Welcome {user.first_name}</h1>
  );
}

export default Dashboard