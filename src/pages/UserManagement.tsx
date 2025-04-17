
import { useState, useEffect, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserTable, { User } from "@/components/users/UserTable";
import UserForm from "@/components/users/UserForm";
import DeleteUserDialog from "@/components/users/DeleteUserDialog";
import { getUsers, createUser, updateUser, deleteUser } from "@/services/userService";

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedUsers = await getUsers();
      setUsers(loadedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAddUser = async (userData: Omit<User, "id" | "dateCreated">) => {
    try {
      const newUser = await createUser(userData);
      setUsers((prevUsers) => [...prevUsers, newUser]);
      toast({
        title: "Success",
        description: `${userData.name} has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsEditUserOpen(true);
    }
  };

  const handleUpdateUser = async (userData: Omit<User, "id" | "dateCreated">) => {
    if (!selectedUser) return;

    try {
      const updatedUser = await updateUser(selectedUser.id, userData);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === selectedUser.id ? updatedUser : user))
      );
      toast({
        title: "Success",
        description: `${userData.name} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDeleteUserOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id));
      toast({
        title: "Success",
        description: `${selectedUser.name} has been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteUserOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <Button onClick={() => setIsAddUserOpen(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Organization Users</h2>
                  <p className="text-muted-foreground">
                    Manage users and their permissions within your organization
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <UserTable
                  users={users}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteClick}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add User Form */}
        <UserForm
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          onSubmit={handleAddUser}
          title="Add New User"
        />

        {/* Edit User Form */}
        {selectedUser && (
          <UserForm
            isOpen={isEditUserOpen}
            onClose={() => {
              setIsEditUserOpen(false);
              setSelectedUser(null);
            }}
            onSubmit={handleUpdateUser}
            defaultValues={selectedUser}
            title="Edit User"
          />
        )}

        {/* Delete User Confirmation */}
        {selectedUser && (
          <DeleteUserDialog
            isOpen={isDeleteUserOpen}
            onClose={() => {
              setIsDeleteUserOpen(false);
              setSelectedUser(null);
            }}
            onConfirm={handleDeleteConfirm}
            userName={selectedUser.name}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default UserManagement;
