import { Link } from "react-router-dom"
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  signupSchema,
  type SignupFormData,
} from "@/schemas/auth.schema";

import{
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/components/ui/card"

import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {Eye,EyeOff} from "lucide-react"
import { Controller } from "react-hook-form";
import { Button } from "../ui/button";

import authService from "@/services/authService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpForm = ()=> {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    // these are the states for the password visibility

    // Now the states for the image preview on the sign up form 
    const[avatarPreview, setAvatarPreview] = useState<string|null>(null)
    const[coverImagePreview, setcoverImagePreview] = useState<string|null>(null)

    const navigate = useNavigate()

    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),

        mode: "onTouched",

        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",

            avatar: undefined,

            coverImage: undefined,
        },
    });
    const onSubmit = async (
        data: SignupFormData
        ) => {

        // Next step:
        // authService.signup(...)
        try{
            const formData = new FormData

            formData.append(
                "fullName",
                data.fullName
            );
            formData.append(
                "username",
                data.username
            );
            formData.append(
                "email",
                data.email
            );

            formData.append(
                "password",
                data.password
            );

            formData.append(
                "avatar",
                data.avatar
            );

            if(data.coverImage) {
                formData.append(
                    "coverImage",
                    data.coverImage
                );
            }
             await authService.signup(formData);

                toast.success(
                "Account created successfully!"
                );

                form.reset();

                navigate("/login");
        }catch(error){
            let message =
                "Account creation failed";

            if (axios.isAxiosError(error)) {
                message =
                error.response?.data?.message ??
                message;
            }

            toast.error(message);
        }


    };



  return (
    <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-md w-full">
        <Card className="w-full shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl">
              Create Account
            </CardTitle>

            <CardDescription>
              Join our platform and start sharing videos.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">

            <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                    Account Information
                </h3>

                <p className="text-sm text-muted-foreground">
                    Enter your basic account details.
                </p>
            </div>

            {/* Full name field */}
            <FormField
                control ={form.control}
                name ="fullName"
                render ={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>

                    <FormControl>
                        <Input
                        placeholder="Enter your full name"
                        autoComplete="name"
                        {...field}
                        />
                    </FormControl>

                    <FormMessage />
                    </FormItem>
                )}
            />

            {/* Username field */}
            <FormField
                control={form.control}
                name = "username"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>

                        <FormControl>
                            <Input
                            placeholder="Choose a username"
                            autoComplete="username"
                            {...field}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Email field */}
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

            {/* Security Section */}
            <div className="space-y-1 pt-2">
                <h3 className="text-lg font-semibold">
                    Security 
                </h3>
                <p className="text-sm text-muted-foreground">
                    Create a secure Password for your account
                </p>

            </div>

            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>

                    <FormControl>
                        <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="new-password"
                            className="pr-10"
                            {...field}
                        />

                        <button
                            type="button"
                            onClick={() =>
                            setShowPassword((prev) => !prev)
                            }
                            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                            aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                            }
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

            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Confirm Password</FormLabel>

                    <FormControl>
                        <div className="relative">
                        <Input
                            type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                            }
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            className="pr-10"
                            {...field}
                        />

                        <button
                            type="button"
                            onClick={() =>
                            setShowConfirmPassword(
                                (prev) => !prev
                            )
                            }
                            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                            aria-label={
                            showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                        >
                            {showConfirmPassword ? (
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

            {/* File upload section */}
            <div className="space-y-1 pt-2">
                <h3 className="text-lg font-semibold">
                    Profile Images
                </h3>
                <p className="text-sm text-muted-foreground">
                    Upload an avatar and an optional cover image.

                </p>
            </div>
            {/* Avatar upload mandatory */}
            {/* But file inputs are different because the browser controls their value.
            Controller gives us full control over onChange 
            so we can store the selected File object in React Hook Form */}
            <FormField
                control={form.control}
                name="avatar"
                render={({ field, fieldState }) => (
                    <FormItem>
                    <FormLabel>Avatar *</FormLabel>

                    <FormControl>
                        <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if(!file) return;

                            field.onChange(file)

                            setAvatarPreview(
                                URL.createObjectURL(file)
                            )
                        }}
                        />
                        
                    </FormControl>
                    {avatarPreview && (
                            <img
                                src={avatarPreview}
                                alt="Avatar Preview"
                                className="mt-3 h-24 w-24 rounded-full object-cover border"
                            />
                    )}

                    
                    <FormMessage/>
                    </FormItem>
                )}
             />
            {/* CoverImage  upload optional */}
            <FormField
                control={form.control}
                name="coverImage"
                render={({ field, fieldState }) => (
                    <FormItem>
                    <FormLabel>Cover Image</FormLabel>

                    <FormControl>
                        <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0]

                            if(!file) return;

                            field.onChange(file)

                            setcoverImagePreview(
                                URL.createObjectURL(file)
                            )
                        }}
                        />
                        
                    </FormControl>
                    {coverImagePreview &&
                         <img
                                src={coverImagePreview}
                                alt="Cover Image Preview"
                                className="mt-3 h-24 w-24 rounded-full object-cover border"
                            />
                        }

                    <FormMessage/>
                        
                    </FormItem>
                )}
            />

            <Button 
             type="submit"
             className="w-full"
             disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting?"Creating Account...":
                "Create Account"}
            </Button>




                
            

          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

export default SignUpForm