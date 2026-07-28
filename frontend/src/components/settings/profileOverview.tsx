import type { User } from "@/types/user.types";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface ProfileOverviewProps {
    user: User;
}

const ProfileOverview = ({
    user,
}: ProfileOverviewProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Settings
                </CardTitle>

                <CardDescription>
                    Manage your account settings and profile.
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0">

                {/* Cover */}

                <div className="relative h-56 overflow-hidden bg-muted">
                    <img
                        src={user.coverImage}
                        alt={`${user.fullName} cover`}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Avatar */}

                <div className="relative -mt-16 ml-8">
                    <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="
                            h-32
                            w-32
                            rounded-full
                            border-4
                            border-background
                            object-cover
                            shadow-lg
                        "
                    />
                </div>

                {/* User */}

                <div className="space-y-2 px-8 pb-8 pt-6">

                    <h2 className="text-3xl font-bold">
                        {user.fullName}
                    </h2>

                    <p className="text-muted-foreground">
                        @{user.username}
                    </p>

                    <p className="text-muted-foreground">
                        {user.email}
                    </p>

                </div>

            </CardContent>
        </Card>
    );
};

export default ProfileOverview;