import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { GenerateGuideRequest, ApiResponse, GeneratedGuide } from '@guide-generator/shared';
import { ResearchService } from '../services/research.service';
import { ContentGenerationService } from '../services/content-generation.service';

const router = Router();
const researchService = new ResearchService();
const contentService = new ContentGenerationService();

// Validation schema
const generateGuideSchema = z.object({
  topic: z.string().min(3).max(200),
  preferences: z.object({
    depth: z.enum(['quick', 'standard', 'comprehensive', 'deep-dive']),
    audience: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']),
    style: z.enum(['tutorial', 'conceptual', 'practical']),
    length: z.enum(['short', 'medium', 'long']),
    images: z.enum(['with-ai-images', 'with-sourced-images', 'without-images']),
    format: z.enum(['blog-post', 'social-media', 'newsletter', 'documentation']),
    tone: z.enum(['professional', 'casual', 'technical', 'conversational']),
  }),
});

/**
 * POST /api/generate
 * Generate a complete guide based on topic and preferences
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    // Validate request
    const validatedData = generateGuideSchema.parse(req.body);
    const { topic, preferences } = validatedData;

    console.log(`Generating guide for topic: ${topic}`);

    // Phase 1: Research
    console.log('Phase 1: Researching...');
    const research = await researchService.comprehensiveResearch(topic);
    
    if (research.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Could not find enough research material for this topic',
      } as ApiResponse<never>);
    }

    // Phase 2: Generate content
    console.log('Phase 2: Generating content...');
    const guide = await contentService.generateGuide(topic, research, preferences);

    console.log('Guide generated successfully!');

    const response: ApiResponse<GeneratedGuide> = {
      success: true,
      data: guide,
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating guide:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: `Validation error: ${error.errors.map(e => e.message).join(', ')}`,
      } as ApiResponse<never>);
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate guide',
    } as ApiResponse<never>);
  }
});

/**
 * POST /api/research
 * Research a topic without generating content (useful for preview)
 */
router.post('/research', async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Topic is required and must be a string',
      } as ApiResponse<never>);
    }

    console.log(`Researching topic: ${topic}`);
    const research = await researchService.comprehensiveResearch(topic);

    res.json({
      success: true,
      data: research,
    } as ApiResponse<typeof research>);
  } catch (error) {
    console.error('Error researching topic:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to research topic',
    } as ApiResponse<never>);
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
