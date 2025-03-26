
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface LoginFormProps {
  isRegister?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ isRegister = false }) => {
  const { login, register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }
    } catch (error) {
      // Error is handled in the auth context
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glassmorphism rounded-xl shadow-sm p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          {isRegister ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-muted-foreground mt-2">
          {isRegister
            ? "Enter your information to create an account"
            : "Enter your credentials to access your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-base"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-base"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            {!isRegister && (
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-base"
          />
        </div>

        {isRegister && (
          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="role-student"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                  className="mr-2"
                />
                <Label htmlFor="role-student">Student</Label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="role-admin"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className="mr-2"
                />
                <Label htmlFor="role-admin">Admin</Label>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full button-primary py-2 mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              <span>{isRegister ? "Creating account..." : "Logging in..."}</span>
            </div>
          ) : (
            <span>{isRegister ? "Create account" : "Log in"}</span>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        {isRegister ? (
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
