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

    // Fetch child blocks for all container blocks (tables, toggles, columns)
    for (const block of blocks) {
      if (block.has_children) {
        block.children = await getArticleContent(block.id);
      }
    }
  } catch (err) {
    console.error('Error fetching block content for pageId', pageId, err);
  }
  return blocks;
}

export async function getArticles() {
  const token = import.meta.env.NOTION_TOKEN;
  const dbId = import.meta.env.NOTION_DATABASE_ID;

  if (!token || !dbId) {
    console.warn('NOTION_TOKEN or NOTION_DATABASE_ID is missing from environment variables');
    return [];
  }

  try {
    console.log(`Querying Notion Database ID: ${dbId.slice(0, 6)}...`);
    const response = await notion.databases.query({
      database_id: dbId.trim(),
    });

    console.log(`Notion returned ${response.results.length} total pages in database.`);

    const publishedArticles = response.results.filter(page => {
      const props = page.properties;
      const statusValue = (
        props.Status?.status?.name ||
        props.Status?.select?.name ||
        (props.Status?.checkbox ? 'Published' : null) ||
        'Published'
      );
      return statusValue.toLowerCase() === 'published';
    });

    console.log(`Found ${publishedArticles.length} published articles.`);

    return publishedArticles.map(page => {
      const props = page.properties;

      // Find title property dynamically
      const titlePropKey = Object.keys(props).find(key => props[key].type === 'title') || 'Title';
      const titleText = richTextToPlain(props[titlePropKey]?.title);
      const cleanTitle = titleText.replace(/\*\*/g, '').trim();

      const featuredImgFile = props['Featured Image']?.files?.[0] || props.Image?.files?.[0];
      const candidateUrls = [
        page.cover?.external?.url,
        featuredImgFile?.external?.url,
        page.cover?.file?.url,
        featuredImgFile?.file?.url,
      ].filter(Boolean);

      const permanentUrl = candidateUrls.find(url => !url.includes('prod-files-secure.s3.us-west-2.amazonaws.com'));
      const imgUrl = permanentUrl || candidateUrls[0] || null;

      const rawSlug = slugify(cleanTitle || 'untitled');

      return {
        id: page.id,
        slug: rawSlug || page.id,
        title: cleanTitle || 'Untitled Article',
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