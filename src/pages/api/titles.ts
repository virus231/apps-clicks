import { prisma } from "@/server/db";
import * as cheerio from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_SITE_SCRAP = "https://www.gamespot.com/";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(BASE_SITE_SCRAP);

    const getTitles = (html: string) => {
      const $ = cheerio.load(html);

      return $("h4")
        .map((i, el) => $(el).text())
        .get()
        .slice(0, 10)
    }

    const titles = getTitles(await response.text());

    for (const title of titles) {
      const existingArticle = await prisma.article.findUnique({
        where: { title },
      });

      if (existingArticle) {
        console.log(`Article with title "${title}" already exists`);
      } else {
        await prisma.article.create({ data: { title } });
      }

    }

    const data = await prisma.article.findMany();


    res.status(200).json({ titles: data, success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "failed to load data" });
  }
}
