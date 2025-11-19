import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { GenerateGuideRequest, ApiResponse, GeneratedGuide } from '@guide-generator/shared';
import { ResearchService } from '../services/research.service';
import { ContentGenerationService } from '../services/content-generation.service';
import { GuideService } from "../services/guide.service";
import { GuideEditingService } from "../services/guide-editing.service";

const router = Router();
const researchService = new ResearchService();
const contentService = new ContentGenerationService();
const guideService = new GuideService();
const editingService = new GuideEditingService();

// Validation schema
const generateGuideSchema = z.object({
  topic: z.string().min(3).max(200),
  preferences: z.object({
    depth: z.enum(["quick", "standard", "comprehensive", "deep-dive"]),
    audience: z.enum(["beginner", "intermediate", "advanced", "mixed"]),
    style: z.enum(["tutorial", "conceptual", "practical"]),
    length: z.enum(["short", "medium", "long"]),
    images: z.enum(["with-ai-images", "with-sourced-images", "without-images"]),
    format: z.enum([
      "blog-post",
      "social-media",
      "newsletter",
      "documentation",
    ]),
    tone: z.enum(["professional", "casual", "technical", "conversational"]),
  }),
});

/**
 * POST /api/generate
 * Generate a complete guide based on topic and preferences
 */
router.post("/generate", async (req: Request, res: Response) => {
  try {
    // Validate request
    const validatedData = generateGuideSchema.parse(req.body);
    const { topic, preferences } = validatedData;

    console.log(`Generating guide for topic: ${topic}`);

    // Phase 1: Research
    console.log("Phase 1: Researching...");
    const research = await researchService.comprehensiveResearch(topic);

    if (research.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Could not find enough research material for this topic",
      } as ApiResponse<never>);
    }

    // Phase 2: Generate content
    console.log("Phase 2: Generating content...");
    const guide = await contentService.generateGuide(
      topic,
      research,
      preferences
    );

    // Phase 3: Save to database
    console.log("Phase 3: Saving guide to database...");
    await guideService.saveGuide(guide);

    console.log("Guide generated and saved successfully!");

    const response: ApiResponse<GeneratedGuide> = {
      success: true,
      data: guide,
    };

    res.json(response);
  } catch (error) {
    console.error("Error generating guide:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: `Validation error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`,
      } as ApiResponse<never>);
    }

    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate guide",
    } as ApiResponse<never>);
  }
});

/**
 * POST /api/research
 * Research a topic without generating content (useful for preview)
 */
router.post("/research", async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({
        success: false,
        error: "Topic is required and must be a string",
      } as ApiResponse<never>);
    }

    console.log(`Researching topic: ${topic}`);
    const research = await researchService.comprehensiveResearch(topic);

    res.json({
      success: true,
      data: research,
    } as ApiResponse<typeof research>);
  } catch (error) {
    console.error("Error researching topic:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to research topic",
    } as ApiResponse<never>);
  }
});

/**
 * GET /api/guides
 * Get all guides
 */
router.get("/guides", async (req: Request, res: Response) => {
  try {
    const guides = await guideService.getAllGuides();
    res.json({
      success: true,
      data: guides,
    } as ApiResponse<GeneratedGuide[]>);
  } catch (error) {
    console.error("Error fetching guides:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch guides",
    } as ApiResponse<never>);
  }
});

/**
 * GET /api/guides/:id
 * Get a specific guide by ID
 */
router.get("/guides/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const guide = await guideService.getGuide(id);

    if (!guide) {
      return res.status(404).json({
        success: false,
        error: "Guide not found",
      } as ApiResponse<never>);
    }

    res.json({
      success: true,
      data: guide,
    } as ApiResponse<GeneratedGuide>);
  } catch (error) {
    console.error("Error fetching guide:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch guide",
    } as ApiResponse<never>);
  }
});

/**
 * DELETE /api/guides/:id
 * Delete a guide by ID
 */
router.delete("/guides/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await guideService.deleteGuide(id);

    res.json({
      success: true,
      data: { message: "Guide deleted successfully" },
    } as ApiResponse<{ message: string }>);
  } catch (error) {
    console.error("Error deleting guide:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message,
      } as ApiResponse<never>);
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete guide",
    } as ApiResponse<never>);
  }
});

/**
 * POST /api/guides/:id/edit
 * Edit a guide using AI based on user instruction
 */
router.post("/guides/:id/edit", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { instruction } = req.body;

    if (!instruction || typeof instruction !== "string") {
      return res.status(400).json({
        success: false,
        error: "Instruction is required and must be a string",
      } as ApiResponse<never>);
    }

    // Get current guide
    const currentGuide = await guideService.getGuide(id);
    if (!currentGuide) {
      return res.status(404).json({
        success: false,
        error: "Guide not found",
      } as ApiResponse<never>);
    }

    // Edit guide using AI
    console.log(`Editing guide ${id} with instruction: ${instruction}`);
    const editedGuide = await editingService.editGuide(
      instruction,
      currentGuide
    );

    // Update guide in database
    await guideService.updateGuide(id, {
      content: editedGuide.content,
      title: editedGuide.title,
      metadata: editedGuide.metadata,
    });

    res.json({
      success: true,
      data: editedGuide,
    } as ApiResponse<GeneratedGuide>);
  } catch (error) {
    console.error("Error editing guide:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to edit guide",
    } as ApiResponse<never>);
  }
});

/**
 * PATCH /api/guides/:id
 * Update a guide (metadata updates, etc.)
 */
router.patch("/guides/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate that updates don't include ID
    if (updates.id) {
      return res.status(400).json({
        success: false,
        error: "Cannot update guide ID",
      } as ApiResponse<never>);
    }

    const updatedGuide = await guideService.updateGuide(id, updates);

    res.json({
      success: true,
      data: updatedGuide,
    } as ApiResponse<GeneratedGuide>);
  } catch (error) {
    console.error("Error updating guide:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message,
      } as ApiResponse<never>);
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to update guide",
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
