import Anthropic from '@anthropic-ai/sdk';
import { 
  GuidePreferences, 
  ResearchResult, 
  GeneratedGuide,
  ResearchSource 
} from '@guide-generator/shared';
import { config } from '../config';

export class ContentGenerationService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropicApiKey,
    });
  }

  /**
   * Generate a complete guide based on research and preferences
   */
  async generateGuide(
    topic: string,
    research: ResearchResult[],
    preferences: GuidePreferences
  ): Promise<GeneratedGuide> {
    // Step 1: Generate outline
    const outline = await this.generateOutline(topic, research, preferences);

    // Step 2: Generate title
    const title = await this.generateTitle(topic, preferences);

    // Step 3: Generate full content
    const content = await this.generateContent(topic, outline, research, preferences);

    // Extract all sources
    const allSources = research.flatMap(r => r.sources);
    const uniqueSources = this.deduplicateSources(allSources);

    // Calculate metadata
    const wordCount = this.countWords(content);
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    return {
      id: this.generateId(),
      topic,
      title,
      content,
      outline,
      metadata: {
        wordCount,
        readingTime,
      },
      sources: uniqueSources.slice(0, 10), // Top 10 sources
      preferences,
      createdAt: new Date(),
    };
  }

  /**
   * Generate an outline for the guide
   */
  private async generateOutline(
    topic: string,
    research: ResearchResult[],
    preferences: GuidePreferences
  ): Promise<string[]> {
    const researchContext = this.formatResearchContext(research);
    
    const prompt = `Based on the following research about "${topic}", create a comprehensive outline for a ${preferences.depth} ${preferences.style} guide targeting a ${preferences.audience} audience.

Research Context:
${researchContext}

Generate an outline with 5-8 main sections. Return ONLY a JSON array of section titles, like:
["Introduction", "Section 1", "Section 2", ...]

Requirements:
- Depth: ${preferences.depth}
- Style: ${preferences.style}
- Audience: ${preferences.audience}
- Tone: ${preferences.tone}
- Length target: ${preferences.length}`;

    const response = await this.client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        return JSON.parse(content.text);
      } catch {
        // Fallback parsing
        return content.text.split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/^[-*\d.]+\s*/, '').trim());
      }
    }

    return ['Introduction', 'Main Content', 'Conclusion'];
  }

  /**
   * Generate an engaging title
   */
  private async generateTitle(
    topic: string,
    preferences: GuidePreferences
  ): Promise<string> {
    const prompt = `Generate a compelling, SEO-friendly title for a ${preferences.style} guide about "${topic}".

Requirements:
- Target audience: ${preferences.audience}
- Tone: ${preferences.tone}
- Length: 50-65 characters
- Should be engaging and descriptive

Return ONLY the title, no quotes or extra text.`;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text.trim().replace(/^["']|["']$/g, '');
    }

    return `Complete Guide to ${topic}`;
  }

  /**
   * Generate the full content of the guide
   */
  private async generateContent(
    topic: string,
    outline: string[],
    research: ResearchResult[],
    preferences: GuidePreferences
  ): Promise<string> {
    const researchContext = this.formatResearchContext(research);
    const targetWords = this.getTargetWordCount(preferences.length);

    const prompt = `Write a comprehensive ${preferences.style} guide about "${topic}" following this outline:

${outline.map((section, i) => `${i + 1}. ${section}`).join('\n')}

Research Context:
${researchContext}

Requirements:
- Depth: ${preferences.depth}
- Audience: ${preferences.audience} level
- Style: ${preferences.style}
- Tone: ${preferences.tone}
- Target length: ~${targetWords} words
- Format: ${preferences.format}

Guidelines:
1. Write in markdown format with proper headings (## for sections)
2. Include practical examples and actionable insights
3. Use the research context to ensure accuracy
4. Make it engaging and easy to follow
5. Include an introduction and conclusion
6. Add relevant code examples if applicable
7. Use bullet points and numbered lists where appropriate
8. Keep paragraphs concise and scannable

Write the complete guide now:`;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    return 'Failed to generate content.';
  }

  /**
   * Format research context for Claude
   */
  private formatResearchContext(research: ResearchResult[]): string {
    return research
      .map(r => {
        const sources = r.sources
          .slice(0, 3)
          .map(s => `- ${s.title}: ${s.snippet}`)
          .join('\n');
        return `Query: ${r.query}\nSources:\n${sources}`;
      })
      .join('\n\n');
  }

  /**
   * Get target word count based on length preference
   */
  private getTargetWordCount(length: string): number {
    switch (length) {
      case 'short':
        return 750;
      case 'medium':
        return 1500;
      case 'long':
        return 2500;
      default:
        return 1500;
    }
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Deduplicate sources
   */
  private deduplicateSources(sources: ResearchSource[]): ResearchSource[] {
    const seen = new Set<string>();
    return sources.filter(source => {
      if (seen.has(source.url)) return false;
      seen.add(source.url);
      return true;
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `guide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
