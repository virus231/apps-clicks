import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { Article } from "@prisma/client";


type Props = {
  article: Pick<Article, "id" | "description" | "regenerateTitle">
}

export const MainAccordion = ({ article }: Props) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };


  return <Accordion key={article.id} expanded={expanded === `${article.id}`} onChange={handleChange(`${article.id}`)}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel4bh-content"
      id="panel4bh-header"
    >
      <Typography sx={{ width: '33%', flexShrink: 0 }}>{article.regenerateTitle}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography>
        {article.description}
      </Typography>
    </AccordionDetails>
  </Accordion>
}