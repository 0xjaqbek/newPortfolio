import { Profile } from '@/types/profile';
import fs from 'fs';
import path from 'path';

export async function loadProfile(): Promise<Profile | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'profile.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to load profile:', error);
    return null;
  }
}

export async function loadKnowledgeBase(): Promise<any> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'knowledge-base.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to load knowledge base:', error);
    return {};
  }
}

export async function loadPrivateReadmes(): Promise<Record<string, string>> {
  try {
    const dirPath = path.join(process.cwd(), 'data', 'private-readmes');
    const files = fs.readdirSync(dirPath);
    const readmes: Record<string, string> = {};

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(dirPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        readmes[file] = content;
      }
    }

    return readmes;
  } catch (error) {
    console.error('Failed to load private READMEs:', error);
    return {};
  }
}
