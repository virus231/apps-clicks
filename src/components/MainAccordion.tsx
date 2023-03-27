import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { type Article } from "@prisma/client";


type Props = {
  article: Omit<Article, "originalTitle">
}

export const MainAccordion = ({ article }: Props) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };


  return <Accordion key={article.id}
                    expanded={expanded === `${article.id}`}
                    onChange={handleChange(`${article.id}`)}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel4bh-content"
      id="panel4bh-header"
    >
      <Typography sx={{ width: '66%', flexShrink: 0 }}>{article.regenerateTitle}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="body1">
        {article.metaTags}
      </Typography>
      <Typography variant="body1">
        {article.metaDescription}
      </Typography>
      <Typography>
        {article.description}
      </Typography>
    </AccordionDetails>
  </Accordion>
}