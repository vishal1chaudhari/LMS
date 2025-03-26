
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "student";
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: "admin" | "student") => Promise<void>;
  isAdmin: boolean;
};

// Mock user data for demo
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    password: "admin123",
    role: "admin" as const,
  },
  {
    id: "2",
    email: "student@example.com",
    name: "Student User",
    password: "student123",
    role: "student" as const,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("lms-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("lms-user", JSON.stringify(userWithoutPassword));
        
        // Redirect based on role
        if (userWithoutPassword.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${userWithoutPassword.name}!`,
        });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: "admin" | "student") => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      
      // In a real app, we would make an API call to register the user
      // For this demo, we'll just pretend it worked and log them in
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
      };
      
      setUser(newUser);
      localStorage.setItem("lms-user", JSON.stringify(newUser));
      
      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lms-user");
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
