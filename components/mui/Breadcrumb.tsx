import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const Breadcrumb = ({ currentLabel }: any) => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  return (
    <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ padding: "16px" }}>
      <Link color="inherit" href="/">
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        {t("menu.home", "Home")}
      </Link>
      <Link color="inherit" href={`/products`}>
        <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        {t("menu.products", "Products")}
      </Link>
      <Typography color="text.primary">
        <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        {currentLabel ? currentLabel : "Product"}
      </Typography>
    </Breadcrumbs>
  );
};

export default Breadcrumb;
