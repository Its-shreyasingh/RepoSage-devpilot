"use client";

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?"
  );
}

export function UserButton() {
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        disabled
        aria-label="Loading user"
      >
        <Spinner />
      </Button>
    );
  }

  if (!user) {
    return null;
  }

  const name = user.displayName || user.githubUsername;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Open user menu"
          />
        }
      >
        <Avatar>
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={name} />}
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Avatar size="lg">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={name} />}
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{name}</span>
            <span className="truncate text-xs text-muted-foreground">
              @{user.githubUsername}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <dl className="flex flex-col gap-1.5 px-3 py-2.5 text-xs">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Display name</dt>
            <dd className="min-w-0 truncate font-medium">{user.displayName}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">GitHub username</dt>
            <dd className="min-w-0 truncate font-mono">{user.githubUsername}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">GitHub ID</dt>
            <dd className="min-w-0 truncate font-mono">{user.githubId}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Account ID</dt>
            <dd className="min-w-0 truncate font-mono" title={user.id}>
              {user.id}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Avatar URL</dt>
            <dd className="min-w-0 truncate font-mono" title={user.avatarUrl ?? "Not set"}>
              {user.avatarUrl ?? "Not set"}
            </dd>
          </div>
        </dl>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          {logout.isPending ? <Spinner /> : <LogOut />}
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}