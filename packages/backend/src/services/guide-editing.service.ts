import Anthropic from '@anthropic-ai/sdk';
import { GeneratedGuide } from '@guide-generator/shared';
import { config } from '../config';

export class GuideEditingService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropicApiKey,
    });
  }

  /**
   * Edit a guide based on user instruction using AI
   */
  async editGuide(
    userInstruction: string,
    currentGuide: GeneratedGuide
  ): Promise<GeneratedGuide> {
    const prompt = `You are editing an existing guide. The user wants you to apply the following instruction:

"${userInstruction}"

Current Guide:
Title: ${currentGuide.title}
Topic: ${currentGuide.topic}
Outline: ${JSON.stringify(currentGuide.outline, null, 2)}

Current Content:
${currentGuide.content}

Please edit the guide according to the user's instruction. You should:
1. Apply the instruction while maintaining the overall structure and quality
2. Keep the same tone and style (${currentGuide.preferences.tone})
3. Preserve the outline structure unless the instruction specifically asks to change it
4. Maintain the same depth level (${currentGuide.preferences.depth})
5. Keep the same audience level (${currentGuide.preferences.audience})

Return the updated guide content in markdown format. Only return the content, not the title or metadata.`;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Failed to get text response from AI');
    }

    const updatedContent = content.text.trim();

    // Update word count and reading time
    const wordCount = this.countWords(updatedContent);
    const readingTime = Math.ceil(wordCount / 200);

    // Create updated guide
    const updatedGuide: GeneratedGuide = {
      ...currentGuide,
      content: updatedContent,
      metadata: {
        ...currentGuide.metadata,
        wordCount,
        readingTime,
      },
      createdAt: currentGuide.createdAt, // Preserve original creation date
    };

    return updatedGuide;
  }

  /**
   * Regenerate a specific section of the guide
   */
  async regenerateSection(
    sectionTitle: string,
    currentGuide: GeneratedGuide
  ): Promise<GeneratedGuide> {
    const instruction = `Regenerate and improve the section titled "${sectionTitle}" with more detail and clarity.`;
    return this.editGuide(instruction, currentGuide);
  }

  /**
   * Update the title of the guide
   */
  async updateTitle(
    newTitle: string,
    currentGuide: GeneratedGuide
  ): Promise<GeneratedGuide> {
    return {
      ...currentGuide,
      title: newTitle,
    };
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
}

