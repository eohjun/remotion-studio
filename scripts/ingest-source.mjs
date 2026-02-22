import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const input = args[0];
const outputFlagIndex = args.indexOf('--output');
const outputPath = outputFlagIndex !== -1 ? args[outputFlagIndex + 1] : 'ingested-source.md';

if (!input) {
    console.error('Usage: node scripts/ingest-source.mjs <input> [--output <path>]');
    console.error('  Input: URL, .pdf, .docx, .md, or .txt file');
    process.exit(1);
}

async function ingest() {
    let text = '';

    try {
        if (input.startsWith('http')) {
            console.log(`Fetching URL: ${input}`);
            const response = await fetch(input);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const html = await response.text();
            const cheerio = await import('cheerio');
            const $ = cheerio.load(html);

            $('script').remove();
            $('style').remove();
            $('nav').remove();
            $('footer').remove();
            $('header').remove();

            text = $('body').text().trim();
            text = `Source URL: ${input}\n\n${text}`;
        } else if (input.endsWith('.pdf')) {
            console.log(`Reading PDF: ${input}`);
            const pdf = (await import('pdf-parse')).default;
            const dataBuffer = fs.readFileSync(input);
            const data = await pdf(dataBuffer);
            text = data.text;
        } else if (input.endsWith('.docx')) {
            console.log(`Reading DOCX: ${input}`);
            const mammoth = (await import('mammoth')).default;
            const result = await mammoth.extractRawText({ path: input });
            text = result.value;
        } else if (input.endsWith('.md') || input.endsWith('.txt')) {
            console.log(`Reading Text file: ${input}`);
            text = fs.readFileSync(input, 'utf-8');
        } else {
            console.error('Unsupported file format. Supported: .pdf, .docx, .md, .txt, or URL');
            process.exit(1);
        }

        const markdown = cleanTextToMarkdown(text);

        const outputDir = path.dirname(outputPath);
        if (outputDir && !fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, markdown);
        console.log(`✅ Saved to ${outputPath} (${markdown.length} chars)`);

    } catch (error) {
        console.error('❌ Error ingesting source:', error.message);
        process.exit(1);
    }
}

function cleanTextToMarkdown(text) {
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n\n');
}

ingest();
