import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db";
// import Replicate from "replicate";
import { ai } from "@/pages/api/original-titles";


// const replicate = new Replicate({
//   userAgent: "",
//   auth: "r8_Vy0yQP33PNFgcnSE5lSf4A0CyuTWfLA3BTjNw"
// });

const generateArticle = async (title: string) => {
  const prompt = `Write an article on "${title}" with 1000 words.\n`;

  const {data} = await ai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  return data.choices[0]?.message?.content.trim();
}

const generateTags = async (article: string) => {
  const prompt = `Generate meta tags for the following article:\n\n${article}`;

  const {data} = await ai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  return data.choices[0]?.message?.content.trim();
}

const generateDescriptino = async (article: string) => {
  const prompt = `Generate meta description for the following article:\n\n${article}`;

  const {data} = await ai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  return data.choices[0]?.message?.content.trim();
}

// const getImageArticle = async (title: string) => {
//   console.log("title", title);
//   const output = await replicate.run(
//     "prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb",
//     {
//       input: {
//         prompt: `mdjrny-v4 ${title} 4k`
//       }
//     }
//   );
//   console.log(output);
//   return String(output);
// }


export default async function handler(req: NextApiRequest,
                                res: NextApiResponse) {
  const id = String(req.query.id);
  try {
    const post = await prisma.article.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        description: true,
        regenerateTitle: true,
      }
    })

    if(!post?.description) {
      const article = await generateArticle(post?.regenerateTitle || "");
      const tags = await generateTags(article || "");
      const description = await generateDescriptino(article || "");
      // const image = await getImageArticle(post?.regenerateTitle || "");

      await prisma.article.upsert({
        where: {
          id
        },
        update: {
          description: article,
          metaTags: tags,
          metaDescription: description
        },
        create: {
          description: article,
          metaTags: tags,
          metaDescription: description
        }
      })
    }


    const mainPost = await prisma.article.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        regenerateTitle: true,
        description: true,
        metaTags: true,
        metaDescription: true,
        image: true
      }
    })

    res.status(200).json({ data: mainPost, success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: "Something went wrong." });
  }
}