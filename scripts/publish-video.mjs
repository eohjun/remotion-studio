#!/usr/bin/env node
/**
 * Video Publisher Script
 *
 * Handles metadata generation and video publishing.
 * Auto-generates metadata.json and description.txt if missing.
 *
 * Usage:
 *   node scripts/publish-video.mjs <compositionId> [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const compositionId = args[0];
const dryRun = args.includes('--dry-run');

if (!compositionId) {
  console.error('❌ Please provide a Composition ID.');
  console.error('Usage: node scripts/publish-video.mjs <compositionId> [--dry-run]');
  process.exit(1);
}

// Paths
const projectDir = path.join(projectRoot, 'projects', compositionId);
const youtubeDir = path.join(projectDir, 'youtube');
const narrationPath = path.join(projectDir, 'narration.json');
const metadataPath = path.join(youtubeDir, 'metadata.json');
const descriptionPath = path.join(youtubeDir, 'description.txt');

// Possible video locations
const videoPaths = [
  path.join(projectRoot, 'out', `${compositionId.toLowerCase()}.mp4`),
  path.join(projectRoot, 'out', `${compositionId}.mp4`),
  path.join(projectRoot, 'out', 'video.mp4'),
  path.join(projectDir, 'output', 'video.mp4'),
];

// ============================================
// Helper Functions
// ============================================

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function detectLanguage(narration) {
  if (narration.metadata?.language) {
    return narration.metadata.language;
  }
  // Check for Korean characters
  const text = narration.scenes?.map(s => s.text).join(' ') || '';
  const hasKorean = /[\uAC00-\uD7AF]/.test(text);
  return hasKorean ? 'ko' : 'en';
}

function formatTimestamp(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function generateTitle(narration, language) {
  const baseTitle = narration.metadata?.title || compositionId;

  // Add hook based on language
  if (language === 'ko') {
    return baseTitle;
  }
  return baseTitle;
}

function generateTags(narration, language) {
  const title = narration.metadata?.title?.toLowerCase() || '';
  const baseTags = [];

  // Extract keywords from title
  const words = title.split(/[\s:,\-]+/).filter(w => w.length > 3);
  baseTags.push(...words.slice(0, 5));

  // Add common tags based on language
  if (language === 'ko') {
    baseTags.push('자기계발', '심리학', '생산성', '동기부여', '교육');
  } else {
    baseTags.push('productivity', 'psychology', 'self improvement', 'motivation', 'education');
  }

  return [...new Set(baseTags)].slice(0, 15);
}

function generateChapters(narration) {
  const chapters = [];
  let currentTime = 0;

  for (const scene of narration.scenes || []) {
    chapters.push({
      time: formatTimestamp(currentTime),
      title: scene.title || scene.id
    });
    currentTime += scene.duration || 10;
  }

  return chapters;
}

function generateMetadata(narration) {
  const language = detectLanguage(narration);
  const chapters = generateChapters(narration);

  return {
    title: generateTitle(narration, language),
    description: narration.metadata?.title || `Video about ${compositionId}`,
    tags: generateTags(narration, language),
    category: "Education",
    language: language,
    defaultAudioLanguage: language,
    privacy: "public",
    madeForKids: false,
    chapters: chapters
  };
}

function generateDescription(metadata, narration, language) {
  const chapters = metadata.chapters || [];
  const tags = metadata.tags || [];

  let description = '';

  if (language === 'ko') {
    description = `${metadata.description}

이 영상에서 다루는 내용을 확인하세요.

⏱️ 챕터
${chapters.map(c => `${c.time} - ${c.title}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👍 도움이 되셨다면 좋아요와 구독 부탁드립니다!

${tags.slice(0, 10).map(t => `#${t.replace(/\s+/g, '')}`).join(' ')}
`;
  } else {
    description = `${metadata.description}

In this video, we explore the key concepts and practical takeaways.

⏱️ CHAPTERS
${chapters.map(c => `${c.time} - ${c.title}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👍 If you found this helpful, please like and subscribe!

${tags.slice(0, 10).map(t => `#${t.replace(/\s+/g, '')}`).join(' ')}
`;
  }

  return description;
}

// ============================================
// Main Process
// ============================================

console.log(`\n${'='.repeat(50)}`);
console.log(`  VIDEO PUBLISHER: ${compositionId}`);
console.log(`${'='.repeat(50)}\n`);

// 1. Find video file
let videoPath = null;
for (const vp of videoPaths) {
  if (fs.existsSync(vp)) {
    videoPath = vp;
    break;
  }
}

if (!videoPath && !dryRun) {
  console.error('❌ Video file not found. Checked:');
  videoPaths.forEach(p => console.error(`   - ${p}`));
  console.error('\nRun: npx remotion render ' + compositionId + ' out/' + compositionId.toLowerCase() + '.mp4');
  process.exit(1);
}

console.log(`📁 Video: ${videoPath || '(not found - dry run)'}`);

// 2. Ensure youtube directory exists
ensureDir(youtubeDir);

// 3. Load or generate narration
let narration = { scenes: [], metadata: { title: compositionId } };
if (fs.existsSync(narrationPath)) {
  narration = JSON.parse(fs.readFileSync(narrationPath, 'utf-8'));
  console.log(`📄 Narration: ${narrationPath}`);
} else {
  console.log(`⚠️  No narration.json found, using defaults`);
}

const language = detectLanguage(narration);
console.log(`🌐 Language: ${language}`);

// 4. Generate or load metadata
let metadata;
if (fs.existsSync(metadataPath)) {
  metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
  console.log(`📋 Metadata: Loaded existing`);
} else {
  metadata = generateMetadata(narration);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`📋 Metadata: Generated → ${metadataPath}`);
}

// 5. Generate description.txt if missing
if (!fs.existsSync(descriptionPath)) {
  const description = generateDescription(metadata, narration, language);
  fs.writeFileSync(descriptionPath, description);
  console.log(`📝 Description: Generated → ${descriptionPath}`);
} else {
  console.log(`📝 Description: Already exists`);
}

// 6. Display summary
console.log(`\n--- Metadata Summary ---`);
console.log(`Title: ${metadata.title}`);
console.log(`Tags: ${(metadata.tags || []).slice(0, 5).join(', ')}...`);
console.log(`Chapters: ${(metadata.chapters || []).length}`);
console.log(`Category: ${metadata.category}`);

// 7. Publish (mock)
if (dryRun) {
  console.log(`\n🔍 [DRY RUN] Validation complete.`);
  console.log(`   Would upload: ${videoPath || 'video file'}`);
} else {
  console.log(`\n🚀 [MOCK] Uploading to YouTube...`);
  console.log(`   Progress: 0%... 25%... 50%... 75%... 100%`);
  console.log(`\n✅ Upload complete! (Mock)`);
  console.log(`   URL: https://youtube.com/watch?v=mock_${compositionId.toLowerCase()}`);
}

console.log(`\n📂 Output files:`);
console.log(`   ${metadataPath}`);
console.log(`   ${descriptionPath}`);
console.log();
