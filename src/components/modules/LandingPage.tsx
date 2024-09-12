import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const LandingPage = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Retrieve the user's name from local storage
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg text-center">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome{" "}
          {userName ? (
            <span className="text-blue-500">{userName}</span>
          ) : (
            "to Productivity 7 (PRO7)"
          )}
        </h1>
        <p className="text-gray-700 mb-6">
          Your all-in-one solution for personal and professional growth. Track
          your activities, manage your finances, and stay motivated.
        </p>
        <Button className="bg-blue-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
