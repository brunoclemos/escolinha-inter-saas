/* ============================================================
   System pages — Turmas, Treinos, Avaliações, Vídeos,
   Relatórios gerenciais, LGPD, Usuários, Auditoria
   ============================================================ */

/* ---------------------- TURMAS ------------------------------ */
function PageTeams({ go }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Turmas</h1>
          <p className="page-sub">{TEAMS.length} turmas ativas · 6 professores · distribuição semanal balanceada.</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn"><Icon.cal/>Grade semanal</button>
          <button className="btn primary"><Icon.plus/>Nova turma</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="segmented">
          {['Todas','Sub-7','Sub-9','Sub-10','Sub-12','Sub-14','Sub-16'].map((c,i)=>(
            <button key={c} className={'seg'+(i===0?' active':'')}>{c}</button>
          ))}
        </div>
        <span className="sep"/>
        <div className="segmented">
          <button className="seg active">Todos profs.</button>
          <button className="seg">Rafa</button><button className="seg">Léo</button><button className="seg">Camila</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14}}>
        {TEAMS.map((t,idx) => {
          const name = t.name || t.cat;
          const count = t.count ?? t.n ?? 0;
          const freq  = t.freq ?? [86,82,79,91,84,88,90,85,87,89,83][idx%11];
          const occ   = t.occ  ?? Math.min(100, Math.round(count/24*100));
          const evals = t.evals?? [92,88,76,94,86,90,82,88,91,84,79][idx%11];
          return (
          <div key={t.id} className="card" style={{cursor:'pointer'}}>
            <div className="card-head">
              <div>
                <div className="card-title">{name}</div>
                <div className="card-sub">{t.days} · {t.time} · {t.field}</div>
              </div>
              <span className="badge brand">{count} atletas</span>
            </div>
            <div className="card-body">
              <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:12}}>
                <div className="avatar sm">{t.coach.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
                <div style={{fontSize:12.5}}>
                  <div style={{fontWeight:500}}>Prof. {t.coach.split(' ')[0]}</div>
                  <div style={{fontSize:11, color:'var(--fg-muted)'}}>responsável</div>
                </div>
              </div>
              <div className="hbars">
                <div className="b"><span>Frequência 30d</span><i style={{'--w': freq+'%'}} className={freq<80?'warn':''}/><span className="mono" style={{textAlign:'right'}}>{freq}%</span></div>
                <div className="b"><span>Ocupação</span><i style={{'--w': occ+'%'}} className="alt"/><span className="mono" style={{textAlign:'right'}}>{occ}%</span></div>
                <div className="b"><span>Avals em dia</span><i style={{'--w': evals+'%'}} className={evals>90?'ok':evals<70?'warn':''}/><span className="mono" style={{textAlign:'right'}}>{evals}%</span></div>
              </div>
              <div style={{display:'flex', gap:6, marginTop:14, paddingTop:12, borderTop:'1px solid var(--border)'}}>
                <button className="btn sm" style={{flex:1}}><Icon.users/>Atletas</button>
                <button className="btn sm" style={{flex:1}}><Icon.cal/>Calendário</button>
                <button className="btn sm"><Icon.chevron/></button>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------- TREINOS ----------------------------- */
function PageTrainings({ go }) {
  const [view, setView] = React.useState('week');
  const hours = ['08:00','10:00','16:00','17:30','18:30','20:00'];
  const days = ['SEG 14','TER 15','QUA 16','QUI 17','SEX 18','SÁB 19'];
  const events = {
    '0-2': ['Sub-7 tarde', 'alt'],     '0-3': ['Sub-10', 'brand'], '0-4': ['Sub-12', 'brand'],
    '1-3': ['Sub-14', 'brand'], '1-4': ['Sub-16', 'alt'],
    '2-2': ['Sub-9',  'alt'],     '2-3': ['Sub-10', 'brand'], '2-4': ['Sub-12', 'brand'],
    '3-3': ['Sub-14', 'brand'], '3-4': ['Sub-16', 'alt'],
    '4-3': ['Sub-12 · avaliação', 'done'], '4-4': ['Sub-16', 'alt'],
    '5-1': ['Peneira interna', 'sat'], '5-2': ['Sub-16 reposição', 'sat'],
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Treinos</h1>
          <p className="page-sub">Semana 16 · 14–19/abr · 22 sessões programadas · 2 avaliações.</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn">← semana anterior</button>
          <button className="btn">hoje</button>
          <button className="btn">semana seguinte →</button>
          <button className="btn primary"><Icon.plus/>Nova sessão</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="segmented">
          {['Semana','Mês','Dia'].map((v,i)=>(
            <button key={v} className={'seg'+(view==={0:'week',1:'month',2:'day'}[i]?' active':'')} onClick={()=>setView({0:'week',1:'month',2:'day'}[i])}>{v}</button>
          ))}
        </div>
        <span className="sep"/>
        <span style={{fontSize:11.5, color:'var(--fg-muted)'}}>Filtros</span>
        <button className="pill-filter on">todos os campos</button>
        <button className="pill-filter">Campo A</button>
        <button className="pill-filter">Campo B</button>
        <button className="pill-filter">society</button>
      </div>

      <div className="cal-grid">
        <div></div>
        {days.map(d => <div key={d}>{d}</div>)}
        {hours.map((h,hi) => (
          <React.Fragment key={hi}>
            <div className="mono">{h}</div>
            {days.map((_,di) => {
              const e = events[di+'-'+hi];
              return (
                <div key={di} onClick={()=>e && go({name:'session'})}>
                  {e && <div className={'cal-event '+e[1]}>{e[0]}</div>}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 340px', gap:16, marginTop:18}}>
        <div className="card">
          <div className="card-head"><div className="card-title">Próxima sessão · hoje 18h30</div><span className="badge brand">Sub-11</span></div>
          <div className="card-body">
            <div className="info-grid" style={{marginBottom:14}}>
              <div className="item"><div className="label">Professor</div><div className="value">Rafaela Pinheiro</div></div>
              <div className="item"><div className="label">Local</div><div className="value">Campo B · society</div></div>
              <div className="item"><div className="label">Duração</div><div className="value">90 min</div></div>
              <div className="item"><div className="label">Foco</div><div className="value">Finalização + transição</div></div>
            </div>
            <div className="section-title" style={{margin:'6px 0 10px'}}>Plano · 4 blocos</div>
            {[
              ['00–15','Aquecimento + passe curto','12min'],
              ['15–45','Posse com alvos externos','30min'],
              ['45–75','Finalização 3v2+GR','30min'],
              ['75–90','Jogo treino 6v6','15min'],
            ].map((b,i)=>(
              <div key={i} style={{display:'flex', gap:12, padding:'8px 10px', borderLeft:'3px solid var(--brand)', background:'var(--brand-soft)', marginBottom:6, borderRadius:'0 4px 4px 0'}}>
                <span className="mono" style={{width:56, color:'var(--brand-fg)', fontSize:11.5}}>{b[0]}</span>
                <span style={{flex:1, fontSize:13}}>{b[1]}</span>
                <span className="mono" style={{fontSize:11.5, color:'var(--fg-muted)'}}>{b[2]}</span>
              </div>
            ))}
          </div>
        </div>
        <aside>
          <div className="card">
            <div className="card-head"><div className="card-title">Chamada</div><span className="mono" style={{fontSize:11, color:'var(--fg-muted)'}}>18 de 22</span></div>
            <div className="card-body" style={{padding:0}}>
              {ATHLETES.slice(0,6).map((a,i) => (
                <div key={a.id} style={{display:'flex', alignItems:'center', gap:10, padding:'8px 14px', borderBottom: i<5?'1px solid var(--border)':'0'}}>
                  <Avatar a={a} size="sm"/>
                  <span style={{flex:1, fontSize:12.5}}>{a.name}</span>
                  <div className="segmented" style={{fontSize:10}}>
                    <button className={'seg'+(i!==2?' active':'')}>P</button>
                    <button className={'seg'+(i===2?' active':'')}>F</button>
                  </div>
                </div>
              ))}
              <div style={{padding:10, textAlign:'center', fontSize:11, color:'var(--fg-muted)'}}>+ 16 atletas</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------------- AVALIAÇÕES -------------------------- */
function PageAssessments({ go }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Avaliações</h1>
          <p className="page-sub">Banco de testes e baterias · ciclo atual fev–abr · 98 avaliações concluídas.</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn"><Icon.clip/>Catálogo de testes</button>
          <button className="btn primary"><Icon.plus/>Nova bateria</button>
        </div>
      </div>

      <div className="dash-grid" style={{gridTemplateColumns:'repeat(5,1fr)'}}>
        <div className="stat"><div className="stat-label">Concluídas (mês)</div><div className="stat-value">42</div><div className="stat-delta">+8 vs mar</div></div>
        <div className="stat"><div className="stat-label">Pendentes</div><div className="stat-value">12</div><div className="stat-delta down">3 vencidas</div></div>
        <div className="stat"><div className="stat-label">Cobertura Sub-12</div><div className="stat-value">94<span className="u">%</span></div></div>
        <div className="stat"><div className="stat-label">Baterias ativas</div><div className="stat-value">3</div></div>
        <div className="stat"><div className="stat-label">Recordes no mês</div><div className="stat-value">7</div><div className="stat-delta">Sub-12 lidera</div></div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:16}}>
        <div className="card">
          <div className="card-head"><div><div className="card-title">Baterias de testes</div><div className="card-sub">Agrupamentos padrão por categoria</div></div><button className="btn sm"><Icon.plus/>Nova</button></div>
          <div className="card-body" style={{padding:0}}>
            {[
              ['Bateria física · Sub-12',    '6 testes · sprint, CMJ, YoYo, Illinois, Sit&Reach, RAST', '32 atletas · última 10/fev', 'brand'],
              ['Antropometria trimestral',   '5 medidas · peso, estatura, %BF, dobras, env. braço',    '140 atletas · última 02/mar', 'brand'],
              ['Bateria técnica · todas',    '4 domínios · passe, condução, finalização, 1v1',         '98 atletas · última 18/mar',  'plain'],
              ['Psicossocial · Sub-11+',     '12 itens · questionário curto 5 min',                    '42 atletas · última 12/mar',  'plain'],
            ].map((r,i)=>(
              <div key={i} style={{padding:'14px 18px', borderBottom: i<3?'1px solid var(--border)':'0', cursor:'pointer'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:500, fontSize:13.5}}>{r[0]}</div>
                    <div style={{fontSize:12, color:'var(--fg-muted)', marginTop:2}}>{r[1]}</div>
                    <div className="mono" style={{fontSize:11, color:'var(--fg-subtle)', marginTop:4}}>{r[2]}</div>
                  </div>
                  <div style={{display:'flex', gap:6}}>
                    <span className={'badge '+r[3]}>{r[3]==='brand'?'ativa':'rascunho'}</span>
                    <button className="btn sm">Aplicar →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><div className="card-title">Catálogo de testes</div><span className="mono" style={{fontSize:11, color:'var(--fg-muted)'}}>{TEST_CATALOG.length} testes</span></div>
          <div className="card-body" style={{padding:0}}>
            <table className="tbl">
              <thead><tr><th>Teste</th><th>Domínio</th><th>Unid.</th><th>Uso</th></tr></thead>
              <tbody>
                {TEST_CATALOG.map((t,i)=>{
                  const dom = t.dom || t.cat || '—';
                  const uses = t.uses || t.ages || '';
                  return (
                  <tr key={i}>
                    <td style={{fontWeight:500}}>{t.name}</td>
                    <td><span className={'badge '+(dom==='Físico'?'brand':dom==='Técnico'?'plain':dom==='Antropo'?'ok':'warn')}>{dom}</span></td>
                    <td className="mono" style={{color:'var(--fg-muted)'}}>{t.unit}</td>
                    <td className="mono" style={{color:'var(--fg-muted)'}}>{uses}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="section-title">Próximas aplicações</div>
      <div className="card" style={{padding:0}}>
        <table className="tbl">
          <thead><tr><th>Data</th><th>Bateria</th><th>Turma</th><th>Aplicador</th><th>Cobertura</th><th>Status</th><th style={{width:80}}></th></tr></thead>
          <tbody>
            {[
              ['20/abr','Antropometria trimestral','Sub-10','Camila',  0,'planejada'],
              ['22/abr','Bateria física',          'Sub-12','Rafa',     0,'planejada'],
              ['24/abr','Bateria técnica',         'Sub-14','Léo',      0,'planejada'],
              ['29/abr','Bateria física',          'Sub-16','Rafa',     0,'planejada'],
              ['02/mai','Psicossocial',            'Sub-14','Camila',   0,'planejada'],
            ].map((r,i)=>(
              <tr key={i}>
                <td className="mono">{r[0]}</td>
                <td style={{fontWeight:500}}>{r[1]}</td>
                <td>{r[2]}</td>
                <td>Prof. {r[3]}</td>
                <td><div className="bar" style={{width:90}}><i style={{width:'0%'}}/></div></td>
                <td><span className="badge plain">planejada</span></td>
                <td><button className="btn sm">Aplicar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------- VÍDEOS ------------------------------ */
function PageVideos({ go }) {
  const clips = [
    { t:'Felipe · gol de cobertura',       d:'0:12', tags:['gol','sub-11','finalização'], who:'Felipe F.', ini:'FF', date:'18/mar', hl:true },
    { t:'Larissa · 1v1 pela direita',    d:'0:18', tags:['1v1','sub-14','drible'],      who:'Larissa A.', ini:'LA', date:'18/mar' },
    { t:'Sub-16 · transição ofensiva',   d:'0:24', tags:['tática','sub-16','coletivo'], who:'turma',   ini:'S16', date:'16/mar' },
    { t:'João · passe decisivo',         d:'0:08', tags:['passe','sub-10'],             who:'João R.', ini:'JR', date:'15/mar' },
    { t:'Pedro · recuperação',           d:'0:14', tags:['defesa','sub-11','pressão'],  who:'Pedro M.', ini:'PM', date:'14/mar' },
    { t:'Peneira interna · 08/mar',      d:'1:42', tags:['peneira','captação'],         who:'evento', ini:'PN', date:'08/mar' },
    { t:'Felipe · finta tripla',           d:'0:09', tags:['drible','sub-11'],            who:'Felipe F.', ini:'FF', date:'07/mar' },
    { t:'Sofia · defesa no canto',       d:'0:11', tags:['goleiro','sub-14','defesa'],  who:'Sofia L.', ini:'SL', date:'05/mar' },
    { t:'Sub-10 · jogo treino',          d:'2:10', tags:['jogo','sub-10'],              who:'turma',   ini:'S10', date:'04/mar' },
  ];
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Vídeos</h1>
          <p className="page-sub">142 clipes · tagueados por atleta, categoria e ação técnica · 8 inéditos.</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn"><Icon.filter/>Gerenciar tags</button>
          <button className="btn primary"><Icon.upload/>Subir vídeos</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="input" style={{width:260}}><Icon.search/><input placeholder="buscar por tag, atleta ou descrição…"/></div>
        <span className="sep"/>
        <span style={{fontSize:11.5, color:'var(--fg-muted)'}}>Categoria</span>
        <div className="segmented">
          {['Todas','Sub-10','Sub-12','Sub-14','Sub-16'].map((c,i)=><button key={c} className={'seg'+(i===0?' active':'')}>{c}</button>)}
        </div>
      </div>

      <div className="toolbar" style={{borderTop:'0', paddingTop:0}}>
        <span style={{fontSize:11.5, color:'var(--fg-muted)'}}>Tags populares</span>
        {['#gol','#1v1','#finalização','#passe','#drible','#defesa','#tática','#peneira','#destaque'].map((t,i)=>(
          <button key={t} className={'pill-filter'+(i===0?' on':'')}>{t}</button>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14}}>
        {clips.map((c,i)=>(
          <div key={i} className="video-card">
            <div className="video-thumb">
              <div className="play"/>
              <div className="dur">{c.d}</div>
              {c.hl && <div style={{position:'absolute', top:8, left:8, background:'var(--brand)', color:'#fff', fontSize:9.5, padding:'2px 7px', borderRadius:3, letterSpacing:'.06em', zIndex:2}}>DESTAQUE</div>}
            </div>
            <div style={{padding:'10px 12px 4px'}}>
              <div style={{fontSize:13, fontWeight:500}}>{c.t}</div>
              <div style={{fontSize:11, color:'var(--fg-subtle)', marginTop:4, display:'flex', gap:8, alignItems:'center'}} className="mono">
                <span>{c.date}</span>
                <span>·</span>
                <span>{c.who}</span>
              </div>
            </div>
            <div className="video-tags">
              {c.tags.map(t=><span key={t} className="t">#{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------- RELATÓRIOS GERENCIAIS --------------- */
function PageReports({ go }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Relatórios gerenciais</h1>
          <p className="page-sub">Visão operacional consolidada · ciclo fev–abr/2026.</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn"><Icon.cal/>Período: fev–abr</button>
          <button className="btn"><Icon.export/>Exportar CSV</button>
          <button className="btn primary"><Icon.doc/>Gerar PDF</button>
        </div>
      </div>

      <div className="dash-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        <div className="stat"><div className="stat-label">Atletas ativos</div><div className="stat-value">148</div><div className="stat-delta">+6 no trimestre</div></div>
        <div className="stat"><div className="stat-label">Retenção 90d</div><div className="stat-value">91<span className="u">%</span></div><div className="stat-delta">+1,8 p.p.</div></div>
        <div className="stat"><div className="stat-label">Frequência méd.</div><div className="stat-value">87<span className="u">%</span></div><div className="stat-delta">+2,3 p.p.</div></div>
        <div className="stat"><div className="stat-label">Avals em dia</div><div className="stat-value">82<span className="u">%</span></div><div className="stat-delta down">−3 vs. meta 85%</div></div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div className="card">
          <div className="card-head"><div className="card-title">Atletas por categoria</div></div>
          <div className="card-body">
            <div className="hbars">
              {[['Sub-7', 12,'alt'],['Sub-9',18,'alt'],['Sub-10',22,'brand'],['Sub-12',28,'brand'],['Sub-14',24,'brand'],['Sub-16',28,'ok'],['Sub-18',16,'warn']].map((r,i)=>(
                <div key={i} className="b">
                  <span>{r[0]}</span>
                  <i style={{'--w': (r[1]/30*100)+'%'}} className={r[2]}/>
                  <span className="mono" style={{textAlign:'right'}}>{r[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><div className="card-title">Frequência por turma · 30d</div></div>
          <div className="card-body">
            <div className="hbars">
              {TEAMS.slice(0,6).map((t,i)=>{
                const name = t.name || t.cat;
                const freq = t.freq ?? [86,82,79,91,84,88][i];
                return (
                <div key={i} className="b">
                  <span>{name}</span>
                  <i style={{'--w': freq+'%'}} className={freq>90?'ok':freq<80?'warn':''}/>
                  <span className="mono" style={{textAlign:'right'}}>{freq}%</span>
                </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><div className="card-title">Retenção por coorte</div><div className="card-sub">matrículas por semestre</div></div>
          <div className="card-body">
            <table className="tbl">
              <thead><tr><th>Coorte</th><th>0d</th><th>30d</th><th>90d</th><th>180d</th><th>365d</th></tr></thead>
              <tbody>
                {[
                  ['2024-S1', '100','96','92','87','81'],
                  ['2024-S2', '100','95','91','88','—'],
                  ['2025-S1', '100','97','94','—','—'],
                  ['2025-S2', '100','96','—','—','—'],
                  ['2026-S1', '100','—','—','—','—'],
                ].map((r,i)=>(
                  <tr key={i}>
                    <td className="mono" style={{fontWeight:500}}>{r[0]}</td>
                    {r.slice(1).map((c,j)=>(
                      <td key={j} className="mono" style={{textAlign:'center', color: c==='—'?'var(--fg-subtle)':'var(--fg)'}}>{c}{c!=='—'&&'%'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><div className="card-title">Lesões · incidência</div><div className="card-sub">últimos 6 meses · 8 ocorrências</div></div>
          <div className="card-body">
            <div className="hbars">
              {[['Entorse', 3],['Estiramento',2],['Contusão',2],['Outros',1]].map((r,i)=>(
                <div key={i} className="b">
                  <span>{r[0]}</span>
                  <i style={{'--w': (r[1]/3*100)+'%'}} className="warn"/>
                  <span className="mono" style={{textAlign:'right'}}>{r[1]}</span>
                </div>
              ))}
            </div>
            <div className="note" style={{marginTop:12}}>
              Taxa: 0,7 lesões a cada 1.000 horas de treino — abaixo da média para categorias de base.
            </div>
          </div>
        </div>

        <div className="card" style={{gridColumn:'1 / -1'}}>
          <div className="card-head"><div><div className="card-title">Destaques para clubes · próximos 90d</div><div className="card-sub">critério: PHV + evolução + frequência + scouting técnico</div></div><button className="btn sm">Ver todos (11) →</button></div>
          <div className="card-body" style={{padding:0}}>
            <table className="tbl">
              <thead><tr><th>Atleta</th><th>Cat.</th><th>Pos.</th><th>PHV</th><th>Sprint 20m</th><th>Freq.</th><th>Notas técnicas</th><th>Status dossiê</th></tr></thead>
              <tbody>
                {ATHLETES.filter(a=>a.highlight).slice(0,5).map(a=>(
                  <tr key={a.id} onClick={()=>go({name:'athlete', id:a.id})}>
                    <td><div style={{display:'flex', gap:8, alignItems:'center'}}><Avatar a={a} size="sm"/><span style={{fontWeight:500}}>{a.name}</span></div></td>
                    <td>{a.cat}</td>
                    <td>{a.pos}</td>
                    <td className="mono">{a.phv>=0?'+':''}{a.phv}a</td>
                    <td className="mono">{a.sprint20?a.sprint20+'s':'—'}</td>
                    <td className="mono">{a.freq}%</td>
                    <td style={{color:'var(--fg-muted)'}}>Téc 7,4 · Fís 7,1 · Tát 6,9</td>
                    <td><span className={'badge '+(a.id==='a1'?'ok':'plain')}>{a.id==='a1'?'pronto':'em preparação'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- LGPD -------------------------------- */
function PageLGPD({ go }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">LGPD · Consentimentos e termos</h1>
          <p className="page-sub">Controle centralizado · 148 atletas · 92% conformidade · 12 pendências ativas.</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn"><Icon.export/>Relatório DPO</button>
          <button className="btn primary"><Icon.send/>Enviar termos pendentes</button>
        </div>
      </div>

      <div className="dash-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        <div className="stat"><div className="stat-label">Uso de imagem</div><div className="stat-value">144<span className="u">/148</span></div><div className="stat-delta">97% consentido</div></div>
        <div className="stat"><div className="stat-label">Dados de saúde</div><div className="stat-value">148<span className="u">/148</span></div><div className="stat-delta">obrigatório · ok</div></div>
        <div className="stat"><div className="stat-label">Export. clubes</div><div className="stat-value">98<span className="u">/148</span></div><div className="stat-delta flat">opt-in</div></div>
        <div className="stat"><div className="stat-label">Redes sociais</div><div className="stat-value">112<span className="u">/148</span></div><div className="stat-delta down">12 a renovar</div></div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16}}>
        <div className="card">
          <div className="card-head"><div><div className="card-title">Pendências ativas</div><div className="card-sub">ordenadas por urgência</div></div><button className="btn sm"><Icon.send/>Lembrar todos</button></div>
          <div className="card-body" style={{padding:0}}>
            <table className="tbl">
              <thead><tr><th>Atleta</th><th>Item</th><th>Status</th><th>Última comunicação</th><th>Prazo</th><th></th></tr></thead>
              <tbody>
                {[
                  ['a1','Felipe De David Fonseca',          'Exportação p/ clubes',          'aguardando','há 2d','até 22/abr','warn'],
                  ['a2','Larissa Antunes',      'Renovação imagem 2026',         'enviado',   'há 5d','até 30/abr','warn'],
                  ['a3','Pedro Meira',          'Redes sociais (opt-in)',        'aguardando','há 1d','até 30/abr','warn'],
                  ['a4','Sofia Lemos',          'Renovação imagem 2026',         'não enviado','—',    'até 30/abr','err'],
                  ['a5','João Ramos',           'Exportação p/ clubes',          'recusado',  'há 7d','—','plain'],
                  ['a6','Mateus Fontes',        'Renovação imagem 2026',         'aguardando','há 3d','até 30/abr','warn'],
                ].map((r,i)=> {
                  const a = findAthlete(r[0]);
                  return (
                    <tr key={i}>
                      <td><div style={{display:'flex', gap:8, alignItems:'center'}}><Avatar a={a} size="sm"/><span style={{fontWeight:500}}>{r[1]}</span></div></td>
                      <td>{r[2]}</td>
                      <td><span className={'badge '+(r[3]==='não enviado'?'err':r[3]==='recusado'?'plain':'warn')}><span className="dot"/>{r[3]}</span></td>
                      <td className="mono" style={{color:'var(--fg-muted)'}}>{r[4]}</td>
                      <td><span className={'badge '+r[6]}>{r[5]}</span></td>
                      <td><button className="btn sm ghost"><Icon.send/></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <div className="card">
            <div className="card-head"><div className="card-title">Modelos de termo</div></div>
            <div className="card-body" style={{padding:0}}>
              {[
                ['Termo de uso de imagem · 2026','v2.1 · vigente','ok'],
                ['Ficha de saúde · 2026',        'v1.4 · vigente','ok'],
                ['Export. clubes parceiros',     'v1.2 · vigente','ok'],
                ['Redes sociais (menores)',      'v1.0 · rascunho','warn'],
              ].map((r,i)=>(
                <div key={i} style={{padding:'10px 14px', borderBottom:i<3?'1px solid var(--border)':'0', display:'flex', alignItems:'center', gap:10}}>
                  <Icon.doc style={{color:'var(--fg-muted)'}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12.5, fontWeight:500}}>{r[0]}</div>
                    <div style={{fontSize:10.5, color:'var(--fg-muted)'}} className="mono">{r[1]}</div>
                  </div>
                  <span className={'badge '+r[2]}><span className="dot"/>{r[2]==='ok'?'ok':'rev.'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">DPO · contato</div></div>
            <div className="card-body" style={{fontSize:12.5}}>
              <div style={{fontWeight:500}}>Juliana Porto · advogada</div>
              <div style={{fontSize:11.5, color:'var(--fg-muted)', marginTop:2}} className="mono">dpo@escoladointer.rs</div>
              <div className="note" style={{marginTop:10}}>Solicitações dos titulares são tratadas em até 15 dias úteis. Trilha completa disponível em Auditoria.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- USUÁRIOS ---------------------------- */
function PageUsers({ go }) {
  const roleFor = (s) => {
    const r = (s.role || '').toLowerCase();
    if (r.includes('coord'))   return ['Coordenador','brand'];
    if (r.includes('prof'))    return ['Professor',  'plain'];
    if (r.includes('fisio'))   return ['Fisio',      'ok'];
    if (r.includes('nutri'))   return ['Nutri',      'ok'];
    if (r.includes('admin'))   return ['Admin',      'warn'];
    if (r.includes('portal') || r.includes('respons')) return ['Pai/mãe','plain'];
    return [s.role || 'Outro','plain'];
  };
  const scopeFor = (s) => s.scope || (s.role && s.role.includes('·') ? s.role.split('·')[1].trim() : '—');
  const lastFor  = (s) => s.last || '—';
  const mfaFor   = (s) => (s.mfa !== undefined ? !!s.mfa : true);
  const iniFor   = (s) => s.ini || s.init || (s.name ? s.name.split(' ').map(w=>w[0]).slice(0,2).join('') : '??');
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Usuários</h1>
          <p className="page-sub">Equipe interna · acessos e perfis · {STAFF.length} ativos + portal dos pais.</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn"><Icon.shield/>Matriz de permissões</button>
          <button className="btn primary"><Icon.plus/>Novo usuário</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="input" style={{width:240}}><Icon.search/><input placeholder="buscar por nome ou e-mail…"/></div>
        <span className="sep"/>
        <div className="segmented">
          {['Todos','Coord','Professor','Fisio','Nutri','Admin','Pais'].map((r,i)=><button key={r} className={'seg'+(i===0?' active':'')}>{r}</button>)}
        </div>
      </div>

      <div className="card" style={{padding:0}}>
        <table className="tbl">
          <thead><tr><th>Usuário</th><th>Perfil</th><th>Turmas/alcance</th><th>Último acesso</th><th>MFA</th><th>Status</th><th style={{width:80}}></th></tr></thead>
          <tbody>
            {STAFF.map(s=>{
              const r = roleFor(s);
              return (
              <tr key={s.id}>
                <td>
                  <div style={{display:'flex', gap:10, alignItems:'center'}}>
                    <div className="avatar">{iniFor(s)}</div>
                    <div>
                      <div style={{fontWeight:500}}>{s.name}</div>
                      <div className="mono" style={{fontSize:10.5, color:'var(--fg-subtle)'}}>{s.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className={'badge '+r[1]}>{r[0]}</span></td>
                <td style={{fontSize:12, color:'var(--fg-muted)'}}>{scopeFor(s)}</td>
                <td className="mono" style={{color:'var(--fg-muted)'}}>{lastFor(s)}</td>
                <td><span className={'badge '+(mfaFor(s)?'ok':'warn')}><span className="dot"/>{mfaFor(s)?'ativo':'não'}</span></td>
                <td><span className="badge ok"><span className="dot"/>ativo</span></td>
                <td><div style={{display:'flex', gap:4}}><button className="btn ghost sm"><Icon.edit/></button><button className="btn ghost sm"><Icon.trash/></button></div></td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="section-title">Matriz resumida · o que cada perfil pode fazer</div>
      <div className="card" style={{padding:0}}>
        <table className="tbl">
          <thead><tr><th>Ação</th><th>Coord.</th><th>Prof.</th><th>Fisio</th><th>Nutri</th><th>Admin</th><th>Pais</th></tr></thead>
          <tbody>
            {[
              ['Ver atletas (todos)',        '✓','própria turma','✓','✓','✓','filho(a)'],
              ['Editar cadastro',            '✓','—','—','—','✓','—'],
              ['Lançar avaliação',           '✓','✓','área saúde','área nutri','—','—'],
              ['Ver ficha médica',           '✓','resumo','✓','resumo','✓','parcial'],
              ['Exportar dossiê p/ clubes',  '✓','—','—','—','—','—'],
              ['Gerenciar usuários',         '✓','—','—','—','✓','—'],
              ['Gerenciar LGPD',             '✓','—','—','—','✓','—'],
              ['Ver auditoria',              '✓','—','—','—','✓','—'],
            ].map((r,i)=>(
              <tr key={i}>
                <td style={{fontWeight:500}}>{r[0]}</td>
                {r.slice(1).map((c,j)=>(
                  <td key={j} style={{textAlign:'center', color: c==='✓'?'var(--ok)':c==='—'?'var(--fg-subtle)':'var(--fg-muted)', fontSize:c==='✓'?15:12}}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------- AUDITORIA --------------------------- */
function PageAudit({ go }) {
  const rows = [
    ['18/abr 14:32:08','Rafaela P.',   'editou avaliação técnica de Felipe De David Fonseca (nota 7,2 → 7,4)', 'write','confiável'],
    ['18/abr 13:10:44','Mariana L.',   'criou usuário: Camila Reis (perfil: nutri)',                'write','confiável'],
    ['18/abr 11:58:21','Carlos G.',    'exportou dossiê Felipe De David Fonseca (PDF + anexos)',                'export','confiável'],
    ['18/abr 09:02:15','Léo Ramos',    'lançou chamada Sub-14 ter 09/abr · 18 presentes',            'write','confiável'],
    ['17/abr 22:41:03','sistema',      'rotina noturna: 3 termos de imagem expiraram',               'write','automático'],
    ['17/abr 17:14:58','Pai do Felipe (resp.)','consentiu uso de imagem · Felipe De David Fonseca',               'write','portal pais'],
    ['17/abr 16:32:12','Carlos G.',    'visualizou ficha médica · 4 atletas',                        'read','confiável'],
    ['16/abr 20:05:47','Rafaela P.',   'subiu 6 vídeos · tags: Sub-12, 1v1, drible',                 'write','confiável'],
    ['16/abr 09:14:22','Mariana L.',   'revogou acesso de usuário: João Ex-prof (desligamento)',     'delete','confiável'],
    ['15/abr 18:47:30','Camila R.',    'lançou antropometria · 22 atletas Sub-10',                   'write','confiável'],
    ['15/abr 14:02:18','DPO (Juliana)','atualizou modelo de termo · Redes sociais (menores) v1.0',   'write','confiável'],
    ['14/abr 11:38:55','sistema',      'backup automático concluído (248 MB · cifrado AES-256)',     'write','automático'],
  ];
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Auditoria</h1>
          <p className="page-sub">Trilha imutável de ações sensíveis · retenção 5 anos · assinatura digital por linha.</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn"><Icon.cal/>Período: últimos 7d</button>
          <button className="btn"><Icon.export/>Exportar trilha</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="input" style={{width:280}}><Icon.search/><input placeholder="buscar por usuário, atleta, ação…"/></div>
        <span className="sep"/>
        <span style={{fontSize:11.5, color:'var(--fg-muted)'}}>Ação</span>
        <div className="segmented">
          {['Todas','Leitura','Escrita','Exportação','Exclusão','Automático'].map((r,i)=><button key={r} className={'seg'+(i===0?' active':'')}>{r}</button>)}
        </div>
      </div>

      <div className="dash-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        <div className="stat"><div className="stat-label">Eventos (7d)</div><div className="stat-value">1.284</div></div>
        <div className="stat"><div className="stat-label">Exportações</div><div className="stat-value">23</div><div className="stat-delta">+4 vs sem. ant.</div></div>
        <div className="stat"><div className="stat-label">Exclusões</div><div className="stat-value">2</div><div className="stat-delta flat">dentro do esperado</div></div>
        <div className="stat"><div className="stat-label">Logins suspeitos</div><div className="stat-value">0</div><div className="stat-delta">nenhum</div></div>
      </div>

      <div className="card" style={{padding:0, overflow:'hidden'}}>
        <div style={{display:'grid', gridTemplateColumns:'150px 90px 1fr 110px 100px', gap:14, padding:'10px 14px', background:'var(--bg-muted)', borderBottom:'1px solid var(--border)', fontSize:11, textTransform:'uppercase', letterSpacing:'.05em', color:'var(--fg-subtle)', fontWeight:500}}>
          <span>Quando</span><span>Ação</span><span>Quem · o quê</span><span>Origem</span><span></span>
        </div>
        {rows.map((r,i)=>(
          <div key={i} className="audit-row">
            <span className="when">{r[0]}</span>
            <span className={'action '+r[3]}>{r[3]}</span>
            <span><span className="who">{r[1]}</span> <span className="what">— {r[2]}</span></span>
            <span className="mono" style={{fontSize:11, color:'var(--fg-muted)'}}>{r[4]}</span>
            <span><button className="btn ghost sm"><Icon.chevron/></button></span>
          </div>
        ))}
      </div>

      <div className="note" style={{marginTop:14}}>
        Cada linha possui hash SHA-256 encadeado com a anterior (blockchain-like local). Alterações retroativas quebram a cadeia e disparam alerta ao DPO.
      </div>
    </div>
  );
}

Object.assign(window, { PageTeams, PageTrainings, PageAssessments, PageVideos, PageReports, PageLGPD, PageUsers, PageAudit });
