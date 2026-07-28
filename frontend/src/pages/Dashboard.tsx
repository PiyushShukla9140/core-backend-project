import DashboardHeader from "@/components/dashboard/dashboardHeader";
import StatsCards from "@/components/dashboard/statsCard";
import DashboardTable from "@/components/dashboard/dashboardTable";

const Dashboard = () => {
  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      <DashboardHeader />
      <StatsCards />
      <DashboardTable />
    </div>
  );
};

export default Dashboard;