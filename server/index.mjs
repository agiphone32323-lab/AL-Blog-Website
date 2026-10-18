import express from 'express';

try {
  process.loadEnvFile();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const app = express();
const port = Number(process.env.API_PORT || 8787);
const apiKey = process.env.GNEWS_API_KEY;

app.get('/api/news', async (_request, response) => {
  if (!apiKey) {
    response.json({ live: false, articles: [] });
    return;
  }

  try {
    const endpoint = new URL('https://gnews.io/api/v4/search');
    endpoint.searchParams.set('q', 'artificial intelligence OR technology');
    endpoint.searchParams.set('lang', 'en');
    endpoint.searchParams.set('max', '10');
    endpoint.searchParams.set('sortby', 'publishedAt');
    endpoint.searchParams.set('apikey', apiKey);

    const upstream = await fetch(endpoint);
    if (!upstream.ok) {
      response.status(upstream.status).json({ error: 'The news provider could not complete the request.' });
      return;
    }

    const payload = await upstream.json();
    const articles = (payload.articles || []).map((item, index) => ({
      id: `live-${index}-${item.url}`,
      slug: `live-${index}`,
      title: item.title,
      excerpt: item.description || item.content || '',
      image: item.image || '',
      category: 'ai-research',
      categoryLabel: 'AI & Research',
      author: item.source?.name || 'GNews',
      publishedAt: item.publishedAt,
      url: item.url,
      sourceName: item.source?.name || 'News source',
      readTime: '4 min read',
      tags: ['Live source'],
      content: [item.description || item.content || 'Open the original source for the full article.'],
      live: true,
    }));

    response.json({ live: true, articles });
  } catch {
    response.status(502).json({ error: 'Unable to reach the news provider.' });
  }
});

app.listen(port, () => {
  console.log(`Signal news API listening on http://localhost:${port}`);
});
