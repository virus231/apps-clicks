import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { type Article } from "@prisma/client";
import { Box, Container, Typography } from "@mui/material";
import { Loading } from "@/components/Loading";
import Head from "next/head";
import Image from "next/image";


const ArticlePage = () => {
  const [article, setArticle] = useState<Omit<Article, "originalTitle">>();
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const id = String(router.query.id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchArticle = async () => {
    setLoading(true)
    const res = await fetch(`/api/article/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await res.json();

    setArticle(data as Omit<Article, "originalTitle">);
    setLoading(false)

  }

  useEffect(() => {
    void fetchArticle();
  }, [fetchArticle])


  return <>
    <Head>
      <title>{article?.regenerateTitle}</title>
      <meta name="tags" content={article?.metaTags || ""} />
      <meta name="description" content={article?.metaDescription || ""} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="flex py-10 min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <Container maxWidth="lg">
        {
          !loading ? <>
            <Box display="flex" justifyContent="center">
              <Image
                fill={false}
                loading="lazy"
                height="700"
                width="600"
                alt={article?.regenerateTitle || ""}
                src={article?.image || ""}
              />
            </Box>
            <Typography variant="h3"
                        className="text-white"
            >
              {article?.regenerateTitle}
            </Typography>
            <Box my={1}>
              <Typography variant="body1"
                          className="text-white my-3"
                          dangerouslySetInnerHTML={{
                            __html: `${article?.description || ""}`.replace(/\n\s?/g, "<br/>")
                          }}
              />
            </Box>
          </> : <Box display="flex" justifyContent="center">
            <Loading/>
          </Box>
        }
      </Container>
    </main>


  </>
}

export default ArticlePage;