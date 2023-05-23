import { createClient, MicroCMSContentId, MicroCMSDate, MicroCMSQueries } from "microcms-js-sdk";
import styles from '../styles/blogstyle.module.scss'
import {load} from 'cheerio'
import hljs from 'highlight.js';


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
      const filename = $(elm).text().split("\n",1)[0]
      const code = $(elm).text().replace(filename,"").trim()
      const result = hljs.highlightAuto(code)
      const test = result.value.split(/\n/)
      $(elm).html(result.value)
      $(elm).addClass(`hljs ${styles.code}`)
      $(elm).css('border-radius', '0.5rem')
      $(elm).before(`<span class="${styles.code_filename}">${filename.replace(':','')}</span>`)
    })
    $("iframe").each((_, elm) => {
      $(elm).removeAttr('width')
      const srcPath = $(elm).attr('src')?.replace("%2Fpreview", "")
      $(elm).prop('src', String(srcPath))
      $(elm).css("width", "100%")
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
      $(elm).addClass("hljs")
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
      $(elm).wrap('<div class="w-full flex justify-center"></div>')
      $(elm).addClass(`rounded-xl shadow-lg sm:max-w-2xl`)
    })
    $('p').each((_, elm) => {
      $(elm).addClass(`${styles.paragraph}`)
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
        $(elm).wrapAll(`
        <div class="${styles.ogp_card} shadow-md">
        </div>`)
      $(elm).html(`
        <div class="${styles.ogp_body}">
        <p class="${styles.ogp_desc}">
        <span>${title ?? ""}</span>
      </p>
      <p class=${styles.ogp_url}><img src="http://www.google.com/s2/favicons?domain=${url}" alt="favicon" /><span>${url?.split("//")[1].split("/")[0] ?? ""}</span></p>
  </div>
    <div class="${styles.ogp_image}">
      <img src="${image ?? ''}" alt="${title ?? ""}" class="shadow-2xl" />
    </div>
        `)

        if(_ === 0){
          resolve($.html())
        }
      })

    } else {
      resolve($.html())
    }
})
}
