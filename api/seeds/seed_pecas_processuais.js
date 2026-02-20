'use strict'

/**
 * Script de Seed - Peças Processuais
 *
 * Lê os 41 templates do DOCX (previamente extraídos para pecas_templates.json)
 * e cria as peças processuais via API POST /sgigjprpecasprocessual
 *
 * Uso:
 *   node seeds/seed_pecas_processuais.js [--api-url=http://localhost:3333] [--token=JWT_TOKEN]
 *
 * Ou via adonis:
 *   node ace seed:pecas
 */

const http = require('http')
const https = require('https')
const path = require('path')
const fs = require('fs')

// ==================== CONFIGURAÇÃO ====================

const args = process.argv.slice(2)
const getArg = (name, defaultValue) => {
  const arg = args.find(a => a.startsWith(`--${name}=`))
  return arg ? arg.split('=').slice(1).join('=') : defaultValue
}

const API_URL = getArg('api-url', 'http://localhost:3333')
const AUTH_TOKEN = getArg('token', '')
const DRY_RUN = args.includes('--dry-run')
const SKIP_EXISTING = !args.includes('--force')

// ==================== MAPEAMENTO DE CAMPOS ====================

/**
 * Mapeamento de cada template aos campos (flags) que deve ter.
 * Os campos disponíveis no sistema são identificados pelas flags:
 * - PESSOA: Selector de pessoa (visado, arguido, etc.)
 * - OBS: Editor de texto rico (corpo do documento)
 * - ANEXO_DOC: Upload de documentos/anexos
 * - DESTINATARIO: Selector de destinatário
 * - INFRACAO_COIMA: Selector de infração + valor da coima
 * - DECISAO: Selector de tipo de decisão
 *
 * Cada entrada define quais campos activar e a sua ordem/obrigatoriedade.
 */
const CAMPOS_MAP = {
  // ANEXO 1 - Auto de Notícia
  'ANEXO 1': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '1' },         // Descrição dos factos
    { flag: 'FLAG_PESSOA', ordem: '2', obrigatorio: '1' },       // Denunciante/Testemunha
    { flag: 'FLAG_ANEXO_DOC', ordem: '3', obrigatorio: '0' },    // Documentos anexos
  ],

  // ANEXO 2 - Capa do Processo
  'ANEXO 2': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Trabalhador/Visado
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '0' },          // Observações
  ],

  // ANEXO 3 - Termos de Abertura e Encerramento
  'ANEXO 3': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '1' },          // Corpo do termo
  ],

  // ANEXO 4 - Comunicação de Início da Instrução à Entidade Decisora
  'ANEXO 4': [
    { flag: 'FLAG_DESTINATARIO', ordem: '1', obrigatorio: '1' }, // Entidade Decisora
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo da comunicação
    { flag: 'FLAG_ANEXO_DOC', ordem: '3', obrigatorio: '0' },    // Anexos
  ],

  // ANEXO 5 - Notificação Pessoal de Início da Instrução
  'ANEXO 5': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Notificado (visado)
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo da notificação
  ],

  // MODELO 6 - Comunicação de Início da Instrução ao Visado ou Entidade Patronal
  'MODELO 6': [
    { flag: 'FLAG_DESTINATARIO', ordem: '1', obrigatorio: '1' }, // Visado/Entidade Patronal
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo
    { flag: 'FLAG_ANEXO_DOC', ordem: '3', obrigatorio: '0' },    // Anexos
  ],

  // MODELO 7 - Acusação
  'MODELO 7': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },            // Visado/Arguido
    { flag: 'FLAG_INFRACAO_COIMA', ordem: '2', obrigatorio: '1' },    // Infração e sanção
    { flag: 'FLAG_OBS', ordem: '3', obrigatorio: '1' },               // Corpo da acusação
    { flag: 'FLAG_ANEXO_DOC', ordem: '4', obrigatorio: '0' },         // Documentos
  ],

  // MODELO 8 - Notificação Pessoal da Acusação e Certidão Negativa
  'MODELO 8': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Notificado
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo
    { flag: 'FLAG_ANEXO_DOC', ordem: '3', obrigatorio: '1' },    // Cópia da acusação
  ],

  // MODELO 9 - Notificação Postal da Acusação
  'MODELO 9': [
    { flag: 'FLAG_DESTINATARIO', ordem: '1', obrigatorio: '1' }, // Destinatário
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo
    { flag: 'FLAG_ANEXO_DOC', ordem: '3', obrigatorio: '1' },    // Cópia da acusação
  ],

  // MODELO 10 - Notificação da Acusação por Publicação de Aviso
  'MODELO 10': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Visado
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo/Aviso
  ],

  // MODELO 11 - Comunicação da Acusação ao Mandatário
  'MODELO 11': [
    { flag: 'FLAG_DESTINATARIO', ordem: '1', obrigatorio: '1' }, // Mandatário
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo
    { flag: 'FLAG_ANEXO_DOC', ordem: '3', obrigatorio: '0' },    // Anexos
  ],

  // MODELO 12 - Auto de Diligências
  'MODELO 12': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '1' },          // Descrição da diligência
    { flag: 'FLAG_ANEXO_DOC', ordem: '2', obrigatorio: '0' },    // Documentos/provas
  ],

  // MODELO 13 - Auto de Apreensão
  'MODELO 13': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Pessoa envolvida
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Descrição dos bens
    { flag: 'FLAG_ANEXO_DOC', ordem: '3', obrigatorio: '0' },    // Fotos/documentos
  ],

  // MODELO 14 - Cota
  'MODELO 14': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '1' },          // Texto da cota
  ],

  // MODELO 15 - Apensação de Processo
  'MODELO 15': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '1' },          // Corpo
  ],

  // MODELO 16 - Convocatória de Participante ou Testemunha
  'MODELO 16': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Testemunha/Participante
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo da convocatória
  ],

  // MODELO 17 - Convocatória do Arguido
  'MODELO 17': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Arguido
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo da convocatória
  ],

  // MODELO 18 - Auto de Declarações
  'MODELO 18': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Declarante
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Declarações
    { flag: 'FLAG_ANEXO_DOC', ordem: '3', obrigatorio: '0' },    // Documentos
  ],

  // MODELO 19 - Auto de Inquirição de Testemunha
  'MODELO 19': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Testemunha
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Depoimento
  ],

  // MODELO 20 - Auto de Acareação
  'MODELO 20': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Pessoas acareadas
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Conteúdo da acareação
  ],

  // MODELO 21 - Auto de Exame
  'MODELO 21': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '1' },          // Descrição do exame
    { flag: 'FLAG_ANEXO_DOC', ordem: '2', obrigatorio: '0' },    // Documentos/relatórios
  ],

  // MODELO 22 - Compromisso de Honra
  'MODELO 22': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Pessoa
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Texto do compromisso
  ],

  // MODELO 23 - Juntada
  'MODELO 23': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '0' },          // Descrição
    { flag: 'FLAG_ANEXO_DOC', ordem: '2', obrigatorio: '1' },    // Documentos a juntar
  ],

  // MODELO 24 - Consulta do Processo
  'MODELO 24': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Requerente
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo
  ],

  // MODELO 25 - Despacho de Conclusão da Instrução
  'MODELO 25': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '1' },          // Corpo do despacho
    { flag: 'FLAG_DESTINATARIO', ordem: '2', obrigatorio: '1' }, // Entidade decisora
  ],

  // MODELO 26 - Relatório no Termo da Instrução
  'MODELO 26': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '1' },          // Corpo do relatório
    { flag: 'FLAG_ANEXO_DOC', ordem: '2', obrigatorio: '0' },    // Anexos
  ],

  // MODELO 27 - Convocatória de Testemunha de Defesa
  'MODELO 27': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Testemunha
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo
  ],

  // MODELO 28 - Pedido de Convocatória de Testemunhas
  'MODELO 28': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Requerente/Visado
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo do pedido
  ],

  // MODELO 29 - Notificação da Data da Convocatória de Testemunhas
  'MODELO 29': [
    { flag: 'FLAG_DESTINATARIO', ordem: '1', obrigatorio: '1' }, // Destinatário
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo
  ],

  // MODELO 30 - Não Comparência de Testemunha
  'MODELO 30': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Testemunha
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo
  ],

  // MODELO 31 - Relatório Final
  'MODELO 31': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },            // Visado
    { flag: 'FLAG_INFRACAO_COIMA', ordem: '2', obrigatorio: '1' },    // Infrações e sanções
    { flag: 'FLAG_OBS', ordem: '3', obrigatorio: '1' },               // Corpo do relatório
    { flag: 'FLAG_DECISAO', ordem: '4', obrigatorio: '1' },           // Proposta de decisão
    { flag: 'FLAG_ANEXO_DOC', ordem: '5', obrigatorio: '0' },         // Anexos
  ],

  // MODELO 32 - Conclusão do Processo
  'MODELO 32': [
    { flag: 'FLAG_DESTINATARIO', ordem: '1', obrigatorio: '1' }, // Entidade decisora
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo
    { flag: 'FLAG_DECISAO', ordem: '3', obrigatorio: '1' },      // Decisão
  ],

  // MODELO 33 - Notificação Postal da Decisão
  'MODELO 33': [
    { flag: 'FLAG_DESTINATARIO', ordem: '1', obrigatorio: '1' }, // Destinatário
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo
    { flag: 'FLAG_DECISAO', ordem: '3', obrigatorio: '1' },      // Decisão
    { flag: 'FLAG_ANEXO_DOC', ordem: '4', obrigatorio: '0' },    // Cópia da decisão
  ],

  // MODELO 34 - Notificação Pessoal da Decisão
  'MODELO 34': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Notificado
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo
    { flag: 'FLAG_DECISAO', ordem: '3', obrigatorio: '1' },      // Decisão
  ],

  // MODELO 35 - Notificação da Decisão por Publicação de Aviso
  'MODELO 35': [
    { flag: 'FLAG_PESSOA', ordem: '1', obrigatorio: '1' },       // Visado
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo/Aviso
    { flag: 'FLAG_DECISAO', ordem: '3', obrigatorio: '1' },      // Decisão
  ],

  // MODELO 36 - Anúncio de Sindicância
  'MODELO 36': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '1' },          // Corpo do anúncio
  ],

  // MODELO 37 - Pedido de Anúncio de Sindicância
  'MODELO 37': [
    { flag: 'FLAG_DESTINATARIO', ordem: '1', obrigatorio: '1' }, // Destinatário
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo do pedido
  ],

  // MODELO 38 - Edital de Sindicância
  'MODELO 38': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '1' },          // Corpo do edital
  ],

  // MODELO 39 - Pedido de Afixação de Edital de Sindicância
  'MODELO 39': [
    { flag: 'FLAG_DESTINATARIO', ordem: '1', obrigatorio: '1' }, // Destinatário
    { flag: 'FLAG_OBS', ordem: '2', obrigatorio: '1' },          // Corpo
  ],

  // MODELO 40 - Certidão de Afixação de Edital de Sindicância
  'MODELO 40': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '1' },          // Corpo da certidão
  ],

  // MODELO 41 - Relatório Final de Sindicância ou Inquérito
  'MODELO 41': [
    { flag: 'FLAG_OBS', ordem: '1', obrigatorio: '1' },               // Corpo do relatório
    { flag: 'FLAG_DECISAO', ordem: '2', obrigatorio: '1' },           // Proposta de decisão
    { flag: 'FLAG_ANEXO_DOC', ordem: '3', obrigatorio: '0' },         // Anexos
  ],
}

// ==================== HTTP CLIENT ====================

function apiRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_URL)
    const isHttps = url.protocol === 'https:'
    const client = isHttps ? https : http

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    }

    if (AUTH_TOKEN) {
      options.headers['Authorization'] = `Bearer ${AUTH_TOKEN}`
    }

    const req = client.request(options, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed)
          } else {
            reject({ status: res.statusCode, body: parsed })
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data)
          } else {
            reject({ status: res.statusCode, body: data })
          }
        }
      })
    })

    req.on('error', reject)

    if (body) {
      req.write(JSON.stringify(body))
    }

    req.end()
  })
}

// ==================== FUNÇÕES AUXILIARES ====================

function findCampoByFlag(campos, flagName) {
  return campos.find(c => c[flagName] === '1')
}

function buildCamposPayload(templateNumero, camposDB) {
  const mapping = CAMPOS_MAP[templateNumero]
  if (!mapping) {
    console.warn(`  [WARN] Sem mapeamento de campos para: ${templateNumero}`)
    // Default: apenas OBS
    const obsCampo = findCampoByFlag(camposDB, 'FLAG_OBS')
    if (obsCampo) {
      return [{
        PR_CAMPOS_ID: obsCampo.ID,
        FLAG_OBRIGATORIEDADE: '1',
        ESTADO: '1',
        ORDEM: '1'
      }]
    }
    return []
  }

  const result = []
  for (const m of mapping) {
    const campo = findCampoByFlag(camposDB, m.flag)
    if (campo) {
      result.push({
        PR_CAMPOS_ID: campo.ID,
        FLAG_OBRIGATORIEDADE: m.obrigatorio,
        ESTADO: '1',
        ORDEM: m.ordem
      })
    } else {
      console.warn(`  [WARN] Campo com flag ${m.flag} não encontrado na BD`)
    }
  }

  return result
}

// ==================== MAIN ====================

async function main() {
  console.log('==============================================')
  console.log('  SEED: Peças Processuais (41 Templates)')
  console.log('==============================================')
  console.log(`  API: ${API_URL}`)
  console.log(`  Auth: ${AUTH_TOKEN ? 'Sim' : 'Não (anónimo)'}`)
  console.log(`  Dry Run: ${DRY_RUN ? 'Sim' : 'Não'}`)
  console.log(`  Skip Existing: ${SKIP_EXISTING ? 'Sim' : 'Não'}`)
  console.log('')

  // 1. Ler templates do JSON
  const templatesPath = path.join(__dirname, 'pecas_templates.json')
  if (!fs.existsSync(templatesPath)) {
    console.error('[ERRO] Ficheiro pecas_templates.json não encontrado!')
    console.error('       Execute primeiro o script de extração do DOCX.')
    process.exit(1)
  }

  const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'))
  console.log(`[INFO] ${templates.length} templates carregados do JSON`)

  // 2. Buscar campos disponíveis
  console.log('[INFO] A buscar campos disponíveis (sigjprcampo)...')
  let camposDB
  try {
    camposDB = await apiRequest('GET', '/sigjprcampo')
    if (Array.isArray(camposDB)) {
      console.log(`[INFO] ${camposDB.length} campos encontrados:`)
      camposDB.forEach(c => {
        const flags = []
        if (c.FLAG_PESSOA === '1') flags.push('PESSOA')
        if (c.FLAG_DECISAO === '1') flags.push('DECISAO')
        if (c.FLAG_ANEXO_DOC === '1') flags.push('ANEXO_DOC')
        if (c.FLAG_OBS === '1') flags.push('OBS')
        if (c.FLAG_DESTINATARIO === '1') flags.push('DESTINATARIO')
        if (c.FLAG_INFRACAO_COIMA === '1') flags.push('INFRACAO_COIMA')
        if (c.FLAG_PERIODO_EXCLUSAO === '1') flags.push('PERIODO_EXCLUSAO')
        if (c.FLAG_TEXTO === '1') flags.push('TEXTO')
        console.log(`       - ${c.DESIG || c.ID} [${flags.join(', ')}]`)
      })
    }
  } catch (err) {
    console.error('[ERRO] Falha ao buscar campos:', err)
    console.log('[INFO] A continuar sem campos (peças serão criadas apenas com OBS template)...')
    camposDB = []
  }

  // 3. Buscar peças existentes (para evitar duplicados)
  let existingPecas = []
  if (SKIP_EXISTING) {
    console.log('[INFO] A verificar peças existentes...')
    try {
      existingPecas = await apiRequest('GET', '/sgigjprpecasprocessual')
      if (Array.isArray(existingPecas)) {
        console.log(`[INFO] ${existingPecas.length} peças já existem no sistema`)
      }
    } catch (err) {
      console.warn('[WARN] Falha ao buscar peças existentes:', err.status || err)
      existingPecas = []
    }
  }

  // 4. Criar peças processuais
  console.log('')
  console.log('--- A criar peças processuais ---')
  console.log('')

  let created = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < templates.length; i++) {
    const tpl = templates[i]
    const displayName = `${tpl.numero} - ${tpl.designacao}`

    // Verificar se já existe
    if (SKIP_EXISTING && existingPecas.length > 0) {
      const exists = existingPecas.find(p =>
        p.DESIG && p.DESIG.toUpperCase().includes(tpl.designacao.toUpperCase().substring(0, 20))
      )
      if (exists) {
        console.log(`[SKIP] ${displayName} (já existe: ${exists.DESIG})`)
        skipped++
        continue
      }
    }

    // Construir payload
    const campos = buildCamposPayload(tpl.numero, camposDB)

    const payload = {
      PECA: {
        DESIG: tpl.designacao,
        OBS: tpl.conteudo_html,
        ESTADO: '1'
      },
      CAMPOS: campos
    }

    if (DRY_RUN) {
      console.log(`[DRY] ${displayName}`)
      console.log(`       Campos: ${campos.length} (${campos.map(c => {
        const campo = camposDB.find(db => db.ID === c.PR_CAMPOS_ID)
        return campo ? campo.DESIG : c.PR_CAMPOS_ID
      }).join(', ')})`)
      created++
      continue
    }

    // Criar via API
    try {
      const result = await apiRequest('POST', '/sgigjprpecasprocessual', payload)
      console.log(`[OK]   ${displayName}`)
      if (result && result.peca) {
        console.log(`       ID: ${result.peca.ID}, CODIGO: ${result.peca.CODIGO}`)
      }
      created++
    } catch (err) {
      console.error(`[ERRO] ${displayName}`)
      console.error(`       Status: ${err.status}, Msg: ${JSON.stringify(err.body)}`)
      failed++
    }

    // Pequeno delay para não sobrecarregar a API
    await new Promise(r => setTimeout(r, 200))
  }

  // 5. Resumo
  console.log('')
  console.log('==============================================')
  console.log('  RESUMO')
  console.log('==============================================')
  console.log(`  Total templates: ${templates.length}`)
  console.log(`  Criados: ${created}`)
  console.log(`  Ignorados (já existiam): ${skipped}`)
  console.log(`  Falharam: ${failed}`)
  console.log('')

  if (DRY_RUN) {
    console.log('  [DRY RUN] Nenhuma peça foi realmente criada.')
    console.log('  Execute sem --dry-run para criar as peças.')
  }

  if (failed > 0) {
    process.exit(1)
  }
}

main().catch(err => {
  console.error('[FATAL]', err)
  process.exit(1)
})
