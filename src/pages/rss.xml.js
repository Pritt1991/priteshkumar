import rss from '@astrojs/rss';
import { getArticles } from '../lib/cms.js';

export async function GET(context) {
  const articles = await getArticles();

  return rss({
    title: 'Blog',
    description: 'Practical Technology. Infrastructure. Security. Cloud.',
    site: context.site,
    items: articles.map(article => ({
      title: article.title,
      pubDate: article.publishDate,
      description: article.excerpt,
      link: `/blog/${article.slug}/`,
      categories: article.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}