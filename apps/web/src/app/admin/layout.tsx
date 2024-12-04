import { AdminSidebar } from "@/components/admin/AdminSidebar";
import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "incubatorapp",
  description: "Sports betting competition platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminSidebar />
      {children}
    </div>
  );
}
