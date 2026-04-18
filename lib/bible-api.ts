/**
 * Integração com APIs de Bíblia para o aplicativo devotional "365 com Deus"
 *
 * Este módulo fornece acesso a textos bíblicos em português através de múltiplas APIs:
 * - Bible API (https://bible-api.com/) - API primária
 * - Bolls.life (https://bolls.life/) - API secundária
 *
 * Suporta múltiplas versões em português e implementa cache em memória
 * para otimizar chamadas à API.
 */

/**
 * Tipos exportados para uso em toda a aplicação
 */

export type BibleVersion = 'ARC' | 'NVI' | 'ARA' | 'ACF';

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BiblePassage {
  reference: string;
  version: BibleVersion;
  text: string;
  verses: BibleVerse[];
  source: 'bible-api' | 'bolls-life';
}

/**
 * Mapeamento de nomes de livros em português para formato de API
 * Inclui todas as 66 livros da Bíblia
 */
const PORTUGUESE_BOOK_MAPPING: Record<string, string> = {
  // Antigo Testamento - Pentateuco (PT-BR + PT-PT)
  'Gênesis': 'genesis',
  'Génesis': 'genesis',
  'Êxodo': 'exodus',
  'Levítico': 'leviticus',
  'Números': 'numbers',
  'Deuteronômio': 'deuteronomy',
  'Deuteronómio': 'deuteronomy',

  // Antigo Testamento - Históricos
  'Josué': 'joshua',
  'Juízes': 'judges',
  'Rute': 'ruth',
  '1 Samuel': '1 samuel',
  '2 Samuel': '2 samuel',
  '1 Reis': '1 kings',
  '2 Reis': '2 kings',
  '1 Crônicas': '1 chronicles',
  '1 Crónicas': '1 chronicles',
  '2 Crônicas': '2 chronicles',
  '2 Crónicas': '2 chronicles',
  'Esdras': 'ezra',
  'Neemias': 'nehemiah',
  'Ester': 'esther',

  // Antigo Testamento - Poéticos
  'Jó': 'job',
  'Salmos': 'psalms',
  'Provérbios': 'proverbs',
  'Eclesiastes': 'ecclesiastes',
  'Cântico dos Cânticos': 'song of songs',
  'Cânticos': 'song of songs',

  // Antigo Testamento - Profetas Maiores
  'Isaías': 'isaiah',
  'Jeremias': 'jeremiah',
  'Lamentações': 'lamentations',
  'Ezequiel': 'ezekiel',
  'Daniel': 'daniel',

  // Antigo Testamento - Profetas Menores
  'Oséias': 'hosea',
  'Oseias': 'hosea',
  'Joel': 'joel',
  'Amós': 'amos',
  'Obadias': 'obadiah',
  'Abdias': 'obadiah',
  'Jonas': 'jonah',
  'Miqueias': 'micah',
  'Naum': 'nahum',
  'Habacuque': 'habakkuk',
  'Sofonias': 'zephaniah',
  'Ageu': 'haggai',
  'Zacarias': 'zechariah',
  'Malaquias': 'malachi',

  // Novo Testamento - Evangelhos
  'Mateus': 'matthew',
  'Marcos': 'mark',
  'Lucas': 'luke',
  'João': 'john',

  // Novo Testamento - Histórico
  'Atos': 'acts',

  // Novo Testamento - Epístolas de Paulo
  'Romanos': 'romans',
  '1 Coríntios': '1 corinthians',
  '2 Coríntios': '2 corinthians',
  'Gálatas': 'galatians',
  'Efésios': 'ephesians',
  'Filipenses': 'philippians',
  'Colossenses': 'colossians',
  '1 Tessalonicenses': '1 thessalonians',
  '2 Tessalonicenses': '2 thessalonians',
  '1 Timóteo': '1 timothy',
  '2 Timóteo': '2 timothy',
  'Tito': 'titus',
  'Filemom': 'philemon',
  'Filémon': 'philemon',

  // Novo Testamento - Hebreus e Epístolas Gerais
  'Hebreus': 'hebrews',
  'Tiago': 'james',
  '1 Pedro': '1 peter',
  '2 Pedro': '2 peter',
  '1 João': '1 john',
  '2 João': '2 john',
  '3 João': '3 john',
  'Judas': 'jude',

  // Novo Testamento - Apocalipse
  'Apocalipse': 'revelation',
};

/**
 * Cache em memória para armazenar passagens já fetchadas
 * Estrutura: { chave: "livro-capitulo-versiculo-versao" => passagem }
 */
const passageCache: Map<string, BiblePassage> = new Map();

/**
 * Versões disponíveis da Bíblia
 */
const AVAILABLE_VERSIONS: BibleVersion[] = ['ARC', 'NVI', 'ARA', 'ACF'];

/** Timeout para pedidos a APIs externas (8 segundos) */
const API_TIMEOUT_MS = 8000;

/**
 * Faz fetch com timeout usando AbortController
 */
async function fetchWithTimeout(url: string, timeoutMs: number = API_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Mapeamento de versões para códigos de API
 * Bible-API usa códigos específicos para cada versão
 */
const VERSION_API_MAPPING: Record<BibleVersion, string> = {
  'ARC': 'almeida',  // Almeida Revista e Corrigida
  'NVI': 'almeida',  // Fallback para almeida (bible-api.com só tem almeida em PT)
  'ARA': 'almeida',  // Fallback para almeida
  'ACF': 'almeida',  // Fallback para almeida
};

/**
 * Parseia uma referência bíblica em português e extrai os componentes
 *
 * Exemplos:
 * - "Gênesis 1:1" => { book: "genesis", chapter: 1, verse: 1 }
 * - "João 3:16–18" => { book: "john", chapter: 3, startVerse: 16, endVerse: 18 }
 * - "Romanos 3:21-31" => { book: "romans", chapter: 3, startVerse: 21, endVerse: 31 }
 */
function parsePortugueseReference(reference: string): {
  book: string;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
  endChapter?: number;
  endChapterVerse?: number;
} | null {
  // Remove espaços extras
  const normalized = reference.trim();

  // Padrão 1: "Livro Cap:Verso-Verso" (dentro do mesmo capítulo)
  const singleChapterMatch = normalized.match(
    /^(.+?)\s+(\d+):(\d+)(?:[-–](\d+))?$/
  );

  // Padrão 2: "Livro Cap:Verso-Cap:Verso" (entre capítulos, ex: "Génesis 1:1–2:3")
  const multiChapterMatch = normalized.match(
    /^(.+?)\s+(\d+):(\d+)[-–](\d+):(\d+)$/
  );

  // Padrão 3: "Livro Cap:Verso-Livro Cap:Verso" ou "Livro Cap-Cap" (intervalos simples de capítulos)
  // Ex: "Romanos 1:1-Filémon 1:25" ou "Salmos 42:1-43:5"
  const chapterRangeMatch = normalized.match(
    /^(.+?)\s+(\d+)(?::(\d+))?[-–](.+?)$/
  );

  // Padrão 4: "Livro Cap" (capítulo inteiro, sem versículo)
  const chapterOnlyMatch = normalized.match(
    /^(.+?)\s+(\d+)$/
  );

  let bookName: string;
  let chapter: number;
  let startVerse: number | undefined;
  let endVerse: number | undefined;
  let endChapter: number | undefined;
  let endChapterVerse: number | undefined;

  if (singleChapterMatch && !multiChapterMatch) {
    // "João 3:16" ou "João 3:16-18"
    bookName = singleChapterMatch[1].trim();
    chapter = parseInt(singleChapterMatch[2], 10);
    startVerse = parseInt(singleChapterMatch[3], 10);
    endVerse = singleChapterMatch[4] ? parseInt(singleChapterMatch[4], 10) : undefined;
  } else if (multiChapterMatch) {
    // "Génesis 1:1-2:3" → buscar intervalo completo entre capítulos
    bookName = multiChapterMatch[1].trim();
    chapter = parseInt(multiChapterMatch[2], 10);
    startVerse = parseInt(multiChapterMatch[3], 10);
    endChapter = parseInt(multiChapterMatch[4], 10);
    endChapterVerse = parseInt(multiChapterMatch[5], 10);
  } else if (chapterRangeMatch) {
    // "1 Coríntios 8:1-10:33" ou padrões semelhantes
    // Tentar extrair endChapter:endVerse do lado direito
    bookName = chapterRangeMatch[1].trim();
    chapter = parseInt(chapterRangeMatch[2], 10);
    startVerse = chapterRangeMatch[3] ? parseInt(chapterRangeMatch[3], 10) : undefined;

    // O grupo 4 contém tudo depois do "-", pode ser "10:33" ou "Cap:Verso"
    const rightSide = chapterRangeMatch[4].trim();
    const rightMatch = rightSide.match(/^(\d+):(\d+)$/);
    if (rightMatch) {
      endChapter = parseInt(rightMatch[1], 10);
      endChapterVerse = parseInt(rightMatch[2], 10);
    }
    // Se não conseguir parsear, buscar só o primeiro capítulo inteiro
  } else if (chapterOnlyMatch) {
    // "Salmos 23" → buscar capítulo inteiro
    bookName = chapterOnlyMatch[1].trim();
    chapter = parseInt(chapterOnlyMatch[2], 10);
  } else {
    console.error(`Referência bíblica inválida: ${reference}`);
    return null;
  }

  // Procura o nome do livro no mapeamento
  const englishBook = PORTUGUESE_BOOK_MAPPING[bookName];
  if (!englishBook) {
    console.error(`Livro bíblico não encontrado: ${bookName}`);
    return null;
  }

  return {
    book: englishBook,
    chapter,
    startVerse,
    endVerse,
    endChapter,
    endChapterVerse,
  };
}

/**
 * Formata a chave de cache para uma passagem
 */
function getCacheKey(
  reference: string,
  version: BibleVersion
): string {
  return `${reference.toLowerCase()}-${version}`;
}

/**
 * Tenta buscar uma passagem da Bible API (API primária)
 *
 * @param parsedRef - Referência parseada contendo livro, capítulo, verso
 * @param version - Versão da Bíblia desejada
 * @returns Passagem ou null se não encontrada
 */
async function fetchFromBibleApi(
  parsedRef: ReturnType<typeof parsePortugueseReference>,
  version: BibleVersion
): Promise<BiblePassage | null> {
  if (!parsedRef) return null;

  try {
    const apiVersion = VERSION_API_MAPPING[version];

    // Construir a referência no formato da API
    // Ex: "genesis 1:1", "galatians 1:1-3:29", "john 3:16-18"
    let apiReference = `${parsedRef.book} ${parsedRef.chapter}`;
    if (parsedRef.startVerse !== undefined) {
      apiReference += `:${parsedRef.startVerse}`;
    }
    if (parsedRef.endChapter !== undefined) {
      // Intervalo entre capítulos: "galatians 1:1-3:29"
      apiReference += `-${parsedRef.endChapter}`;
      if (parsedRef.endChapterVerse !== undefined) {
        apiReference += `:${parsedRef.endChapterVerse}`;
      }
    } else if (parsedRef.endVerse !== undefined) {
      // Intervalo dentro do mesmo capítulo: "john 3:16-18"
      apiReference += `-${parsedRef.endVerse}`;
    }

    // Só codificar espaços (não usar encodeURIComponent que codifica : e -)
    const encodedRef = apiReference.replace(/ /g, '%20');
    const url = `https://bible-api.com/${encodedRef}?translation=${apiVersion}`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      console.warn(
        `Bible API retornou status ${response.status} para ${apiReference}`
      );
      return null;
    }

    const data = await response.json();

    if (!data.text || !data.verses) {
      return null;
    }

    return {
      reference: data.reference,
      version,
      text: data.text,
      verses: data.verses.map((v: any) => ({
        book: v.book_name,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      })),
      source: 'bible-api',
    };
  } catch (error) {
    console.error(`Erro ao buscar da Bible API:`, error);
    return null;
  }
}

/**
 * Tenta buscar uma passagem do Bolls.life (API secundária)
 *
 * @param parsedRef - Referência parseada
 * @param version - Versão da Bíblia desejada
 * @returns Passagem ou null se não encontrada
 */
async function fetchFromBollsLife(
  parsedRef: ReturnType<typeof parsePortugueseReference>,
  version: BibleVersion
): Promise<BiblePassage | null> {
  if (!parsedRef) return null;

  try {
    // Bolls.life usa IDs numéricos para traduções em português
    // Ver: https://bolls.life/api/ — IDs verificados para traduções PT
    const versionMapping: Record<BibleVersion, number> = {
      'ARC': 20,   // Almeida Revista e Corrigida
      'NVI': 211,  // Nova Versão Internacional (PT)
      'ARA': 212,  // Almeida Revista e Atualizada
      'ACF': 213,  // Almeida Corrigida Fiel
    };

    const translationId = versionMapping[version];

    // Construir referência: bookIndex/chapter
    const bookIndex = getBookIndex(parsedRef.book);
    if (bookIndex === -1) {
      return null;
    }

    // Formato Bolls.life: /get-chapter/TRANSLATION_ID/BOOK_INDEX/CHAPTER/
    let endpoint = `https://bolls.life/get-chapter/${translationId}/${bookIndex}/${parsedRef.chapter}/`;

    const response = await fetchWithTimeout(endpoint);

    if (!response.ok) {
      console.warn(
        `Bolls.life retornou status ${response.status}`
      );
      return null;
    }

    const data = await response.json();

    // Processar resposta — Bolls.life retorna array de versículos
    // Cada item: { chapter, verse, text } ou { pk, verse, text }
    const verses: BibleVerse[] = [];
    const textParts: string[] = [];
    const items = Array.isArray(data) ? data : (Array.isArray(data.text) ? data.text : null);

    if (!items || items.length === 0) {
      return null;
    }

    items.forEach((item: any) => {
      const verseText = item.text || item.t || '';
      const verseNum = item.verse || item.pk || 0;

      // Filtrar versículos se startVerse/endVerse foram especificados
      if (parsedRef.startVerse !== undefined && verseNum < parsedRef.startVerse) return;
      if (parsedRef.endVerse !== undefined && verseNum > parsedRef.endVerse) return;

      if (verseText) {
        // Limpar tags HTML que o Bolls.life às vezes inclui
        const cleanText = verseText.replace(/<[^>]*>/g, '').trim();
        if (cleanText) {
          verses.push({
            book: parsedRef.book,
            chapter: parsedRef.chapter,
            verse: verseNum,
            text: cleanText,
          });
          textParts.push(cleanText);
        }
      }
    });

    if (verses.length === 0) return null;

    const refStr = parsedRef.startVerse
      ? `${parsedRef.book} ${parsedRef.chapter}:${parsedRef.startVerse}${parsedRef.endVerse ? '-' + parsedRef.endVerse : ''}`
      : `${parsedRef.book} ${parsedRef.chapter}`;

    return {
      reference: refStr,
      version,
      text: textParts.join(' '),
      verses,
      source: 'bolls-life',
    };
  } catch (error) {
    console.error(`Erro ao buscar do Bolls.life:`, error);
    return null;
  }
}

/**
 * Obtém o índice de um livro para uso na API Bolls.life
 * Os livros são numerados de 1 a 66
 */
function getBookIndex(englishBookName: string): number {
  const bookOrder = [
    'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
    'joshua', 'judges', 'ruth', '1 samuel', '2 samuel', '1 kings', '2 kings',
    '1 chronicles', '2 chronicles', 'ezra', 'nehemiah', 'esther', 'job',
    'psalms', 'proverbs', 'ecclesiastes', 'song of songs', 'isaiah',
    'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel',
    'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk',
    'zephaniah', 'haggai', 'zechariah', 'malachi', 'matthew',
    'mark', 'luke', 'john', 'acts', 'romans', '1 corinthians',
    '2 corinthians', 'galatians', 'ephesians', 'philippians',
    'colossians', '1 thessalonians', '2 thessalonians', '1 timothy',
    '2 timothy', 'titus', 'philemon', 'hebrews', 'james',
    '1 peter', '2 peter', '1 john', '2 john', '3 john', 'jude',
    'revelation'
  ];

  const index = bookOrder.indexOf(englishBookName.toLowerCase());
  return index >= 0 ? index + 1 : -1;
}

/**
 * Busca uma passagem de um único capítulo (ou trecho dentro dele)
 * Função auxiliar usada internamente para compor resultados multi-capítulo
 */
async function fetchSingleChapterPassage(
  book: string,
  chapter: number,
  startVerse?: number,
  endVerse?: number,
  version: BibleVersion = 'ARC'
): Promise<BiblePassage | null> {
  const singleRef = {
    book,
    chapter,
    startVerse,
    endVerse,
    endChapter: undefined,
    endChapterVerse: undefined,
  };

  // Tentar Bible API primeiro
  let result = await fetchFromBibleApi(singleRef, version);

  // Fallback para Bolls.life
  if (!result) {
    result = await fetchFromBollsLife(singleRef, version);
  }

  // Fallback para ARC se versão diferente falhou
  if (!result && version !== 'ARC') {
    result = await fetchFromBibleApi(singleRef, 'ARC');
  }

  return result;
}

/**
 * Busca uma passagem multi-capítulo com múltiplas estratégias:
 * 1. Tenta pedido directo à Bible API com intervalo completo (ex: "ephesians 4:1-6:24")
 * 2. Se falhar, tenta capítulo a capítulo na Bible API
 * 3. Se falhar, tenta capítulo a capítulo no Bolls.life
 */
async function fetchMultiChapterRange(
  parsedRef: NonNullable<ReturnType<typeof parsePortugueseReference>>,
  version: BibleVersion,
  originalReference: string
): Promise<BiblePassage | null> {
  const { book, chapter: startChapter, startVerse, endChapter, endChapterVerse } = parsedRef;

  if (endChapter === undefined) return null;

  // --- Estratégia 1: pedido directo com intervalo completo ---
  try {
    const directResult = await fetchFromBibleApi(parsedRef, version);
    if (directResult && directResult.verses && directResult.verses.length > 0) {
      return {
        ...directResult,
        reference: originalReference,
      };
    }
  } catch (e) {
    console.warn('Pedido directo multi-capítulo falhou, tentando capítulo a capítulo...', e);
  }

  // --- Estratégia 2: capítulo a capítulo via fetchSingleChapterPassage ---
  // (tenta Bible API, depois Bolls.life para cada capítulo)
  const chapterPromises: Promise<BiblePassage | null>[] = [];

  for (let ch = startChapter; ch <= endChapter; ch++) {
    chapterPromises.push(fetchSingleChapterPassage(book, ch, undefined, undefined, version));
  }

  const results = await Promise.all(chapterPromises);

  // Combinar resultados — ignorar capítulos que falharam
  const allVerses: BibleVerse[] = [];
  const textParts: string[] = [];
  let source: 'bible-api' | 'bolls-life' = 'bible-api';

  for (const result of results) {
    if (result) {
      allVerses.push(...result.verses);
      textParts.push(result.text);
      source = result.source;
    }
  }

  if (allVerses.length > 0) {
    return {
      reference: originalReference,
      version,
      text: textParts.join('\n'),
      verses: allVerses,
      source,
    };
  }

  // --- Estratégia 3: capítulo a capítulo via Bolls.life directamente ---
  const bollsPromises: Promise<BiblePassage | null>[] = [];
  for (let ch = startChapter; ch <= endChapter; ch++) {
    const chapterRef = {
      book,
      chapter: ch,
      startVerse: undefined,
      endVerse: undefined,
      endChapter: undefined,
      endChapterVerse: undefined,
    };
    bollsPromises.push(fetchFromBollsLife(chapterRef, version));
  }

  const bollsResults = await Promise.all(bollsPromises);
  const bollsVerses: BibleVerse[] = [];
  const bollsText: string[] = [];

  for (const result of bollsResults) {
    if (result) {
      bollsVerses.push(...result.verses);
      bollsText.push(result.text);
    }
  }

  if (bollsVerses.length > 0) {
    return {
      reference: originalReference,
      version,
      text: bollsText.join('\n'),
      verses: bollsVerses,
      source: 'bolls-life',
    };
  }

  // --- Estratégia 4: tentar ARC como fallback se versão diferente ---
  if (version !== 'ARC') {
    return fetchMultiChapterRange(
      parsedRef,
      'ARC',
      originalReference,
    );
  }

  return null;
}

/**
 * Busca uma passagem bíblica em português
 *
 * Implementa fallback automático entre APIs e usa cache em memória
 * para otimizar chamadas repetidas. Para intervalos multi-capítulo,
 * faz pedidos separados por capítulo e combina os resultados.
 *
 * @param passage - Referência bíblica em português (ex: "João 3:16")
 * @param version - Versão desejada (padrão: "ARC")
 * @returns Promise com a passagem ou null se não encontrada
 *
 * @example
 * const verse = await fetchPassage("João 3:16");
 * console.log(verse?.text);
 */
export async function fetchPassage(
  passage: string,
  version: BibleVersion = 'ARC'
): Promise<BiblePassage | null> {
  // Validar entrada
  if (!passage || passage.trim().length === 0) {
    console.error('Referência bíblica vazia');
    return null;
  }

  if (!AVAILABLE_VERSIONS.includes(version)) {
    console.warn(`Versão ${version} não suportada, usando ARC`);
  }

  // Verificar cache
  const cacheKey = getCacheKey(passage, version);
  if (passageCache.has(cacheKey)) {
    return passageCache.get(cacheKey)!;
  }

  // Parsear referência
  const parsedRef = parsePortugueseReference(passage);
  if (!parsedRef) {
    return null;
  }

  let result: BiblePassage | null = null;

  // Se for multi-capítulo, dividir em pedidos por capítulo
  if (parsedRef.endChapter !== undefined && parsedRef.endChapter > parsedRef.chapter) {
    result = await fetchMultiChapterRange(parsedRef, version, passage);
  } else {
    // Passagem dentro de um único capítulo — fluxo normal
    result = await fetchFromBibleApi(parsedRef, version);

    if (!result) {
      console.info(
        `Fallback para Bolls.life para ${passage} (versão ${version})`
      );
      result = await fetchFromBollsLife(parsedRef, version);
    }

    if (!result && version !== 'ARC') {
      console.info(
        `Fallback para versão ARC para ${passage}`
      );
      result = await fetchFromBibleApi(parsedRef, 'ARC');
    }
  }

  // Armazenar em cache se obteve resultado
  if (result) {
    passageCache.set(cacheKey, result);
  }

  return result;
}

/**
 * Retorna as versões disponíveis da Bíblia
 *
 * @returns Array com as versões suportadas
 */
export function getAvailableVersions(): BibleVersion[] {
  return [...AVAILABLE_VERSIONS];
}

/**
 * Obtém informações sobre uma versão específica
 *
 * @param version - Versão desejada
 * @returns Descrição da versão
 */
export function getVersionInfo(version: BibleVersion): string {
  const info: Record<BibleVersion, string> = {
    'ARC': 'Almeida Revista e Corrigida (clássica)',
    'NVI': 'Nova Versão Internacional (contemporânea)',
    'ARA': 'Almeida Revista e Atualizada (transitória)',
    'ACF': 'Almeida Corrigida Fiel (literal)',
  };

  return info[version] || 'Versão desconhecida';
}

/**
 * Limpa o cache de passagens (útil para testes ou liberação de memória)
 */
export function clearPassageCache(): void {
  passageCache.clear();
}

/**
 * Retorna o tamanho atual do cache
 *
 * @returns Número de passagens em cache
 */
export function getCacheSize(): number {
  return passageCache.size;
}

/**
 * Pré-carrega um conjunto de passagens comuns no cache
 * Útil para otimizar a experiência do usuário ao iniciar a aplicação
 *
 * @param passages - Array de referências em português
 * @param version - Versão desejada
 */
export async function preloadPassages(
  passages: string[],
  version: BibleVersion = 'ARC'
): Promise<void> {
  const promises = passages.map(passage => fetchPassage(passage, version));
  await Promise.all(promises);
}

/**
 * Hook para buscar múltiplas passagens em paralelo
 *
 * @param passages - Array de referências
 * @param version - Versão desejada
 * @returns Promise com array de passagens
 */
export async function fetchMultiplePassages(
  passages: string[],
  version: BibleVersion = 'ARC'
): Promise<(BiblePassage | null)[]> {
  const results = await Promise.allSettled(
    passages.map(passage => fetchPassage(passage, version))
  );

  return results.map(result =>
    result.status === 'fulfilled' ? result.value : null
  );
}
