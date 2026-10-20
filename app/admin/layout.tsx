
import type { ReactNode } from "react";
import AdminIdleLogout from "@/components/admin/AdminIdleLogout";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <AdminIdleLogout />
      {children}
    </>
  );
}
