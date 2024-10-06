"use client";

import { NeighborhoodProvider } from "@/components/providers/neighborhood-provider";
import MapComponent from "@/components/ui/map";
import MapSidebar from "@/components/ui/map-sidebar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Map() {
  return (
    <div className="gap-4">
      <div className={"flex w-full h-full"}>
        <NeighborhoodProvider>
          <div className={"w-full bg-red-50"}>
            <MapComponent />
          </div>

          <MapSidebar />
        </NeighborhoodProvider>
      </div>
    </div>
  );
}
