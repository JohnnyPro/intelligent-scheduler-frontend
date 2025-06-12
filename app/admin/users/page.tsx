"use client";

import { useState } from "react";
import { Role } from "@/lib/types/users.types";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Plus, Search, Trash2, User, UserCog, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/lib/stores/auth-store";
import { useUserStore } from "@/lib/stores/user.store";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete";
import { User as UserType, UserCreating } from "@/lib/types/users.types";

export default function UsersPage() {
  const { isAuthenticated } = useAuthStore();

  const { users, fetchUsers, addUser, updateUser, deleteUser } = useUserStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const initialFormData: UserCreating = {
    firstName: "",
    lastName: "",
    email: "",
    role: Role.ADMIN,
    password: "",
    phone: undefined,
    needWheelchairAccessibleRoom: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  const router = useRouter();
  const roles = Object.values(Role);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    addUser({ ...formData, password });
    resetFormData();
    setIsAddDialogOpen(false);
  };

  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  useEffect(() => {
    let newFiltered = users.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (roleFilter === 'all' || user.role === roleFilter)
    );
    setFilteredUsers(newFiltered);
  }, [searchQuery, roleFilter, users]);

  const handleEditUser = () => {
    if (selectedUser) {
      updateUser(selectedUser, formData);
      setIsEditDialogOpen(false);
    }
  };

  const openConfirmDeleteDialog = (id: string) => {
    setSelectedUser(id);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser);
    }
  };

  const resetFormData = () => {
    setFormData(initialFormData);
    setSelectedUser(null);
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const openEditDialog = (id: string) => {
    const user = users.find((u) => u.userId === id);
    if (user) {
      setSelectedUser(id);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        password: "",
        phone: user.phone || undefined,
        needWheelchairAccessibleRoom: user.needWheelchairAccessibleRoom || false,
      });
      setIsEditDialogOpen(true);
    }
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return <UserCog className="w-4 h-4" />;
      case Role.TEACHER:
        return <UserPlus className="w-4 h-4" />;
      case Role.STUDENT:
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "bg-purple-100 text-purple-600";
      case Role.TEACHER:
        return "bg-blue-100 text-blue-600";
      case Role.STUDENT:
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <DashboardLayout title="Users">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground text-sm">Manage user accounts and permissions</p>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full pl-10 py-2 rounded-md border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select onValueChange={(val) => setRoleFilter(val)} value={roleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table Section */}
        <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>USER</TableHead>
                <TableHead>ROLE</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>ACCESSIBILITY</TableHead>
                <TableHead>LAST UPDATED</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.userId} className="hover:bg-muted/40">
                  <TableCell className="flex items-center gap-3 font-medium">
                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-md ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                    </span>
                    <div>
                      <div className="font-semibold leading-tight">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-muted-foreground">ID: {user.userId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.needWheelchairAccessibleRoom ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium">
                        Requires Accessible Room
                      </span>
                    ) : <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                        Not Required
                      </span>}
                  </TableCell>
                  <TableCell>
                    {new Date(user.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="edit"
                        size="icon"
                        className="hover:bg-indigo-100"
                        onClick={() => openEditDialog(user.userId)}
                        aria-label="Edit"
                      >
                        <Edit color="currentColor" className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="delete"
                        size="icon"
                        className="hover:bg-red-100"
                        onClick={() => openConfirmDeleteDialog(user.userId)}
                        aria-label="Delete"
                      >
                        <Trash2 color="currentColor" strokeWidth={2} className="w-5 h-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetFormData();
        }
      }}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? 'Add New User' : 'Edit User'}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (isAddDialogOpen) handleAddUser();
              if (isEditDialogOpen) handleEditUser();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 mt-5">
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="e.g., John"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="e.g., Doe"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., john.doe@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +1234567890"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={value => setFormData({ ...formData, role: value as Role })}
                  required
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isAddDialogOpen && (
                <>
                  <div className="space-y-2 flex flex-col gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 flex flex-col gap-3">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                    {passwordError && (
                      <span className="text-red-500 text-sm">{passwordError}</span>
                    )}
                  </div>
                </>
              )}
              <div className="flex items-center gap-2 md:col-span-2 pt-2">
                <Checkbox
                  id="needWheelchairAccessibleRoom"
                  checked={formData.needWheelchairAccessibleRoom}
                  onCheckedChange={checked => setFormData({ ...formData, needWheelchairAccessibleRoom: checked === true })}
                />
                <Label htmlFor="needWheelchairAccessibleRoom" className="text-sm font-medium">
                  Requires Wheelchair Accessible Room
                </Label>
              </div>
            </div>
            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isAddDialogOpen && password !== confirmPassword}
              >
                {isAddDialogOpen ? 'Create User' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={isConfirmDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        onOpenChange={setIsConfirmDeleteDialogOpen}
      />
    </DashboardLayout>
  );
}
