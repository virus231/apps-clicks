import { ai } from "@/pages/api/original-titles";
import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "@/server/db";



const getRegenerateTitles = async (titles: {originalTitle: string}[]) => {
  const prompt = `Regenerate the following h1 titles:\n${titles.join("\n")}\nNew Titles:`;
  const { data } = await ai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  return data.choices[0]?.message?.content.trim().split("\n");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const titles = await prisma.article.findMany({
      select: {
        originalTitle: true
      }
    })

    const { regenerateTitle } = await prisma.article.count({
      select: {
        regenerateTitle: true
      }
    })

    if (regenerateTitle === 0) {
      const listOfRegenerateTitles = await getRegenerateTitles(titles as {originalTitle: string}[]) as string[];

      for (const title of listOfRegenerateTitles) {
        await prisma.article.upsert({
          where: { regenerateTitle: title },
          update: { regenerateTitle: title },
          create: { regenerateTitle: title  },
        });
      }
    }


    const data = await prisma.article.findMany({
      select: {
        id: true,
        regenerateTitle: true
      }
    });

    res.status(200).json({ data, success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: "Something went wrong." });
  }
}