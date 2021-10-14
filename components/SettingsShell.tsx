import { CodeIcon, CreditCardIcon, KeyIcon, UserGroupIcon, UserIcon } from "@heroicons/react/solid";
import React from "react";

import NavTabs from "./NavTabs";

export default function SettingsShell({ children }: { children: React.ReactNode }) {
  const tabs = [
    {
      name: "Profil",
      href: "/settings/profile",
      icon: UserIcon,
    },
    {
      name: "Securité",
      href: "/settings/security",
      icon: KeyIcon,
    },
    { name: "Intégration & Webhooks", href: "/settings/embed", icon: CodeIcon },
    {
      name: "Équipes",
      href: "/settings/teams",
      icon: UserGroupIcon,
    },
    {
      name: "Abonnement",
      href: "/settings/billing",
      icon: CreditCardIcon,
    },
  ];

  return (
    <>
      <div className="sm:mx-auto">
        <NavTabs tabs={tabs} />
      </div>
      <main className="max-w-4xl">{children}</main>
    </>
  );
}
