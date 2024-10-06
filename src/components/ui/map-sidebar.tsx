"use client";

import { useNeighborhood } from "../providers/neighborhood-provider";

import { H3 } from "./typography";

export default function MapSidebar() {
  const { neighborhood } = useNeighborhood();
  return (
    <div className={"min-w-[350px] border h-screen top-0 right-0 p-4"}>
      <H3>Map Controls</H3>
      <p>Neighborhood: {neighborhood}</p>
    </div>
  );
}
