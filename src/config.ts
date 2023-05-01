import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://ryoooun-blog-ryoooun.vercel.app/",
  author: "Ryosuke Yamashita",
  desc: "個人的な技術・趣味ブログです。",
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
