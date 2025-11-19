import axios from 'axios';
import { ResearchResult, ResearchSource } from '@guide-generator/shared';
import { config } from '../config';

export class ResearchService {
  private apiKey: string;
  private baseUrl = 'https://api.search.brave.com/res/v1/web/search';

  constructor() {
    this.apiKey = config.braveSearchApiKey;
  }

  /**
   * Perform web search using Brave Search API
   */
  async search(query: string, count: number = 10): Promise<ResearchSource[]> {
    try {
      const response = await axios.get(this.baseUrl, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': this.apiKey,
        },
        params: {
          q: query,
          count,
          search_lang: 'en',
        },
      });

      const results = response.data.web?.results || [];
      
      return results.map((result: any) => ({
        title: result.title,
        url: result.url,
        snippet: result.description,
        relevanceScore: this.calculateRelevanceScore(result, query),
      }));
    } catch (error) {
      console.error('Search error:', error);
      throw new Error(`Failed to search: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Perform multiple searches for comprehensive research
   */
  async comprehensiveResearch(topic: string): Promise<ResearchResult[]> {
    const queries = this.generateResearchQueries(topic);
    const results: ResearchResult[] = [];

    for (const query of queries) {
      try {
        const sources = await this.search(query, 5);
        results.push({
          query,
          sources,
          summary: this.generateQuerySummary(sources),
        });
      } catch (error) {
        console.error(`Failed to search for query: ${query}`, error);
      }
    }

    return results;
  }

  /**
   * Generate multiple search queries for comprehensive coverage
   */
  private generateResearchQueries(topic: string): string[] {
    return [
      topic, // Main topic
      `${topic} guide`,
      `${topic} tutorial`,
      `${topic} best practices`,
      `${topic} examples`,
    ];
  }

  /**
   * Calculate relevance score based on query match
   */
  private calculateRelevanceScore(result: any, query: string): number {
    const title = result.title?.toLowerCase() || '';
    const description = result.description?.toLowerCase() || '';
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(' ');

    let score = 0;
    
    // Title matches are worth more
    if (title.includes(queryLower)) score += 10;
    queryWords.forEach(word => {
      if (title.includes(word)) score += 3;
    });

    // Description matches
    if (description.includes(queryLower)) score += 5;
    queryWords.forEach(word => {
      if (description.includes(word)) score += 1;
    });

    return score;
  }

  /**
   * Generate a brief summary from sources
   */
  private generateQuerySummary(sources: ResearchSource[]): string {
    if (sources.length === 0) return 'No sources found';
    
    return sources
      .slice(0, 3)
      .map(s => s.snippet)
      .join(' ');
  }

  /**
   * Deduplicate and rank sources by relevance
   */
  rankAndDeduplicate(sources: ResearchSource[]): ResearchSource[] {
    // Remove duplicates by URL
    const uniqueSources = sources.reduce((acc, source) => {
      if (!acc.some(s => s.url === source.url)) {
        acc.push(source);
      }
      return acc;
    }, [] as ResearchSource[]);

    // Sort by relevance score
    return uniqueSources.sort((a, b) => 
      (b.relevanceScore || 0) - (a.relevanceScore || 0)
    );
  }
}
