"use client";

import { WorkspaceModel } from "@/lib/db";
import { Card, CardHeader, CardDescription, CardContent } from "@hexa/ui/card";
import { BarChart2Icon, GlobeIcon, Link2Icon } from "@hexa/ui/icons";
import { Badge } from "@hexa/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@hexa/ui/avatar";
import { useSession } from "@/providers/session-provider";
import { getAvatarFallbackUrl } from "@/lib/user";
import Link from "next/link";

export function WorkspaceCard({
  workspace: { name, slug },
}: {
  workspace: WorkspaceModel;
}) {
  const { user } = useSession();
  return (
    <Card className="md:max-w-1/3  md:grow-0 grow">
      <Link href={`/${slug}/`}>
        <CardHeader className="flex flex-row justify-between items-start">
          <div className="flex flex-shrink-0 flex-row items-top gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={user?.avatarUrl!}
                alt={user?.name || "User Profile Picture"}
              />
              <AvatarFallback delayMs={200}>
                <Avatar>
                  <AvatarImage
                    src={getAvatarFallbackUrl(user)}
                    alt={user?.name || "User Fallback Profile Picture"}
                  />
                </Avatar>
              </AvatarFallback>
            </Avatar>
            <CardDescription>{name}</CardDescription>
          </div>
          <Badge
            className="!mt-0"
            onClick={(e) => {
              e.preventDefault();
              console.log("plan");
            }}
          >
            Plan
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <GlobeIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />1
              Domain
            </div>
            <div className="flex items-center">
              <Link2Icon className="mr-1 h-3 w-3" />
              20k Links
            </div>
            <div className="flex items-center">
              <BarChart2Icon className="mr-1 h-3 w-3" />
              10k Views
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
