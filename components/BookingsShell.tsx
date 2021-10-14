import React from "react";

import NavTabs from "./NavTabs";

export default function BookingsShell({ children }: { children: React.ReactNode }) {
  const tabs = [
    {
      name: "À venir",
      href: "/bookings/upcoming",
    },
    {
      name: "Passé",
      href: "/bookings/past",
    },
    {
      name: "Annulé",
      href: "/bookings/cancelled",
    },
  ];

  return (
    <>
      <NavTabs tabs={tabs} linkProps={{ shallow: true }} />
      <main>{children}</main>
    </>
  );
}
