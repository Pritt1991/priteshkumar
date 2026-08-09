import { Client } from '@notionhq/client';
import { slugify } from './utils.js';

const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });
const DATABASE_ID = import.meta.env.NOTION_DATABASE_ID;

function richTextToPlain(richText) {
  return richText.map(t => t.plain_text).join('');
}

export async function getArticleContent(pageId) {
  const blocks = [];
  let cursor = undefined;
  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });
    blocks.push(...response.results);
    cursor = response.next_cursor;
  } while (cursor);
  return blocks;
}

export async function getArticles() {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Status',
        select: { equals: 'Published' },
      },
      sorts: [{ property: 'Publish Date', direction: 'descending' }],
    });

    return response.results.map(page => {
      const props = page.properties;
      return {
        id: page.id,
        slug: slugify(richTextToPlain(props.Title?.title || [])),
        title: richTextToPlain(props.Title?.title || []),
        excerpt: richTextToPlain(props.Excerpt?.rich_text || []),
        category: props.Category?.select?.name || 'Uncategorized',
        tags: props.Tags?.multi_select?.map(t => t.name) || [],
        series: props.Series?.select?.name || null,
        seriesOrder: props['Series Order']?.number || null,
        featuredImage: props['Featured Image']?.files?.[0]?.file?.url || null,
        seoTitle: richTextToPlain(props['SEO Title']?.rich_text || []),
        seoDescription: richTextToPlain(props['SEO Description']?.rich_text || []),
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