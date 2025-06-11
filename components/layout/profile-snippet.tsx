import useAuthStore from "@/lib/stores/auth-store";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const ProfileSnippet = () => {
  const { isAuthenticated, logout, user } = useAuthStore();

  return (
    <div className="border-t p-4">
      <div className="flex items-center justify-between">
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
              {user.firstName.at(0)}
              {user.lastName.at(0)}
            </div>
            <div>
              <div className="text-sm font-medium">
                {user.firstName}{" "}
                {user.firstName.length + user.lastName.length > 14
                  ? `${user.lastName.at(0)}.`
                  : user.lastName}
              </div>
              <div className="text-xs text-gray-500">{user.role}</div>
            </div>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={logout} title="Logout">
          <LogOut className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

export default ProfileSnippet;
