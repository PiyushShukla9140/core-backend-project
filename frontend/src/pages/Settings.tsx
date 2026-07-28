import useCurrentUser from "@/hooks/useCurrentUser";
import ProfileOverview from "@/components/settings/profileOverview";




const Settings = () => {
    const {
    user,
    loading,
    error,
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
        <div className="container mx-auto max-w-5xl py-8">
            <ProfileOverview user={user}/>
        </div>
        
    );
};

export default Settings;