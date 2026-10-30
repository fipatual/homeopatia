/* ═══════════════════════════════════════════════════════════════
   /api/anamnese — função do Vercel que recebe a descrição dos
   sintomas e pede ao Claude uma anamnese homeopática educativa.
   A chave fica SÓ na variável de ambiente ANTHROPIC_API_KEY do Vercel.
   ═══════════════════════════════════════════════════════════════ */

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';
const MAX_CHARS = 3000;
const LIMIT_PER_HOUR = Number(process.env.LIMIT_PER_HOUR || 15);

const ALLOWED = [
  /^https:\/\/homeopatia[a-z0-9-]*\.vercel\.app$/,
  /^https:\/\/fipatual\.github\.io$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
];

const SYSTEM = `Você é o “consultório educativo” de um site brasileiro sobre homeopatia, escrito em português do Brasil, num tom acolhedor, claro e respeitoso.

A pessoa descreve o que está sentindo. Sua tarefa é montar uma ANAMNESE HOMEOPÁTICA COMPLETA e educativa, como um homeopata clássico organizaria o caso, usando a ferramenta "registrar_anamnese".

Regras:
- Use somente o que a pessoa contou. Não invente dados; o que faltar vira pergunta em "perguntas_que_faltam".
- Organize como na homeopatia clássica: queixa principal, história, sensações, modalidades (o que piora / o que melhora, incluindo hora, clima, posição, movimento, comida), sintomas concomitantes, sintomas gerais (sono, sede, apetite, temperatura, transpiração, desejos e aversões) e sintomas mentais/emocionais.
- Explique de forma simples o que provavelmente acontece no corpo (fisiologia), sem dar diagnóstico.
- Cite de 2 a 4 medicamentos que a tradição homeopática (Matéria Médica / repertório) associaria a esse quadro, dizendo a origem de cada um e por que o “retrato” dele lembra o caso. Deixe claro que é a visão da tradição, não uma prescrição.
- Inclua, com honestidade e sem sermão, o que a ciência diz: as grandes revisões não encontraram efeito dos medicamentos homeopáticos além do placebo; diga o que comprovadamente ajuda nesse tipo de queixa.
- Liste sinais de alerta para procurar um médico. Se a descrição tiver sinais de urgência (dor no peito, falta de ar, desmaio, sangramento importante, febre alta em bebê, confusão, fraqueza súbita de um lado do corpo, ideação suicida etc.), preencha "urgente" com uma orientação direta para procurar atendimento já (SAMU 192; CVV 188 para sofrimento emocional).
- Se o texto não for uma queixa de saúde, preencha só "resumo" explicando gentilmente que a consulta serve para descrever sintomas.
- Nunca indique dose, potência ou que a pessoa pare um tratamento médico.
- Responda SEMPRE chamando a ferramenta "registrar_anamnese" uma única vez, sem texto fora dela.`;

const TOOL = {
  name: 'registrar_anamnese',
  description: 'Registra a anamnese homeopática educativa estruturada.',
  input_schema: {
    type: 'object',
    properties: {
      resumo: { type: 'string', description: '2 a 3 frases resumindo o caso com as palavras da pessoa.' },
      urgente: { type: 'string', description: 'Orientação de urgência, ou string vazia se não houver sinais de urgência.' },
      queixa_principal: { type: 'string' },
      historia: { type: 'string', description: 'Início, duração, evolução, gatilhos.' },
      sensacoes: { type: 'array', items: { type: 'string' } },
      piora: { type: 'array', items: { type: 'string' } },
      melhora: { type: 'array', items: { type: 'string' } },
      concomitantes: { type: 'array', items: { type: 'string' } },
      gerais: { type: 'array', items: { type: 'string' }, description: 'Sono, sede, apetite, temperatura, desejos/aversões.' },
      mentais: { type: 'array', items: { type: 'string' } },
      perguntas_que_faltam: { type: 'array', items: { type: 'string' }, description: 'Perguntas que um homeopata faria para completar o caso.' },
      no_corpo: { type: 'string', description: 'O que provavelmente acontece no corpo, em linguagem simples.' },
      medicamentos_da_tradicao: {
        type: 'array',
        items: {
          type: 'object',
          properties: { nome: { type: 'string' }, origem: { type: 'string' }, por_que: { type: 'string' } },
          required: ['nome', 'origem', 'por_que'],
        },
      },
      ciencia: { type: 'string' },
      procurar_medico_se: { type: 'array', items: { type: 'string' } },
    },
    required: ['resumo', 'urgente'],
  },
};

const hits = new Map(); // limite simples por IP (melhor esforço)
function tooMany(ip) {
  const now = Date.now(), h = (hits.get(ip) || []).filter(t => now - t < 3600e3);
  h.push(now); hits.set(ip, h);
  return h.length > LIMIT_PER_HOUR;
}

module.exports = async (req, res) => {
  const origin = req.headers.origin || '';
  if (ALLOWED.some(r => r.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  const key = process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_KEY;
  // GET = verificação de saúde (não revela a chave)
  if (req.method === 'GET') return res.status(200).json({ ok: true, chave_configurada: Boolean(key), modelo: MODEL });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  if (origin && !ALLOWED.some(r => r.test(origin))) return res.status(403).json({ error: 'Origem não permitida.' });

  if (!key) return res.status(500).json({ error: 'A chave ANTHROPIC_API_KEY (ou ANTHROPIC_KEY) não está configurada no Vercel.' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const texto = String((body && body.texto) || '').trim().slice(0, MAX_CHARS);
  if (texto.length < 3) return res.status(400).json({ error: 'Descreva o que você está sentindo.' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'anon';
  if (tooMany(ip)) return res.status(429).json({ error: 'Muitas consultas seguidas. Tente de novo daqui a pouco.' });

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 3000,
        system: SYSTEM,
        tools: [TOOL],
        tool_choice: { type: 'auto' },
        messages: [{ role: 'user', content: `Descrição da pessoa:\n"""${texto}"""` }],
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      console.error('Anthropic', r.status, JSON.stringify(data).slice(0, 500));
      const msg = r.status === 401 ? 'A chave da API foi recusada. Confira a ANTHROPIC_API_KEY no Vercel.'
        : r.status === 429 ? 'O serviço de IA está ocupado. Tente de novo em instantes.'
        : 'Não foi possível gerar a anamnese agora.';
      return res.status(502).json({ error: msg });
    }
    const tool = (data.content || []).find(b => b.type === 'tool_use');
    if (tool) return res.status(200).json(tool.input);
    // plano B: o modelo respondeu em texto — tenta achar um JSON, senão devolve o texto como resumo
    const txt = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
    const m = txt.match(/\{[\s\S]*\}/);
    if (m) { try { return res.status(200).json(JSON.parse(m[0])); } catch {} }
    if (txt) return res.status(200).json({ resumo: txt, urgente: '' });
    return res.status(502).json({ error: 'Resposta inesperada da IA.' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao falar com a IA.' });
  }
};
