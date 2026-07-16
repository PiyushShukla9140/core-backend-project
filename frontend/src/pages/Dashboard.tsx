import { Button } from "@/components/ui/button";
import useLogout  from "@/hooks/useLogout";

const Dashboard = () => {
  const logout = useLogout();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Button
        className="mt-6"
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;