/* Conteúdo do site — tudo em um lugar só para facilitar a edição. */
window.HDATA = {

  /* ───────────── QUEIXAS DE EXEMPLO (CONSULTA) ───────────── */
  complaints: [
    {
      id: 'hematoma',
      chip: 'Bati o joelho e ficou roxo',
      title: 'Pancada e mancha roxa',
      keywords: ['roxo', 'hematoma', 'pancada', 'bati', 'batida', 'queda', 'caí', 'cai ', 'contusão', 'machuc', 'mancha roxa'],
      whatHappens: 'Na pancada, vasinhos finíssimos (capilares) se rompem debaixo da pele. O sangue vaza para o tecido e fica preso ali. A mancha muda de cor porque o corpo vai desmontando a hemoglobina: roxo-avermelhado → verde (biliverdina) → amarelo (bilirrubina) → some.',
      remedies: [
        { name: 'Arnica montana', origin: 'flor amarela dos Alpes', note: 'É o medicamento mais citado nos livros homeopáticos para traumatismos, “sensação de corpo moído” e hematomas.' },
        { name: 'Ruta graveolens', origin: 'arruda', note: 'Citada quando a pancada atinge mais o osso, o tendão ou a canela.' },
        { name: 'Bellis perennis', origin: 'margarida-comum', note: 'Lembrada em contusões mais profundas, de tecidos moles.' }
      ],
      modalities: 'O homeopata perguntaria: piora ao toque? melhora com frio ou com calor? a pessoa prefere ficar parada ou se mexer?',
      redFlags: ['Inchaço que cresce muito rápido ou deformidade', 'Dor forte para apoiar o peso', 'Manchas roxas que aparecem sem pancada', 'Pancada na cabeça com sonolência, vômito ou confusão'],
      science: 'Hematomas comuns somem sozinhos em 1–3 semanas. Gelo nas primeiras horas e elevar a perna ajudam de verdade. Arnica em gel (não diluída) tem alguns estudos pequenos e inconclusivos; a versão homeopática não mostrou efeito além do placebo em ensaios controlados.'
    },
    {
      id: 'coriza',
      chip: 'Nariz escorrendo e olhos ardendo',
      title: 'Coriza e olhos lacrimejando',
      keywords: ['coriza', 'nariz escorr', 'espirr', 'resfri', 'rinite', 'alergia', 'olhos ard', 'lacrimej', 'gripe', 'nariz entup'],
      whatHappens: 'Vírus ou pólen irritam a mucosa do nariz. O corpo responde soltando histamina: os vasos dilatam, as glândulas produzem muco e os olhos lacrimejam — é a faxina do organismo.',
      remedies: [
        { name: 'Allium cepa', origin: 'cebola-roxa', note: 'O exemplo clássico do “semelhante”: quem corta cebola lacrimeja e espirra; por isso é citada para coriza aguada com olhos ardendo.' },
        { name: 'Euphrasia', origin: 'eufrásia, “erva-dos-olhos”', note: 'Citada quando o olho arde mais que o nariz.' },
        { name: 'Arsenicum album', origin: 'trióxido de arsênio, hiperdiluído', note: 'Lembrado para coriza que queima o lábio, com frio e inquietação.' }
      ],
      modalities: 'O homeopata perguntaria: piora em lugar fechado ou ao ar livre? o muco é aguado ou grosso? arde ou não arde?',
      redFlags: ['Falta de ar ou chiado no peito', 'Febre alta por mais de 3 dias', 'Dor forte no rosto ou ouvido', 'Bebês com dificuldade para mamar ou respirar'],
      science: 'O resfriado comum melhora sozinho em 7 a 10 dias, com ou sem tratamento. Lavagem nasal com soro e hidratação aliviam. Para rinite alérgica, anti-histamínicos têm eficácia comprovada.'
    },
    {
      id: 'insonia',
      chip: 'Não consigo dormir, a cabeça não desliga',
      title: 'Insônia de pensamentos acelerados',
      keywords: ['dormir', 'insônia', 'insonia', 'sono', 'acordo', 'cabeça não desliga', 'pensamento', 'madrugada'],
      whatHappens: 'Ao longo do dia o cérebro acumula adenosina, uma molécula que dá sono ao se encaixar em “fechaduras” nos neurônios. Estresse, telas e cafeína (que ocupa essas fechaduras) mantêm o cérebro em alerta.',
      remedies: [
        { name: 'Coffea cruda', origin: 'grão de café verde', note: 'Outro “semelhante” didático: o café tira o sono; por isso é citado para mente acelerada, cheia de ideias, que não desliga.' },
        { name: 'Nux vomica', origin: 'semente da noz-vômica', note: 'Lembrada para quem acorda de madrugada (3–4h) depois de excessos e trabalho.' },
        { name: 'Ignatia amara', origin: 'fava-de-santo-inácio', note: 'Citada para insônia ligada a tristeza ou luto recente.' }
      ],
      modalities: 'O homeopata perguntaria: demora para pegar no sono ou acorda no meio da noite? em que horário? o que passa pela cabeça?',
      redFlags: ['Insônia por mais de 3 meses', 'Ronco alto com pausas na respiração', 'Tristeza profunda, desesperança ou pensamentos de se machucar (ligue 188 — CVV)'],
      science: 'A terapia cognitivo-comportamental para insônia (TCC-I) é o tratamento de primeira linha com melhor evidência. Higiene do sono — horário fixo, quarto escuro, menos tela e cafeína à tarde — ajuda muito.'
    },
    {
      id: 'digestao',
      chip: 'Comi demais e o estômago pesou',
      title: 'Estômago pesado depois de exagerar',
      keywords: ['comi', 'estômago', 'estomago', 'azia', 'indigest', 'empachado', 'gases', 'enjoo depois', 'exagerei', 'ressaca', 'digest'],
      whatHappens: 'O estômago é uma bolsa muscular com dobras (as pregas gástricas) que se esticam. Com muita comida gordurosa ou álcool, ele esvazia mais devagar, produz mais ácido e o gás sobe — daí o peso e a azia.',
      remedies: [
        { name: 'Nux vomica', origin: 'semente da noz-vômica', note: 'O medicamento mais lembrado nos livros para “excessos”: comida, bebida, café, noites mal dormidas e irritação.' },
        { name: 'Carbo vegetabilis', origin: 'carvão vegetal', note: 'Citado para muitos gases e estufamento, com alívio ao arrotar.' },
        { name: 'Pulsatilla', origin: 'anêmona-dos-prados', note: 'Lembrada para mal-estar depois de comida gordurosa, sem sede.' }
      ],
      modalities: 'O homeopata perguntaria: arrotar alivia? piora deitado? tem sede ou não? está irritado ou choroso?',
      redFlags: ['Vômito com sangue ou fezes pretas', 'Dor forte que não passa ou que vai para o braço/peito', 'Perda de peso sem explicação', 'Dificuldade para engolir'],
      science: 'Refeições menores, comer devagar e não deitar logo após comer reduzem o refluxo. Antiácidos aliviam a azia. Sintomas que voltam sempre merecem avaliação médica.'
    },
    {
      id: 'picada',
      chip: 'Uma abelha me picou e inchou',
      title: 'Picada de abelha com inchaço',
      keywords: ['picada', 'abelha', 'vespa', 'inseto', 'mosquito', 'inchou', 'ferroada', 'ferrão'],
      whatHappens: 'O ferrão da abelha tem farpas e fica preso na pele com a bolsa de veneno ainda bombeando. O veneno (melitina) abre poros nas células e libera histamina: vermelhidão, calor, ardor e inchaço.',
      remedies: [
        { name: 'Apis mellifica', origin: 'a própria abelha', note: 'O “semelhante” mais literal da homeopatia: é citada para inchaços rosados, quentes e ardidos que melhoram com frio — qualquer que seja a causa.' },
        { name: 'Ledum palustre', origin: 'alecrim-do-norte', note: 'Lembrado para picadas e perfurações que melhoram com compressa fria.' },
        { name: 'Urtica urens', origin: 'urtiga', note: 'Citada para ardor e coceira tipo urticária.' }
      ],
      modalities: 'O homeopata perguntaria: o inchaço é quente ou frio? melhora com gelo? arde ou coça?',
      redFlags: ['Falta de ar, chiado ou inchaço nos lábios e na garganta — emergência, ligue 192', 'Muitas picadas de uma vez', 'Picada dentro da boca', 'Tontura ou desmaio'],
      science: 'Tire o ferrão raspando com a unha ou um cartão (sem apertar a bolsa de veneno), lave e aplique gelo. Anti-histamínicos aliviam. Reação alérgica grave (anafilaxia) se trata com adrenalina, e rápido.'
    },
    {
      id: 'enjoo',
      chip: 'Fico enjoado em viagens de carro ou barco',
      title: 'Enjoo de movimento',
      keywords: ['enjoo', 'enjoado', 'enjoada', 'náusea', 'nausea', 'viagem', 'carro', 'barco', 'navio', 'cinetose', 'labirint', 'tontura'],
      whatHappens: 'Dentro do ouvido há três tubinhos cheios de líquido (os canais semicirculares) que sentem o balanço. No barco, o ouvido diz “estamos mexendo”, mas o olho, fixo na cabine, diz “estamos parados”. O cérebro estranha o conflito e dispara o enjoo.',
      remedies: [
        { name: 'Cocculus indicus', origin: 'semente de uma trepadeira asiática', note: 'O mais citado para enjoo de movimento com tontura e fraqueza, que piora só de olhar algo se mexendo.' },
        { name: 'Tabacum', origin: 'folha do tabaco', note: 'Lembrado para enjoo com suor frio e palidez que melhora ao ar livre.' },
        { name: 'Petroleum', origin: 'óleo mineral', note: 'Citado para enjoo de carro com fome estranha.' }
      ],
      modalities: 'O homeopata perguntaria: melhora de olhos fechados ou olhando o horizonte? tem suor frio? melhora com ar fresco?',
      redFlags: ['Tontura forte sem movimento, de repente', 'Tontura com fala enrolada, rosto torto ou fraqueza num lado do corpo — ligue 192', 'Vômitos que não param'],
      science: 'Olhar o horizonte, sentar na frente do carro ou no meio do barco e evitar ler ajudam a reduzir o conflito de sentidos. Remédios como dimenidrinato têm eficácia comprovada.'
    }
  ],

  /* Palavras que indicam urgência médica */
  urgent: [
    { re: /(suic|me matar|tirar minha vida|me machucar|automutila|não quero mais viver|nao quero mais viver)/i,
      msg: 'Você não precisa passar por isso sozinho(a). Ligue <b>188</b> (CVV, 24h, gratuito) ou acesse cvv.org.br. Em perigo imediato, ligue <b>192</b>.' },
    { re: /(dor no peito|aperto no peito|falta de ar|não consigo respirar|nao consigo respirar|desmai|convuls|boca torta|rosto torto|fala enrolada|sangr(ando|amento) muito|vomit(ando|o) sangue|anafila|garganta fechando|lábios? inchad)/i,
      msg: 'Esses sinais podem indicar uma emergência. Ligue <b>192</b> (SAMU) ou vá agora a um pronto-socorro.' },
    { re: /(febre).{0,25}(bebê|bebe|recém|recem|meses)/i,
      msg: 'Febre em bebês pequenos precisa de avaliação médica no mesmo dia.' }
  ],

  /* ───────────── PRINCÍPIOS (agora dentro da CONSULTA) ───────────── */
  principles: [
    { id: 'similia', title: 'Semelhante cura semelhante', latin: 'Similia similibus curentur',
      short: 'Uma substância que provoca sintomas numa pessoa saudável seria usada para tratar sintomas parecidos numa pessoa doente.',
      long: 'É a ideia-mãe da homeopatia. Cebola faz lacrimejar → cebola diluída para coriza. Café tira o sono → café diluído para insônia. Hahnemann chegou a isso em 1790, ao tomar casca de quina e sentir sintomas que lembravam a malária, que a quina tratava.',
      sci: 'A ciência não encontrou uma lei geral desse tipo. Há coincidências curiosas (vacinas e dessensibilização de alergias usam “um pouco do agressor”), mas elas funcionam por mecanismos imunológicos específicos e com doses mensuráveis.' },
    { id: 'experimentacao', title: 'Experimentação no ser humano saudável', latin: 'Patogenesia',
      short: 'Voluntários saudáveis tomam uma substância e anotam tudo o que sentem — esse diário vira o “retrato” do medicamento.',
      long: 'Essas experimentações (em inglês, “provings”) formam a Matéria Médica: livros enormes que listam, para cada substância, sintomas do corpo, do sono, dos sonhos e do humor.',
      sci: 'Foi uma ideia pioneira para a época: testar em pessoas e registrar com método. Mas experimentações com controle por placebo costumam encontrar a mesma quantidade de “sintomas” nos dois grupos.' },
    { id: 'dose', title: 'Dose mínima e dinamização', latin: 'Diluição + sucussão',
      short: 'O medicamento é diluído muitas vezes e sacudido com força a cada etapa. Para os homeopatas, quanto mais diluído, mais “potente”.',
      long: 'Na escala centesimal (C), cada etapa é 1 parte da substância para 99 de água ou álcool. 6C = seis etapas; 30C = trinta etapas. Hahnemann batia o frasco contra um livro de couro — a “sucussão”.',
      sci: 'A partir de 12C a diluição passa do número de Avogadro: é praticamente certo que não reste nenhuma molécula da substância original. Veja a escada interativa na aba Ciência.' },
    { id: 'unico', title: 'Medicamento único', latin: 'Unicista',
      short: 'Na escola clássica, dá-se um medicamento por vez, escolhido para o conjunto de sintomas da pessoa.',
      long: 'Hahnemann dizia que só assim dá para saber o que cada substância faz. Hoje existem também correntes “complexistas”, que misturam várias.',
      sci: 'Testar uma variável por vez é, de fato, um princípio científico sólido — é assim que se faz um bom experimento.' },
    { id: 'individualizacao', title: 'Individualização', latin: 'Totalidade sintomática',
      short: 'Duas pessoas com “gripe” podem receber medicamentos diferentes, porque o homeopata olha a pessoa inteira.',
      long: 'A consulta homeopática é longa: pergunta sobre sono, comida preferida, medos, temperamento, o que melhora e o que piora cada sintoma (as “modalidades”).',
      sci: 'Escuta atenta e consultas longas têm efeitos reais no bem-estar — isso a pesquisa sobre a relação médico-paciente confirma. Os ensaios com homeopatia individualizada, porém, não mostraram efeito consistente além do placebo.' },
    { id: 'vital', title: 'Força vital', latin: 'Dynamis',
      short: 'Hahnemann acreditava numa energia imaterial que mantém o corpo em equilíbrio; a doença seria um desarranjo dela.',
      long: 'O “vitalismo” era uma ideia comum no século XVIII. O medicamento dinamizado agiria nesse plano energético, e não no químico.',
      sci: 'A biologia moderna explica a vida por química e física (células, DNA, metabolismo) e não encontrou nenhuma “força vital” mensurável.' },
    { id: 'hering', title: 'Lei de cura de Hering', latin: 'De dentro para fora',
      short: 'A cura iria de dentro para fora, de cima para baixo, dos órgãos mais importantes para os menos — e na ordem inversa do surgimento.',
      long: 'Formulada por Constantine Hering, o “pai da homeopatia americana”, no século XIX. É usada pelos homeopatas para avaliar se o tratamento “vai bem”.',
      sci: 'É uma regra observacional da tradição homeopática, sem comprovação em estudos.' }
  ],

  /* ───────────── LINHA DO TEMPO (HISTÓRIA) ───────────── */
  timeline: [
    { y: -400, label: 'c. 400 a.C.', title: 'Hipócrates e os dois caminhos', art: 'hipocrates', era: 'antiga',
      text: 'Nos escritos atribuídos a Hipócrates aparecem duas formas de tratar: pelo contrário (frio contra calor) e, às vezes, pelo semelhante. A segunda ideia dormiria por 2 mil anos.' },
    { y: 1530, label: 'c. 1530', title: 'Paracelso: “a dose faz o veneno”', art: 'paracelso', era: 'antiga',
      text: 'O médico suíço Paracelso dizia que tudo é veneno, dependendo da dose — e acreditava que as plantas tinham “assinaturas”: a noz, parecida com um cérebro, serviria para a cabeça.' },
    { y: 1755, label: '1755', title: 'Nasce Samuel Hahnemann', era: 'hahnemann',
      text: 'Em Meissen, na Saxônia, cidade famosa pela porcelana. Filho de um pintor de porcelanas, dominava várias línguas e trabalhou como tradutor de livros médicos.' },
    { y: 1790, label: '1790', title: 'O experimento da quina', art: 'quina', era: 'hahnemann', big: true,
      text: 'Traduzindo um livro do médico escocês William Cullen, Hahnemann discordou da explicação de por que a casca da quina curava malária. Tomou a casca ele mesmo e sentiu calafrios e palpitações parecidos com a doença. Nascia a ideia do “semelhante”. (Hoje sabemos que a quina contém quinina, que mata o parasita da malária no sangue.)' },
    { y: 1796, label: '1796', title: 'O primeiro ensaio', era: 'hahnemann',
      text: 'No jornal médico de Hufeland, Hahnemann publica seu “Ensaio sobre um novo princípio”. Era a época das sangrias e dos purgantes — e ele criticava esses tratamentos agressivos.' },
    { y: 1810, label: '1810', title: 'O Organon', art: 'organon', era: 'hahnemann', big: true,
      text: 'Hahnemann publica o “Organon da Arte Racional de Curar”, o livro-regra da homeopatia. Teve seis edições; a última só foi publicada em 1921, quase 80 anos após sua morte.' },
    { y: 1828, label: '1828', title: 'As doenças crônicas', era: 'hahnemann',
      text: 'Hahnemann propõe os “miasmas” — causas profundas e herdadas que explicariam as doenças que não saravam.' },
    { y: 1835, label: '1835', title: 'Paris e Mélanie', era: 'hahnemann',
      text: 'Aos 79 anos, viúvo, Hahnemann se casa com a pintora francesa Mélanie d’Hervilly e se muda para Paris, onde atende de nobres a pobres. Morre lá em 1843.' },
    { y: 1840, label: '21 nov 1840', title: 'A homeopatia chega ao Brasil', art: 'navio', era: 'brasil', big: true,
      text: 'O médico francês Benoît Mure — “Bento Mure” — desembarca no Rio de Janeiro. Socialista utópico, funda uma colônia em Santa Catarina (Saí), uma escola e o Instituto Homeopático do Brasil, atendendo gratuitamente os pobres.' },
    { y: 1854, label: '1854', title: 'O cólera em Londres', art: 'colera', era: 'brasil', big: true,
      text: 'Na epidemia do Soho, o Hospital Homeopático de Londres relata mortalidade bem menor que a dos hospitais comuns. No mesmo ano, John Snow descobre que o cólera vinha da água de uma bomba pública. Explicação provável do “sucesso”: a homeopatia não fazia sangrias nem dava venenos — e repouso e hidratação ajudavam.' },
    { y: 1910, label: '1910', title: 'O Relatório Flexner', era: 'moderna',
      text: 'Nos EUA, um relatório reforma o ensino médico e exige base científica e laboratórios. Quase todas as escolas homeopáticas americanas fecham nas décadas seguintes.' },
    { y: 1928, label: '1928', title: 'A era dos antibióticos', art: 'penicilina', era: 'moderna',
      text: 'Alexander Fleming descobre a penicilina. Com antibióticos e vacinas, a medicina passa a curar infecções que antes matavam — e a homeopatia perde espaço no mundo todo.' },
    { y: 1980, label: '1980', title: 'Especialidade médica no Brasil', era: 'moderna',
      text: 'O Conselho Federal de Medicina reconhece a homeopatia como especialidade médica (Resolução CFM 1.000/80). No Brasil, homeopata precisa ser médico, farmacêutico, dentista ou veterinário com formação específica.' },
    { y: 1988, label: '1988', title: 'A “memória da água”', art: 'agua', era: 'moderna', big: true,
      text: 'O imunologista Jacques Benveniste publica na revista Nature que anticorpos diluídos além de qualquer molécula ainda teriam efeito. Uma equipe da revista acompanha a repetição do experimento às cegas — e o efeito desaparece.' },
    { y: 2005, label: '2005', title: 'A meta-análise da Lancet', era: 'contemporanea',
      text: 'Um estudo comparou 110 ensaios de homeopatia com 110 da medicina convencional. Nos ensaios maiores e mais bem feitos, o efeito da homeopatia ficou compatível com placebo.' },
    { y: 2006, label: '2006', title: 'Homeopatia no SUS', era: 'contemporanea',
      text: 'A Política Nacional de Práticas Integrativas e Complementares (PNPIC) inclui a homeopatia no Sistema Único de Saúde.' },
    { y: 2015, label: '2015', title: 'A revisão australiana', era: 'contemporanea',
      text: 'O conselho nacional de pesquisa médica da Austrália (NHMRC) avalia 176 estudos e conclui que não há evidência confiável de efeito além do placebo para nenhuma condição. Associações homeopáticas contestam os critérios usados.' },
    { y: 2021, label: '2021', title: 'França encerra o reembolso', era: 'contemporanea',
      text: 'Depois de uma avaliação da Alta Autoridade de Saúde, a França — terra da Boiron, maior fabricante mundial — deixa de reembolsar medicamentos homeopáticos pela previdência pública.' }
  ],

  /* Comparações para a escada de diluição.
     Volume total ≈ 0,05 mL (uma gota) × 100^n */
  ladder: [
    { n: 0,  vol: 'a gota original', cmp: 'tintura-mãe', icon: 'gota' },
    { n: 1,  vol: '5 mL', cmp: 'uma colher de chá', icon: 'colher' },
    { n: 2,  vol: '0,5 litro', cmp: 'uma garrafinha de água', icon: 'garrafa' },
    { n: 3,  vol: '50 litros', cmp: 'um balde grande', icon: 'balde' },
    { n: 4,  vol: '5 mil litros', cmp: 'uma caixa-d’água', icon: 'caixa' },
    { n: 5,  vol: '500 mil litros', cmp: 'uma piscina semiolímpica', icon: 'piscina' },
    { n: 6,  vol: '50 milhões de litros', cmp: 'cerca de 20 piscinas olímpicas', icon: 'piscina' },
    { n: 7,  vol: '5 bilhões de litros', cmp: 'um lago', icon: 'lago' },
    { n: 8,  vol: '0,5 km³', cmp: 'uma grande represa', icon: 'lago' },
    { n: 9,  vol: '50 km³', cmp: 'quase dois reservatórios de Itaipu', icon: 'lago' },
    { n: 10, vol: '5 mil km³', cmp: 'um quinto do Lago Baikal', icon: 'lago' },
    { n: 11, vol: '500 mil km³', cmp: 'um sétimo do Mar Mediterrâneo', icon: 'oceano' },
    { n: 12, vol: '50 milhões de km³', cmp: 'um sexto do Oceano Atlântico', icon: 'oceano' },
    { n: 13, vol: '5 bilhões de km³', cmp: 'quase 4 vezes todos os oceanos da Terra', icon: 'terra' },
    { n: 15, vol: '50 trilhões de km³', cmp: 'água para encher ~46 planetas Terra', icon: 'terra' },
    { n: 18, vol: '5×10¹⁹ km³', cmp: 'o volume de ~35 Sóis', icon: 'sol' },
    { n: 24, vol: '5×10³¹ km³', cmp: 'uma esfera maior que a órbita de Plutão', icon: 'sistema' },
    { n: 30, vol: '5×10⁴³ km³', cmp: 'uma esfera de água com ~48 anos-luz de diâmetro', icon: 'estrelas' }
  ]
};
