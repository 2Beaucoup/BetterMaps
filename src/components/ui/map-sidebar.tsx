"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import { useNeighborhood } from "../providers/neighborhood-provider";
import normalizedFoodDesertnessScores, {
  neighborhoodIncome,
} from "@/lib/food-desert-metric";

import { H2, H3, H4, P } from "./typography";
import { Separator } from "./separator";
import { Input } from "./input";
import { FormEvent, useState } from "react";
import { Button } from "./button";

const Attribute = ({ label, value }: { label: string; value: string }) => (
  <div className={"flex flex-col gap-2 w-full"}>
    <p>{label}</p>
    <b className={"w-full p-2 rounded-md bg-muted h-10"}>{value}</b>
  </div>
);
export default function MapSidebar() {
  const { neighborhood } = useNeighborhood();

  const sendMessageToLLM = async (message: string) => {
    // clear coach message

    if (!message) return;
    if (generating) return;

    setGenerating(true);
    setCoachMessage("");

    try {
      console.log(`Sending message to LLM: ${message}`);

      const response = await fetch("/api/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, neighborhood }),
      });

      const data = await response.text();

      console.log("Data:", data);

      setCoachMessage(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error);
    } finally {
      setGenerating(false);
    }
  };

  const submitMessage = (e: FormEvent) => {
    e.preventDefault();

    if (!message) return;
    if (generating) return;

    console.log(message);

    sendMessageToLLM(message);

    setMessage("");
  };

  const [message, setMessage] = useState("");
  const [coachMessage, setCoachMessage] = useState("");
  const [generating, setGenerating] = useState(false);

  const income = neighborhoodIncome[neighborhood as string];
  const foodDesertScore =
    normalizedFoodDesertnessScores[neighborhood as string];

  return (
    <Dialog>
      <DialogContent className={"max-w-3xl min-h-[300px] w-full"}>
        <DialogHeader>
          <DialogTitle>Talk with a resident</DialogTitle>
        </DialogHeader>
        <div className={"flex gap-4 bg-muted"}>
          <div
            className={"flex flex-col justify-center text-sm self-start gap-2"}
          >
            <div className={""}>
              <P className={"font-semibold"}>Newton Isaac</P>
            </div>

            <P className={"text-neutral-900"}>
              {coachMessage ||
                `Ask me anything about ${neighborhood ? neighborhood : "Chicago"}! I'll help you out.`}
            </P>
          </div>
        </div>

        <form onSubmit={submitMessage}>
          <Input
            disabled={generating}
            type={"text"}
            placeholder={"Type your message here"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={
              "bg-neutral-200 text-neutral-900 placeholder-neutral-500"
            }
          />
        </form>
      </DialogContent>
      <div
        className={
          "min-w-[350px] border h-screen top-0 right-0 p-6 flex flex-col gap-4"
        }
      >
        <div className={"flex flex-col gap-4"}>
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

            <b className={"w-full p-2 rounded-md bg-muted h-10"}>
              {foodDesertScore ? foodDesertScore.toFixed(2) : ""}
            </b>
          </div>
          <Attribute
            label="Change in AQD Score (2005-2021)"
            value={"-50.7316%"}
          />

          <Separator />

          <H4 className={"text-neutral-800"}>💬 Chat with a resident</H4>

          <div
            className={
              "bg-neutral-100 rounded-lg p-4 h-full w-full flex-1 flex flex-col gap-4 col-span-2"
            }
          >
            <div className={"flex gap-4"}>
              <div
                className={
                  "flex flex-col justify-center text-sm self-start gap-2"
                }
              >
                <div className={""}>
                  <P className={"font-semibold"}>Newton Isaac</P>
                </div>

                <P className={"text-neutral-900"}>
                  {coachMessage ||
                    `Ask me anything about ${neighborhood ? neighborhood : "Chicago"}! I'll help you out.`}
                </P>
              </div>
            </div>

            <form onSubmit={submitMessage}>
              <Input
                disabled={generating}
                type={"text"}
                placeholder={"Type your message here"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={
                  "bg-neutral-200 text-neutral-900 placeholder-neutral-500"
                }
              />
            </form>
          </div>

          <Separator />

          <DialogTrigger>Chat with a resident from China Town</DialogTrigger>
        </div>
      </div>
    </Dialog>
  );
}
