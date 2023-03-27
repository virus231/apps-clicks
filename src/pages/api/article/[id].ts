import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db";

export default async function handler(req: NextApiRequest,
                                res: NextApiResponse) {
  const id = String(req.query.id)
  try {
    const article = await prisma.article.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        regenerateTitle: true,
        description: true,
        metaTags: true,
        metaDescription: true
      }
    })
    res.status(200).json({ data: article, success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: "Something went wrong." });
  }
}