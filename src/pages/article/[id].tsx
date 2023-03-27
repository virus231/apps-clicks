import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { type Article } from "@prisma/client";
import { Typography } from "@mui/material";
import { Loading } from "@/components/Loading";
import Head from "next/head";

const ArticlePage = () => {
  const [article, setArticle] = useState<Omit<Article, "originalTitle">>();
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const id = String(router.query.id);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      const res = await fetch(`/api/article/${id}`);
      const { data } = await res.json();

      setArticle(data as Omit<Article, "originalTitle">);
      setLoading(false)

    }
    fetchArticle();
  }, [])

  return <>
    <Head>
      <title>{article?.regenerateTitle}</title>
      <meta name="tags" content={article?.metaTags || ""} />
      <meta name="description" content={article?.metaDescription || ""} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      {
        !loading ? <>
          <Typography variant="h3" className="text-white">
            {article?.regenerateTitle}
          </Typography>
          <Typography variant="body1" className="text-white">
            {article?.description}
          </Typography>
        </> : <Loading/>
      }
    </main>


  </>
}

export default ArticlePage;