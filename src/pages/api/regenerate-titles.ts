import { ai, BASE_SITE_SCRAP, getOriginalTitles } from "@/pages/api/original-titles";
import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "@/server/db";


const getRegenerateTitles = async (titles: string[]) => {
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
    // const response = await fetch(BASE_SITE_SCRAP);

    // const titles = getOriginalTitles(await response.text());

    // const listOfRegenerateTitles = await getRegenerateTitles(titles) as string[];
    //
    // for (const [index, title] of titles.entries()) {
    //   await prisma.article.upsert({
    //     where: { originalTitle: title || "" },
    //     update: { regenerateTitle: listOfRegenerateTitles[index] },
    //     create: { regenerateTitle: listOfRegenerateTitles[index] },
    //   });
    // }

    const regenerateTitles = await prisma.article.findMany({
      select: {
        id: true,
        regenerateTitle: true
      }
    })

    res.status(200).json({ data: regenerateTitles, success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: "Something went wrong." });
  }
}