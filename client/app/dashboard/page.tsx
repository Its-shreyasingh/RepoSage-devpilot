"use client";

import { UserButton } from "@/components/user-button";
import { useCurrentUser } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-14 items-center justify-between border-b border-border/70 px-4">
        <span className="font-heading text-sm font-medium">
          {isLoading
            ? "Loading..."
            : user
              ? `Hi, ${user.displayName || user.githubUsername}`
              : "RepoSage"}
        </span>
        <UserButton />
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          DashboardPage
        </h1>
      </main>
    </div>
  );
}