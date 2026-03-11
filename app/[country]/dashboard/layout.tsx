import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - StayBuddy",
  description: "Manage your properties and bookings",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
