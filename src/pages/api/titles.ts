import { prisma } from "@/server/db";
import * as cheerio from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next";
import {Configuration, CreateChatCompletionResponse, OpenAIApi} from "openai";
import { AxiosResponse } from "axios";


const BASE_SITE_SCRAP = "https://www.gamespot.com/";

const ai = new OpenAIApi(new Configuration({
  apiKey: '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'
}))


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let regenerateTitles: string[] | undefined;

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
        where: { originalTitle: title },
      });

      if (existingArticle) {
        new Error(`Article with title "${title}" already exists`)
      } else {
        console.log("title", title);
        await prisma.article.create({ data: { originalTitle: title } });
      }

    }

    const data = await prisma.article.findMany();

    if(data) {
      const prompt = `Regenerate the following h1 titles:\n${titles.join("\n")}\nNew Titles:`;

      const responseFromAI = await ai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: prompt
        }]
      });
      regenerateTitles = responseFromAI.data.choices[0]?.message?.content.trim().split("\n");

    }


    res.status(200).json({ originalTitles: data, regenerateTitles: regenerateTitles, success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "failed to load data" });
  }
}
