// CMS Adapter Pattern
// Swap this import to change backends without touching components

import * as notion from './notion.js';

export const getArticles = notion.getArticles;
export const getArticleBySlug = notion.getArticleBySlug;
export const getArticleContent = notion.getArticleContent;
export const getArticlesBySeries = notion.getArticlesBySeries;