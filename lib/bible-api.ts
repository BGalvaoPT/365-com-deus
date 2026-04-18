/**
 * Integração com APIs de Bíblia para o aplicativo devotional "365 com Deus"
 *
 * APIs utilizadas (por ordem de prioridade):
 * 1. GetBible.net (https://api.getbible.net/v2/) — capítulos inteiros em PT, tradução "almeida"
 * 2. Bolls.life (https://bolls.life/) — múltiplas versões PT (ARC09, ACF11, ARA, NVIPT)
 * 3. Bible API (https://bible-api.com/) — fallback para versículos individuais
 *
 * Suporta múltiplas versões em português e implementa cache em memória.
 */

/**
 * Tipos exportados
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
  source: 'getbible' | 'bolls-life' | 'bible-api';
}

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
 * Mapeamento de nomes de livros em português para número de livro (1-66)
 * e nome em inglês (para bible-api.com)
 */
const BOOK_DATA: Record<string, { number: number; english: string }> = {
  // Antigo Testamento - Pentateuco
  'Gênesis': { number: 1, english: 'genesis' },
  'Génesis': { number: 1, english: 'genesis' },
  'Êxodo': { number: 2, english: 'exodus' },
  'Levítico': { number: 3, english: 'leviticus' },
  'Números': { number: 4, english: 'numbers' },
  'Deuteronômio': { number: 5, english: 'deuteronomy' },
  'Deuteronómio': { number: 5, english: 'deuteronomy' },

  // Históricos
  'Josué': { number: 6, english: 'joshua' },
  'Juízes': { number: 7, english: 'judges' },
  'Rute': { number: 8, english: 'ruth' },
  '1 Samuel': { number: 9, english: '1 samuel' },
  '2 Samuel': { number: 10, english: '2 samuel' },
  '1 Reis': { number: 11, english: '1 kings' },
  '2 Reis': { number: 12, english: '2 kings' },
  '1 Crônicas': { number: 13, english: '1 chronicles' },
  '1 Crónicas': { number: 13, english: '1 chronicles' },
  '2 Crônicas': { number: 14, english: '2 chronicles' },
  '2 Crónicas': { number: 14, english: '2 chronicles' },
  'Esdras': { number: 15, english: 'ezra' },
  'Neemias': { number: 16, english: 'nehemiah' },
  'Ester': { number: 17, english: 'esther' },

  // Poéticos
  'Jó': { number: 18, english: 'job' },
  'Salmos': { number: 19, english: 'psalms' },
  'Provérbios': { number: 20, english: 'proverbs' },
  'Eclesiastes': { number: 21, english: 'ecclesiastes' },
  'Cântico dos Cânticos': { number: 22, english: 'song of songs' },
  'Cânticos': { number: 22, english: 'song of songs' },

  // Profetas Maiores
  'Isaías': { number: 23, english: 'isaiah' },
  'Jeremias': { number: 24, english: 'jeremiah' },
  'Lamentações': { number: 25, english: 'lamentations' },
  'Ezequiel': { number: 26, english: 'ezekiel' },
  'Daniel': { number: 27, english: 'daniel' },

  // Profetas Menores
  'Oséias': { number: 28, english: 'hosea' },
  'Oseias': { number: 28, english: 'hosea' },
  'Joel': { number: 29, english: 'joel' },
  'Amós': { number: 30, english: 'amos' },
  'Obadias': { number: 31, english: 'obadiah' },
  'Abdias': { number: 31, english: 'obadiah' },
  'Jonas': { number: 32, english: 'jonah' },
  'Miqueias': { number: 33, english: 'micah' },
  'Naum': { number: 34, english: 'nahum' },
  'Habacuque': { number: 35, english: 'habakkuk' },
  'Sofonias': { number: 36, english: 'zephaniah' },
  'Ageu': { number: 37, english: 'haggai' },
  'Zacarias': { number: 38, english: 'zechariah' },
  'Malaquias': { number: 39, english: 'malachi' },

  // Evangelhos
  'Mateus': { number: 40, english: 'matthew' },
  'Marcos': { number: 41, english: 'mark' },
  'Lucas': { number: 42, english: 'luke' },
  'João': { number: 43, english: 'john' },

  // Histórico NT
  'Atos': { number: 44, english: 'acts' },
  'Actos': { number: 44, english: 'acts' },

  // Epístolas Paulinas
  'Romanos': { number: 45, english: 'romans' },
  '1 Coríntios': { number: 46, english: '1 corinthians' },
  '2 Coríntios': { number: 47, english: '2 corinthians' },
  'Gálatas': { number: 48, english: 'galatians' },
  'Efésios': { number: 49, english: 'ephesians' },
  'Filipenses': { number: 50, english: 'philippians' },
  'Colossenses': { number: 51, english: 'colossians' },
  '1 Tessalonicenses': { number: 52, english: '1 thessalonians' },
  '2 Tessalonicenses': { number: 53, english: '2 thessalonians' },
  '1 Timóteo': { number: 54, english: '1 timothy' },
  '2 Timóteo': { number: 55, english: '2 timothy' },
  'Tito': { number: 56, english: 'titus' },
  'Filémon': { number: 57, english: 'philemon' },
  'Filemon': { number: 57, english: 'philemon' },

  // Epístolas Gerais
  'Hebreus': { number: 58, english: 'hebrews' },
  'Tiago': { number: 59, english: 'james' },
  '1 Pedro': { number: 60, english: '1 peter' },
  '2 Pedro': { number: 61, english: '2 peter' },
  '1 João': { number: 62, english: '1 john' },
  '2 João': { number: 63, english: '2 john' },
  '3 João': { number: 64, english: '3 john' },
  'Judas': { number: 65, english: 'jude' },

  // Profecia NT
  'Apocalipse': { number: 66, english: 'revelation' },
};

/**
 * Mapeamento de versões para slugs do Bolls.life
 */
const BOLLS_VERSION_MAPPING: Record<BibleVersion, string> = {
  'ARC': 'ARC09',   // Almeida Revista e Corrigida, 2009
  'ACF': 'ACF11',   // Almeida Corrigida Fiel, 2011
  'ARA': 'ARA',     // Almeida Revista e Atualizada, 1993
  'NVI': 'NVIPT',   // Nova Versão Internacional (PT)
};

/** Cache em memória */
const passageCache: Map<string, BiblePassage> = new Map();

/** Versões disponíveis */
const AVAILABLE_VERSIONS: BibleVersion[] = ['ARC', 'NVI', 'ARA', 'ACF'];

/**
 * Parseia uma referência bíblica em português
 */
function parseReference(reference: string): {
  bookName: string;
  bookNumber: number;
  englishBook: string;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
  endChapter?: number;
  endChapterVerse?: number;
} | null {
  const normalized = reference.trim();

  // Padrão 1: "Livro Cap:Verso-Cap:Verso" (multi-capítulo)
  const multiChapterMatch = normalized.match(
    /^(.+?)\s+(\d+):(\d+)[-–](\d+):(\d+)$/
  );

  // Padrão 2: "Livro Cap:Verso-Verso" (mesmo capítulo)
  const singleChapterMatch = normalized.match(
    /^(.+?)\s+(\d+):(\d+)(?:[-–](\d+))?$/
  );

  // Padrão 3: "Livro Cap" (capítulo inteiro)
  const chapterOnlyMatch = normalized.match(
    /^(.+?)\s+(\d+)$/
  );

  let bookName: string;
  let chapter: number;
  let startVerse: number | undefined;
  let endVerse: number | undefined;
  let endChapter: number | undefined;
  let endChapterVerse: number | undefined;

  if (multiChapterMatch) {
    bookName = multiChapterMatch[1].trim();
    chapter = parseInt(multiChapterMatch[2], 10);
    startVerse = parseInt(multiChapterMatch[3], 10);
    endChapter = parseInt(multiChapterMatch[4], 10);
    endChapterVerse = parseInt(multiChapterMatch[5], 10);
  } else if (singleChapterMatch && !normalized.match(/^(.+?)\s+(\d+):(\d+)[-–](\d+):(\d+)$/)) {
    bookName = singleChapterMatch[1].trim();
    chapter = parseInt(singleChapterMatch[2], 10);
    startVerse = parseInt(singleChapterMatch[3], 10);
    endVerse = singleChapterMatch[4] ? parseInt(singleChapterMatch[4], 10) : undefined;
  } else if (chapterOnlyMatch) {
    bookName = chapterOnlyMatch[1].trim();
    chapter = parseInt(chapterOnlyMatch[2], 10);
  } else {
    // Tentar padrão genérico para "Livro Cap:Verso-Cap:Verso" com nomes numéricos
    const chapterRangeMatch = normalized.match(
      /^(.+?)\s+(\d+)(?::(\d+))?[-–](\d+):(\d+)$/
    );
    if (chapterRangeMatch) {
      bookName = chapterRangeMatch[1].trim();
      chapter = parseInt(chapterRangeMatch[2], 10);
      startVerse = chapterRangeMatch[3] ? parseInt(chapterRangeMatch[3], 10) : undefined;
      endChapter = parseInt(chapterRangeMatch[4], 10);
      endChapterVerse = parseInt(chapterRangeMatch[5], 10);
    } else {
      console.error(`Referência bíblica inválida: ${reference}`);
      return null;
    }
  }

  const bookData = BOOK_DATA[bookName];
  if (!bookData) {
    console.error(`Livro bíblico não encontrado: ${bookName}`);
    return null;
  }

  return {
    bookName,
    bookNumber: bookData.number,
    englishBook: bookData.english,
    chapter,
    startVerse,
    endVerse,
    endChapter,
    endChapterVerse,
  };
}

// ===== API 1: GetBible.net (primária — capítulos inteiros em PT) =====

/**
 * Busca um capítulo inteiro do GetBible.net
 * URL: https://api.getbible.net/v2/almeida/{bookNumber}/{chapter}.json
 * Retorna: { verses: { "1": { chapter, verse, name, text }, ... } }
 */
async function fetchFromGetBible(
  bookNumber: number,
  chapter: number,
  bookName: string,
): Promise<BiblePassage | null> {
  try {
    const url = `https://api.getbible.net/v2/almeida/${bookNumber}/${chapter}.json`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      console.warn(`GetBible retornou ${response.status} para livro ${bookNumber} cap ${chapter}`);
      return null;
    }

    const data = await response.json();

    if (!data.verses) return null;

    // data.verses é um objeto com keys numéricas: { "1": {...}, "2": {...} }
    const versesObj = data.verses;
    const verses: BibleVerse[] = [];
    const textParts: string[] = [];

    const verseKeys = Object.keys(versesObj).sort((a, b) => parseInt(a) - parseInt(b));
    for (const key of verseKeys) {
      const v = versesObj[key];
      if (v.text) {
        verses.push({
          book: bookName,
          chapter: v.chapter || chapter,
          verse: v.verse || parseInt(key),
          text: v.text.trim(),
        });
        textParts.push(v.text.trim());
      }
    }

    if (verses.length === 0) return null;

    return {
      reference: `${bookName} ${chapter}`,
      version: 'ARC',
      text: textParts.join(' '),
      verses,
      source: 'getbible',
    };
  } catch (error) {
    console.error(`Erro GetBible.net:`, error);
    return null;
  }
}

// ===== API 2: Bolls.life (secundária — múltiplas versões PT) =====

/**
 * Busca um capítulo do Bolls.life
 * URL: https://bolls.life/get-text/{slug}/{bookNumber}/{chapter}/
 * Retorna: [{ pk, verse, text }, ...]
 */
async function fetchFromBollsLife(
  bookNumber: number,
  chapter: number,
  bookName: string,
  version: BibleVersion,
): Promise<BiblePassage | null> {
  try {
    const slug = BOLLS_VERSION_MAPPING[version];
    const url = `https://bolls.life/get-text/${slug}/${bookNumber}/${chapter}/`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      console.warn(`Bolls.life retornou ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) return null;

    const verses: BibleVerse[] = [];
    const textParts: string[] = [];

    for (const item of data) {
      const verseText = item.text || '';
      const verseNum = item.verse || 0;
      if (verseText) {
        // Limpar tags HTML
        const cleanText = verseText.replace(/<[^>]*>/g, '').trim();
        if (cleanText) {
          verses.push({
            book: bookName,
            chapter,
            verse: verseNum,
            text: cleanText,
          });
          textParts.push(cleanText);
        }
      }
    }

    if (verses.length === 0) return null;

    return {
      reference: `${bookName} ${chapter}`,
      version,
      text: textParts.join(' '),
      verses,
      source: 'bolls-life',
    };
  } catch (error) {
    console.error(`Erro Bolls.life:`, error);
    return null;
  }
}

// ===== API 3: Bible API (fallback — só versículos individuais em PT) =====

/**
 * Busca um versículo ou range curto do Bible API
 * Só funciona para referências com versículos específicos (ex: "john 3:16")
 * NÃO funciona para capítulos inteiros ou multi-capítulo
 */
async function fetchFromBibleApi(
  englishBook: string,
  chapter: number,
  startVerse: number,
  endVerse?: number,
): Promise<BiblePassage | null> {
  try {
    let ref = `${englishBook} ${chapter}:${startVerse}`;
    if (endVerse !== undefined) {
      ref += `-${endVerse}`;
    }

    const encodedRef = ref.replace(/ /g, '%20');
    const url = `https://bible-api.com/${encodedRef}?translation=almeida`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.text || !data.verses) return null;

    return {
      reference: data.reference,
      version: 'ARC',
      text: data.text,
      verses: data.verses.map((v: any) => ({
        book: v.book_name,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text?.trim() || '',
      })),
      source: 'bible-api',
    };
  } catch (error) {
    console.error(`Erro Bible API:`, error);
    return null;
  }
}

// ===== Função para buscar um capítulo com fallback entre APIs =====

async function fetchChapter(
  bookName: string,
  bookNumber: number,
  englishBook: string,
  chapter: number,
  version: BibleVersion,
): Promise<BiblePassage | null> {
  // 1. Tentar Bolls.life com a versão correcta
  const bollsResult = await fetchFromBollsLife(bookNumber, chapter, bookName, version);
  if (bollsResult && bollsResult.verses.length > 0) {
    return bollsResult;
  }

  // 2. Tentar GetBible.net (só tem "almeida" / ARC)
  const getBibleResult = await fetchFromGetBible(bookNumber, chapter, bookName);
  if (getBibleResult && getBibleResult.verses.length > 0) {
    return { ...getBibleResult, version };
  }

  // 3. Tentar Bolls.life com ARC09 como fallback
  if (version !== 'ARC') {
    const arcResult = await fetchFromBollsLife(bookNumber, chapter, bookName, 'ARC');
    if (arcResult && arcResult.verses.length > 0) {
      return { ...arcResult, version };
    }
  }

  return null;
}

// ===== Função pública principal =====

/**
 * Busca uma passagem bíblica em português
 *
 * @param passage - Referência em português (ex: "João 3:16", "Efésios 4:1-6:24")
 * @param version - Versão desejada (padrão: "ARC")
 * @returns Passagem ou null
 */
export async function fetchPassage(
  passage: string,
  version: BibleVersion = 'ARC'
): Promise<BiblePassage | null> {
  if (!passage || passage.trim().length === 0) return null;

  // Cache
  const cacheKey = `${passage.toLowerCase()}-${version}`;
  if (passageCache.has(cacheKey)) {
    return passageCache.get(cacheKey)!;
  }

  // Parsear referência
  const ref = parseReference(passage);
  if (!ref) return null;

  let result: BiblePassage | null = null;

  // Multi-capítulo (ex: Efésios 4:1-6:24)
  if (ref.endChapter !== undefined && ref.endChapter > ref.chapter) {
    const allVerses: BibleVerse[] = [];
    const textParts: string[] = [];
    let source: BiblePassage['source'] = 'getbible';

    for (let ch = ref.chapter; ch <= ref.endChapter; ch++) {
      const chapterResult = await fetchChapter(
        ref.bookName, ref.bookNumber, ref.englishBook, ch, version
      );

      if (chapterResult) {
        let verses = chapterResult.verses;

        // Filtrar versículos do primeiro capítulo (a partir de startVerse)
        if (ch === ref.chapter && ref.startVerse !== undefined) {
          verses = verses.filter(v => v.verse >= ref.startVerse!);
        }

        // Filtrar versículos do último capítulo (até endChapterVerse)
        if (ch === ref.endChapter && ref.endChapterVerse !== undefined) {
          verses = verses.filter(v => v.verse <= ref.endChapterVerse!);
        }

        allVerses.push(...verses);
        textParts.push(verses.map(v => v.text).join(' '));
        source = chapterResult.source;
      }
    }

    if (allVerses.length > 0) {
      result = {
        reference: passage,
        version,
        text: textParts.join('\n'),
        verses: allVerses,
        source,
      };
    }
  }
  // Capítulo inteiro (ex: Salmos 23)
  else if (ref.startVerse === undefined) {
    const chapterResult = await fetchChapter(
      ref.bookName, ref.bookNumber, ref.englishBook, ref.chapter, version
    );
    if (chapterResult) {
      result = { ...chapterResult, reference: passage };
    }
  }
  // Versículo(s) específico(s) (ex: João 3:16 ou João 3:16-18)
  else {
    // Tentar buscar capítulo inteiro e filtrar
    const chapterResult = await fetchChapter(
      ref.bookName, ref.bookNumber, ref.englishBook, ref.chapter, version
    );

    if (chapterResult) {
      let verses = chapterResult.verses;

      // Filtrar pelo range de versículos
      verses = verses.filter(v => {
        if (v.verse < ref.startVerse!) return false;
        if (ref.endVerse !== undefined && v.verse > ref.endVerse) return false;
        return true;
      });

      if (verses.length > 0) {
        result = {
          reference: passage,
          version,
          text: verses.map(v => v.text).join(' '),
          verses,
          source: chapterResult.source,
        };
      }
    }

    // Fallback: bible-api.com para versículos individuais
    if (!result) {
      const bibleApiResult = await fetchFromBibleApi(
        ref.englishBook, ref.chapter, ref.startVerse, ref.endVerse
      );
      if (bibleApiResult) {
        result = { ...bibleApiResult, reference: passage, version };
      }
    }
  }

  // Cache
  if (result) {
    passageCache.set(cacheKey, result);
  }

  return result;
}

/**
 * Retorna as versões disponíveis
 */
export function getAvailableVersions(): BibleVersion[] {
  return [...AVAILABLE_VERSIONS];
}

/**
 * Informações sobre uma versão
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
 * Limpa o cache
 */
export function clearPassageCache(): void {
  passageCache.clear();
}

/**
 * Tamanho do cache
 */
export function getCacheSize(): number {
  return passageCache.size;
}

/**
 * Pré-carrega passagens
 */
export async function preloadPassages(
  passages: string[],
  version: BibleVersion = 'ARC'
): Promise<void> {
  const promises = passages.map(passage => fetchPassage(passage, version));
  await Promise.all(promises);
}

/**
 * Busca múltiplas passagens em paralelo
 */
export async function fetchMultiplePassages(
  passages: string[],
  version: BibleVersion = 'ARC'
): Promise<(BiblePassage | null)[]> {
  const results = await Promise.allSettled(
    passages.map(passage => fetchPassage(passage, version))
  );
  return results.map(r => r.status === 'fulfilled' ? r.value : null);
}
