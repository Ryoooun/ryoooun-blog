import { createClient, MicroCMSContentId, MicroCMSDate, MicroCMSQueries } from "microcms-js-sdk";
import styles from '../styles/blogstyle.module.scss'
import {load} from 'cheerio'
import hljs from 'highlight.js';
import { string } from "astro/zod";


const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

export type Blog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
  eyecatch: {
    url: string;
    height: number;
    width: number;
  };
  category: {
    id: string;
    name: string;
  };
};

export type BlogResponse = {
  totalCount: number;
  offset: number;
  limit: number;
  contents: Blog[];
};

export const getBlogs = async (queries?: MicroCMSQueries) => {
  return await client.get<BlogResponse>({ endpoint: "blogs", queries });
};

export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  // return await client.getListDetail<Blog>({
  //   endpoint: "blogs",
  //   contentId,
  //   queries,
  // });
  const blog = await client.getListDetail<Blog>({
    endpoint: "blogs",
    contentId,
    queries,
  });
  const createdHtml = await createBlogHtml(blog)

  blog.content = await createdHtml
  return blog
};

const createBlogHtml = async (blog: Blog & MicroCMSContentId & MicroCMSDate): Promise<string> => {
  const $ = load(blog.content);
  // @ts-ignore
  return new Promise((resolve) => {
    $("pre code").each((_, elm) => {
      const result = hljs.highlightAuto($(elm).text())
      $(elm).html(result.value)
      $(elm).addClass("javascript hljs")
      $(elm).css('border-radius', '0.5rem')
    })
    $("h1").each((_, elm) => {
      $(elm).addClass(`${styles.heading1}`)
    })
    $("h2").each((_, elm) => {
      $(elm).addClass(`${styles.heading2}`)

    })
    $("h3").each((_, elm) => {
      $(elm).addClass(`${styles.heading3}`)
    })
    $("h4").each((_, elm) => {
      $(elm).addClass(`${styles.heading4}`)
    })
    $('h5').each((_, elm) => {
      $(elm).addClass(`${styles.heading5}`)
    })
    $('strong').each((_, elm) => {
      $(elm).addClass(`${styles.strong}`)
    })
    $('code').each((_, elm) => {
      const result = hljs.highlightAuto($(elm).text())
      $(elm).html(result.value)
      $(elm).addClass("javascript hljs")
    })
    $('blockquote').each((_, elm) => {
      $(elm).addClass(`${styles.blockquote}`)
    })
    $('ol').each((_, elm) => {
      $(elm).addClass(`${styles.ordered_list}`)
    })
    $('ul').each((_, elm) => {
      $(elm).addClass(`${styles.unordered_list}`)
    })
    $('img').each((_, elm) => {
      $(elm).addClass(`${styles.img}`)
    })

    if($('html').find('a').attr('href')){
      //@ts-ignore
      $('a').each(async(_, elm) => {
        const url = $(elm).attr("href")
        const res = await fetch(url as string)
        const text = await res.text()
        const $href = load(text)
        const image = $href('meta[property="og:image"]').attr('content')
        const desc = $href('meta[property="og:description"]').attr('content')
        const title = $href('meta[property="og:title"]').attr('content')
        $(elm).html(`<div class="${styles.ogp_card} shadow-lg">
        <div class="${styles.ogp_body}">
          <p class="${styles.ogp_desc}">
            <span>${title ?? ""}</span>
          </p>
          <p class=${styles.ogp_url}><img src="http://www.google.com/s2/favicons?domain=${url}" alt="favicon" /><span>${url?.split("//")[1].split("/")[0] ?? ""}</span></p>
        </div>
        <div class="${styles.ogp_image}"><img src="${image ?? ''}" alt="${title ?? ""}" /></div>
        </div>`)
        resolve($.html())
      })
    } else {
      resolve($.html())
    }
})
}
