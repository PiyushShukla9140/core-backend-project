import useCurrentUser from "@/hooks/useCurrentUser";
import ProfileOverview from "@/components/settings/profileOverview";

import AccountInformation from "@/components/settings/accountInfo";

import AvatarCard from "@/components/settings/avatarCard";

import CoverImageCard from "@/components/settings/coverImageCard";





const Settings = () => {
    
    const {
    user,
    loading,
    error,
    refetch
} = useCurrentUser();




if (loading) {
    return <div>Loading...</div>;
}

if (error) {
    return <div>{error}</div>;
}
if (!user) {
    return <div>User not found.</div>;
}
    return (
        <div className="container mx-auto max-w-5xl py-8 space-y-6">

            <div>
                <h1 className="text-3xl font-bold">
                    Settings
                </h1>

                <p className="text-muted-foreground mt-1">
                    Manage your account settings and profile.
                </p>
            </div>

            <ProfileOverview user={user} />

            <AccountInformation user={user} refetch={refetch} />

            <AvatarCard user={user} refetch={refetch}/>
 
            <CoverImageCard user={user} refetch={refetch}/>

        </div>
        
    );
};

export default Settings;