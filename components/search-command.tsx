"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearch } from "@/hooks/use-search";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const documents = useQuery(api.documents.getSearch);
  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, [toggle]);

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`Search ${user?.fullName || user?.username}'s Notion...`}
      />
      <CommandList>No results found</CommandList>
      <CommandGroup heading="Documents">
        {documents?.map((document) => (
          <CommandItem
            key={document._id}
            value={`${document._id}-${document.title}`}
            title={document.title}
            onSelect={onSelect}
          >
            {document.icon ? (
              <p className="mr-2 text-[18px]">{document.icon}</p>
            ) : (
              <File className="mr-2 h-4 w-4" />
            )}
            <span>{document.title}</span>
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandDialog>
  );
};
