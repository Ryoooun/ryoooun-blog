import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://komogomo.vercel.app/",
  author: "Ryosuke Yamashita",
  desc: "このブログは、業界・業種・実務、トリプル未経験の28歳フリーターがWebフロントエンドエンジニアを目指す上で学習している内容であったり、\
  趣味の内容をまとめたものです。",
  title: "komogomo",
  ogImage: "",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOCALE = ["ja-JP"];

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 256,
  height: 256,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/ryoooun",
    linkTitle: `${SITE.title} on Github`,
    active: true,
  },
];
