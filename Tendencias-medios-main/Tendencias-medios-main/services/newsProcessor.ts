import { NewsArticle, NewsCluster, ScoreBreakdown } from "../types";

// --- HELPERS ---

// Simple string hash for ID generation
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

// Normalize URL for deduplication
const normalizeUrl = (url: string): string => {
  try {
    const u = new URL(url);
    // Remove common tracking params
    ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'].forEach(p => u.searchParams.delete(p));
    return u.hostname.replace('www.', '') + u.pathname;
  } catch (e) {
    return url;
  }
};

// Normalize Title for fuzzy matching
const normalizeTitle = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/gi, '') // Remove special chars
    .replace(/\s+/g, ' ') // Collapse spaces
    .trim();
};

const parseRelativeDate = (dateStr: string): Date => {
  const now = new Date();
  if (!dateStr) return now;
  
  const str = dateStr.toLowerCase();
  
  if (str.includes('hace') || str.includes('ago')) {
    const val = parseInt(str.match(/\d+/)?.[0] || "0");
    if (str.includes('min') || str.includes('m')) return new Date(now.getTime() - val * 60000);
    if (str.includes('hora') || str.includes('hour') || str.includes('h')) return new Date(now.getTime() - val * 3600000);
    if (str.includes('día') || str.includes('day') || str.includes('d')) return new Date(now.getTime() - val * 86400000);
  }
  
  // Try parsing ISO
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? now : parsed;
};

// --- SCORING ALGORITHM ---

const calculateScore = (cluster: NewsCluster): void => {
  const breakdown: ScoreBreakdown = {
    recency: 0,
    coverage: 0,
    authority: 0,
    visual: 0,
    position: 0,
    total: 0
  };

  // 1. Recency (0-40)
  // Decay: 0h = 40pts, 24h = 20pts, 48h = 0pts
  const latestDate = parseRelativeDate(cluster.latest_published_at);
  const hoursOld = (new Date().getTime() - latestDate.getTime()) / 3600000;
  breakdown.recency = Math.max(0, Math.round(40 - (hoursOld * 0.83)));

  // 2. Coverage (0-25)
  // 1 article = 0, 2 = 8, 3 = 12, 5+ = 25
  const count = cluster.coverage_count;
  if (count >= 5) breakdown.coverage = 25;
  else if (count >= 3) breakdown.coverage = 12 + ((count - 3) * 4);
  else if (count === 2) breakdown.coverage = 8;
  else breakdown.coverage = 0;

  // 3. Authority (0-20)
  // User Request: No prioritization. All SERP sources are valid.
  // We give a flat score of 10 to represent "Verified by Google News".
  breakdown.authority = 10;

  // 4. Visual (0-10)
  const hasVisual = cluster.articles.some(a => !!a.thumbnail_url);
  breakdown.visual = hasVisual ? 10 : 0;

  // 5. Position Boost (0-5)
  // Average position of articles. Lower is better.
  const avgPos = cluster.articles.reduce((sum, a) => sum + a.position, 0) / count;
  if (avgPos <= 1) breakdown.position = 5;
  else if (avgPos <= 3) breakdown.position = 3;
  else if (avgPos <= 10) breakdown.position = 1;
  else breakdown.position = 0;

  breakdown.total = breakdown.recency + breakdown.coverage + breakdown.authority + breakdown.visual + breakdown.position;
  
  cluster.score = breakdown.total;
  cluster.score_breakdown = breakdown;
};

// --- MAIN PROCESSOR ---

export const processNews = (rawArticles: NewsArticle[]): NewsCluster[] => {
  const clusters: Map<string, NewsCluster> = new Map();
  const seenUrls: Set<string> = new Set();

  // 1. Pre-process and Dedupe by URL
  const uniqueArticles: NewsArticle[] = [];
  
  rawArticles.forEach(article => {
    // Generate IDs
    article.article_id = simpleHash(normalizeUrl(article.url));
    
    if (!seenUrls.has(article.article_id)) {
      seenUrls.add(article.article_id);
      uniqueArticles.push(article);
    }
  });

  // 2. Clustering (Semantic / Topic)
  // Basic strategy: Match by normalized title overlap or identical keywords + time window
  uniqueArticles.forEach(article => {
    let foundCluster = false;
    
    // Title Hash for clustering: "roig arena obras"
    const titleKey = normalizeTitle(article.title).substring(0, 30); // Use first 30 chars of normalized title as weak key
    
    // Try to find an existing cluster
    for (const cluster of clusters.values()) {
        // Check fuzzy title match
        const clusterTitleNorm = normalizeTitle(cluster.title);
        const articleTitleNorm = normalizeTitle(article.title);
        
        // Simple Jaccard or substring match
        if (clusterTitleNorm.includes(titleKey) || articleTitleNorm.includes(normalizeTitle(cluster.title).substring(0, 30))) {
            cluster.articles.push(article);
            cluster.coverage_count++;
            
            // Update latest date
            const artDate = parseRelativeDate(article.published_at);
            const clustDate = parseRelativeDate(cluster.latest_published_at);
            if (artDate > clustDate) {
                cluster.latest_published_at = article.published_at;
            }

            // Update top source: Pick the one with the best SERP position (lowest number)
            const currentTop = cluster.articles.find(a => a.source_name === cluster.top_source);
            const currentPos = currentTop ? currentTop.position : 999;
            
            if (article.position < currentPos) {
                cluster.top_source = article.source_name;
            }

            foundCluster = true;
            break;
        }
    }

    if (!foundCluster) {
        const clusterId = simpleHash(article.title + article.keyword);
        clusters.set(clusterId, {
            cluster_id: clusterId,
            title: article.title,
            articles: [article],
            coverage_count: 1,
            latest_published_at: article.published_at,
            top_source: article.source_name,
            score: 0,
            score_breakdown: { recency: 0, coverage: 0, authority: 0, visual: 0, position: 0, total: 0 }
        });
    }
  });

  const processedClusters = Array.from(clusters.values());

  // 3. Scoring
  processedClusters.forEach(calculateScore);

  // 4. Sort by Score DESC
  return processedClusters.sort((a, b) => b.score - a.score);
};