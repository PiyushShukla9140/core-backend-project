import type { User } from "@/types/user.types";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

interface ProfileOverviewProps {
    user: User;
}

const ProfileOverview = ({
    user,
}: ProfileOverviewProps) => {
    return (
        <Card className="overflow-hidden">

            <CardContent className="p-0">

                {/* Cover */}

                {user.coverImage ? (
                    <img
                        src={user.coverImage}
                        alt={`${user.fullName} cover`}
                        className="h-48 w-full object-cover"
                    />
                ) : (
                    <div className="flex h-48 items-center justify-center bg-muted">
                        <p className="text-sm text-muted-foreground">
                            No cover image uploaded.
                        </p>
                    </div>
                )}

                {/* Avatar */}

                <div className="relative -mt-16 ml-8">
                    {user.avatar?
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
                    />:<div className="flex h-48 items-center justify-center bg-muted">
                        <p className="text-sm text-muted-foreground">
                            No avatar uploaded.
                        </p>
                    </div>}
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