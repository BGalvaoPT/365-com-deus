export interface CatechismQA {
  /** Número (1-52) */
  number: number;
  /** Parte: 1 = Pai, 2 = Filho, 3 = Espírito Santo */
  part: 1 | 2 | 3;
  /** Pergunta */
  question: string;
  /** Resposta curta (versão crianças — sem texto entre parênteses rectos do original) */
  answerShort: string;
  /** Resposta completa (versão adultos — inclui também o texto entre parênteses) */
  answerFull: string;
  /** Base bíblica */
  reference: string;
}

export const CATECHISM_PARTS: Record<1 | 2 | 3, { title: string; subtitle: string }> = {
  1: {
    title: "Parte I",
    subtitle: "Deus Pai, a criação, a queda e a Lei",
  },
  2: {
    title: "Parte II",
    subtitle: "Deus Filho, a redenção e a graça",
  },
  3: {
    title: "Parte III",
    subtitle: "Deus Espírito Santo, a restauração, renovação e crescimento em graça",
  },
};

const catechism: CatechismQA[] = [
  // PARTE I — Deus Pai, a criação, a queda e a Lei (1-20)
  {
    number: 1,
    part: 1,
    question: "Qual é a nossa única esperança na vida e na morte?",
    answerShort:
      "Que nós não somos nossos mas pertencemos, corpo e alma, na vida e na morte, a Deus e ao nosso Salvador Jesus Cristo.",
    answerFull:
      "Que nós não somos nossos mas pertencemos, corpo e alma, na vida e na morte, a Deus e ao nosso Salvador Jesus Cristo.",
    reference: "Romanos 14:7-8",
  },
  {
    number: 2,
    part: 1,
    question: "O que é Deus?",
    answerShort:
      "Deus é o criador e sustentador de todas as pessoas e todas coisas.",
    answerFull:
      "Deus é o criador e sustentador de todas as pessoas e todas coisas. Ele é eterno, infinito, e imutável no seu poder e perfeição, bondade e glória, sabedoria, justiça e verdade. Nada acontece excepto através dele e pela sua vontade.",
    reference: "Salmos 86:8-10, 15",
  },
  {
    number: 3,
    part: 1,
    question: "Quantas pessoas há em Deus?",
    answerShort:
      "Há três pessoas no Deus único e vivo: o Pai, o Filho, e o Espírito Santo.",
    answerFull:
      "Há três pessoas no Deus único e vivo: o Pai, o Filho, e o Espírito Santo. Elas são o mesmo em substância, iguais em poder e glória.",
    reference: "2 Coríntios 13:14",
  },
  {
    number: 4,
    part: 1,
    question: "Como e por que é que Deus nos criou?",
    answerShort:
      "Deus criou-nos macho e fêmea à sua imagem para glorificá-lo.",
    answerFull:
      "Deus criou-nos macho e fêmea à sua imagem para conhecê-lo, amá-lo, viver com ele, e glorificá-lo. E é certo que nós que fomos criados por Deus devemos viver para a sua glória.",
    reference: "Génesis 1:27",
  },
  {
    number: 5,
    part: 1,
    question: "O que mais criou Deus?",
    answerShort:
      "Deus criou todas as coisas, e toda a sua criação era muito boa.",
    answerFull:
      "Deus criou todas as coisas pela sua poderosa palavra, e toda a sua criação era muito boa; tudo florescia sob o seu domínio amoroso.",
    reference: "Génesis 1:31",
  },
  {
    number: 6,
    part: 1,
    question: "Como podemos glorificar Deus?",
    answerShort:
      "Amando-o e obedecendo aos seus mandamentos e lei.",
    answerFull:
      "Nós glorificamos Deus alegrando-nos nele, amando-o, confiando nele e obedecendo aos seus mandamentos e lei.",
    reference: "Deuteronómio 11:1",
  },
  {
    number: 7,
    part: 1,
    question: "O que é que a lei de Deus requer?",
    answerShort:
      "Que amemos Deus de todo o nosso coração, alma, mente e forças; e que amemos o nosso próximo como a nós mesmos.",
    answerFull:
      "Obediência pessoal, perfeita e perpétua; que amemos Deus de todo o nosso coração, alma, mente e forças; e que amemos o nosso próximo como a nós mesmos.",
    reference: "Mateus 22:37-40",
  },
  {
    number: 8,
    part: 1,
    question: "Qual é a lei de Deus declarada nos Dez Mandamentos?",
    answerShort:
      "Não terás outros deuses diante de mim. Não farás imagem de semelhança. Não invocarás o nome de Deus em vão. Lembra-te do dia de Sábado para o santificares. Honra a teu pai e a tua mãe. Não matarás. Não adulterarás. Não furtarás. Não dirás falso testemunho. Não cobiçarás.",
    answerFull:
      "Não terás outros deuses diante de mim. Não farás imagem de semelhança do que há em cima nos céus, nem embaixo na terra, nem nas águas debaixo da terra — não as adorarás, nem lhes darás culto. Não invocarás o nome de Deus em vão. Lembra-te do dia de Sábado para o santificares. Honra a teu pai e a tua mãe. Não matarás. Não adulterarás. Não furtarás. Não dirás falso testemunho. Não cobiçarás.",
    reference: "Êxodo 20:3",
  },
  {
    number: 9,
    part: 1,
    question: "O que é que Deus requer no primeiro, segundo e terceiro mandamentos?",
    answerShort:
      "Primeiro, que conheçamos Deus como o único Deus. Segundo, que evitemos toda a idolatria. Terceiro, que tratemos o nome de Deus com temor e reverência.",
    answerFull:
      "Primeiro, que conheçamos e confiemos em Deus como o único e vivo Deus. Segundo, que evitemos toda a idolatria e que não louvemos Deus impropriamente. Terceiro, que tratemos o nome de Deus com temor e reverência, honrando também a sua Palavra e obras.",
    reference: "Deuteronómio 6:13-14",
  },
  {
    number: 10,
    part: 1,
    question: "O que é que Deus requer no quarto e quinto mandamentos?",
    answerShort:
      "Quarto, que no dia de Sábado gastemos tempo no louvor a Deus. Quinto, que amemos e honremos o nosso pai e a nossa mãe.",
    answerFull:
      "Quarto, que no dia de Sábado gastemos tempo no louvor público e privado a Deus, descansemos da rotina do emprego, sirvamos o Senhor e os outros, e assim antecipemos o Sábado eterno. Quinto, que amemos e honremos o nosso pai e a nossa mãe, submetendo-nos à sua disciplina divina e direcção.",
    reference: "Levítico 19:3",
  },
  {
    number: 11,
    part: 1,
    question: "O que é que Deus requer no sexto, sétimo e oitavo mandamentos?",
    answerShort:
      "Sexto, que não magoemos ou odiemos o nosso próximo. Sétimo, que vivamos pura e fielmente. Oitavo, que não tomemos sem permissão aquilo que pertence a outra pessoa.",
    answerFull:
      "Sexto, que não magoemos, ou odiemos, ou sejamos hostis para o nosso próximo, mas sejamos pacientes e pacíficos, procurando até os nossos inimigos com amor. Sétimo, que nos abstenhamos de imoralidade sexual e que vivamos pura e fielmente, quer no casamento quer na vida solteira, evitando todas as acções, olhares, palavras, pensamentos, ou desejos impuros, e tudo o que possa levar até eles. Oitavo, que não tomemos sem permissão aquilo que pertence a outra pessoa, nem retenhamos qualquer bem de alguém a quem possamos beneficiar.",
    reference: "Romanos 13:9",
  },
  {
    number: 12,
    part: 1,
    question: "O que é que Deus requer no nono e décimo mandamentos?",
    answerShort:
      "Nono, que nós não mintamos ou enganemos. Décimo, que sejamos contentes, não invejando ninguém.",
    answerFull:
      "Nono, que nós não mintamos ou enganemos, mas falemos a verdade em amor. Décimo, que sejamos contentes, não invejando ninguém ou tendo ressentimentos pelo que Deus deu aos outros e a nós.",
    reference: "Tiago 2:8",
  },
  {
    number: 13,
    part: 1,
    question: "Alguém consegue guardar perfeitamente a lei de Deus?",
    answerShort:
      "Desde a queda, nenhum ser humano consegue guardar perfeitamente a lei de Deus.",
    answerFull:
      "Desde a queda, nenhum mero ser humano consegue guardar perfeitamente a lei de Deus, mas quebra-a consistentemente em pensamento, palavra e acção.",
    reference: "Romanos 3:10-12",
  },
  {
    number: 14,
    part: 1,
    question: "Deus criou-nos sem a capacidade de guardar a sua lei?",
    answerShort:
      "Não, mas por causa da desobediência de Adão e Eva, todos nós nascemos em pecado e culpa, incapazes de guardar a lei de Deus.",
    answerFull:
      "Não, mas por causa da desobediência de os nossos primeiros pais Adão e Eva, toda a criação está caída; todos nós nascemos em pecado e culpa, corrompidos na nossa natureza e incapazes de guardar a lei de Deus.",
    reference: "Romanos 5:12",
  },
  {
    number: 15,
    part: 1,
    question: "Uma vez que ninguém consegue guardar a lei, qual é o seu propósito?",
    answerShort:
      "Que possamos conhecer a natureza santa de Deus, e a natureza pecaminosa dos nossos corações; e, portanto, a nossa necessidade de um Salvador.",
    answerFull:
      "Que possamos conhecer a natureza santa e a vontade de Deus, e a natureza pecaminosa e desobediência dos nossos corações; e, portanto, a nossa necessidade de um Salvador. A lei também ensina e nos exorta a viver uma vida digna do nosso Salvador.",
    reference: "Romanos 3:20",
  },
  {
    number: 16,
    part: 1,
    question: "O que é o pecado?",
    answerShort:
      "O pecado é rejeitar ou ignorar Deus no mundo que ele criou, não sendo ou fazendo o que ele requer na sua lei.",
    answerFull:
      "O pecado é rejeitar ou ignorar Deus no mundo que ele criou, rebelando-se contra ele vivendo sem referência a ele, não sendo ou fazendo o que ele requer na sua lei — resultando na nossa morte e na desintegração de toda a criação.",
    reference: "1 João 3:4",
  },
  {
    number: 17,
    part: 1,
    question: "O que é a idolatria?",
    answerShort:
      "A idolatria é crer nas coisas criadas em vez do Criador.",
    answerFull:
      "A idolatria é crer nas coisas criadas em vez do Criador para a nossa esperança e felicidade, significado e segurança.",
    reference: "Romanos 1:21, 25",
  },
  {
    number: 18,
    part: 1,
    question: "Deus vai permitir que a nossa desobediência e idolatria sigam sem castigo?",
    answerShort:
      "Não, Deus está justamente irado com os nossos pecados e vai castigá-los, quer nesta vida quer na vida por vir.",
    answerFull:
      "Não, todo o pecado é contra a soberania, santidade, e bondade de Deus, e contra a sua justa lei, e Deus está ajustadamente irado com os nossos pecados e vai castigá-los no seu julgamento justo quer nesta vida quer na vida por vir.",
    reference: "Efésios 5:5-6",
  },
  {
    number: 19,
    part: 1,
    question: "Há algum caminho para escapar ao castigo e ser trazido de volta ao favor de Deus?",
    answerShort:
      "Sim, Deus, da sua misericórdia, reconcilia-nos para si próprio através de um Redentor.",
    answerFull:
      "Sim, para satisfazer a sua justiça, o próprio Deus, da sua mera misericórdia, reconcilia-nos para si próprio e liberta-nos do pecado e do castigo pelo pecado, através de um Redentor.",
    reference: "Isaías 53:10-11",
  },
  {
    number: 20,
    part: 1,
    question: "Quem é o Redentor?",
    answerShort:
      "O único Redentor é o Senhor Jesus Cristo.",
    answerFull:
      "O único Redentor é o Senhor Jesus Cristo, o eterno Filho de Deus, em quem Deus se tornou homem e suportou ele mesmo o castigo pelo pecado.",
    reference: "1 Timóteo 2:5",
  },

  // PARTE II — Deus Filho, a redenção e a graça (21-35)
  {
    number: 21,
    part: 2,
    question: "Que tipo de Redentor é necessário para trazer-nos de volta para Deus?",
    answerShort:
      "Um que seja verdadeiramente humano e também verdadeiramente Deus.",
    answerFull:
      "Um que seja verdadeiramente humano e também verdadeiramente Deus.",
    reference: "Isaías 9:6",
  },
  {
    number: 22,
    part: 2,
    question: "Por que é que o Redentor tem de ser verdadeiramente humano?",
    answerShort:
      "Para que na natureza humana ele possa em nosso favor obedecer perfeitamente à lei e sofrer o castigo pelo pecado humano.",
    answerFull:
      "Para que na natureza humana ele possa em nosso favor obedecer perfeitamente a toda a lei e sofrer o castigo pelo pecado humano; e também para que ele possa simpatizar com as nossas fraquezas.",
    reference: "Hebreus 2:17",
  },
  {
    number: 23,
    part: 2,
    question: "Por que é que o Redentor tem de ser verdadeiramente Deus?",
    answerShort:
      "Para que por causa da sua natureza divina a sua obediência e sofrimento fossem perfeitos e eficazes.",
    answerFull:
      "Para que por causa da sua natureza divina a sua obediência e sofrimento fossem perfeitos e eficazes; e também para que ele pudesse suportar a justa ira de Deus contra o pecado e ainda vencer o pecado.",
    reference: "Atos 2:24",
  },
  {
    number: 24,
    part: 2,
    question: "Por que é que foi necessário que Cristo, o Redentor, morresse?",
    answerShort:
      "Cristo morreu voluntariamente no nosso lugar para libertar-nos do poder e punição do pecado e trazer-nos de volta para Deus.",
    answerFull:
      "Uma vez que a morte é o castigo pelo pecado, Cristo morreu voluntariamente no nosso lugar para libertar-nos do poder e punição do pecado e trazer-nos de volta para Deus. Através da sua morte expiatória substitutiva, ele sozinho redimiu-nos do inferno e ganhou para nós perdão do pecado, justiça, e vida eterna.",
    reference: "Colossenses 1:21-22",
  },
  {
    number: 25,
    part: 2,
    question: "A morte de Cristo significa que todos os nossos pecados podem ser perdoados?",
    answerShort:
      "Sim, porque a morte de Cristo pagou totalmente a punição pelo nosso pecado, Deus nunca mais recordará os nossos pecados.",
    answerFull:
      "Sim, porque a morte de Cristo pagou totalmente a punição pelo nosso pecado, Deus graciosamente imputa-nos a justiça de Cristo como se fosse nossa e nunca mais recordará os nossos pecados.",
    reference: "2 Coríntios 5:21",
  },
  {
    number: 26,
    part: 2,
    question: "O que mais redime a morte de Cristo?",
    answerShort:
      "Todas as partes da criação caída.",
    answerFull:
      "A morte de Cristo é o princípio da redenção e renovação de todas as partes da criação caída, à medida que ele poderosamente dirige todas as coisas para a sua própria glória e bem da criação.",
    reference: "Colossenses 1:19-20",
  },
  {
    number: 27,
    part: 2,
    question: "Todas as pessoas, do mesmo modo que estão perdidas através de Adão, são salvas através de Cristo?",
    answerShort:
      "Não, apenas aquelas que são eleitas por Deus e unidas a Cristo pela fé.",
    answerFull:
      "Não, apenas aquelas que são eleitas por Deus e unidas a Cristo pela fé. Ainda assim Deus na sua misericórdia demonstra graça comum até àqueles que não são eleitos, restringindo os efeitos do pecado e permitindo obras de cultura para o bem-estar humano.",
    reference: "Romanos 5:17",
  },
  {
    number: 28,
    part: 2,
    question: "O que acontece depois da morte àqueles que não estão unidos a Cristo pela fé?",
    answerShort:
      "Eles serão expulsos da presença de Deus, para o inferno, para serem justamente castigados, para sempre.",
    answerFull:
      "No dia do julgamento eles receberão a terrível mas justa sentença de condenação pronunciada contra eles. Eles serão expulsos da favorável presença de Deus, para o inferno, para serem justamente e gravemente castigados, para sempre.",
    reference: "João 3:16-18, 36",
  },
  {
    number: 29,
    part: 2,
    question: "Como podemos ser salvos?",
    answerShort:
      "Apenas pela fé em Jesus Cristo e na sua morte expiatória substitutiva na cruz.",
    answerFull:
      "Apenas pela fé em Jesus Cristo e na sua morte expiatória substitutiva na cruz; e assim ainda que sejamos culpados de termos desobedecido a Deus e estejamos ainda inclinados para todo o mal, todavia, Deus, sem qualquer mérito nosso, mas apenas por pura graça, imputa-nos a perfeita justiça de Cristo quando nos arrependemos e cremos nele.",
    reference: "Efésios 2:8-9",
  },
  {
    number: 30,
    part: 2,
    question: "O que é fé em Jesus Cristo?",
    answerShort:
      "Receber e descansar nele somente para a salvação como ele nos foi oferecido no evangelho.",
    answerFull:
      "Fé em Jesus Cristo é reconhecer a verdade de tudo que Deus revelou na sua Palavra, confiando nele, e também receber e descansar nele somente para a salvação como ele nos foi oferecido no evangelho.",
    reference: "Gálatas 2:20",
  },
  {
    number: 31,
    part: 2,
    question: "Em que cremos por verdadeira fé?",
    answerShort:
      "Tudo o que nos é ensinado no evangelho, como expresso no Credo dos Apóstolos.",
    answerFull:
      "Tudo o que nos é ensinado no evangelho. O Credo dos Apóstolos expressa em que cremos nestas palavras: Cremos em Deus Pai Todo-Poderoso, Criador do céu e da terra; e em Jesus Cristo seu único Filho, nosso Salvador, o qual foi concebido pelo poder Espírito Santo, nasceu da virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado. Desceu ao hades. Ressuscitou ao terceiro dia. Ele ascendeu ao céu onde está sentado à direita de Deus Pai Todo-Poderoso; de onde voltará para julgar os vivos e os mortos. Cremos no Espírito Santo, na santa igreja universal, na comunhão dos santos, na remissão dos pecados, na ressurreição do corpo e na vida eterna. Amém.",
    reference: "Judas 3",
  },
  {
    number: 32,
    part: 2,
    question: "O que é que justificação e santificação significam?",
    answerShort:
      "Justificação é a nossa justiça declarada diante de Deus. Santificação é a nossa justiça gradual e crescente.",
    answerFull:
      "Justificação significa a nossa justiça declarada diante de Deus, possível pela morte e ressurreição de Cristo por nós. Santificação significa a nossa justiça gradual e crescente, possível pelo trabalho do Espírito em nós.",
    reference: "1 Pedro 1:1-2",
  },
  {
    number: 33,
    part: 2,
    question:
      "Aqueles que têm fé em Cristo devem procurar a sua salvação através das suas próprias obras, ou noutro lugar qualquer?",
    answerShort:
      "Não, tudo necessário para a salvação é encontrado em Cristo.",
    answerFull:
      "Não, não devem, uma vez que tudo necessário para a salvação é encontrado em Cristo. Procurar salvação através de boas obras é uma negação que Cristo é o único Redentor e Salvador.",
    reference: "Gálatas 2:16",
  },
  {
    number: 34,
    part: 2,
    question:
      "Uma vez que somos redimidos somente pela graça, somente através de Cristo, precisamos ainda de fazer boas obras e obedecer à Palavra de Deus?",
    answerShort:
      "Sim, para que as nossas vidas mostrem amor e gratidão a Deus e pelo nosso comportamento piedoso outros possam ser ganhos para Cristo.",
    answerFull:
      "Sim, porque Cristo, tendo-nos redimido pelo seu sangue, também nos renova pelo seu Espírito; para que as nossas vidas possam mostrar amor e gratidão a Deus; para que possamos estar seguros da nossa fé pelos frutos; e para que pelo nosso comportamento piedoso outros possam ser ganhos para Cristo.",
    reference: "1 Pedro 2:9-12",
  },
  {
    number: 35,
    part: 2,
    question:
      "Uma vez que somos redimidos somente pela graça, somente através da fé, de onde vem esta fé?",
    answerShort: "Do Espírito Santo.",
    answerFull:
      "Todos os dons que recebemos de Cristo recebemos através do Espírito Santo, incluindo a própria fé.",
    reference: "Tito 3:4-6",
  },

  // PARTE III — Deus Espírito Santo, restauração, renovação, crescimento em graça (36-52)
  {
    number: 36,
    part: 3,
    question: "Em que cremos acerca do Espírito Santo?",
    answerShort:
      "Que ele é Deus, co-eterno com o Pai e o Filho.",
    answerFull:
      "Que ele é Deus, co-eterno com o Pai e o Filho, e que Deus o garante irrevogavelmente a todos que creem.",
    reference: "João 14:16-17",
  },
  {
    number: 37,
    part: 3,
    question: "Como é que o Espírito nos ajuda?",
    answerShort:
      "O Espírito Santo convence-nos do nosso pecado, e permite-nos orar e entender a palavra de Deus.",
    answerFull:
      "O Espírito Santo convence-nos do nosso pecado, conforta-nos, guia-nos, dá-nos dons espirituais e o desejo de obedecer a Deus; e ele permite-nos que oremos e entendamos a palavra de Deus.",
    reference: "Efésios 6:17-18",
  },
  {
    number: 38,
    part: 3,
    question: "O que é a oração?",
    answerShort:
      "Oração é derramar os nossos corações a Deus.",
    answerFull:
      "Oração é derramar os nossos corações a Deus em louvor, petição, confissão de pecados, e acção de graças.",
    reference: "Salmo 62:8",
  },
  {
    number: 39,
    part: 3,
    question: "Com que atitude devemos orar?",
    answerShort:
      "Com amor, perseverança, e gratidão.",
    answerFull:
      "Com amor, perseverança, e gratidão; em humilde submissão à vontade de Deus, sabendo que, por causa de Cristo, ele ouve sempre as nossas orações.",
    reference: "Filipenses 4:6",
  },
  {
    number: 40,
    part: 3,
    question: "O que é que devemos orar?",
    answerShort:
      "A Palavra de Deus dirige-nos no que devemos orar.",
    answerFull:
      "A Palavra de Deus toda dirige e inspira-nos no que devemos orar, incluindo a oração que o próprio Jesus nos ensinou.",
    reference: "Efésios 3:14-21",
  },
  {
    number: 41,
    part: 3,
    question: "Qual é a oração do Senhor?",
    answerShort:
      "Pai nosso que estás no céu, santificado seja o teu nome, venha o teu reino, seja feita a tua vontade assim na terra como no céu. O pão nosso de cada dia dá-nos hoje e perdoa as nossas dívidas como nós perdoamos aos nossos devedores. E não nos deixes cair em tentação, mas livra-nos do mal. Porque teu é o Reino, o poder e a glória, para sempre, amém.",
    answerFull:
      "Pai nosso que estás no céu, santificado seja o teu nome, venha o teu reino, seja feita a tua vontade assim na terra como no céu. O pão nosso de cada dia dá-nos hoje e perdoa as nossas dívidas como nós perdoamos aos nossos devedores. E não nos deixes cair em tentação, mas livra-nos do mal. Porque teu é o Reino, o poder e a glória, para sempre, amém.",
    reference: "Mateus 6:9-13",
  },
  {
    number: 42,
    part: 3,
    question: "Como é que a Palavra de Deus deve ser lida e ouvida?",
    answerShort:
      "Com diligência, preparação e oração; para que a possamos aceitar com fé e praticá-la nas nossas vidas.",
    answerFull:
      "Com diligência, preparação e oração; para que a possamos aceitar com fé, guardá-la nos nossos corações, e praticá-la nas nossas vidas.",
    reference: "2 Timóteo 3:16-17",
  },
  {
    number: 43,
    part: 3,
    question: "Quais são as ordenanças?",
    answerShort:
      "O baptismo e a Ceia do Senhor.",
    answerFull:
      "Os sacramentos ou ordenanças dados por Deus e instituídos por Cristo, nomeadamente o baptismo e a Ceia do Senhor, são sinais visíveis e selos que estamos unidos como uma comunidade de fé pela sua morte e ressurreição. Pelo nosso uso deles o Espírito Santo mais plenamente declara e sela para nós as promessas do evangelho.",
    reference: "Romanos 6:4 e Lucas 22:19-20",
  },
  {
    number: 44,
    part: 3,
    question: "O que é o baptismo?",
    answerShort:
      "O baptismo é a lavagem com água no nome do Pai, do Filho e do Espírito Santo.",
    answerFull:
      "O baptismo é a lavagem com água no nome do Pai, do Filho e do Espírito Santo; significa e sela a nossa adopção em Cristo, a nossa purificação do pecado, e o nosso compromisso com pertencer ao Senhor e à sua igreja.",
    reference: "Mateus 28:19-20",
  },
  {
    number: 45,
    part: 3,
    question: "O baptismo com água é a lavagem do próprio pecado?",
    answerShort:
      "Não, apenas o sangue de Cristo pode limpar-nos do pecado.",
    answerFull:
      "Não, apenas o sangue de Cristo e a renovação do Espírito Santo pode limpar-nos do pecado.",
    reference: "Lucas 3:16",
  },
  {
    number: 46,
    part: 3,
    question: "O que é a Ceia do Senhor?",
    answerShort:
      "Cristo ordenou todos os cristãos a comer o pão e beber do cálice em grata memória dele e da sua morte.",
    answerFull:
      "Cristo ordenou todos os cristãos a comer o pão e beber do cálice em grata memória dele e da sua morte. A Ceia do Senhor é uma celebração da presença de Deus no nosso meio; trazendo-nos à comunhão com Deus e uns com os outros; alimentando e nutrindo as nossas almas. Também antecipa o dia quando comeremos e beberemos com Cristo no reino do seu Pai.",
    reference: "1 Coríntios 11:23-26",
  },
  {
    number: 47,
    part: 3,
    question: "A Ceia do Senhor adiciona alguma coisa ao trabalho expiatório de Cristo?",
    answerShort:
      "Não, Cristo morreu de uma vez por todas.",
    answerFull:
      "Não, Cristo morreu de uma vez por todas. A Ceia do Senhor é uma refeição pactual celebrando o trabalho expiatório de Cristo; assim como é um meio de reforçar a nossa fé enquanto olhamos para ele, e um aperitivo da festa futura. Mas aqueles que tomam parte com corações sem arrependimento comem e bebem julgamento para si mesmos.",
    reference: "1 Pedro 3:18",
  },
  {
    number: 48,
    part: 3,
    question: "O que é a igreja?",
    answerShort:
      "Uma comunidade eleita para a vida eterna e unida pela fé, que junta ama, segue, aprende de, e louva Deus.",
    answerFull:
      "Deus escolhe e preserva para si uma comunidade eleita para a vida eterna e unida pela fé, que junta ama, segue, aprende de, e louva Deus. Deus envia esta comunidade para proclamar o evangelho e prefigurar o reino de Cristo pela qualidade da sua vida em comunhão e o seu amor uns pelos outros.",
    reference: "2 Tessalonicenses 2:13",
  },
  {
    number: 49,
    part: 3,
    question: "Onde está Cristo agora?",
    answerShort:
      "Cristo ressurgiu fisicamente da sepultura ao terceiro dia e está sentado à direita do Pai.",
    answerFull:
      "Cristo ressurgiu fisicamente da sepultura ao terceiro dia após a sua morte e está sentado à direita do Pai, governando o seu reino e intercedendo por nós, até ele retorne para julgar e renovar todo o mundo.",
    reference: "Efésios 1:20-21",
  },
  {
    number: 50,
    part: 3,
    question: "O que é que a ressurreição de Cristo significa para nós?",
    answerShort:
      "Cristo triunfou sobre o pecado e a morte, para que todos os que confiam nele sejam erguidos para uma nova vida.",
    answerFull:
      "Cristo triunfou sobre o pecado e a morte ao ser fisicamente ressuscitado, para que todos os que confiam nele sejam erguidos para uma nova vida neste mundo e para a vida eterna no mundo por vir. Assim como um dia seremos ressuscitados, também este mundo será um dia restaurado. Mas aqueles que não confiam em Cristo serão erguidos para a morte eterna.",
    reference: "1 Tessalonicenses 4:13-14",
  },
  {
    number: 51,
    part: 3,
    question: "Que vantagem é para nós a ascensão de Cristo?",
    answerShort:
      "Cristo está agora a advogar por nós na presença do seu Pai, e também nos envia o seu Espírito.",
    answerFull:
      "Cristo ascendeu fisicamente em nosso nome, do mesmo modo que desceu fisicamente em nossa conta, e ele está agora a advogar por nós na presença do seu Pai, preparando um lugar para nós, e também nos envia o seu Espírito.",
    reference: "Romanos 8:34",
  },
  {
    number: 52,
    part: 3,
    question: "Que esperança é que a vida eterna reserva para nós?",
    answerShort:
      "Que em breve viveremos com e desfrutaremos Deus para sempre, no novo céu e na nova terra, livres do pecado.",
    answerFull:
      "Recorda-nos que este presente mundo caído não é tudo o que há; em breve viveremos com e desfrutaremos Deus para sempre na nova cidade, no novo céu e na nova terra, onde seremos inteiramente e para sempre livres do pecado e habitaremos corpos de ressurreição renovados numa criação restaurada renovada.",
    reference: "Apocalipse 21:1-4",
  },
];

export default catechism;

/**
 * Devolve a pergunta do catecismo correspondente à semana do dia dado (1-365).
 * Há 52 perguntas → 1 por semana do ano. Dias 365 caem na semana 52.
 */
export function getCatechismForDay(day: number): CatechismQA {
  const week = Math.min(52, Math.max(1, Math.ceil(day / 7)));
  return catechism[week - 1];
}

/**
 * Devolve a semana (1-52) a que pertence o dia.
 */
export function getWeekForDay(day: number): number {
  return Math.min(52, Math.max(1, Math.ceil(day / 7)));
}
