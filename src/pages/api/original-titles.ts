import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import * as cheerio from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next";
import {Configuration, OpenAIApi} from "openai";


export const BASE_SITE_SCRAP = "https://www.gamespot.com/";

export const ai = new OpenAIApi(new Configuration({
  apiKey: "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"
}))

export const getOriginalTitles = (html: string) => {
  const $ = cheerio.load(html);

  return $("h4")
    .map((i, el) => $(el).text())
    .get()
    .slice(0, 10)
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(BASE_SITE_SCRAP);

    const { originalTitle } = await prisma.article.count({
      select: {
        originalTitle: true
      }
    })

    if (originalTitle === 0) {
      const titles = getOriginalTitles(await response.text());

      for (const title of titles) {
        await prisma.article.upsert({
          where: { originalTitle: title },
          update: { originalTitle: title },
          create: { originalTitle: title },
        });
      }
    }

    const data = await prisma.article.findMany({
      select: {
        id: true,
        originalTitle: true,
      }
    });

    res.status(200).json({ data, success: true });
  } catch (err) {
    console.log("ERROR", err)
    res.status(500).json({ success: false, error: "Something went wrong." });
  }
}
