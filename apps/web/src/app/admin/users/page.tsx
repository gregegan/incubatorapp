import { UsersList } from "@/app/admin/users/components/UsersList";

export default function AdminUsers() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            View and manage platform users
          </p>
        </div>

        <UsersList />

      </div>
    </main>
  );
}
