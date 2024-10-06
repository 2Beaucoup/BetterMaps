import axios, { AxiosResponse } from "axios";
import { NextRequest } from "next/server";
import normalizedFoodDesertnessScores, {
  neighborhoodIncome,
} from "@/lib/food-desert-metric";

async function completeContextMessage(
  message: string,
  neighborhood: string,
): Promise<AxiosResponse<unknown, unknown>> {
  const income = neighborhoodIncome[neighborhood];
  const foodDesertnessScore = normalizedFoodDesertnessScores[neighborhood];

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a citizen from Chicago who currently lives in ${neighborhood}. You should know that and be able to provide information about the neighborhood. You will
        make the answers informative but concise. You will also provide information about the neighborhood's income which is ${income} and food desert score which is ${foodDesertnessScore}.
        If there is no income or food desert score, you will not
        Interpret the income and food desert score. You will also provide information about the neighborhood's income which is ${income} and food desert score which is ${foodDesertnessScore}.
        ONLY talk about the selected neighborhood.
        `,
        },
        { role: "user", content: message },
      ],
      stream: false,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}

export async function POST(req: NextRequest) {
  const { message, neighborhood } = await req.json();

  if (!message) {
    return new Response("Message is required", { status: 400 });
  }

  if (!neighborhood) {
    return new Response("Neighborhood is required", { status: 400 });
  }

  const content = await completeContextMessage(message, neighborhood as string);

  if (!content) {
    return new Response("No data received", { status: 500 });
  }

  const msg = content.choices[0].message.content;

  return new Response(msg, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
