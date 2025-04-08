import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Laptop,
  Menu,
  User,
  LogOut,
  X,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 w-full border-b border-border bg-background/80 backdrop-blur-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-semibold animate-fade-in"
          >
            <Laptop className="h-6 w-6" />
            <span>LMS Portal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center animate-fade-in">
            <Link
              to="/courses"
              className="text-foreground/70 hover:text-foreground transition-colors duration-200"
            >
              Courses
            </Link>
            
            {user ? (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className="text-foreground/70 hover:text-foreground transition-colors duration-200"
                >
                  {isAdmin ? "Admin" : "Dashboard"}
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/login">Log in</Link>
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-md p-2 text-foreground"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/courses"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
              onClick={toggleMobileMenu}
            >
              Courses
            </Link>
            
            {user ? (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                  onClick={toggleMobileMenu}
                >
                  {isAdmin ? "Admin" : "Dashboard"}
                </Link>
                
                <button
                  className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block w-full px-3 py-2 rounded-md text-base font-medium bg-accent text-center"
                onClick={toggleMobileMenu}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
