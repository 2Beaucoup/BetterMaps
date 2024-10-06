"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Image from "next/image";
import { useNeighborhood } from "../providers/neighborhood-provider";
import normalizedFoodDesertnessScores, {
  neighborhoodIncome,
} from "@/lib/food-desert-metric";

import { H2, H3, P } from "./typography";

const Attribute = ({ label, value }: { label: string; value: string }) => (
  <div className={"flex flex-col gap-2 w-full"}>
    <p>{label}</p>
    <b className={"w-full p-2 rounded-md bg-muted"}>{value}</b>
  </div>
);
export default function MapSidebar() {
  const { neighborhood } = useNeighborhood();

  const income = neighborhoodIncome[neighborhood as string];
  const foodDesertScore =
    normalizedFoodDesertnessScores[neighborhood as string];

  return (
    <div
      className={
        "min-w-[350px] border h-screen top-0 right-0 p-4 flex flex-col gap-4"
      }
    >
      <H2>{neighborhood || "Neighborhood Stats"}</H2>

      <H3 className={"text-neutral-500"}>Neighborhood Info</H3>

      <Attribute
        label="Median Household Income"
        value={"$" + (income ? income?.toLocaleString() : "")}
      />

      <div className={"flex flex-col gap-2 w-full"}>
        <div className={"flex gap-2 items-center w-full"}>
          <p>Food Desert Score</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Image
                  src="/icons/info.svg"
                  width={16}
                  height={16}
                  alt="Food Desert Score"
                />
              </TooltipTrigger>
              <TooltipContent className={"max-w-md"}>
                <P>
                  {" "}
                  A higher score indicates worse access to grocery stores,
                  suggesting a higher likelihood of being a food desert.
                </P>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <b className={"w-full p-2 rounded-md bg-muted"}>
          {foodDesertScore ? foodDesertScore.toFixed(2) : ""}
        </b>
      </div>
    </div>
  );
}
