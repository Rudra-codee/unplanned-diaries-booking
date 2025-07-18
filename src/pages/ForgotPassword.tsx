
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail, CheckCircle, Clock } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const startCooldown = (seconds: number) => {
    setIsRateLimited(true);
    setCooldownTime(seconds);
    
    const timer = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRateLimited(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const extractWaitTime = (errorMessage: string): number => {
    const match = errorMessage.match(/(\d+)\s+seconds?/);
    return match ? parseInt(match[1]) : 30;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (isRateLimited) {
      toast.error(`Please wait ${cooldownTime} seconds before trying again`);
      return;
    }

    setLoading(true);

    try {
      // Use production URL for password reset redirect
      const isProduction = window.location.hostname !== 'localhost';
      const redirectUrl = isProduction 
        ? 'https://unplanned-diaries-booking.vercel.app/reset-password'
        : `${window.location.origin}/reset-password`;
      
      console.log('Sending reset email with redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        console.error("Password reset error:", error);
        
        // Handle rate limiting specifically
        if (error.message.includes("For security purposes") && error.message.includes("seconds")) {
          const waitTime = extractWaitTime(error.message);
          startCooldown(waitTime);
          toast.error(`Too many requests. Please wait ${waitTime} seconds before trying again.`);
        } else if (error.message.includes("rate")) {
          toast.error("Too many password reset requests. Please try again in a few minutes.");
          startCooldown(60); // Default 1 minute cooldown
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      } else {
        setEmailSent(true);
        toast.success("If this email is registered, a reset link has been sent.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-600">
              If an account with <strong>{email}</strong> exists, we've sent you a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-sm text-gray-500">
              <p>Didn't receive the email? Check your spam folder or wait a few minutes before trying again.</p>
              <Button
                variant="link"
                className="p-0 h-auto text-emerald-600 hover:text-emerald-700 mt-2"
                disabled={isRateLimited}
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
              >
                {isRateLimited ? `Try again in ${cooldownTime}s` : "Try again"}
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <Link 
                to="/auth" 
                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <Link 
            to="/auth" 
            className="absolute left-4 top-4 p-2 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {isRateLimited && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700">
                  Please wait {cooldownTime} seconds before trying again
                </span>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors" 
              disabled={loading || isRateLimited}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isRateLimited ? `Wait ${cooldownTime}s` : "Send Reset Link"}
            </Button>
            
            <div className="text-center">
              <Link 
                to="/auth" 
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Remember your password? Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
