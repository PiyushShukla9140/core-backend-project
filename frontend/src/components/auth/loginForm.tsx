import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginSchema,
  type LoginFormData,
} from "@/schemas/auth.schema";
import { Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useNavigate } from "react-router-dom";

import authService from "@/services/authService";

import { useAppDispatch } from "@/store/hooks";

import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/features/auth/authSlice";

import { toast } from "sonner";



const LoginForm = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // these hooks will be used in authentication flow 

  const [showPassword, setShowPassword] = useState(false);
  // will be used in toggling the visibility of password

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // We have updated the useForm here because now 
  // we can do form.handleSubmit form.comtrol etc through one object only

  const onSubmit = async (
        data: LoginFormData
      ) => {
        try {
          dispatch(loginStart());

          const response =
            await authService.login(data);

          dispatch(
            loginSuccess({
              user: response.data.user,
              accessToken:
                response.data.accessToken,
            })
          );

          form.reset();
          toast.success("Login Successful!");

          navigate("/");
        } catch (error: any) {
           const message =
              error.response?.data?.message ??
              "Login failed";

            dispatch(loginFailure(message));

            toast.error(message);
          }
      };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md w-full"
      >
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl">
              Welcome Back
            </CardTitle>

            <CardDescription>
              Sign in to continue to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>

                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="pr-10"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Signing In..."
                : "Sign In"}
            </Button>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default LoginForm;