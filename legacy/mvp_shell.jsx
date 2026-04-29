/* ============================================================
   Shell: Sidebar + Topbar + Router
   ============================================================ */

function Sidebar({ route, go, user, logout, closeDrawer }) {
  const groups = [
    { label: 'Operação', items: [
      ['home',   'home',    'Visão geral'],
      ['athletes','users',  'Atletas', '1'],
      ['teams',  'grid',    'Turmas',  '11'],
      ['trainings','cal',   'Treinos'],
      ['assessments','clip','Avaliações'],
      ['videos', 'video',   'Vídeos'],
    ]},
    { label: 'Saídas', items: [
      ['report-parent','doc',   'Relatório pais'],
      ['dossier',      'export','Dossiê Inter'],
      ['reports',      'chart', 'Gerenciais'],
    ]},
    { label: 'Sistema', items: [
      ['lgpd',  'shield',  'LGPD'],
      ['users', 'users',   'Usuários'],
      ['audit', 'clock',   'Auditoria'],
    ]},
  ];
  const handleNav = (id) => {
    go({name:id});
    if (closeDrawer) closeDrawer();
  };
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-mark"><img src="assets/logo-escola-inter-bg.png" alt=""/></div>
        <div className="sb-brand-text">
          <div className="sb-title">Escola do Inter</div>
          <div className="sb-sub">Rio Grande · RS</div>
        </div>
        {closeDrawer && (
          <button className="sb-close" onClick={closeDrawer} aria-label="Fechar menu">×</button>
        )}
      </div>
      <nav className="sb-nav">
        {groups.map(g => (
          <React.Fragment key={g.label}>
            <div className="sb-group">{g.label}</div>
            {g.items.map(([id,ic,label,tag]) => {
              const Ic = Icon[ic];
              const active = route.name === id || (id==='athletes' && ['athlete','athlete-new','athlete-eval','anthro','evolution'].includes(route.name));
              return (
                <button key={id} className={'sb-item' + (active?' active':'')} onClick={() => handleNav(id)}>
                  <Ic/><span>{label}</span>{tag && <span className="tag">{tag}</span>}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </nav>
      <div className="sb-bottom">
        {user && (
          <div className="sb-user">
            <div className="avatar xs" style={{background:'var(--brand-soft)', color:'var(--brand-fg)', borderColor:'transparent'}}>
              {(user.name||'?').slice(0,2).toUpperCase()}
            </div>
            <div className="sb-user-info">
              <div className="sb-user-name">{user.name}</div>
              <div className="sb-user-role">acesso prototipo</div>
            </div>
            <button className="sb-logout" onClick={logout} title="Sair" aria-label="Sair">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            </button>
          </div>
        )}
        <div className="sb-foot">
          v0.1 · prototipo de pré-produção
        </div>
      </div>
    </aside>
  );
}

function Topbar({ route, go, user, logout, openDrawer }) {
  const crumbs = [];
  if (route.name === 'home')        crumbs.push('Visão geral');
  else if (route.name === 'athletes')    crumbs.push('Atletas');
  else if (route.name === 'athlete')     crumbs.push({ label:'Atletas', to:{name:'athletes'} }, findAthlete(route.id).name);
  else if (route.name === 'athlete-new') crumbs.push({ label:'Atletas', to:{name:'athletes'} }, 'Novo atleta');
  else if (route.name === 'athlete-eval')crumbs.push({ label:'Atletas', to:{name:'athletes'} }, { label:findAthlete(route.id).name, to:{name:'athlete', id:route.id} }, 'Avaliação de campo');
  else if (route.name === 'anthro')      crumbs.push({ label:'Atletas', to:{name:'athletes'} }, { label:findAthlete(route.id).name, to:{name:'athlete', id:route.id} }, 'Antropometria');
  else if (route.name === 'evolution')   crumbs.push({ label:'Atletas', to:{name:'athletes'} }, { label:findAthlete(route.id).name, to:{name:'athlete', id:route.id} }, 'Evolução');
  else if (route.name === 'report-parent')crumbs.push('Relatório trimestral — pais');
  else if (route.name === 'dossier')     crumbs.push('Dossiê Inter');
  else if (route.name === 'teams')       crumbs.push('Turmas');
  else if (route.name === 'trainings')   crumbs.push('Treinos');
  else if (route.name === 'assessments') crumbs.push('Avaliações');
  else if (route.name === 'videos')      crumbs.push('Vídeos');
  else if (route.name === 'reports')     crumbs.push('Relatórios gerenciais');
  else if (route.name === 'lgpd')        crumbs.push('LGPD');
  else if (route.name === 'users')       crumbs.push('Usuários');
  else if (route.name === 'audit')       crumbs.push('Auditoria');
  else crumbs.push(route.name);
  return (
    <div className="topbar">
      <button className="topbar-burger" onClick={openDrawer} aria-label="Abrir menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      <div className="crumbs">
        <span className="brand-chip">
          <span className="bc-mono"><img src="assets/logo-escola-inter-bg.png" alt=""/></span>
          Escola do Inter
        </span>
        {crumbs.map((c,i) => {
          const last = i === crumbs.length - 1;
          const label = typeof c === 'string' ? c : c.label;
          return (
            <React.Fragment key={i}>
              <span className="sep">/</span>
              {typeof c === 'object' ? (
                <a onClick={() => go(c.to)} style={{cursor:'pointer'}}>{label}</a>
              ) : (
                <span className={last ? 'cur' : ''}>{label}</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="topbar-right">
        <div className="cmdk"><Icon.search/><span>Buscar atleta, turma, teste…</span><span style={{marginLeft:'auto'}} className="kbd">⌘K</span></div>
        {user && (
          <button
            className="avatar xs"
            onClick={logout}
            title={`${user.name} · clique para sair`}
            style={{background:'var(--brand-soft)', color:'var(--brand-fg)', borderColor:'transparent', cursor:'pointer'}}
          >
            {(user.name||'?').slice(0,2).toUpperCase()}
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Home / dashboard
   ============================================================ */
function PageHome({ go }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Visão geral</h1>
          <p className="page-sub">Resumo operacional da Escola do Inter · Rio Grande/RS — semana 16 de 2026.</p>
        </div>
        <div className="page-meta">148 atletas · 11 turmas<br/>6 professores · hoje 18 abr<br/>próx. ciclo: 01/mai</div>
      </div>

      <div className="dash-grid">
        <div className="stat"><div className="stat-label">Atletas ativos</div><div className="stat-value">148</div><div className="stat-delta">+6 no mês</div></div>
        <div className="stat"><div className="stat-label">Avaliações a vencer</div><div className="stat-value">12</div><div className="stat-delta down">3 já vencidas</div></div>
        <div className="stat"><div className="stat-label">Frequência média</div><div className="stat-value">87<span className="u">%</span></div><div className="stat-delta">+2,3 p.p.</div></div>
        <div className="stat"><div className="stat-label">Consent. LGPD</div><div className="stat-value">92<span className="u">%</span></div><div className="stat-delta flat">12 pendentes</div></div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16}}>
        <div className="card">
          <div className="card-head">
            <div><div className="card-title">Atletas em destaque neste trimestre</div><div className="card-sub">Evolução + frequência + percentil interno</div></div>
            <button className="btn sm" onClick={()=>go({name:'athletes'})}>Ver todos →</button>
          </div>
          <div className="card-body" style={{padding:0}}>
            {(() => {
              const seen = new Set();
              return ATHLETES.filter(a=>a.highlight).concat(ATHLETES.slice(0,4))
                .filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true; })
                .slice(0,4);
            })().map(a => (
              <div key={a.id} style={{display:'flex', alignItems:'center', gap:12, padding:'14px 18px', borderBottom:'1px solid var(--border)', cursor:'pointer'}}
                   onClick={()=>go({name:'athlete', id:a.id})}>
                <div className="avatar">{a.ini}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{a.name}</div>
                  <div style={{fontSize:11.5, color:'var(--fg-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} className="mono">{a.cat} · {a.pos}</div>
                </div>
                <div style={{display:'flex', gap:14, alignItems:'center', flexShrink:0}}>
                  <div style={{textAlign:'right'}}><div style={{fontSize:9.5, color:'var(--fg-subtle)', whiteSpace:'nowrap'}}>FREQ</div><div className="mono" style={{fontSize:12.5, whiteSpace:'nowrap'}}>{a.freq}%</div></div>
                  <div style={{textAlign:'right'}}><div style={{fontSize:9.5, color:'var(--fg-subtle)', whiteSpace:'nowrap'}}>SPRINT</div><div className="mono" style={{fontSize:12.5, whiteSpace:'nowrap'}}>{a.sprint20 ? a.sprint20+'s' : '—'}</div></div>
                  <div style={{textAlign:'right'}}><div style={{fontSize:9.5, color:'var(--fg-subtle)', whiteSpace:'nowrap'}}>PHV</div><div className="mono" style={{fontSize:12.5, whiteSpace:'nowrap'}}>{a.phv>=0?'+':''}{a.phv}a</div></div>
                </div>
                <Icon.chevron/>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <div className="card">
            <div className="card-head"><div className="card-title">Próximas ações</div></div>
            <div className="card-body" style={{display:'flex', flexDirection:'column', gap:10}}>
              {[
                ['Lançar bateria — Sub-12 · quarta','hoje 17h30','brand'],
                ['Gerar relatórios trimestrais','até sexta','warn'],
                ['Renovar consent. imagem · 4 atletas','até 30/abr','warn'],
                ['Exportar dossiê Felipe F. · Inter','aguardando assinatura','plain'],
              ].map(([t,d,tag],i)=>(
                <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 10px', borderRadius:6, background:'var(--bg-muted)'}}>
                  <div style={{fontSize:12.5}}>{t}</div>
                  <span className={'badge '+tag}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><div className="card-title">Turmas desta semana</div></div>
            <div className="card-body" style={{fontSize:12.5}}>
              {['Sub-7 · seg/qua', 'Sub-9 · seg/qua/sex', 'Sub-12 · qua/sex', 'Sub-14 · ter/qui', 'Sub-16 · ter/qui/sáb'].map((t,i)=>(
                <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'6px 0', borderTop: i>0?'1px solid var(--border)':'0'}}>
                  <span>{t}</span><span className="mono" style={{color:'var(--fg-subtle)'}}>{[12,18,22,16,19][i]} atletas</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, PageHome });
