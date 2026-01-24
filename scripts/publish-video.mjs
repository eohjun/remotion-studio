import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const compositionId = args[0];
const dryRun = args.includes('--dry-run');

if (!compositionId) {
    console.error('Please provide a Composition ID.');
    process.exit(1);
}

// Project paths
const projectRoot = process.cwd();
const projectDir = path.join(projectRoot, 'projects', compositionId);
const youtubeDir = path.join(projectDir, 'youtube');
const videoPath = path.join(projectRoot, 'out', 'video.mp4'); // Default output location, arguably should be in projectDir/output

// Check if video exists
if (!fs.existsSync(videoPath)) {
    // Try looking in project output
    const projectVideoPath = path.join(projectDir, 'output', 'video.mp4');
    if (!fs.existsSync(projectVideoPath) && !dryRun) {
        console.error(`Video file not found at ${videoPath} or ${projectVideoPath}`);
        process.exit(1);
    }
}

// Read metadata
const metadataPath = path.join(youtubeDir, 'metadata.json');
let metadata = {};
if (fs.existsSync(metadataPath)) {
    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
} else {
    console.warn('No metadata.json found in youtube directory. Using defaults.');
}

console.log(`\n=== Publishing Video: ${compositionId} ===`);
console.log(`Title: ${metadata.title || 'Untitled'}`);
console.log(`Description: ${metadata.description ? metadata.description.substring(0, 50) + '...' : 'No description'}`);
console.log(`Tags: ${metadata.tags ? metadata.tags.join(', ') : 'None'}`);
console.log(`Video File: ${videoPath}`);

if (dryRun) {
    console.log('\n[DRY RUN] Would upload to YouTube now.');
    console.log('Upload simulated successfully.');
} else {
    // TODO: Implement actual YouTube Data API upload
    console.log('\n[MOCK] Uploading to YouTube... 0%... 50%... 100%');
    console.log('Video uploaded successfully! (Mock ID: dqw4w9wgxcq)');
}
