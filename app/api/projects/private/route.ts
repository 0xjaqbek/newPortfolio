import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const revalidate = 3600; // Revalidate every hour

interface PrivateProject {
  id: string;
  title: string;
  description: string;
  content: string;
  filename: string;
  demoUrl?: string;
}

export async function GET() {
  try {
    const privateReadmesPath = path.join(process.cwd(), 'data', 'private-readmes');

    // Check if directory exists
    if (!fs.existsSync(privateReadmesPath)) {
      return NextResponse.json({ projects: [] });
    }

    // Read all markdown files
    const files = fs.readdirSync(privateReadmesPath).filter(file =>
      file.endsWith('.md') && !file.toLowerCase().includes('example')
    );

    const projects: PrivateProject[] = files.map((filename) => {
      const filePath = path.join(privateReadmesPath, filename);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Extract title (first # heading)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : filename.replace('.md', '');

      // Extract description (first paragraph after title or quote)
      const descMatch = content.match(/^>\s*\*?\*?(.+?)\*?\*?\s*$/m) ||
                        content.match(/^(?!#|>|\[|\!|\s*$)(.+)$/m);
      const description = descMatch ? descMatch[1].replace(/\*\*/g, '').trim() : 'Private project documentation';

      // Extract demo URL (look for common patterns)
      const urlMatch = content.match(/(?:Live URL|Demo|Website|URL):\s*(https?:\/\/[^\s\)]+)/i) ||
                       content.match(/\[.*?\]\((https?:\/\/[^\s\)]+)\)/) ||
                       content.match(/(https?:\/\/[^\s\)]+\.(?:pl|com|app|io|dev|net|org)(?:\/[^\s\)]*)?)/);
      const demoUrl = urlMatch ? urlMatch[1] : undefined;

      return {
        id: filename.replace('.md', ''),
        title,
        description,
        content,
        filename,
        demoUrl,
      };
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Failed to fetch private projects:', error);
    return NextResponse.json({ projects: [] });
  }
}
