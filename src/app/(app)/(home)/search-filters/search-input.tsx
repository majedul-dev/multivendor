"use client";
import { useState } from "react";

import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoriesSidebar } from "./categories-sidebar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Link from "next/link";

interface props {
  disabled: boolean;
}
export const SearchInput = ({ disabled }: props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC()
  const session = useQuery(trpc.auth.session.queryOptions())
  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8"
          disabled={disabled}
          placeholder="Search products"
        />
      </div>
      <Button
        variant="elevated"
        className="size-12 shrink-0 flex lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
      {session.data?.user && (
        <div className="hidden lg:block">
          <Button
            asChild
            variant="elevated"
          >
            <Link href="/library">
              <BookmarkCheckIcon className="mr-2"/>
              Library
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
