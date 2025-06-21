
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (!error && data) {
        setIsAdmin(true);
      }
    } catch (error) {
      // Silently fail - user is not admin
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out!");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-emerald-600">
              WanderLust
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <a href="#destinations" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Destinations
            </a>
            <a href="#packages" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Packages
            </a>
            <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors">
              About
            </a>

            {/* Authentication Section */}
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {getUserInitials(user.email || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="text-emerald-600 border-emerald-600 hover:bg-emerald-50">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-emerald-600 focus:outline-none focus:text-emerald-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <a
                href="#destinations"
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Destinations
              </a>
              <a
                href="#packages"
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Packages
              </a>
              <a
                href="#about"
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
              
              {/* Mobile Authentication */}
              <div className="border-t border-gray-200 pt-4 pb-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Signed in as {user.email}
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="block px-3 py-2 text-emerald-600 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
