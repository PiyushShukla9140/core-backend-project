import { useChannelStats } from "@/hooks/useChannelStats";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const StatsCards = () => {
    const { stats, loading, error } = useChannelStats();

    if (loading) {
        return (
            <div className="text-center py-10">
                Loading statistics...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                {error}
            </div>
        );
    }

    const dashboardStats = [
        {
            title: "Videos",
            value: stats?.totalVideos ?? 0,
            description: "Total uploaded videos",
        },
        {
            title: "Views",
            value: stats?.totalViews ?? 0,
            description: "Total channel views",
        },
        {
            title: "Likes",
            value: stats?.totalLikes ?? 0,
            description: "Total likes received",
        },
        {
            title: "Subscribers",
            value: stats?.totalSubscribers ?? 0,
            description: "Current subscribers",
        },
    ];

    return (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardStats.map((stat) => (
                <Card
                    key={stat.title}
                    className="transition-all duration-200 hover:shadow-md"
                >
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="text-3xl font-bold">
                            {stat.value}
                        </div>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </section>
    );
};

export default StatsCards;