

import type { User } from "@/types/user.types";
import { updateCurrentUser } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useState,useEffect} from "react";
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

import type { AccountFormData } from "@/schemas/account.schema";

import { accountSchema } from "@/schemas/account.schema";

import { Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage} from "../ui/form";
import { Input } from "../ui/input";
import settingService from "@/services/settingService";
import axios from "axios";
import { toast } from "sonner";

interface AccountInformationProps {
    user: User;
    refetch: () => Promise<void>;
}

const AccountInformation = ({ user, refetch}: AccountInformationProps) => {
    const dispatch = useDispatch()
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
        defaultValues: {
            fullName: user.fullName,
            username: user.username,
            email: user.email,
        },
    });
    useEffect(() => {
        form.reset({
            fullName: user.fullName,
            username: user.username,
            email: user.email,
        });
    }, [user, form]);

    const onSubmit = async(values: AccountFormData) => {
        const normalizedUsername = values.username.trim().toLowerCase();

        const hasChanges =
            values.fullName.trim() !== user.fullName ||
            values.email.trim() !== user.email ||
            normalizedUsername !== user.username;

        if (!hasChanges) {
            toast.info("No changes to save.");
            setIsEditing(false);
            return;
        }
        try{
            setIsSaving(true)

            const response = await settingService.updateAccount(
                {
                    ...values,
                username: normalizedUsername,
                }
            )
            toast.success(response.message)
            dispatch(updateCurrentUser(response.data));

            

            await refetch()
            setIsEditing(false)
        }catch(error){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "Failed to update account."
                )
            }else{
                toast.error("Something went wrong.");
            }

        }finally{
            setIsSaving(false)
        }
    };
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Account Information</CardTitle>

                    <CardDescription>
                        View and update your account details.
                    </CardDescription>
                </div>

                {!isEditing ? (
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                form.reset();
                                setIsEditing(false);
                            }}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            form="account-form"
                            disabled={isSaving}
                        >
                            {isSaving?"Saving...":"Save Changes"}
                        </Button>
                    </div>
                )}
            </CardHeader>

            <CardContent className="space-y-6">
                

                {isEditing ? (
                    <div>
                        <Form {...form}>
                            <form
                                id="account-form"
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >

                                {/* fields */}
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>

                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input{...field}/>
                                            </FormControl>

                                            <FormDescription>
                                                Usernames are stored in lowercase and must be unique.
                                            </FormDescription>

                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled
                                                />
                                            </FormControl>

                                            <FormDescription>
                                                Email cannot be changed
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />


                            </form>
                        </Form>
                    </div>
                ) : (
                    <>
                        {/* Your current read-only UI */}
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Full Name
                            </p>

                            <p className="text-base font-medium">
                                {user.fullName}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Username
                            </p>

                            <p className="text-base font-medium">
                                @{user.username}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Email
                            </p>

                            <p className="text-base font-medium">
                                {user.email}
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default AccountInformation;


