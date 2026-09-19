/**
 * SEO & Meta Tag Management Utility for Zeta Calculator
 * Handles document titles, descriptions, canonical URLs, and JSON-LD structured data
 */

export interface SEOMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export function updatePageSEO(meta: SEOMetadata) {
  if (typeof document === 'undefined') return;

  // 1. Update Title
  document.title = meta.title;

  // 2. Update Meta Description
  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement('meta');
    descTag.setAttribute('name', 'description');
    document.head.appendChild(descTag);
  }
  descTag.setAttribute('content', meta.description);

  // 3. Update Open Graph Title & Description
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', meta.title);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', meta.description);

  let ogType = document.querySelector('meta[property="og:type"]');
  if (!ogType) {
    ogType = document.createElement('meta');
    ogType.setAttribute('property', 'og:type');
    document.head.appendChild(ogType);
  }
  ogType.setAttribute('content', meta.ogType || 'website');

  let ogSiteName = document.querySelector('meta[property="og:site_name"]');
  if (!ogSiteName) {
    ogSiteName = document.createElement('meta');
    ogSiteName.setAttribute('property', 'og:site_name');
    document.head.appendChild(ogSiteName);
  }
  ogSiteName.setAttribute('content', 'Zeta Calculator');

  // Update Twitter Title & Description
  let twCard = document.querySelector('meta[name="twitter:card"]');
  if (!twCard) {
    twCard = document.createElement('meta');
    twCard.setAttribute('name', 'twitter:card');
    document.head.appendChild(twCard);
  }
  twCard.setAttribute('content', 'summary_large_image');

  let twTitle = document.querySelector('meta[name="twitter:title"]');
  if (!twTitle) {
    twTitle = document.createElement('meta');
    twTitle.setAttribute('name', 'twitter:title');
    document.head.appendChild(twTitle);
  }
  twTitle.setAttribute('content', meta.title);

  let twDesc = document.querySelector('meta[name="twitter:description"]');
  if (!twDesc) {
    twDesc = document.createElement('meta');
    twDesc.setAttribute('name', 'twitter:description');
    document.head.appendChild(twDesc);
  }
  twDesc.setAttribute('content', meta.description);

  // 4. Update Canonical Tag (strictly one canonical tag per page)
  const canonicalHref = meta.canonicalUrl || (typeof window !== 'undefined' ? window.location.href.split('#')[0] : 'https://zetacalculator.net/');
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (!canonicalTag) {
    canonicalTag = document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalTag);
  }
  canonicalTag.setAttribute('href', canonicalHref);

  // 5. Update JSON-LD structured data
  const existingScript = document.getElementById('zeta-calculator-json-ld');
  if (existingScript) {
    existingScript.remove();
  }

  if (meta.jsonLd) {
    const script = document.createElement('script');
    script.id = 'zeta-calculator-json-ld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(meta.jsonLd);
    document.head.appendChild(script);
  }
}

/**
 * Builds standard Google Rich Snippet Schema graph (WebApplication + FAQPage + Breadcrumbs)
 */
export function buildCalculatorStructuredData(
  toolName: string,
  description: string,
  url: string,
  categoryName: string,
  categorySlug: string,
  faqs?: { question: string; answer: string }[]
) {
  const graphs: Record<string, any>[] = [
    {
      '@type': 'WebApplication',
      name: `${toolName} – Zeta Calculator`,
      url: url,
      description: description,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any (Web Browser)',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Zeta Calculator',
        url: 'https://zetacalculator.net',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://zetacalculator.net/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: categoryName,
          item: `https://zetacalculator.net/#/category/${categorySlug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: toolName,
          item: url,
        },
      ],
    },
  ];

  if (faqs && faqs.length > 0) {
    graphs.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  // Add HowTo schema for every calculator tool for AI answer engines (GEO)
  graphs.push({
    '@type': 'HowTo',
    name: `How to Calculate Using the ${toolName}`,
    description: `Step-by-step instructions for calculating results and amortizations using the ${toolName} on Zeta Calculator.`,
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Enter Inputs',
        text: `Input your required values and select your preferred units or currency in the ${toolName}.`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Calculate Instantly',
        text: 'View real-time deterministic results, key metrics, and amortization schedules.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Compare or Export',
        text: 'Save the calculation to your history, compare with alternative scenarios, or export the report.',
      },
    ],
  });

  return {
    '@context': 'https://schema.org',
    '@graph': graphs,
  };
}

