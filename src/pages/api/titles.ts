import * as cheerio from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_SITE_SCRAP = "https://www.gamespot.com/";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(BASE_SITE_SCRAP);
  
    const html = await response.text();

    const $ = cheerio.load(html);
    const titles = $("h4")
      .map((i, el) => $(el).text())
      .get()
      .slice(0, 10);

    res.status(200).json({ titles, success: true });
  } catch (err) {
    res.status(500).json({ succes: false, error: "failed to load data" });
  }
}
