
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
    <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              Unplanned Diaries
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#destinations" className="text-white hover:text-emerald-300 transition-colors">
              Destinations
            </a>
            <Link to="/group-trips" className="text-white hover:text-emerald-300 transition-colors">
              Group Trips
            </Link>
            <a href="#packages" className="text-white hover:text-emerald-300 transition-colors">
              Tour Packages
            </a>
            <a href="#contact" className="text-white hover:text-emerald-300 transition-colors">
              Contact
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
                <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
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
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-full">
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-emerald-500 text-white hover:bg-emerald-600 px-6 py-2 rounded-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-emerald-300 focus:outline-none focus:text-emerald-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white/20 backdrop-blur-md rounded-lg mt-2 p-4">
            <div className="space-y-3">
              <a
                href="#destinations"
                className="block px-3 py-2 text-white hover:text-emerald-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Destinations
              </a>
              <Link
                to="/group-trips"
                className="block px-3 py-2 text-white hover:text-emerald-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Group Trips
              </Link>
              <a
                href="#packages"
                className="block px-3 py-2 text-white hover:text-emerald-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Tour Packages
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 text-white hover:text-emerald-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>
              
              {/* Mobile Authentication */}
              <div className="border-t border-white/20 pt-4 space-y-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-white/80">
                      Signed in as {user.email}
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-3 py-2 text-white hover:text-emerald-300 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-2 text-white hover:text-emerald-300 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <Link
                      to="/auth"
                      className="flex-1 text-center bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/auth"
                      className="flex-1 text-center bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
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
