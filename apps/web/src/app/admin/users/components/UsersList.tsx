'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/table";
import { Card } from "@/ui/components/card";
import { format } from "date-fns";
import { fetchAllUsers } from "@/lib/api";
import { Skeleton } from "@/ui/components/skeleton";
import { useEffect, useState } from "react";
import { User } from "@/types/users";

export function UsersList() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <div className="p-4">
          <Skeleton className="h-8 w-full max-w-sm mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
