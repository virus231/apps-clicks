import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db";
import { ai } from "./original-titles";


const generateArticle = async (title: string) => {
  const prompt = `Write an article on "${title}" with 1000 words.\n`;

  const {data} = await ai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  return data.choices[0]?.message?.content.trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const regenerateTitles = await prisma.article.findMany({
      select: {
        regenerateTitle: true
      }
    });

    for (const title of regenerateTitles) {
      const article = await generateArticle(title.regenerateTitle || "");
      await prisma.article.upsert({
        where: {
          regenerateTitle: title.regenerateTitle || ""
        },
        update: { description: article },
        create: {
          description: article
        }
      })
    }

    const data = await prisma.article.findMany({
      select: {
        id: true,
        regenerateTitle: true,
        description: true
      }
    });


    res.status(200).json({ data, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Something went wrong." });
  }
}