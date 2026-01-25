import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_VOICE_ID = process.env.HEYGEN_VOICE_ID || '1bd001e7e50f421d891986aad5158bc8';
const API_URL = 'https://api.heygen.com';

// Polling configuration
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_TIME_MS = 10 * 60 * 1000; // 10 minutes timeout

// Helper for API requests with consistent error handling
async function apiRequest(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    const resp = await fetch(url, {
        ...options,
        headers: {
            'X-Api-Key': HEYGEN_API_KEY,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`API Error (${resp.status}): ${errorText}`);
    }

    const data = await resp.json();
    if (data.error) {
        throw new Error(`HeyGen Error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    return data;
}

async function generateVideo(avatarId, text) {
    console.log('Requesting video generation...');

    const data = await apiRequest('/v2/video/generate', {
        method: 'POST',
        body: JSON.stringify({
            video_inputs: [
                {
                    character: {
                        type: 'talking_photo',
                        talking_photo_id: avatarId
                    },
                    voice: {
                        type: 'text',
                        input_text: text,
                        voice_id: HEYGEN_VOICE_ID
                    },
                    background: {
                        type: 'color',
                        value: '#00FF00' // Green screen for chroma key
                    }
                }
            ],
            dimension: { width: 1080, height: 1920 } // Shorts ratio (9:16)
        })
    });

    return data.data.video_id;
}

async function checkStatus(videoId) {
    const data = await apiRequest(`/v1/video_status.get?video_id=${videoId}`, {
        method: 'GET',
    });
    return data.data;
}

async function downloadVideo(url, destPath) {
    console.log(`Downloading video to ${destPath}...`);

    const resp = await fetch(url);
    if (!resp.ok) {
        throw new Error(`Download failed: ${resp.status}`);
    }

    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    // Use pipeline for proper stream handling in Node.js
    const destStream = fs.createWriteStream(destPath);
    await pipeline(Readable.fromWeb(resp.body), destStream);

    console.log(`Saved to ${destPath}`);
}

async function pollForCompletion(videoId) {
    const startTime = Date.now();

    while (true) {
        const elapsed = Date.now() - startTime;

        if (elapsed > MAX_POLL_TIME_MS) {
            throw new Error(`Timeout: Video generation exceeded ${MAX_POLL_TIME_MS / 1000 / 60} minutes`);
        }

        const status = await checkStatus(videoId);
        const elapsedMin = (elapsed / 1000 / 60).toFixed(1);
        console.log(`Status: ${status.status} (${elapsedMin}min elapsed)`);

        if (status.status === 'completed') {
            return status.video_url;
        } else if (status.status === 'failed') {
            throw new Error(`Video generation failed: ${status.error || 'Unknown error'}`);
        }

        await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
    }
}

function printUsage() {
    console.log(`
Usage: node scripts/generate-avatar.mjs [options]

Options:
  --text, -t <text>     Text for the avatar to speak (required if no --text-file)
  --text-file <path>    Read text from file
  --output, -o <path>   Output video path (default: public/characters/ai-reporter-video.mp4)
  --help, -h            Show this help

Environment variables (in .env):
  HEYGEN_API_KEY        Required. Your HeyGen API key
  HEYGEN_AVATAR_ID      Required. Talking Photo ID from HeyGen dashboard
  HEYGEN_VOICE_ID       Optional. Voice ID (default: generic voice)

Example:
  node scripts/generate-avatar.mjs -t "안녕하세요, AI 리포터입니다."
  node scripts/generate-avatar.mjs --text-file scripts/narration.txt -o output/video.mp4
`);
}

function parseArgs(args) {
    const result = {
        text: null,
        textFile: null,
        output: 'public/characters/ai-reporter-video.mp4',
        help: false,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--text':
            case '-t':
                result.text = args[++i];
                break;
            case '--text-file':
                result.textFile = args[++i];
                break;
            case '--output':
            case '-o':
                result.output = args[++i];
                break;
            case '--help':
            case '-h':
                result.help = true;
                break;
        }
    }

    return result;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

    if (args.help) {
        printUsage();
        process.exit(0);
    }

    // Check API key
    if (!HEYGEN_API_KEY) {
        console.error('Error: HEYGEN_API_KEY is not defined in .env file');
        process.exit(1);
    }

    // Get text input
    let text = args.text;
    if (!text && args.textFile) {
        if (!fs.existsSync(args.textFile)) {
            console.error(`Error: Text file not found: ${args.textFile}`);
            process.exit(1);
        }
        text = fs.readFileSync(args.textFile, 'utf8').trim();
    }
    if (!text) {
        text = 'This is a test of the automatic reporter system.';
        console.log('No text provided, using default test message.');
    }

    // Get avatar ID
    const avatarId = process.env.HEYGEN_AVATAR_ID;
    if (!avatarId) {
        console.error(`
Error: HEYGEN_AVATAR_ID is not set.

To get your Talking Photo ID:
1. Go to HeyGen Dashboard (https://app.heygen.com)
2. Navigate to "Talking Photo" section
3. Upload your character image (public/characters/ai-reporter.png)
4. Copy the generated Talking Photo ID
5. Add to .env: HEYGEN_AVATAR_ID=your_id_here
`);
        process.exit(1);
    }

    try {
        console.log('='.repeat(50));
        console.log('HeyGen Avatar Video Generator');
        console.log('='.repeat(50));
        console.log(`Avatar ID: ${avatarId}`);
        console.log(`Voice ID: ${HEYGEN_VOICE_ID}`);
        console.log(`Text: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
        console.log(`Output: ${args.output}`);
        console.log('='.repeat(50));

        const videoId = await generateVideo(avatarId, text);
        console.log(`Video task started: ${videoId}`);

        const videoUrl = await pollForCompletion(videoId);
        console.log(`Video ready: ${videoUrl}`);

        await downloadVideo(videoUrl, args.output);

        console.log('='.repeat(50));
        console.log('✅ Done!');
        console.log('='.repeat(50));

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

main();
