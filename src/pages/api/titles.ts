import { prisma } from "@/server/db";
import * as cheerio from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next";
import {Configuration, OpenAIApi} from "openai";


const BASE_SITE_SCRAP = "https://www.gamespot.com/";

const ai = new OpenAIApi(new Configuration({
  apiKey: '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'
}))


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(BASE_SITE_SCRAP);
    const getOriginalTitles = (html: string) => {
      const $ = cheerio.load(html);

      return $("h4")
        .map((i, el) => $(el).text())
        .get()
        .slice(0, 10)
    }

    const getRegenerateTitles = async (titles: string[]) => {
      const prompt = `Regenerate the following h1 titles:\n${titles.join("\n")}\nNew Titles:`;
      const { data } = await ai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
      return data.choices[0]?.message?.content.trim().split("\n");
    };

    const titles = getOriginalTitles(await response.text());
    const regenerateTitles = await getRegenerateTitles(titles) as string[];

    for (const [index, title] of titles.entries()) {
      const regenerateTitle = regenerateTitles[index] as string;

      const existingArticle = await prisma.article.findUnique({
        where: { originalTitle: title },
      });

      if (existingArticle) {
        new Error(`Article with title "${title}" already exists`)
      }

      await prisma.article.upsert({
        where: { originalTitle: title },
        update: { regenerateTitle },
        create: { originalTitle: title, regenerateTitle },
      });

      // await prisma.article.create({ data: { originalTitle: title, regenerateTitle } });
    }

    const data = await prisma.article.findMany();
    console.log(data);

    res.status(200).json({ data, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Something went wrong." });
  }
}
