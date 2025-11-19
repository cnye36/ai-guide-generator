import { GeneratedGuide } from '@guide-generator/shared';

export interface ExportOptions {
  includeMetadata?: boolean;
  includeSources?: boolean;
  includeOutline?: boolean;
}

export class ExportService {
  /**
   * Export guide as Markdown
   */
  exportMarkdown(guide: GeneratedGuide, options: ExportOptions = {}): string {
    const { includeMetadata = true, includeSources = true, includeOutline = true } = options;

    let content = `# ${guide.title}\n\n`;

    if (includeMetadata) {
      content += `**Topic:** ${guide.topic}\n`;
      content += `**Words:** ${guide.metadata.wordCount}\n`;
      content += `**Reading Time:** ${guide.metadata.readingTime} min\n`;
      content += `**Created:** ${new Date(guide.createdAt).toLocaleString()}\n\n`;
      content += '---\n\n';
    }

    if (includeOutline && guide.outline.length > 0) {
      content += '## Outline\n\n';
      guide.outline.forEach((section, index) => {
        content += `${index + 1}. ${section}\n`;
      });
      content += '\n---\n\n';
    }

    content += guide.content;

    if (includeSources && guide.sources.length > 0) {
      content += '\n\n---\n\n## Sources\n\n';
      guide.sources.forEach((source, index) => {
        content += `${index + 1}. [${source.title}](${source.url})\n`;
        if (source.snippet) {
          content += `   ${source.snippet}\n`;
        }
        content += '\n';
      });
    }

    return content;
  }

  /**
   * Export guide as HTML
   */
  exportHTML(guide: GeneratedGuide, options: ExportOptions = {}): string {
    const { includeMetadata = true, includeSources = true, includeOutline = true } = options;

    // Convert markdown to HTML (simplified - in production you'd use a proper markdown library)
    const markdownToHTML = (md: string): string => {
      return md
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/^\*(.*)\*/gim, '<em>$1</em>')
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
        .replace(/\n/g, '<br>');
    };

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${guide.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    h1 { color: #1a202c; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    h2 { color: #2d3748; margin-top: 30px; }
    h3 { color: #4a5568; }
    code {
      background: #f7fafc;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    pre {
      background: #f7fafc;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      border-left: 4px solid #4299e1;
    }
    a { color: #3182ce; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .metadata {
      background: #edf2f7;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .metadata p { margin: 5px 0; }
    .sources {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
    }
    ul { padding-left: 20px; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
  <h1>${guide.title}</h1>`;

    if (includeMetadata) {
      html += `
  <div class="metadata">
    <p><strong>Topic:</strong> ${guide.topic}</p>
    <p><strong>Words:</strong> ${guide.metadata.wordCount}</p>
    <p><strong>Reading Time:</strong> ${guide.metadata.readingTime} min</p>
    <p><strong>Created:</strong> ${new Date(guide.createdAt).toLocaleString()}</p>
  </div>`;
    }

    if (includeOutline && guide.outline.length > 0) {
      html += `
  <h2>Outline</h2>
  <ol>`;
      guide.outline.forEach((section) => {
        html += `\n    <li>${section}</li>`;
      });
      html += `
  </ol>`;
    }

    html += `
  <div>${markdownToHTML(guide.content)}</div>`;

    if (includeSources && guide.sources.length > 0) {
      html += `
  <div class="sources">
    <h2>Sources</h2>
    <ol>`;
      guide.sources.forEach((source) => {
        html += `
      <li>
        <a href="${source.url}" target="_blank" rel="noopener noreferrer">
          ${source.title}
        </a>
        ${source.snippet ? `<p style="margin-left: 20px; color: #666; font-size: 0.9em;">${source.snippet}</p>` : ''}
      </li>`;
      });
      html += `
    </ol>
  </div>`;
    }

    html += `
</body>
</html>`;

    return html;
  }

  /**
   * Export guide as JSON
   */
  exportJSON(guide: GeneratedGuide): string {
    return JSON.stringify(guide, null, 2);
  }

  /**
   * Download file
   */
  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Copy to clipboard
   */
  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  /**
   * Export guide with format and options
   */
  exportGuide(
    guide: GeneratedGuide,
    format: 'markdown' | 'html' | 'json',
    options: ExportOptions = {}
  ): void {
    let content: string;
    let filename: string;
    let mimeType: string;

    const sanitizedTitle = guide.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();

    switch (format) {
      case 'markdown':
        content = this.exportMarkdown(guide, options);
        filename = `${sanitizedTitle}.md`;
        mimeType = 'text/markdown';
        break;
      case 'html':
        content = this.exportHTML(guide, options);
        filename = `${sanitizedTitle}.html`;
        mimeType = 'text/html';
        break;
      case 'json':
        content = this.exportJSON(guide);
        filename = `${sanitizedTitle}.json`;
        mimeType = 'application/json';
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    this.downloadFile(content, filename, mimeType);
  }

  /**
   * Copy guide content to clipboard
   */
  async copyGuide(
    guide: GeneratedGuide,
    format: 'markdown' | 'html' | 'plain',
    options: ExportOptions = {}
  ): Promise<void> {
    let content: string;

    switch (format) {
      case 'markdown':
        content = this.exportMarkdown(guide, options);
        break;
      case 'html':
        content = this.exportHTML(guide, options);
        break;
      case 'plain':
        content = guide.content;
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    await this.copyToClipboard(content);
  }
}

export const exportService = new ExportService();

