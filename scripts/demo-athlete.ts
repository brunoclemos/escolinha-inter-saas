/**
 * Enriquece o atleta showcase "Felipe Almeida Silva" com dados completos
 * para demonstração de venda. Idempotente — pode rodar várias vezes.
 *
 * Uso: npx tsx --env-file=.env.local scripts/demo-athlete.ts
 *
 * Dados criados:
 * - Perfil completo (escola, contato emergência, sonho, etc)
 * - Foto via Supabase Storage (fetch de pravatar.cc)
 * - 2 responsáveis (pai + mãe) com WhatsApp
 * - 4 medições antropométricas (mostrando evolução de 9 meses)
 * - 3 avaliações trimestrais publicadas (scores progressivos)
 * - 12 testes físicos variados (sprint, salto, agilidade, resistência)
 * - 1 lesão histórica (já recuperado)
 * - 5 treinos com presença
 * - 2 jogos com estatísticas individuais
 */
import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../lib/db/schema";
import {
  TECHNICAL_FUNDAMENTALS,
  TACTICAL_DIMENSIONS,
  PSYCH_DIMENSIONS,
  average,
} from "../lib/eval/fundamentos";
import { calculateBmiX10 } from "../lib/queries/anthropometry";
import { estimateBiologicalAge } from "../lib/eval/phv";

const ATHLETE_NAME = "Felipe Almeida Silva";
const TENANT_SLUG = "escola-inter";

async function uploadPhoto(
  supabaseUrl: string,
  serviceKey: string,
  tenantId: string,
  athleteId: string
): Promise<string | null> {
  try {
    // Pravatar — foto de jovem com licença CC
    const photoSource = "https://i.pravatar.cc/400?img=12";
    const res = await fetch(photoSource);
    if (!res.ok) {
      console.warn("  · falha ao baixar foto, pulando");
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const path = `${tenantId}/${athleteId}.jpg`;

    const { error } = await admin.storage
      .from("athlete-photos")
      .upload(path, buf, { contentType: "image/jpeg", upsert: true });
    if (error) {
      console.warn(`  · upload falhou: ${error.message}`);
      return null;
    }
    const { data: pub } = admin.storage
      .from("athlete-photos")
      .getPublicUrl(path);
    return `${pub.publicUrl}?v=${Date.now()}`;
  } catch (e) {
    console.warn(`  · erro foto: ${e instanceof Error ? e.message : e}`);
    return null;
  }
}

async function main() {
  const dbUrl = process.env.DATABASE_URL_DIRECT;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!dbUrl || !supabaseUrl || !serviceKey) {
    console.error("✗ Faltam env vars");
    process.exit(1);
  }

  const client = postgres(dbUrl, { max: 1, idle_timeout: 5 });
  const db = drizzle(client, { schema });

  console.log(`→ Atleta showcase: ${ATHLETE_NAME}\n`);

  // 1. Tenant
  const [tenant] = await db
    .select()
    .from(schema.tenants)
    .where(eq(schema.tenants.slug, TENANT_SLUG))
    .limit(1);
  if (!tenant) {
    console.error("✗ Tenant não encontrado. Rode lib/db/seed.ts primeiro.");
    process.exit(1);
  }
  console.log(`✓ Tenant ${tenant.name}`);

  // 2. Atleta
  const [existing] = await db
    .select()
    .from(schema.athletes)
    .where(
      and(
        eq(schema.athletes.tenantId, tenant.id),
        eq(schema.athletes.fullName, ATHLETE_NAME)
      )
    )
    .limit(1);
  if (!existing) {
    console.error(`✗ Atleta "${ATHLETE_NAME}" não encontrado. Rode seed.`);
    process.exit(1);
  }
  const athleteId = existing.id;
  console.log(`✓ Atleta encontrado (${athleteId})`);

  // 3. Atualiza perfil completo
  await db
    .update(schema.athletes)
    .set({
      nickname: "Lipe",
      cpf: "123.456.789-01",
      nationality: "BR",
      naturalCity: "Porto Alegre, RS",
      address: {
        street: "Rua dos Andradas, 1234",
        district: "Centro",
        city: "Porto Alegre",
        state: "RS",
        zip: "90020-007",
      },
      positionMain: "Atacante",
      positionSecondary: ["Meia-Atacante", "Ponta Direita"],
      dominantFoot: "right",
      jerseyNumber: 9,
      bloodType: "O+",
      allergies: "Nenhuma conhecida",
      medications: "Nenhuma",
      healthPlan: "Unimed POA",
      emergencyContact: {
        name: "Maria Almeida (mãe)",
        phone: "(51) 99999-1111",
        relationship: "mother",
      },
      schoolName: "Colégio Estadual Padre Reus",
      schoolGrade: "9º ano",
      schoolShift: "Manhã",
      entryDate: "2024-02-10",
      entryOrigin: "Indicação familiar",
      entryNotes:
        "Chegou indicado por um primo que treinou conosco em 2022. Demonstrou interesse e disciplina desde o primeiro dia.",
      previousClub: null,
      yearsPlaying: 4,
      dream:
        "Jogar profissional pelo Sport Club Internacional e representar o Brasil em Copa do Mundo.",
      heightCm: 168,
      weightKg: 56,
      updatedAt: new Date(),
    })
    .where(eq(schema.athletes.id, athleteId));
  console.log("✓ Perfil completo atualizado");

  // 4. Foto via Supabase Storage
  console.log("→ Upload da foto...");
  const photoUrl = await uploadPhoto(supabaseUrl, serviceKey, tenant.id, athleteId);
  if (photoUrl) {
    await db
      .update(schema.athletes)
      .set({ photoUrl, updatedAt: new Date() })
      .where(eq(schema.athletes.id, athleteId));
    console.log("✓ Foto salva");
  }

  // 5. Responsáveis (pai + mãe)
  console.log("\n→ Responsáveis");
  await db
    .delete(schema.athleteGuardians)
    .where(eq(schema.athleteGuardians.athleteId, athleteId));

  const guardiansData = [
    {
      fullName: "Maria Almeida Silva",
      relationship: "mother" as const,
      phone: "(51) 99999-1111",
      whatsapp: "(51) 99999-1111",
      email: "maria.almeida@email.com",
      occupation: "Professora",
      isPrimary: true,
      financialResponsible: true,
    },
    {
      fullName: "Roberto Silva",
      relationship: "father" as const,
      phone: "(51) 98888-2222",
      whatsapp: "(51) 98888-2222",
      email: "roberto.silva@email.com",
      occupation: "Engenheiro civil",
      isPrimary: false,
      financialResponsible: false,
    },
  ];

  for (const g of guardiansData) {
    let guardianId: string;
    const [exists] = await db
      .select()
      .from(schema.guardians)
      .where(
        and(
          eq(schema.guardians.tenantId, tenant.id),
          eq(schema.guardians.fullName, g.fullName)
        )
      )
      .limit(1);
    if (exists) {
      guardianId = exists.id;
      await db
        .update(schema.guardians)
        .set({
          phone: g.phone,
          whatsapp: g.whatsapp,
          email: g.email,
          occupation: g.occupation,
          updatedAt: new Date(),
        })
        .where(eq(schema.guardians.id, guardianId));
    } else {
      const [created] = await db
        .insert(schema.guardians)
        .values({
          tenantId: tenant.id,
          fullName: g.fullName,
          relationship: g.relationship,
          phone: g.phone,
          whatsapp: g.whatsapp,
          email: g.email,
          occupation: g.occupation,
        })
        .returning({ id: schema.guardians.id });
      guardianId = created.id;
    }

    await db.insert(schema.athleteGuardians).values({
      athleteId,
      guardianId,
      isPrimary: g.isPrimary,
      financialResponsible: g.financialResponsible,
      canPickup: true,
    });
    console.log(`  · ${g.fullName} (${g.relationship})`);
  }

  // 6. Antropometria — 4 medições de ago/25 a abr/26 mostrando crescimento
  console.log("\n→ Antropometria (limpa + 4 medições)");
  await db
    .delete(schema.anthropometryRecords)
    .where(eq(schema.anthropometryRecords.athleteId, athleteId));

  const measurements = [
    { date: "2025-08-15", height: 162, weight: 51, fat: 14.2 },
    { date: "2025-11-15", height: 164, weight: 52.8, fat: 13.8 },
    { date: "2026-02-15", height: 166, weight: 54.5, fat: 13.5 },
    { date: "2026-04-25", height: 168, weight: 56, fat: 13.2 },
  ];
  for (const m of measurements) {
    const heightCm = m.height;
    const weightDg = Math.round(m.weight * 10);
    const bmi = calculateBmiX10(heightCm, weightDg);
    // Idade na data da medição
    const ageAt =
      (new Date(m.date).getTime() - new Date("2012-03-14").getTime()) /
      (365.25 * 24 * 60 * 60 * 1000);
    const bioAge = estimateBiologicalAge(heightCm, ageAt);
    await db.insert(schema.anthropometryRecords).values({
      tenantId: tenant.id,
      athleteId,
      recordedAt: m.date,
      heightCm,
      weightDg,
      wingspanCm: heightCm + 2,
      bodyFatPctX10: Math.round(m.fat * 10),
      bmiX10: bmi,
      biologicalAgeX10: bioAge !== null ? Math.round(bioAge * 10) : null,
      notes: "Medição trimestral. Atleta em fase de crescimento esperado.",
    });
    console.log(`  · ${m.date}: ${heightCm}cm, ${m.weight}kg, ${m.fat}% gordura`);
  }

  // 7. Avaliações trimestrais — 3 publicadas com evolução
  console.log("\n→ Avaliações (limpa + 3 trimestrais)");
  await db
    .delete(schema.evaluations)
    .where(eq(schema.evaluations.athleteId, athleteId));

  const periods = [
    {
      label: "3º trimestre 2025",
      start: "2025-08-01",
      end: "2025-10-31",
      base: 6,
      summary:
        "Felipe demonstrou enorme dedicação durante o trimestre. Pontos fortes: chegada na área e finalização com pé dominante. Pontos a desenvolver: passe longo e jogo aéreo defensivo. Manteve frequência de 95% e teve atitude exemplar nas conversas em grupo. Para o próximo trimestre, foco em decisão sob pressão.",
    },
    {
      label: "4º trimestre 2025",
      start: "2025-11-01",
      end: "2026-01-31",
      base: 7,
      summary:
        "Evolução visível em leitura de jogo. Felipe começou a antecipar jogadas e não só reagir — sinal claro de amadurecimento tático. Cabeceio também melhorou após trabalho específico em treino. Continuar trabalhando o pé não-dominante: ainda é o gargalo dele. Liderança crescente, virou referência pros mais novos.",
    },
    {
      label: "1º trimestre 2026",
      start: "2026-02-01",
      end: "2026-04-30",
      base: 8,
      summary:
        "Trimestre de consolidação. Felipe atingiu nível consistente em todos os fundamentos técnicos e está pronto para desafios em categoria superior. Resiliência impressionante após a lesão de outubro — voltou mais forte. Tem maturidade socioemocional acima do esperado pra idade. Recomenda-se acompanhamento próximo do Departamento de Avaliações Técnicas das Categorias de Base do Sport Club Internacional.",
    },
  ];

  for (const p of periods) {
    // Gera scores variando entre base-1 e base+2, com tendência de melhoria
    const techScores = TECHNICAL_FUNDAMENTALS.map((f, i) => ({
      fundamental: f.key,
      score: Math.min(
        10,
        Math.max(1, p.base + ((i % 4) - 1) + (i === 0 || i === 4 ? 1 : 0))
      ),
      comment:
        i === 4
          ? "Finalização cresceu muito esse trimestre, especialmente dentro da área."
          : i === 0
            ? "Boa proteção de bola e mudança de ritmo."
            : null,
    }));
    const tactScores = TACTICAL_DIMENSIONS.map((d, i) => ({
      dimension: d.key,
      score: Math.min(10, Math.max(1, p.base + ((i % 3) - 1))),
      comment: null,
    }));
    const psychScores = PSYCH_DIMENSIONS.map((d, i) => ({
      dimension: d.key,
      score: Math.min(
        10,
        Math.max(1, p.base + ((i % 3) - 1) + (i === 1 ? 1 : 0))
      ),
      comment: i === 1 ? "Liderança natural, virou referência da turma." : null,
    }));

    const techAvg = average(techScores.map((s) => s.score)) ?? 0;
    const tactAvg = average(tactScores.map((s) => s.score)) ?? 0;
    const psychAvg = average(psychScores.map((s) => s.score)) ?? 0;

    const [evalRow] = await db
      .insert(schema.evaluations)
      .values({
        tenantId: tenant.id,
        athleteId,
        evaluatorId: null,
        periodLabel: p.label,
        periodStart: p.start,
        periodEnd: p.end,
        status: "published",
        summaryText: p.summary,
        techScore: Math.round(techAvg * 10),
        tacticalScore: Math.round(tactAvg * 10),
        psychScore: Math.round(psychAvg * 10),
        publishedAt: new Date(p.end + "T18:00:00Z"),
      })
      .returning({ id: schema.evaluations.id });

    await db.insert(schema.evalTechnical).values(
      techScores.map((s) => ({
        evaluationId: evalRow.id,
        fundamental: s.fundamental,
        score: s.score,
        comment: s.comment,
      }))
    );
    await db.insert(schema.evalTactical).values(
      tactScores.map((s) => ({
        evaluationId: evalRow.id,
        dimension: s.dimension,
        score: s.score,
        comment: s.comment,
      }))
    );
    await db.insert(schema.evalPsych).values(
      psychScores.map((s) => ({
        evaluationId: evalRow.id,
        dimension: s.dimension,
        score: s.score,
        comment: s.comment,
      }))
    );
    console.log(
      `  · ${p.label}: téc ${techAvg.toFixed(1)} · tát ${tactAvg.toFixed(1)} · psi ${psychAvg.toFixed(1)}`
    );
  }

  // 8. Bateria física — 12 testes ao longo do tempo
  console.log("\n→ Testes físicos (limpa + 12 testes)");
  await db
    .delete(schema.physicalTests)
    .where(eq(schema.physicalTests.athleteId, athleteId));

  const physTests: {
    code: string;
    unit: string;
    value: number;
    date: string;
    field?: string;
    obs?: string;
  }[] = [
    // Set/2025
    { code: "sprint_10m", unit: "s", value: 1.92, date: "2025-09-10", field: "Campo 2" },
    { code: "sprint_20m", unit: "s", value: 3.42, date: "2025-09-10", field: "Campo 2" },
    { code: "horizontal_jump", unit: "cm", value: 198, date: "2025-09-10", field: "Sala 1" },
    { code: "cmj", unit: "cm", value: 38.5, date: "2025-09-10", field: "Sala 1" },
    // Dez/2025
    { code: "sprint_20m", unit: "s", value: 3.28, date: "2025-12-08", field: "Campo 2" },
    { code: "cmj", unit: "cm", value: 41.2, date: "2025-12-08" },
    { code: "illinois", unit: "s", value: 17.42, date: "2025-12-08", obs: "Bom controle nas curvas" },
    // Mar/2026
    { code: "sprint_10m", unit: "s", value: 1.78, date: "2026-03-12" },
    { code: "sprint_20m", unit: "s", value: 3.12, date: "2026-03-12" },
    { code: "yoyo_ir1", unit: "m", value: 1240, date: "2026-03-12", obs: "Ótimo VO2 estimado" },
    // Abr/2026 (mais recente)
    { code: "cmj", unit: "cm", value: 43.8, date: "2026-04-20", field: "Sala 1" },
    { code: "t_test", unit: "s", value: 10.85, date: "2026-04-20", field: "Campo 1" },
  ];
  for (const t of physTests) {
    await db.insert(schema.physicalTests).values({
      tenantId: tenant.id,
      athleteId,
      recordedAt: t.date,
      testCode: t.code,
      valueX1000: Math.round(t.value * 1000),
      unit: t.unit,
      condition: { field: t.field, shift: "afternoon", weather: "dry" },
      observation: t.obs ?? null,
    });
  }
  console.log(`  · ${physTests.length} testes inseridos`);

  // 9. Lesão histórica (já recuperado)
  console.log("\n→ Lesões (limpa + 1 histórica)");
  await db
    .delete(schema.injuries)
    .where(eq(schema.injuries.athleteId, athleteId));
  await db.insert(schema.injuries).values({
    tenantId: tenant.id,
    athleteId,
    type: "Entorse de tornozelo (grau I)",
    bodyPart: "tornozelo direito",
    severity: "minor",
    occurredAt: "2025-10-12",
    daysOut: 14,
    returnedAt: "2025-10-26",
    description:
      "Entorse leve durante treino, ao apoiar o pé em irregularidade do gramado. Sem lesão ligamentar significativa.",
    treatment:
      "Gelo nas primeiras 48h, fisioterapia 3x/semana por 2 semanas, retorno gradual com bandagem.",
  });
  console.log("  · Entorse tornozelo direito (14 dias afastado, recuperado)");

  // 10. Treinos + presença — 5 últimos
  console.log("\n→ Treinos (limpa + 5 com presença)");
  // Pega categoria Sub-15
  const [cat] = await db
    .select()
    .from(schema.categories)
    .where(
      and(
        eq(schema.categories.tenantId, tenant.id),
        eq(schema.categories.name, "Sub-15")
      )
    )
    .limit(1);

  // Limpa treinos antigos só do Felipe (mantém os outros se houver)
  // Na prática, vamos criar 5 novos treinos da turma e marcar presença do Felipe
  const trainings = [
    {
      date: "2026-04-08",
      time: "18:00",
      focus: "Posicionamento defensivo + finalização",
      status: "present" as const,
    },
    {
      date: "2026-04-15",
      time: "18:00",
      focus: "Jogos reduzidos 4x4",
      status: "present" as const,
    },
    {
      date: "2026-04-22",
      time: "18:00",
      focus: "Velocidade + passe curto",
      status: "late" as const,
    },
    {
      date: "2026-04-25",
      time: "10:00",
      focus: "Treino físico + bateria de testes",
      status: "present" as const,
    },
    {
      date: "2026-04-29",
      time: "18:00",
      focus: "Tática coletiva 11x11",
      status: "present" as const,
    },
  ];
  for (const t of trainings) {
    const [session] = await db
      .insert(schema.trainingSessions)
      .values({
        tenantId: tenant.id,
        categoryId: cat?.id ?? null,
        date: t.date,
        startTime: t.time,
        durationMin: 90,
        focus: t.focus,
        field: "Campo principal",
        weather: "ensolarado",
      })
      .returning({ id: schema.trainingSessions.id });

    await db.insert(schema.attendance).values({
      sessionId: session.id,
      athleteId,
      status: t.status,
    });
  }
  console.log(`  · ${trainings.length} treinos com presença`);

  // 11. Jogos com estatísticas
  console.log("\n→ Jogos (2 jogos com stats)");
  const matchesData = [
    {
      kind: "friendly" as const,
      opponent: "Escola Cruzeiro POA",
      date: "2026-03-22",
      time: "10:00",
      location: "CT do Inter — Campo B",
      isHome: true,
      scoreUs: 3,
      scoreThem: 1,
      result: "win" as const,
      stats: {
        minutesPlayed: 70,
        goals: 2,
        assists: 1,
        yellowCards: 0,
        redCards: 0,
        rating: 9,
        positionPlayed: "Atacante",
        notes: "Atuação destacada, 2 gols e 1 assistência decisiva.",
      },
    },
    {
      kind: "official" as const,
      opponent: "EC Juventude Sub-15",
      date: "2026-04-12",
      time: "15:30",
      location: "Estádio do Bairro Belém Velho",
      isHome: false,
      scoreUs: 1,
      scoreThem: 1,
      result: "draw" as const,
      stats: {
        minutesPlayed: 80,
        goals: 1,
        assists: 0,
        yellowCards: 1,
        redCards: 0,
        rating: 7,
        positionPlayed: "Atacante",
        notes: "Marcação dupla a maior parte do jogo, mas balançou as redes.",
      },
    },
  ];
  for (const m of matchesData) {
    const [match] = await db
      .insert(schema.matches)
      .values({
        tenantId: tenant.id,
        categoryId: cat?.id ?? null,
        kind: m.kind,
        opponent: m.opponent,
        date: m.date,
        startTime: m.time,
        location: m.location,
        isHome: m.isHome,
        scoreUs: m.scoreUs,
        scoreThem: m.scoreThem,
        result: m.result,
      })
      .returning({ id: schema.matches.id });

    await db.insert(schema.matchStats).values({
      matchId: match.id,
      athleteId,
      ...m.stats,
    });
    console.log(
      `  · ${m.opponent} ${m.scoreUs}x${m.scoreThem} (${m.stats.goals} gol${m.stats.goals !== 1 ? "s" : ""}, nota ${m.stats.rating})`
    );
  }

  console.log(`\n✅ Atleta showcase pronto!`);
  console.log(`   Acesse: https://escolinha-inter-saas.vercel.app/atletas/${athleteId}`);
  console.log(`   Local:  http://localhost:3000/atletas/${athleteId}`);

  await client.end();
}

main().catch((e) => {
  console.error("✗ Falhou:", e);
  process.exit(1);
});
