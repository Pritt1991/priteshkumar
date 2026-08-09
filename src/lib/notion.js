import { Client } from '@notionhq/client';
import { slugify } from './utils.js';

const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });
const DATABASE_ID = import.meta.env.NOTION_DATABASE_ID;

function richTextToPlain(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map(t => t.plain_text).join('');
}

export async function getArticleContent(pageId) {
  const blocks = [];
  let cursor = undefined;
  try {
    do {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
      });
      blocks.push(...response.results);
      cursor = response.next_cursor;
    } while (cursor);
  } catch (err) {
    console.error('Error fetching block content:', err);
  }
  return blocks;
}

export async function getArticles() {
  if (!import.meta.env.NOTION_TOKEN || !DATABASE_ID) {
    console.warn('NOTION_TOKEN or NOTION_DATABASE_ID missing');
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
    });

    const publishedArticles = response.results.filter(page => {
      const props = page.properties;
      const statusValue = (
        props.Status?.select?.name ||
        props.Status?.status?.name ||
        (props.Status?.checkbox ? 'Published' : null) ||
        'Published' // default to include if Status property isn't defined
      );
      return statusValue.toLowerCase() === 'published';
    });

    return publishedArticles.map(page => {
      const props = page.properties;

      // Find title property dynamically if Title/Name key differs
      const titlePropKey = Object.keys(props).find(key => props[key].type === 'title') || 'Title';
      const titleText = richTextToPlain(props[titlePropKey]?.title);

      const featuredImgFile = props['Featured Image']?.files?.[0] || props.Image?.files?.[0];
      const imgUrl = featuredImgFile?.file?.url || featuredImgFile?.external?.url || null;

      return {
        id: page.id,
        slug: slugify(titleText || 'untitled'),
        title: titleText || 'Untitled Article',
        excerpt: richTextToPlain(props.Excerpt?.rich_text || props.Description?.rich_text),
        category: props.Category?.select?.name || props.Category?.status?.name || 'Uncategorized',
        tags: props.Tags?.multi_select?.map(t => t.name) || [],
        series: props.Series?.select?.name || null,
        seriesOrder: props['Series Order']?.number || null,
        featuredImage: imgUrl,
        seoTitle: richTextToPlain(props['SEO Title']?.rich_text),
        seoDescription: richTextToPlain(props['SEO Description']?.rich_text),
        publishDate: props['Publish Date']?.date?.start || page.created_time,
        content: null,
      };
    });
  } catch (error) {
    console.error('Notion fetch error:', error);
    return [];
  }
}

export async function getArticleBySlug(slug) {
  const articles = await getArticles();
  return articles.find(a => a.slug === slug) || null;
}

export async function getArticlesBySeries(seriesName) {
  const articles = await getArticles();
  return articles
    .filter(a => a.series === seriesName)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}