import { NextResponse } from 'next/server';

/**
 * Rota de diagnóstico para testar APIs de Bíblia
 * Visita: /api/test-bible
 * Remove depois de confirmar que funciona!
 */
export async function GET() {
  const results: Record<string, any> = {};

  // Helper com timeout
  async function testFetch(name: string, url: string) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const start = Date.now();
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      const elapsed = Date.now() - start;
      const data = await response.json();

      return {
        status: response.status,
        ok: response.ok,
        elapsed_ms: elapsed,
        has_data: !!data,
        is_array: Array.isArray(data),
        item_count: Array.isArray(data) ? data.length : (data.verses?.length || 'N/A'),
        has_text: !!data.text,
        has_verses: !!data.verses,
        error: data.error || null,
        first_item: Array.isArray(data) ? JSON.stringify(data[0])?.substring(0, 200) : undefined,
        first_verse: data.verses?.[0] ? JSON.stringify(data.verses[0]).substring(0, 200) : undefined,
        sample_text: (typeof data.text === 'string') ? data.text.substring(0, 200) : undefined,
      };
    } catch (e: any) {
      return {
        error: e.message || 'Unknown error',
        name: e.name,
      };
    }
  }

  // ====== Bible API tests ======
  results['bible-api_ephesians4_almeida'] = await testFetch(
    'Bible API - Ephesians 4 (almeida)',
    'https://bible-api.com/ephesians%204?translation=almeida'
  );

  results['bible-api_john3_16_almeida'] = await testFetch(
    'Bible API - John 3:16 (almeida)',
    'https://bible-api.com/john%203:16?translation=almeida'
  );

  results['bible-api_ephesians4_1-6_24_almeida'] = await testFetch(
    'Bible API - Ephesians 4:1-6:24 (almeida)',
    'https://bible-api.com/ephesians%204:1-6:24?translation=almeida'
  );

  results['bible-api_john3_16_default'] = await testFetch(
    'Bible API - John 3:16 (default/WEB)',
    'https://bible-api.com/john%203:16'
  );

  // ====== Bolls.life tests ======
  // Try different translation slugs for Portuguese
  const bollsSlugs = ['ARC', 'ACF', 'NVI', 'AA', 'RCUV'];
  for (const slug of bollsSlugs) {
    results[`bolls_get-text_${slug}_eph4`] = await testFetch(
      `Bolls.life get-text ${slug} - Ephesians 4`,
      `https://bolls.life/get-text/${slug}/49/4/`
    );
  }

  // Try get-chapter endpoint
  results['bolls_get-chapter_ARC_eph4'] = await testFetch(
    'Bolls.life get-chapter ARC - Ephesians 4',
    'https://bolls.life/get-chapter/ARC/49/4/'
  );

  // Try numeric IDs
  for (const id of [20, 211, 212, 213]) {
    results[`bolls_get-text_id${id}_eph4`] = await testFetch(
      `Bolls.life get-text ID=${id} - Ephesians 4`,
      `https://bolls.life/get-text/${id}/49/4/`
    );
  }

  // Get full translations list from Bolls.life
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const r = await fetch('https://bolls.life/static/bolls/app/views/languages.json', { signal: controller.signal });
    clearTimeout(timer);
    const langs = await r.json();
    // Find Portuguese translations
    const allTranslations: any[] = [];
    for (const lang of langs) {
      if (lang.translations) {
        for (const t of lang.translations) {
          allTranslations.push({
            language: lang.language,
            short_name: t.short_name,
            full_name: t.full_name,
          });
        }
      }
    }
    // Filter for Portuguese or anything with "almeida", "port", "pt"
    const ptTranslations = allTranslations.filter((t: any) => {
      const search = `${t.language} ${t.full_name} ${t.short_name}`.toLowerCase();
      return search.includes('portug') || search.includes('almeida') || search.includes('pt_') || search.includes('braz');
    });
    results['bolls_portuguese_translations'] = ptTranslations.length > 0 ? ptTranslations : 'NONE FOUND';
    results['bolls_all_translations_count'] = allTranslations.length;
    results['bolls_all_slugs'] = allTranslations.map((t: any) => t.short_name);
  } catch(e: any) {
    results['bolls_translations_error'] = e.message;
  }

  // Test bible-api.com with verse range instead of whole chapter
  results['bible-api_eph4_1-32_almeida'] = await testFetch(
    'Bible API - Ephesians 4:1-32 (almeida) - verse range',
    'https://bible-api.com/ephesians%204:1-32?translation=almeida'
  );

  results['bible-api_eph5_1-33_almeida'] = await testFetch(
    'Bible API - Ephesians 5:1-33 (almeida) - verse range',
    'https://bible-api.com/ephesians%205:1-33?translation=almeida'
  );

  // ====== GetBible.net API tests ======
  // Format: /v2/{translation}/{book_number}/{chapter}.json
  // Ephesians = book 49, Chapter 4
  results['getbible_almeida_eph4'] = await testFetch(
    'GetBible.net - Almeida Ephesians 4',
    'https://api.getbible.net/v2/almeida/49/4.json'
  );

  results['getbible_almeida_eph5'] = await testFetch(
    'GetBible.net - Almeida Ephesians 5',
    'https://api.getbible.net/v2/almeida/49/5.json'
  );

  results['getbible_almeida_eph6'] = await testFetch(
    'GetBible.net - Almeida Ephesians 6',
    'https://api.getbible.net/v2/almeida/49/6.json'
  );

  results['getbible_almeida_john3'] = await testFetch(
    'GetBible.net - Almeida John 3',
    'https://api.getbible.net/v2/almeida/43/3.json'
  );

  // Test bible-api.com with verse range
  results['bible-api_eph4_1-32_almeida'] = await testFetch(
    'Bible API - Ephesians 4:1-32 verse range',
    'https://bible-api.com/ephesians%204:1-32?translation=almeida'
  );

  // Free Use Bible API (bible.helloao.org)
  results['helloao_eph4_pt'] = await testFetch(
    'HelloAO Bible - Ephesians 4 PT',
    'https://bible.helloao.org/api/EPH/4/pt-BR-Almeida.json'
  );

  return NextResponse.json(results, { status: 200 });
}
