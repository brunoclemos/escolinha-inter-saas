/* ============================================================
   Atletas — lista · perfil (com todas as abas) · cadastro (5 etapas)
   ============================================================ */

function PageAthletes({ go }) {
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('Todas');
  const [coach, setCoach] = React.useState('Todos');
  const filtered = ATHLETES.filter(a =>
    (cat==='Todas' || a.cat===cat) &&
    (coach==='Todos' || a.coach.includes(coach)) &&
    (q==='' || a.name.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Atletas</h1>
          <p className="page-sub">{ATHLETES.length} ativos · 12 pendentes de termo de imagem · 3 avaliações vencidas</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn"><Icon.upload/>Importar CSV</button>
          <button className="btn primary" onClick={()=>go({name:'athlete-new'})}><Icon.plus/>Novo atleta</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="input" style={{width:260}}><Icon.search/><input placeholder="buscar por nome do atleta…" value={q} onChange={e=>setQ(e.target.value)}/></div>
        <span className="sep"/>
        <span style={{fontSize:11.5, color:'var(--fg-muted)'}}>Categoria</span>
        <div className="segmented">
          {['Todas','Sub-7','Sub-10','Sub-12','Sub-14','Sub-16'].map(c => (
            <button key={c} className={'seg'+(cat===c?' active':'')} onClick={()=>setCat(c)}>{c}</button>
          ))}
        </div>
        <span className="sep"/>
        <span style={{fontSize:11.5, color:'var(--fg-muted)'}}>Professor</span>
        <div className="segmented">
          {['Todos','Rafa','Léo','Camila'].map(c => (
            <button key={c} className={'seg'+(coach===c?' active':'')} onClick={()=>setCoach(c)}>{c}</button>
          ))}
        </div>
        <button className="btn ghost sm" style={{marginLeft:'auto'}}><Icon.filter/>Mais filtros</button>
      </div>

      <div className="card" style={{overflow:'hidden', padding:0}}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{width:32}}></th>
              <th>Atleta</th>
              <th>Cat.</th>
              <th>Posição</th>
              <th>Professor</th>
              <th>Últ. avaliação</th>
              <th>Próx. janela</th>
              <th>Freq. (30d)</th>
              <th style={{width:32}}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} onClick={()=>go({name:'athlete', id:a.id})}>
                <td><input type="checkbox" onClick={e=>e.stopPropagation()} style={{pointerEvents:'none'}} readOnly/></td>
                <td>
                  <div style={{display:'flex', gap:10, alignItems:'center'}}>
                    <Avatar a={a}/>
                    <div>
                      <div style={{fontWeight:500}}>{a.name}</div>
                      <div className="mono" style={{fontSize:10.5, color:'var(--fg-subtle)'}}>atleta_{a.id} · {a.age}</div>
                    </div>
                  </div>
                </td>
                <td>{a.cat}</td>
                <td>{a.pos}</td>
                <td>{a.coach}</td>
                <td className="mono" style={{color:'var(--fg-muted)'}}>{a.lastEval}</td>
                <td><span className={'badge ' + (a.status==='err'?'err':a.status==='warn'?'warn':'plain')}>{a.nextWin}</span></td>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <div className="bar" style={{width:70}}><i style={{width:a.freq+'%'}}/></div>
                    <span className="mono" style={{fontSize:11}}>{a.freq}%</span>
                  </div>
                </td>
                <td><Icon.chevron/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{display:'flex', justifyContent:'space-between', marginTop:12, fontSize:11.5, color:'var(--fg-muted)'}}>
        <span>Mostrando {filtered.length} de {ATHLETES.length}</span>
        <span>‹ 1 2 3 … 17 ›</span>
      </div>
    </div>
  );
}

/* ---------------------- Perfil ------------------------------ */
function PageAthlete({ id, go }) {
  const a = findAthlete(id);
  const [tab, setTab] = React.useState('overview');
  return (
    <div className="page">
      <div style={{fontSize:11.5, color:'var(--fg-muted)', marginBottom:8}}>
        <a onClick={()=>go({name:'athletes'})} style={{cursor:'pointer'}}>‹ voltar para atletas</a>
      </div>

      <div style={{display:'flex', gap:20, alignItems:'center', padding:20, border:'1px solid var(--border)', borderRadius:10, background:'var(--bg-elev)', marginBottom:18}}>
        <Avatar a={a} size="xl"/>
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
            <span style={{fontSize:22, fontWeight:600}}>{a.name}</span>
            <span className="badge brand">{a.cat}</span>
            <span className="badge plain">{a.pos}</span>
            <span className="badge plain">{a.foot}</span>
            {a.highlight && <span className="badge brand"><Icon.star/>destaque</span>}
          </div>
          <div className="mono" style={{fontSize:12, color:'var(--fg-muted)', marginTop:4}}>
            {a.age} · nasc. {a.birth} · na escolinha há {a.since}
          </div>
          <div className="mono" style={{fontSize:12, color:'var(--fg-muted)', marginTop:2}}>
            {a.coach} · origem: {a.origin} · escola: {a.school}
          </div>
        </div>
        <div style={{display:'flex', gap:6}}>
          <button className="btn"><Icon.edit/>Editar</button>
          <button className="btn" onClick={()=>go({name:'dossier'})}><Icon.export/>Dossiê</button>
          <button className="btn primary" onClick={()=>go({name:'athlete-eval', id:a.id})}><Icon.plus/>Nova avaliação</button>
        </div>
      </div>

      <div className="tabs">
        {[
          ['overview','Visão geral'],
          ['assessments','Avaliações', 14],
          ['evolution','Evolução'],
          ['videos','Vídeos', 6],
          ['health','Saúde & lesões'],
          ['attendance','Presenças'],
          ['guardians','Responsáveis'],
          ['docs','Documentos', 4],
        ].map(([tid,l,n]) => (
          <button key={tid} className={'tab'+(tab===tid?' active':'')} onClick={()=>{
            if (tid==='evolution') go({name:'evolution', id:a.id});
            else setTab(tid);
          }}>
            {l}{n && <span className="num">{n}</span>}
          </button>
        ))}
      </div>

      {tab === 'overview'    && <TabOverview a={a} go={go}/>}
      {tab === 'assessments' && <TabAssessments a={a} go={go}/>}
      {tab === 'videos'      && <TabVideos a={a} go={go}/>}
      {tab === 'health'      && <TabHealth a={a}/>}
      {tab === 'attendance'  && <TabAttendance a={a}/>}
      {tab === 'guardians'   && <TabGuardians a={a}/>}
      {tab === 'docs'        && <TabDocs a={a}/>}
    </div>
  );
}

/* --- inner tabs do perfil ----------------------------------- */
function TabOverview({ a, go }) {
  return (
    <>
      <div className="dash-grid">
        <div className="stat"><div className="stat-label">Altura</div><div className="stat-value">{a.height.toFixed(1)}<span className="u">cm</span></div><div className="stat-delta">+4,0 cm em 6m</div></div>
        <div className="stat"><div className="stat-label">Peso</div><div className="stat-value">{a.weight.toFixed(1)}<span className="u">kg</span></div><div className="stat-delta">+2,1 kg</div></div>
        <div className="stat"><div className="stat-label">Sprint 20m</div><div className="stat-value">{a.sprint20?a.sprint20:'—'}<span className="u">{a.sprint20?'s':''}</span></div><div className="stat-delta">{a.sprint20?'−0,12 s':'n/a p/ idade'}</div></div>
        <div className="stat"><div className="stat-label">PHV</div><div className="stat-value">{a.phv>=0?'+':''}{a.phv}<span className="u">a</span></div><div className={'stat-delta '+(a.phv<-1?'down':'flat')}>{a.phv<-1?'pré-pico':a.phv>1?'pós-pico':'em pico'}</div></div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:16}}>
        <div className="card">
          <div className="card-head"><div className="card-title">Linha do tempo</div><span className="badge plain">12 meses</span></div>
          <div className="card-body" style={{padding:0}}>
            {[
              ['há 12d','Avaliação técnica',   'Nota média 7,4 · destaque em 1v1','brand'],
              ['há 28d','Antropometria',       '+1,3 cm · %BF 14,2 → 13,6','plain'],
              ['há 34d','Lesão encerrada',     'Estiramento leve posterior esq.','ok'],
              ['há 47d','Vídeo tagueado',      '4 ações destacadas','plain'],
              ['há 62d','Avaliação física',    'Sprint 20m 3,41s (recorde pessoal)','brand'],
              ['há 88d','Relatório pais enviado','via WhatsApp · Pai do Felipe','plain'],
            ].map(([w,t,d,b],i) => (
              <div key={i} style={{display:'flex', gap:14, padding:'12px 18px', borderBottom:'1px solid var(--border)'}}>
                <span className="mono" style={{fontSize:11, color:'var(--fg-subtle)', width:44}}>{w}</span>
                <div style={{flex:1}}>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <span style={{fontSize:12.5, fontWeight:500}}>{t}</span>
                    <span className={'badge '+b} style={{fontSize:9.5, padding:'1px 6px'}}>{b==='brand'?'destaque':b==='ok'?'ok':'info'}</span>
                  </div>
                  <div style={{fontSize:11.5, color:'var(--fg-muted)'}}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside style={{display:'flex', flexDirection:'column', gap:12}}>
          <div className="card">
            <div className="card-head"><div className="card-title">LGPD</div></div>
            <div className="card-body" style={{fontSize:12}}>
              {[['Uso de imagem','ok'],['Dados de saúde','ok'],['Exportação p/ clubes','warn'],['Publicação redes','plain']].map(([l,s],i)=>(
                <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'5px 0'}}>
                  <span>{l}</span><span className={'badge '+s}><span className="dot"/>{s==='ok'?'ok':s==='warn'?'pendente':'n/a'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">Atalhos</div></div>
            <div className="card-body" style={{display:'flex', flexDirection:'column', gap:6}}>
              <button className="btn" onClick={()=>go({name:'anthro', id:a.id})}><Icon.clip/>Nova antropometria</button>
              <button className="btn" onClick={()=>go({name:'evolution', id:a.id})}><Icon.chart/>Ver evolução</button>
              <button className="btn" onClick={()=>go({name:'report-parent'})}><Icon.doc/>Gerar relatório pais</button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function TabAssessments({ a, go }) {
  const rows = [
    ['18/mar/2026','Avaliação técnica','Rafa',    'Nota média 7,4 · 1v1 ótimo','ok'],
    ['02/mar/2026','Antropometria',    'Camila',  '+1,3 cm · BF 13,6%','ok'],
    ['10/fev/2026','Bateria física',   'Rafa',    'Sprint 20m 3,41s (RP) · CMJ 28,4cm','ok'],
    ['04/jan/2026','Avaliação tática', 'Léo',     'Leitura 7,2 · posicionamento 6,8','ok'],
    ['12/dez/2025','Bateria física',   'Rafa',    'Sprint 20m 3,48s · CMJ 27,2cm','ok'],
    ['01/dez/2025','Psicossocial',     'Camila',  'Resiliência 4/5 · foco 5/5','ok'],
    ['18/nov/2025','Antropometria',    'Camila',  '+0,8 cm · BF 14,2%','ok'],
    ['02/nov/2025','Avaliação técnica','Rafa',    'Nota média 6,9','ok'],
  ];
  return (
    <div className="card" style={{padding:0}}>
      <div className="card-head">
        <div><div className="card-title">Histórico de avaliações</div><div className="card-sub">Ordem decrescente · 14 no total</div></div>
        <button className="btn primary sm" onClick={()=>go({name:'athlete-eval', id:a.id})}><Icon.plus/>Nova avaliação</button>
      </div>
      <table className="tbl">
        <thead><tr><th>Data</th><th>Tipo</th><th>Aplicador</th><th>Resumo</th><th>Status</th><th style={{width:32}}></th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} onClick={e=>e.stopPropagation()}>
              <td className="mono" style={{color:'var(--fg-muted)'}}>{r[0]}</td>
              <td style={{fontWeight:500}}>{r[1]}</td>
              <td>Prof. {r[2]}</td>
              <td style={{color:'var(--fg-muted)'}}>{r[3]}</td>
              <td><span className="badge ok"><span className="dot"/>concluída</span></td>
              <td><Icon.chevron/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabVideos({ a, go }) {
  const clips = [
    { t:'Jogada 1v1 · pela direita', d:'0:18', tags:['1v1','finta','drible'], date:'18/mar' },
    { t:'Gol após 3 toques',         d:'0:12', tags:['gol','finalização'],   date:'12/mar' },
    { t:'Passe decisivo',            d:'0:09', tags:['passe','assistência'], date:'08/mar' },
    { t:'Recuperação de bola',       d:'0:15', tags:['defesa','pressão'],    date:'02/mar' },
    { t:'Cabeceio no treino',        d:'0:08', tags:['cabeceio','bola parada'], date:'24/fev' },
    { t:'Condução em velocidade',    d:'0:11', tags:['velocidade','condução'], date:'18/fev' },
  ];
  return (
    <div>
      <div className="toolbar">
        <div className="input" style={{width:240}}><Icon.search/><input placeholder="buscar por tag ou descrição…"/></div>
        <div className="segmented">
          {['Todos','Jogo','Treino','Teste'].map((x,i)=><button key={x} className={'seg'+(i===0?' active':'')}>{x}</button>)}
        </div>
        <button className="btn ghost sm" style={{marginLeft:'auto'}}><Icon.upload/>Subir vídeo</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14}}>
        {clips.map((c,i)=>(
          <div key={i} className="video-card">
            <div className="video-thumb">
              <div className="play"/>
              <div className="dur">{c.d}</div>
            </div>
            <div style={{padding:'10px 12px 4px'}}>
              <div style={{fontSize:13, fontWeight:500}}>{c.t}</div>
              <div style={{fontSize:11, color:'var(--fg-subtle)', marginTop:2}} className="mono">{c.date} · {a.name.split(' ')[0]}</div>
            </div>
            <div className="video-tags">
              {c.tags.map(t => <span key={t} className="t">#{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabHealth({ a }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:16}}>
      <div>
        <div className="card">
          <div className="card-head"><div className="card-title">Histórico de lesões</div><button className="btn sm"><Icon.plus/>Registrar</button></div>
          <div className="card-body" style={{padding:0}}>
            {[
              ['12/fev – 05/mar/2026', 'Estiramento leve · posterior esq.', 'Afastado 21 dias · liberado com trabalho individualizado','ok'],
              ['04/ago – 18/ago/2025', 'Entorse tornozelo dir.',           'Afastado 14 dias · fisio 6 sessões','ok'],
            ].map((r,i)=>(
              <div key={i} style={{padding:'14px 18px', borderBottom:'1px solid var(--border)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4}}>
                  <span style={{fontWeight:500}}>{r[1]}</span>
                  <span className={'badge '+r[3]}><span className="dot"/>encerrada</span>
                </div>
                <div className="mono" style={{fontSize:11, color:'var(--fg-muted)', marginBottom:4}}>{r[0]}</div>
                <div style={{fontSize:12.5, color:'var(--fg-muted)'}}>{r[2]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-title">Ficha médica</div>
        <div className="card"><div className="card-body">
          <div className="info-grid">
            <div className="item"><div className="label">Tipo sanguíneo</div><div className="value mono">O+</div></div>
            <div className="item"><div className="label">Alergias</div><div className="value">Nenhuma</div></div>
            <div className="item"><div className="label">Uso contínuo</div><div className="value">Nenhum</div></div>
            <div className="item"><div className="label">Plano de saúde</div><div className="value">Unimed · 00000</div></div>
            <div className="item"><div className="label">Médico</div><div className="value">Dr. F. Moraes</div></div>
            <div className="item"><div className="label">Atestado válido até</div><div className="value mono">31/dez/2026</div></div>
          </div>
        </div></div>
      </div>

      <aside style={{display:'flex', flexDirection:'column', gap:12}}>
        <div className="card">
          <div className="card-head"><div className="card-title">Dias sem lesão</div></div>
          <div className="card-body" style={{textAlign:'center', padding:18}}>
            <div className="mono" style={{fontSize:44, fontWeight:500, color:'var(--ok)'}}>43</div>
            <div style={{fontSize:12, color:'var(--fg-muted)'}}>desde 05/mar/2026</div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title">Red flags maturação</div></div>
          <div className="card-body" style={{fontSize:12.5, lineHeight:1.6}}>
            <div style={{display:'flex', alignItems:'center', gap:8}}><Icon.alert style={{color:'var(--warn)'}}/><span>Próximo do pico (PHV {a.phv} a)</span></div>
            <div style={{display:'flex', alignItems:'center', gap:8, marginTop:6}}><Icon.check style={{color:'var(--ok)'}}/><span>Velocidade crescimento dentro da faixa</span></div>
            <div style={{display:'flex', alignItems:'center', gap:8, marginTop:6}}><Icon.check style={{color:'var(--ok)'}}/><span>Sem Osgood-Schlatter relatado</span></div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function TabAttendance({ a }) {
  const months = ['Nov/25','Dez/25','Jan/26','Fev/26','Mar/26','Abr/26'];
  return (
    <div>
      <div className="dash-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        <div className="stat"><div className="stat-label">Freq. 30d</div><div className="stat-value">{a.freq}<span className="u">%</span></div></div>
        <div className="stat"><div className="stat-label">Freq. ano</div><div className="stat-value">89<span className="u">%</span></div></div>
        <div className="stat"><div className="stat-label">Presenças</div><div className="stat-value">142</div><div className="stat-delta">de 160 sessões</div></div>
        <div className="stat"><div className="stat-label">Ausências justif.</div><div className="stat-value">12</div></div>
      </div>
      <div className="card">
        <div className="card-head"><div className="card-title">Últimos 6 meses</div><div className="segmented"><button className="seg active">Semana</button><button className="seg">Mês</button></div></div>
        <div className="card-body">
          {months.map((m,i) => (
            <div key={m} style={{display:'flex', alignItems:'center', gap:14, padding:'10px 0', borderTop:i>0?'1px solid var(--border)':'0'}}>
              <span style={{width:70, fontSize:12.5, color:'var(--fg-muted)'}}>{m}</span>
              <div style={{flex:1, display:'flex', gap:3}}>
                {Array.from({length:24}).map((_,j) => {
                  const miss = (i*7+j) % 13 === 0 || (i===2 && j===18);
                  return <div key={j} style={{flex:1, height:16, borderRadius:2, background: miss?'var(--border)':'var(--brand)', opacity: miss?1:(0.55 + (j%5)*0.1)}}/>;
                })}
              </div>
              <span className="mono" style={{fontSize:11.5, width:40, textAlign:'right', color:'var(--fg-muted)'}}>{[92,88,94,85,95,92][i]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabGuardians({ a }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
      {[
        { init:'AP', name:'Pai do Felipe', parent:'Mãe', fin:true,  wa:'(53) 9 9969-6774', email:'responsavel@email.com', cpf:'***.456.789-**', portal:true },
        { init:'CM', name:'—',  parent:'Pai', fin:false, wa:'—', email:'—',    cpf:'***.321.654-**', portal:false },
      ].map((g,i)=>(
        <div key={i} className="card">
          <div className="card-head">
            <div style={{display:'flex', gap:10, alignItems:'center'}}>
              <div className="avatar">{g.init}</div>
              <div>
                <div style={{fontWeight:500}}>{g.name}</div>
                <div style={{fontSize:11, color:'var(--fg-muted)'}}>{g.parent}{g.fin && ' · financeiro'}</div>
              </div>
            </div>
            <button className="btn ghost sm"><Icon.edit/></button>
          </div>
          <div className="card-body">
            <div className="kv" style={{fontSize:12.5, rowGap:8}}>
              <span className="k">WhatsApp</span><span className="mono">{g.wa}</span>
              <span className="k">E-mail</span><span>{g.email}</span>
              <span className="k">CPF</span><span className="mono">{g.cpf}</span>
              <span className="k">Portal</span><span><span className={'badge '+(g.portal?'ok':'plain')}><span className="dot"/>{g.portal?'acesso ativo':'sem acesso'}</span></span>
            </div>
            <div style={{display:'flex', gap:6, marginTop:12}}>
              <button className="btn sm"><Icon.phone/>Ligar</button>
              <button className="btn sm"><Icon.send/>WhatsApp</button>
              <button className="btn sm"><Icon.mail/>E-mail</button>
            </div>
          </div>
        </div>
      ))}
      <div style={{gridColumn:'1 / -1'}}>
        <button className="btn" style={{width:'100%', justifyContent:'center', border:'1px dashed var(--border-strong)', background:'transparent'}}>
          <Icon.plus/>Adicionar responsável
        </button>
      </div>
    </div>
  );
}

function TabDocs({ a }) {
  const docs = [
    ['contrato_matricula_2026.pdf', 'Contrato de matrícula', '14/jan/2026', '142 KB', 'ok'],
    ['termo_imagem_2026.pdf',       'Termo de uso de imagem','14/jan/2026', '88 KB',  'ok'],
    ['atestado_medico_2026.pdf',    'Atestado médico',       '20/jan/2026', '320 KB', 'ok'],
    ['certidao_nasc.pdf',           'Certidão de nascimento','14/jan/2026', '212 KB', 'ok'],
  ];
  return (
    <div className="card" style={{padding:0}}>
      <div className="card-head">
        <div><div className="card-title">Documentos anexados</div><div className="card-sub">Armazenados com criptografia · LGPD</div></div>
        <button className="btn sm"><Icon.upload/>Anexar</button>
      </div>
      <table className="tbl">
        <thead><tr><th>Arquivo</th><th>Tipo</th><th>Enviado</th><th>Tamanho</th><th>Status</th><th style={{width:80}}></th></tr></thead>
        <tbody>
          {docs.map((d,i)=>(
            <tr key={i}>
              <td style={{fontWeight:500, display:'flex', gap:10, alignItems:'center'}}><Icon.file style={{color:'var(--fg-muted)'}}/>{d[0]}</td>
              <td>{d[1]}</td>
              <td className="mono" style={{color:'var(--fg-muted)'}}>{d[2]}</td>
              <td className="mono" style={{color:'var(--fg-muted)'}}>{d[3]}</td>
              <td><span className="badge ok"><span className="dot"/>válido</span></td>
              <td><div style={{display:'flex', gap:4}}><button className="btn ghost sm"><Icon.download/></button><button className="btn ghost sm"><Icon.trash/></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------- Cadastro (5 etapas) ------------------- */
function PhotoUploader({ onChange, value }) {
  const ref = React.useRef();
  const pick = () => ref.current.click();
  const handle = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(f);
  };
  return (
    <div style={{display:'flex', gap:16, alignItems:'center'}}>
      <input ref={ref} type="file" accept="image/*" style={{display:'none'}} onChange={handle}/>
      {value ? (
        <div className="photo-preview" onClick={pick}>
          <img src={value} alt="preview"/>
          <div className="overlay">Trocar foto</div>
        </div>
      ) : (
        <div className="photo-drop" style={{width:180, height:180, padding:12, justifyContent:'center'}} onClick={pick}>
          <div className="big"><Icon.camera/></div>
          <div style={{fontSize:12, fontWeight:500}}>Enviar foto</div>
          <div style={{fontSize:10.5}} className="mono">PNG, JPG · até 5MB</div>
        </div>
      )}
      <div style={{fontSize:12, color:'var(--fg-muted)', maxWidth:260, lineHeight:1.5}}>
        A foto é usada na identificação interna e no dossiê enviado para clubes parceiros.
        <br/><br/>
        <b>LGPD:</b> uso restrito ao contexto esportivo — não é publicada sem consentimento explícito na etapa 4.
      </div>
    </div>
  );
}

function PageAthleteNew({ go }) {
  const [step, setStep] = React.useState(1);
  const [photo, setPhoto] = React.useState(null);
  const steps = ['Identificação','Responsáveis','Escola & rotina','Saúde & LGPD','Futebol'];

  const save = () => {
    // persiste a foto para o primeiro atleta da lista como demonstração
    if (photo) {
      try { localStorage.setItem('photo_a1', photo); } catch(e){}
    }
    go({name:'athlete', id:'a1'});
  };

  return (
    <div className="page">
      <div style={{fontSize:11.5, color:'var(--fg-muted)', marginBottom:8}}>
        <a onClick={()=>go({name:'athletes'})} style={{cursor:'pointer'}}>‹ voltar para atletas</a>
      </div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Novo atleta</h1>
          <p className="page-sub">Rascunho salvo automaticamente · meta: &lt; 5 min · etapa {step} de 5</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn">Salvar rascunho</button>
          {step < 5
            ? <button className="btn primary" onClick={()=>setStep(step+1)}>Próxima etapa →</button>
            : <button className="btn primary" onClick={save}><Icon.check/>Concluir cadastro</button>}
        </div>
      </div>

      <div className="stepper">
        {steps.map((l,i) => {
          const state = i<step-1 ? 'done' : i===step-1 ? 'active' : '';
          return (
            <button key={i} className={'step '+state} onClick={()=>setStep(i+1)}>
              <span className="n">{state==='done'?'✓':i+1}</span>{l}
            </button>
          );
        })}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 280px', gap:20}}>
        <div className="card"><div className="card-body" style={{padding:22}}>
          {step === 1 && <Step1 photo={photo} setPhoto={setPhoto}/>}
          {step === 2 && <Step2/>}
          {step === 3 && <Step3/>}
          {step === 4 && <Step4/>}
          {step === 5 && <Step5/>}
        </div></div>

        <aside>
          <div className="card">
            <div className="card-head"><div className="card-title">Progresso</div></div>
            <div className="card-body" style={{fontSize:12.5}}>
              {steps.map((l,i) => {
                const state = i<step-1 ? 'done' : i===step-1 ? 'active' : '';
                return (
                  <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'6px 0', color: state==='done'?'var(--ok)':state==='active'?'var(--fg)':'var(--fg-subtle)', fontWeight:state==='active'?500:400}}>
                    <span>{state==='done'?'✓':state==='active'?'●':'○'} {l}</span>
                    <span className="mono" style={{color:'var(--fg-subtle)'}}>{state==='done'?'ok':state==='active'?'…':'—'}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="note" style={{marginTop:12}}>
            {step === 4 ? 'Menor de idade: o termo de imagem e o questionário PAR-Q são obrigatórios antes de liberar treinos.' :
             step === 5 ? 'Categoria é sugerida por data de nascimento, mas o professor pode ajustar.' :
             'Campos marcados com * são obrigatórios para concluir o cadastro.'}
          </div>
        </aside>
      </div>

      <div style={{display:'flex', justifyContent:'space-between', marginTop:20}}>
        <button className="btn" onClick={()=>setStep(Math.max(1,step-1))} disabled={step===1} style={{opacity: step===1?.5:1}}>‹ Anterior</button>
        {step < 5
          ? <button className="btn primary" onClick={()=>setStep(step+1)}>Próxima etapa →</button>
          : <button className="btn primary" onClick={save}><Icon.check/>Concluir cadastro</button>}
      </div>
    </div>
  );
}

function Step1({ photo, setPhoto }) {
  return (
    <>
      <div className="section-title" style={{marginTop:0}}>Foto</div>
      <PhotoUploader value={photo} onChange={setPhoto}/>
      <div className="section-title">Identificação</div>
      <div className="row row-2">
        <div><label className="form-label req">Nome completo</label><div className="input"><input defaultValue="Felipe De David Fonseca"/></div></div>
        <div><label className="form-label">Nome esportivo (opcional)</label><div className="input"><input placeholder="ex. Lukinha"/></div></div>
      </div>
      <div className="row row-3">
        <div><label className="form-label req">Data de nascimento</label><div className="input mono"><input defaultValue="20/01/2016"/></div></div>
        <div><label className="form-label">Sexo</label><div className="input"><select defaultValue="M"><option value="M">Masculino</option><option>Feminino</option></select></div></div>
        <div><label className="form-label">Categoria sugerida</label><div className="input" style={{background:'var(--bg-muted)'}}><span>Sub-11</span><span style={{marginLeft:'auto', fontSize:10, color:'var(--fg-subtle)'}}>auto pela idade</span></div></div>
      </div>
      <div className="row row-3">
        <div><label className="form-label">Nacionalidade</label><div className="input"><input defaultValue="Brasileira"/></div></div>
        <div><label className="form-label">Naturalidade</label><div className="input"><input defaultValue="Rio Grande/RS"/></div></div>
        <div><label className="form-label">Matrícula</label><div className="input mono"><input defaultValue="171273"/></div></div>
      </div>
      <div className="row row-2">
        <div><label className="form-label">CPF</label><div className="input mono"><input defaultValue="050.249.390-93"/></div></div>
        <div><label className="form-label">RG</label><div className="input mono"><input placeholder="—"/></div></div>
      </div>
      <div className="row row-3">
        <div style={{gridColumn:'1 / 3'}}><label className="form-label">Endereço</label><div className="input"><input defaultValue="Ana Pernigotti, nº 1061 · Cassino · Rio Grande/RS"/></div></div>
        <div><label className="form-label">CEP</label><div className="input mono"><input defaultValue="96207-010"/></div></div>
      </div>
      <div className="row row-2">
        <div><label className="form-label">Complemento</label><div className="input"><input defaultValue="Rua H88 Bolaxa"/></div></div>
        <div><label className="form-label">Celular</label><div className="input mono"><input defaultValue="(53) 9 9969-6774"/></div></div>
      </div>
    </>
  );
}

function Step2() {
  return (
    <>
      <div className="section-title" style={{marginTop:0}}>Responsável 1 <span className="badge brand" style={{marginLeft:8, textTransform:'none', letterSpacing:0}}>financeiro</span></div>
      <div className="row row-2">
        <div><label className="form-label req">Nome</label><div className="input"><input defaultValue="Pai do Felipe"/></div></div>
        <div><label className="form-label req">Parentesco</label><div className="input"><select defaultValue="mae"><option value="mae">Mãe</option><option>Pai</option><option>Avó/Avô</option><option>Outro</option></select></div></div>
      </div>
      <div className="row row-2">
        <div><label className="form-label req">WhatsApp</label><div className="input mono"><Icon.phone/><input defaultValue="(53) 9 9969-6774"/></div></div>
        <div><label className="form-label">E-mail</label><div className="input"><Icon.mail/><input defaultValue="responsavel@email.com"/></div></div>
      </div>
      <div className="row row-3">
        <div><label className="form-label">CPF</label><div className="input mono"><input placeholder="000.000.000-00"/></div></div>
        <div><label className="form-label">Profissão</label><div className="input"><input defaultValue="Enfermeira"/></div></div>
        <div style={{display:'flex', alignItems:'flex-end', gap:8, fontSize:12, color:'var(--fg-muted)'}}><span className="chk on"/>Acesso ao portal dos pais</div>
      </div>

      <div className="section-title">Responsável 2</div>
      <div className="row row-2">
        <div><label className="form-label">Nome</label><div className="input"><input defaultValue="—"/></div></div>
        <div><label className="form-label">Parentesco</label><div className="input"><select defaultValue="pai"><option>Mãe</option><option value="pai">Pai</option><option>Outro</option></select></div></div>
      </div>
      <div className="row row-2">
        <div><label className="form-label">WhatsApp</label><div className="input mono"><Icon.phone/><input defaultValue="—"/></div></div>
        <div><label className="form-label">E-mail</label><div className="input"><Icon.mail/><input placeholder="opcional"/></div></div>
      </div>
      <button className="btn" style={{width:'100%', justifyContent:'center', border:'1px dashed var(--border-strong)', background:'transparent', marginTop:8}}><Icon.plus/>Adicionar terceiro responsável</button>

      <div className="section-title">Contato de emergência</div>
      <div className="row row-2">
        <div><label className="form-label req">Nome</label><div className="input"><input defaultValue="Pai do Felipe"/></div></div>
        <div><label className="form-label req">Telefone</label><div className="input mono"><Icon.phone/><input defaultValue="(53) 9 9969-6774"/></div></div>
      </div>
    </>
  );
}

function Step3() {
  return (
    <>
      <div className="section-title" style={{marginTop:0}}>Escola regular</div>
      <div className="row row-2">
        <div><label className="form-label">Instituição</label><div className="input"><Icon.building/><input defaultValue="Escola Castelo Branco"/></div></div>
        <div><label className="form-label">Ano/Série</label><div className="input"><input defaultValue="7º ano · manhã"/></div></div>
      </div>
      <div className="row row-3">
        <div><label className="form-label">Período escolar</label><div className="input"><select defaultValue="manha"><option value="manha">Manhã</option><option>Tarde</option><option>Integral</option></select></div></div>
        <div><label className="form-label">Nota média</label><div className="input mono"><input placeholder="opcional"/></div></div>
        <div><label className="form-label">Contato coordenação</label><div className="input mono"><input placeholder="(51) ·····"/></div></div>
      </div>

      <div className="section-title">Outras atividades</div>
      <div className="row row-2">
        <div><label className="form-label">Pratica outro esporte</label><div className="input"><input placeholder="ex. natação · 2x/sem"/></div></div>
        <div><label className="form-label">Horas/semana (fora escolinha)</label><div className="input mono"><input placeholder="ex. 4h"/></div></div>
      </div>

      <div className="section-title">Logística · escolinha</div>
      <div className="row row-2">
        <div><label className="form-label req">Turno de treino</label><div className="input"><select defaultValue="tarde"><option>Manhã</option><option value="tarde">Tarde</option><option>Noite</option></select></div></div>
        <div><label className="form-label">Quem traz/leva</label><div className="input"><input defaultValue="Mãe · de carro"/></div></div>
      </div>
      <div className="row row-2">
        <div><label className="form-label">Pode voltar sozinho?</label><div className="input"><select defaultValue="nao"><option>Sim</option><option value="nao">Não</option></select></div></div>
        <div><label className="form-label">Tamanho de uniforme</label><div className="input"><select defaultValue="12"><option>10</option><option value="12">12</option><option>14</option><option>M</option><option>G</option></select></div></div>
      </div>

      <div className="section-title">Histórico na escolinha</div>
      <div className="row row-3">
        <div><label className="form-label">Como conheceu?</label><div className="input"><select defaultValue="ind"><option value="ind">Indicação</option><option>Peneira</option><option>Rede social</option><option>Outro</option></select></div></div>
        <div><label className="form-label">Data de entrada</label><div className="input mono"><input defaultValue="05/02/2024"/></div></div>
        <div><label className="form-label">Professor captador</label><div className="input"><select defaultValue="rafa"><option value="rafa">Rafaela Pinheiro</option><option>Leonardo Ramos</option><option>Camila Reis</option></select></div></div>
      </div>
      <div><label className="form-label">Impressão inicial (texto livre)</label><div className="input" style={{height:'auto', padding:10}}><textarea rows="3" defaultValue="Chegou tímido, mas mostrou boa leitura de jogo nos primeiros dias. Gosta muito do 1v1." style={{width:'100%'}}/></div></div>
    </>
  );
}

function Step4() {
  return (
    <>
      <div className="section-title" style={{marginTop:0}}>Ficha médica</div>
      <div className="row row-3">
        <div><label className="form-label">Tipo sanguíneo</label><div className="input"><select defaultValue="O+"><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option value="O+">O+</option><option>O-</option><option>AB+</option><option>AB-</option></select></div></div>
        <div><label className="form-label">Plano de saúde</label><div className="input"><input placeholder="ex. Unimed"/></div></div>
        <div><label className="form-label">Nº carteirinha</label><div className="input mono"><input placeholder="opcional"/></div></div>
      </div>
      <div className="row row-2">
        <div><label className="form-label">Alergias</label><div className="input"><input placeholder="ex. amendoim · ou deixe vazio"/></div></div>
        <div><label className="form-label">Medicação contínua</label><div className="input"><input placeholder="ex. ·"/></div></div>
      </div>
      <div><label className="form-label">Observações médicas (texto livre)</label><div className="input" style={{height:'auto', padding:10}}><textarea rows="2" placeholder="condições pré-existentes, cirurgias, restrições a atividades..." style={{width:'100%'}}/></div></div>

      <div className="section-title">Questionário PAR-Q <span className="badge warn" style={{marginLeft:8}}>obrigatório p/ liberar treinos</span></div>
      <div style={{display:'flex', flexDirection:'column', gap:8, fontSize:12.5}}>
        {[
          'Algum médico já disse que seu/sua filho(a) tem problema cardíaco?',
          'Sente dor no peito ao fazer atividade física?',
          'Já perdeu o equilíbrio por tontura ou teve desmaio?',
          'Tem problema ósseo ou articular que atividade física pode piorar?',
          'Usa medicação para pressão arterial ou coração?',
          'Há alguma outra razão para não fazer atividade física?',
        ].map((q,i)=>(
          <div key={i} style={{display:'grid', gridTemplateColumns:'1fr 100px', gap:14, padding:'8px 12px', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg-elev)'}}>
            <span>{i+1}. {q}</span>
            <div className="segmented"><button className={'seg'+(i===0?'':' active')}>Sim</button><button className={'seg'+(i===0?' active':'')}>Não</button></div>
          </div>
        ))}
      </div>

      <div className="section-title">Consentimentos LGPD</div>
      <div style={{display:'flex', flexDirection:'column', gap:10, fontSize:12.5}}>
        {[
          ['Uso de imagem (uso interno e relatórios)', true, true],
          ['Publicação em redes sociais oficiais',     true, false],
          ['Compartilhamento de dados de saúde c/ fisio parceira', true, true],
          ['Exportação de dossiê para clubes parceiros (ex. Inter)', true, false],
          ['Envio de relatórios via WhatsApp',          true, true],
        ].map(([l,req,on],i)=>(
          <label key={i} style={{display:'flex', gap:10, alignItems:'flex-start', padding:10, border:'1px solid var(--border)', borderRadius:6, cursor:'pointer'}}>
            <span className={'chk'+(on?' on':'')}/>
            <div style={{flex:1}}>
              <div>{l}{req && <span className="badge plain" style={{marginLeft:8, fontSize:9.5}}>obrigatório p/ MVP</span>}</div>
              <div style={{fontSize:11, color:'var(--fg-subtle)', marginTop:2}}>Responsável: Pai do Felipe · assinatura digital será coletada no envio do termo</div>
            </div>
          </label>
        ))}
      </div>
    </>
  );
}

function Step5() {
  return (
    <>
      <div className="section-title" style={{marginTop:0}}>Perfil do atleta · futebol</div>
      <div className="row row-3">
        <div><label className="form-label req">Pé dominante</label><div className="input"><select defaultValue="d"><option value="d">Destro</option><option>Canhoto</option><option>Ambidestro</option></select></div></div>
        <div><label className="form-label req">Posição principal</label><div className="input"><select defaultValue="pd"><option>Goleiro</option><option>Zagueiro</option><option>Lateral</option><option>Volante</option><option>Meio-campo</option><option value="pd">Ponta direita</option><option>Ponta esquerda</option><option>Atacante</option></select></div></div>
        <div><label className="form-label">Posições secundárias</label><div className="input"><input placeholder="ex. meia, atacante"/></div></div>
      </div>
      <div className="row row-2">
        <div><label className="form-label">Tempo de prática</label><div className="input mono"><input defaultValue="3 anos"/></div></div>
        <div><label className="form-label">Clube anterior</label><div className="input"><input placeholder="opcional"/></div></div>
      </div>
      <div><label className="form-label">Sonho / objetivo do atleta</label><div className="input" style={{height:'auto', padding:10}}><textarea rows="2" placeholder="o que ele quer alcançar no futebol? (transcrição do atleta ou dos pais)" style={{width:'100%'}}/></div></div>

      <div className="section-title">Atribuição interna</div>
      <div className="row row-3">
        <div><label className="form-label req">Turma</label><div className="input"><select defaultValue="sub11"><option value="sub11">Sub-11 · ter/qui 18:00 · Campo B</option><option>Sub-10 · ter/qui 17:30 · Campo A</option></select></div></div>
        <div><label className="form-label">Professor responsável</label><div className="input"><select defaultValue="camila"><option value="camila">Camila Reis</option><option>Rafaela Pinheiro</option><option>Leonardo Ramos</option></select></div></div>
        <div><label className="form-label">Data de início nos treinos</label><div className="input mono"><input defaultValue="15/08/2024"/></div></div>
      </div>

      <div className="section-title">Primeira avaliação</div>
      <div className="note" style={{marginBottom:10}}>
        A primeira bateria é agendada automaticamente para 14 dias após o início. O professor recebe notificação.
      </div>
      <label style={{display:'flex', gap:10, alignItems:'center', padding:10, border:'1px solid var(--border)', borderRadius:6, cursor:'pointer', fontSize:12.5}}>
        <span className="chk on"/>
        <span>Agendar automaticamente bateria inicial (antropometria + testes físicos + técnica)</span>
      </label>

      <div className="section-title">Resumo do cadastro</div>
      <div className="info-grid">
        <div className="item"><div className="label">Nome</div><div className="value">Felipe De David Fonseca</div></div>
        <div className="item"><div className="label">Categoria</div><div className="value">Sub-11</div></div>
        <div className="item"><div className="label">Responsável financeiro</div><div className="value">Pai do Felipe</div></div>
        <div className="item"><div className="label">WhatsApp</div><div className="value mono">(53) 9 9969-6774</div></div>
        <div className="item"><div className="label">Turma</div><div className="value">Sub-11 · Prof. Camila</div></div>
        <div className="item"><div className="label">Documentos</div><div className="value">4 anexados</div></div>
        <div className="item"><div className="label">LGPD</div><div className="value"><span className="badge ok"><span className="dot"/>3 de 5 ok</span></div></div>
        <div className="item"><div className="label">Primeira avaliação</div><div className="value mono">06/mai/2026</div></div>
      </div>
    </>
  );
}

Object.assign(window, { PageAthletes, PageAthlete, PageAthleteNew });
