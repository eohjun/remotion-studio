import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import * as cheerio from 'cheerio';

const args = process.argv.slice(2);
const input = args[0];
const outputFlagIndex = args.indexOf('--output');
const outputPath = outputFlagIndex !== -1 ? args[outputFlagIndex + 1] : 'ingested-source.md';

if (!input) {
    console.error('Please provide an input file or URL.');
    process.exit(1);
}

async function ingest() {
    let text = '';

    try {
        if (input.startsWith('http')) {
            console.log(`Fetching URL: ${input}`);
            const response = await fetch(input);
            const html = await response.text();
            const $ = cheerio.load(html);

            // Remove scripts, styles, and other non-content elements
            $('script').remove();
            $('style').remove();
            $('nav').remove();
            $('footer').remove();
            $('header').remove();

            // Extract main content - simplistic approach, can be improved
            text = $('body').text().replace(/\s+/g, ' ').trim();
            text = `Source URL: ${input}\n\n${text}`;
        } else if (input.endsWith('.pdf')) {
            console.log(`Reading PDF: ${input}`);
            const dataBuffer = fs.readFileSync(input);
            const data = await pdf(dataBuffer);
            text = data.text;
        } else if (input.endsWith('.docx')) {
            console.log(`Reading DOCX: ${input}`);
            const result = await mammoth.extractRawText({ path: input });
            text = result.value;
        } else if (input.endsWith('.md') || input.endsWith('.txt')) {
            console.log(`Reading Text file: ${input}`);
            text = fs.readFileSync(input, 'utf-8');
        } else {
            console.error('Unsupported file format.');
            process.exit(1);
        }

        // Basic Markdown cleanup
        const markdown = cleanTextToMarkdown(text);

        fs.writeFileSync(outputPath, markdown);
        console.log(`Successfully saved content to ${outputPath}`);

    } catch (error) {
        console.error('Error ingesting source:', error);
        process.exit(1);
    }
}

function cleanTextToMarkdown(text) {
    // Simple cleanup to ensure it's readable
    // 1. Normalize whitespace (mostly done above for URL)
    // 2. Try to preserve some paragraph structure if possible
    // For now, comprehensive cleanup is left to the LLM agent, this script just extracts.

    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n\n');
}

ingest();
