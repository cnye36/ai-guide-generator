// Guide generation preferences
export type GuideDepth = 'quick' | 'standard' | 'comprehensive' | 'deep-dive';
export type AudienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'mixed';
export type GuideStyle = 'tutorial' | 'conceptual' | 'practical';
export type GuideLength = 'short' | 'medium' | 'long';
export type ImagePreference = 'with-ai-images' | 'with-sourced-images' | 'without-images';
export type OutputFormat = 'blog-post' | 'social-media' | 'newsletter' | 'documentation';
export type ToneStyle = 'professional' | 'casual' | 'technical' | 'conversational';

export interface GuidePreferences {
  depth: GuideDepth;
  audience: AudienceLevel;
  style: GuideStyle;
  length: GuideLength;
  images: ImagePreference;
  format: OutputFormat;
  tone: ToneStyle;
}

// Generation request
export interface GenerateGuideRequest {
  topic: string;
  preferences: GuidePreferences;
}

// Research results
export interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
  relevanceScore?: number;
}

export interface ResearchResult {
  query: string;
  sources: ResearchSource[];
  summary: string;
}

// Generated guide
export interface GeneratedGuide {
  id: string;
  topic: string;
  title: string;
  content: string;
  outline: string[];
  metadata: {
    wordCount: number;
    readingTime: number;
    seoScore?: number;
    readabilityScore?: number;
  };
  sources: ResearchSource[];
  preferences: GuidePreferences;
  createdAt: Date;
}

// API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GenerationProgress {
  stage: 'researching' | 'outlining' | 'generating' | 'enhancing' | 'complete';
  progress: number;
  message: string;
}

// Export formats
export interface ExportOptions {
  format: 'markdown' | 'html' | 'pdf' | 'json';
  includeMetadata: boolean;
  includeSources: boolean;
}

export interface SocialMediaSnippet {
  platform: 'twitter' | 'linkedin' | 'facebook';
  content: string;
  hashtags?: string[];
}
