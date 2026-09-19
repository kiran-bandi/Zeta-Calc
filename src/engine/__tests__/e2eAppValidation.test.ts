import fs from 'fs';
import path from 'path';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { CATEGORIES } from '../../data/categories';
import { buildCalculatorStructuredData } from '../../utils/seo';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    throw new Error(`Assertion failed: ${msg}`);
  } else {
    console.log(`✅ PASSED: ${msg}`);
  }
}

export function runE2EAppValidationTests() {
  console.log('\n--- STARTING COMPREHENSIVE E2E & SEO FUNCTIONALITY TEST SUITE ---\n');

  // 1. Validate All 330 Registered Tools
  console.log('--- 1. Validating Tools Registry & Category Links ---');
  assert(TOOLS_REGISTRY.length >= 330, `Expected at least 330 registered tools, found ${TOOLS_REGISTRY.length}`);

  const validCategoryIds = new Set(CATEGORIES.map((c) => c.id));
  for (const tool of TOOLS_REGISTRY) {
    assert(tool.slug && tool.slug.length > 2, `Tool slug exists: ${tool.slug}`);
    assert(tool.name && tool.name.length > 2, `Tool name exists: ${tool.name}`);
    assert(tool.description && tool.description.length > 10, `Tool description exists: ${tool.slug}`);
    assert(validCategoryIds.has(tool.category), `Tool ${tool.slug} maps to valid category: ${tool.category}`);
    assert(tool.seo && tool.seo.title.length > 5, `Tool ${tool.slug} has valid SEO title: ${tool.seo?.title}`);
    assert(Array.isArray(tool.seo?.keywords) && tool.seo.keywords.length > 0, `Tool ${tool.slug} has SEO keywords`);
  }
  console.log(`✅ All ${TOOLS_REGISTRY.length} tools verified with valid schema, category mapping, and SEO metadata.`);

  // 2. Validate index.html SEO, Social, Security & GEO Structured Data
  console.log('\n--- 2. Validating index.html Payload & SEO Standards ---');
  const indexHtmlPath = path.resolve('index.html');
  assert(fs.existsSync(indexHtmlPath), 'index.html exists');
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Title verification
  const titleMatch = indexHtml.match(/<title>(.*?)<\/title>/);
  assert(!!titleMatch, 'Title tag exists in index.html');
  const title = titleMatch![1].replace(/&amp;/g, '&');
  assert(title.startsWith('Free Online Calculators'), `Title begins with primary keyword. Got: "${title}"`);
  assert(title.length >= 30 && title.length <= 65, `Title length is optimal (${title.length} chars)`);

  // Meta Description verification
  const descMatch = indexHtml.match(/<meta\s+name="description"\s+content="(.*?)"/);
  assert(!!descMatch, 'Meta description exists in index.html');
  const metaDesc = descMatch![1];
  assert(metaDesc.length >= 120 && metaDesc.length <= 160, `Meta description length is optimal (${metaDesc.length} chars)`);
  assert(metaDesc.toLowerCase().includes('free online calculators'), 'Meta description includes primary keyword');
  assert(metaDesc.toLowerCase().includes('now') || metaDesc.toLowerCase().includes('today'), 'Meta description has actionable call-to-action');

  // Security & Browser Meta Tags
  assert(indexHtml.includes('http-equiv="X-Content-Type-Options" content="nosniff"'), 'X-Content-Type-Options nosniff is set');
  assert(indexHtml.includes('name="referrer" content="strict-origin-when-cross-origin"'), 'Referrer-Policy is set');

  // OpenGraph & Social Image Dimensions
  assert(indexHtml.includes('property="og:image:width" content="1200"'), 'OpenGraph image width 1200 is set');
  assert(indexHtml.includes('property="og:image:height" content="630"'), 'OpenGraph image height 630 is set');
  assert(indexHtml.includes('property="og:image:type" content="image/png"'), 'OpenGraph image type is set');
  assert(indexHtml.includes('property="og:image:alt"'), 'OpenGraph image alt is set');
  assert(indexHtml.includes('name="twitter:card" content="summary_large_image"'), 'Twitter card is summary_large_image');

  // Structured Data (Schema.org)
  const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(!!jsonLdMatch, 'JSON-LD schema script is present in index.html');
  const parsedSchema = JSON.parse(jsonLdMatch![1]);
  assert(parsedSchema['@context'] === 'https://schema.org', 'JSON-LD has valid schema.org context');
  assert(Array.isArray(parsedSchema['@graph']), 'JSON-LD uses @graph collection');

  const schemaTypes = parsedSchema['@graph'].map((item: any) => item['@type']);
  assert(schemaTypes.includes('WebSite'), 'Schema includes WebSite');
  assert(schemaTypes.includes('Organization'), 'Schema includes Organization (Entity: true)');
  assert(schemaTypes.includes('WebApplication'), 'Schema includes WebApplication (Entity: true)');
  assert(schemaTypes.includes('FAQPage'), 'Schema includes FAQPage (FAQ: true)');
  assert(schemaTypes.includes('HowTo'), 'Schema includes HowTo (HowTo: true)');

  // Verify FAQ content depth in schema
  const faqSchema = parsedSchema['@graph'].find((item: any) => item['@type'] === 'FAQPage');
  assert(faqSchema.mainEntity.length >= 5, `FAQPage has ${faqSchema.mainEntity.length} comprehensive Q&A entries`);

  // Verify HowTo content depth in schema
  const howToSchema = parsedSchema['@graph'].find((item: any) => item['@type'] === 'HowTo');
  assert(howToSchema.step.length >= 5, `HowTo has ${howToSchema.step.length} step-by-step instructions`);

  // 3. Validate Pre-rendered Semantic HTML Shell (#root)
  console.log('\n--- 3. Validating Pre-rendered Semantic HTML Shell (#root) ---');
  const rootContentMatch = indexHtml.match(/<div id="root">([\s\S]*?)<\/div>\s*<script/);
  assert(!!rootContentMatch, 'Root element contains pre-rendered fallback content for crawlers');
  const rootHtml = rootContentMatch![1];

  // Exactly one H1 check
  const h1Matches = rootHtml.match(/<h1[\s>][\s\S]*?<\/h1>/gi);
  assert(h1Matches !== null && h1Matches.length === 1, `Expected exactly 1 <h1> in document body, found ${h1Matches?.length}`);
  assert(h1Matches![0].toLowerCase().includes('free online calculators'), 'H1 contains primary target keyword');

  // Heading hierarchy (h2 and h3)
  const h2Matches = rootHtml.match(/<h2[\s>][\s\S]*?<\/h2>/gi);
  assert(h2Matches !== null && h2Matches.length >= 4, `Proper heading hierarchy: found ${h2Matches?.length} <h2> headings`);
  const h3Matches = rootHtml.match(/<h3[\s>][\s\S]*?<\/h3>/gi);
  assert(h3Matches !== null && h3Matches.length >= 10, `Proper heading hierarchy: found ${h3Matches?.length} <h3> sub-headings`);

  // Text-to-HTML & Word Count Verification
  const plainText = rootHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(' ').length;
  assert(wordCount >= 900, `Content depth verified: Body contains ${wordCount} words (benchmark was 0 words)`);
  const textToHtmlRatio = (plainText.length / rootHtml.length) * 100;
  assert(textToHtmlRatio > 15, `Text-to-HTML ratio verified: ${textToHtmlRatio.toFixed(1)}% (benchmark was 0.0%)`);

  // Internal Linking Verification
  const linkMatches = rootHtml.match(/href="([^"]+)"/g) || [];
  assert(linkMatches.length >= 30, `Internal linking verified: Found ${linkMatches.length} crawlable links (benchmark was 0 links)`);

  // 4. Validate Sitemap XML
  console.log('\n--- 4. Validating Sitemap Declarations & Lastmod Dates ---');
  const sitemapPath = path.resolve('public/sitemap.xml');
  assert(fs.existsSync(sitemapPath), 'sitemap.xml exists');
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');

  const urlBlocks = sitemapXml.match(/<url>[\s\S]*?<\/url>/g) || [];
  assert(urlBlocks.length >= 80, `Sitemap contains ${urlBlocks.length} indexed URLs`);

  let missingLastMod = 0;
  for (const block of urlBlocks) {
    if (!block.includes('<lastmod>')) {
      missingLastMod++;
    }
  }
  assert(missingLastMod === 0, `All sitemap URLs declare valid <lastmod> dates (missing: ${missingLastMod})`);

  // 5. Validate Dynamic Calculator Schema Generator (buildCalculatorStructuredData)
  console.log('\n--- 5. Validating Dynamic Tool Structured Data Generator ---');
  const toolStructuredData = buildCalculatorStructuredData(
    'Loan EMI Calculator',
    'Calculate loan monthly payments, total interest, and amortization schedule.',
    'https://zetacalculator.net/finance/emi-calculator',
    'Finance',
    'finance',
    [
      { question: 'What is EMI?', answer: 'Equated Monthly Installment.' }
    ]
  );

  assert(toolStructuredData['@context'] === 'https://schema.org', 'Dynamic schema has schema.org context');
  const toolGraphTypes = toolStructuredData['@graph'].map((g: any) => g['@type']);
  assert(toolGraphTypes.includes('WebApplication'), 'Dynamic schema generates WebApplication');
  assert(toolGraphTypes.includes('BreadcrumbList'), 'Dynamic schema generates BreadcrumbList');
  assert(toolGraphTypes.includes('FAQPage'), 'Dynamic schema generates FAQPage');
  assert(toolGraphTypes.includes('HowTo'), 'Dynamic schema generates HowTo');

  console.log('\n===============================================================');
  console.log('🎉 ALL END-TO-END VERIFICATIONS & TESTS PASSED WITH 100% SUCCESS!');
  console.log('===============================================================\n');
}

// Run immediately if this file is the entry point
runE2EAppValidationTests();
