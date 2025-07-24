import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail, Sparkles, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Forgot password data:", data);
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Back button */}
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>

          {!isSubmitted ? (
            <>
              {/* Logo/Brand */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Forgot password?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  No worries, we'll send you reset instructions
                </p>
              </div>

              {/* Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className="h-12"
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Reset password"}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/20 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Check your email
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We sent a password reset link to{" "}
                  <span className="font-medium text-foreground">
                    {form.getValues("email")}
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex">
                    <Mail className="w-5 h-5 text-brand-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">
                        Didn't receive the email?
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Check your spam folder, or click below to resend.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => {
                    setIsSubmitted(false);
                    form.reset();
                  }}
                >
                  Resend email
                </Button>
              </div>
            </>
          )}

          {/* Sign in link */}
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-brand-600 hover:text-brand-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Gradient */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 dark:from-brand-950 dark:via-brand-900 dark:to-brand-800">
        <div className="max-w-md text-center">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center">
            <Mail className="w-16 h-16 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Password reset
          </h3>
          <p className="text-muted-foreground">
            Secure password reset process to keep your account safe and get you
            back to using AppStop.pro quickly.
          </p>
        </div>
      </div>
    </div>
  );
}
