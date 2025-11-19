import { GeneratedGuide } from '@guide-generator/shared';
import { getDatabase } from '../database/database';

interface GuideRow {
  id: string;
  topic: string;
  title: string;
  content: string;
  outline: string;
  metadata: string;
  sources: string;
  preferences: string;
  created_at: number;
  updated_at: number;
}

export class GuideService {
  private db = getDatabase();

  /**
   * Save a new guide to the database
   */
  async saveGuide(guide: GeneratedGuide): Promise<void> {
    const now = Date.now();
    
    const stmt = this.db.prepare(`
      INSERT INTO guides (
        id, topic, title, content, outline, metadata, sources, preferences, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      guide.id,
      guide.topic,
      guide.title,
      guide.content,
      JSON.stringify(guide.outline),
      JSON.stringify(guide.metadata),
      JSON.stringify(guide.sources),
      JSON.stringify(guide.preferences),
      now,
      now
    );
  }

  /**
   * Get a guide by ID
   */
  async getGuide(id: string): Promise<GeneratedGuide | null> {
    const stmt = this.db.prepare('SELECT * FROM guides WHERE id = ?');
    const row = stmt.get(id) as GuideRow | undefined;

    if (!row) {
      return null;
    }

    return this.mapRowToGuide(row);
  }

  /**
   * Get all guides, sorted by creation date (newest first)
   */
  async getAllGuides(): Promise<GeneratedGuide[]> {
    const stmt = this.db.prepare('SELECT * FROM guides ORDER BY created_at DESC');
    const rows = stmt.all() as GuideRow[];

    return rows.map(row => this.mapRowToGuide(row));
  }

  /**
   * Delete a guide by ID
   */
  async deleteGuide(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM guides WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      throw new Error(`Guide with id ${id} not found`);
    }
  }

  /**
   * Update a guide
   */
  async updateGuide(id: string, updates: Partial<GeneratedGuide>): Promise<GeneratedGuide> {
    const existingGuide = await this.getGuide(id);
    if (!existingGuide) {
      throw new Error(`Guide with id ${id} not found`);
    }

    const updatedGuide: GeneratedGuide = {
      ...existingGuide,
      ...updates,
      id, // Ensure ID doesn't change
      createdAt: existingGuide.createdAt, // Preserve original creation date
    };

    // Update only changed fields
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.topic !== undefined) {
      fields.push('topic = ?');
      values.push(updates.topic);
    }
    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.content !== undefined) {
      fields.push('content = ?');
      values.push(updates.content);
    }
    if (updates.outline !== undefined) {
      fields.push('outline = ?');
      values.push(JSON.stringify(updates.outline));
    }
    if (updates.metadata !== undefined) {
      fields.push('metadata = ?');
      values.push(JSON.stringify(updates.metadata));
    }
    if (updates.sources !== undefined) {
      fields.push('sources = ?');
      values.push(JSON.stringify(updates.sources));
    }
    if (updates.preferences !== undefined) {
      fields.push('preferences = ?');
      values.push(JSON.stringify(updates.preferences));
    }

    // Always update updated_at
    fields.push('updated_at = ?');
    values.push(Date.now());
    values.push(id); // For WHERE clause

    if (fields.length > 1) { // More than just updated_at
      const sql = `UPDATE guides SET ${fields.join(', ')} WHERE id = ?`;
      this.db.prepare(sql).run(...values);
    }

    return updatedGuide;
  }

  /**
   * Map database row to GeneratedGuide object
   */
  private mapRowToGuide(row: GuideRow): GeneratedGuide {
    return {
      id: row.id,
      topic: row.topic,
      title: row.title,
      content: row.content,
      outline: JSON.parse(row.outline),
      metadata: JSON.parse(row.metadata),
      sources: JSON.parse(row.sources),
      preferences: JSON.parse(row.preferences),
      createdAt: new Date(row.created_at),
    };
  }
}

