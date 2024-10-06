import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

async function completeContextMessage(message: string): Promise<any> {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "" },
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

export async function POST(req: NextRequest, res: NextResponse) {
  const { message } = await req.json();

  if (!message) {
    return new Response("Message is required", { status: 400 });
  }

  const content = await completeContextMessage(message);

  const msg = content.choices[0]?.message?.content || "";

  return new Response(msg, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
