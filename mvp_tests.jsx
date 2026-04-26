/* ============================================================
   Mobile eval + Antropometria + Evolução
   ============================================================ */

function PageAthleteEval({ id, go }) {
  const a = findAthlete(id);
  const [test, setTest] = React.useState('sprint20');
  const tests = [
    ['sprint20','Sprint 20m','velocidade','brand'],
    ['cmj','Salto CMJ','potência','plain'],
    ['illinois','Agilidade Illinois','agilidade','plain'],
    ['yoyo','Yo-Yo IR1','resistência','plain'],
    ['tech','Técnico (1-10)','técnico','plain'],
  ];
  return (
    <div className="page">
      <div style={{fontSize:11.5, color:'var(--fg-muted)', marginBottom:8}}>
        <a onClick={()=>go({name:'athlete', id:a.id})} style={{cursor:'pointer'}}>‹ voltar para {a.name}</a>
      </div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Avaliação de campo</h1>
          <p className="page-sub">Bateria Sub-12 · sessão iniciada há 14 min · 3 de 5 testes concluídos</p>
        </div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <span className="badge warn"><Icon.wifiOff/>offline · 2 pendentes</span>
          <button className="btn"><Icon.play/>Tutorial</button>
          <button className="btn primary"><Icon.check/>Finalizar bateria</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'320px 1fr 380px', gap:16, alignItems:'flex-start'}}>
        {/* Queue */}
        <div className="card">
          <div className="card-head"><div className="card-title">Fila da sessão</div><span className="badge plain">5 testes</span></div>
          <div className="card-body" style={{padding:0}}>
            {tests.map(([k,l,sub], i) => {
              const done = i < 2;
              const active = k === test;
              return (
                <div key={k} onClick={()=>setTest(k)} style={{padding:'12px 14px', borderBottom:'1px solid var(--border)', cursor:'pointer',
                  background:active?'var(--brand-soft)':'transparent', borderLeft:active?'3px solid var(--brand)':'3px solid transparent'}}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <div className="avatar xs" style={{background:done?'var(--ok)':active?'var(--brand)':'var(--bg-sunken)', color:'#fff', borderColor:'transparent'}}>{done?'✓':i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:500, fontSize:13, color:active?'var(--brand-fg)':'var(--fg)'}}>{l}</div>
                      <div className="mono" style={{fontSize:10.5, color:'var(--fg-muted)'}}>{sub} · {done?'ok':active?'em curso':'pendente'}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live capture */}
        <div className="card">
          <div className="card-head">
            <div><div className="card-title">Sprint 20m</div><div className="card-sub">2 tentativas · melhor tempo é registrado · cones a 0m / 10m / 20m</div></div>
            <span className="badge brand"><span className="dot"/>gravando</span>
          </div>
          <div className="card-body">
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16}}>
              {[[1,3.48,'válida'], [2,null,'em curso']].map(([n,t,s])=>(
                <div key={n} style={{padding:16, border:'1px solid var(--border)', borderRadius:8, background: t===null?'#fff':'var(--bg-muted)'}}>
                  <div style={{fontSize:11, color:'var(--fg-muted)'}}>TENTATIVA {n}</div>
                  <div className="mono" style={{fontSize:34, fontWeight:500, letterSpacing:'-0.02em'}}>{t?t.toFixed(2):'—,—'}<span style={{fontSize:16, color:'var(--fg-muted)'}}>s</span></div>
                  <div style={{fontSize:11, color:t===null?'var(--brand)':'var(--ok)'}}>{t===null?'● aguardando início':'✓ '+s}</div>
                </div>
              ))}
            </div>

            <div style={{textAlign:'center', padding:'24px 0', background:'var(--bg-sunken)', borderRadius:8, marginBottom:16}}>
              <div className="mono" style={{fontSize:64, fontWeight:500, letterSpacing:'-0.03em', color:'var(--brand)'}}>3.22</div>
              <div style={{fontSize:11, color:'var(--fg-muted)', textTransform:'uppercase', letterSpacing:'.1em'}}>cronômetro · toque p/ parar</div>
            </div>

            <div style={{display:'flex', gap:8}}>
              <button className="btn" style={{flex:1, justifyContent:'center'}}>⟲ Descartar</button>
              <button className="btn" style={{flex:1, justifyContent:'center'}}>⏸ Pausar</button>
              <button className="btn primary" style={{flex:2, justifyContent:'center'}}><Icon.check/>Validar tempo</button>
            </div>

            <div className="note" style={{marginTop:14, fontSize:12}}>
              <b>Referência Sub-12:</b> mediana interna 3,58s · melhor do atleta (últ. 90d) 3,41s · p75 categoria 3,30s.
            </div>
          </div>
        </div>

        {/* Context */}
        <aside style={{display:'flex', flexDirection:'column', gap:12}}>
          <div className="card">
            <div className="card-body" style={{display:'flex', gap:12, alignItems:'center', padding:14}}>
              <div className="avatar">{a.ini}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:500}}>{a.name}</div>
                <div className="mono" style={{fontSize:11, color:'var(--fg-muted)'}}>{a.cat} · {a.pos} · {a.age}</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">Condições da sessão</div></div>
            <div className="card-body">
              <div className="kv" style={{rowGap:8}}>
                <span className="k">Local</span><span>Campo B · grama sintética</span>
                <span className="k">Temp.</span><span className="mono">22°C · vento 6 km/h</span>
                <span className="k">Superfície</span><span>seca</span>
                <span className="k">Calçado</span><span>society</span>
                <span className="k">Cronometria</span><span>Brower · célula fotoelétrica</span>
                <span className="k">Prof. aplicador</span><span>Rafael D.</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">Histórico · Sprint 20m</div></div>
            <div className="card-body" style={{padding:'12px 14px'}}>
              <svg viewBox="0 0 280 120" width="100%" height="120" style={{overflow:'visible'}}>
                <defs>
                  <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--brand)" stopOpacity=".22"/>
                    <stop offset="1" stopColor="var(--brand)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <line x1="0" x2="280" y1="40" y2="40" stroke="var(--border)" strokeDasharray="2 3"/>
                <line x1="0" x2="280" y1="80" y2="80" stroke="var(--border)" strokeDasharray="2 3"/>
                <path d="M0,70 L56,58 L112,62 L168,48 L224,40 L280,30" stroke="var(--brand)" strokeWidth="2" fill="none"/>
                <path d="M0,70 L56,58 L112,62 L168,48 L224,40 L280,30 L280,120 L0,120 Z" fill="url(#g)"/>
                {[[0,70],[56,58],[112,62],[168,48],[224,40],[280,30]].map(([x,y],i)=>(
                  <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke="var(--brand)" strokeWidth="2"/>
                ))}
              </svg>
              <div className="mono" style={{display:'flex', justifyContent:'space-between', fontSize:10, color:'var(--fg-subtle)', marginTop:4}}>
                <span>out/25</span><span>dez</span><span>fev/26</span><span>abr</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Anthro ------------------------------------- */
function PageAnthro({ id, go }) {
  const a = findAthlete(id);
  return (
    <div className="page">
      <div style={{fontSize:11.5, color:'var(--fg-muted)', marginBottom:8}}>
        <a onClick={()=>go({name:'athlete', id:a.id})} style={{cursor:'pointer'}}>‹ voltar para {a.name}</a>
      </div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Antropometria</h1>
          <p className="page-sub">Reavaliar a cada 90 dias · última coleta há 28d · Método Mirwald (PHV)</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn">Histórico</button>
          <button className="btn primary"><Icon.check/>Salvar coleta</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 380px', gap:16}}>
        <div className="card">
          <div className="card-head"><div className="card-title">Nova coleta · {new Date().toLocaleDateString('pt-BR')}</div><span className="badge plain">Coletor: Camila R.</span></div>
          <div className="card-body">
            <div className="row row-3">
              <div><label className="form-label req">Altura (cm)</label><div className="input mono"><input defaultValue="152.4"/></div><div style={{fontSize:10.5, color:'var(--fg-subtle)', marginTop:4}}>anterior: 148,4 · Δ +4,0</div></div>
              <div><label className="form-label req">Peso (kg)</label><div className="input mono"><input defaultValue="42.8"/></div><div style={{fontSize:10.5, color:'var(--fg-subtle)', marginTop:4}}>anterior: 40,7 · Δ +2,1</div></div>
              <div><label className="form-label">Envergadura (cm)</label><div className="input mono"><input defaultValue="150.1"/></div></div>
            </div>
            <div className="row row-3">
              <div><label className="form-label">Altura sentado (cm)</label><div className="input mono"><input defaultValue="78.2"/></div></div>
              <div><label className="form-label">Comp. membros inf. (cm)</label><div className="input mono" style={{background:'var(--bg-muted)'}}><span>74,2</span><span style={{marginLeft:'auto', fontSize:10, color:'var(--fg-subtle)'}}>auto</span></div></div>
              <div><label className="form-label">IMC (kg/m²)</label><div className="input mono" style={{background:'var(--bg-muted)'}}><span>18,4</span><span style={{marginLeft:'auto', fontSize:10, color:'var(--fg-subtle)'}}>auto</span></div></div>
            </div>

            <div style={{padding:'14px 0 8px', borderTop:'1px solid var(--border)', marginTop:8, fontSize:11.5, color:'var(--fg-muted)', textTransform:'uppercase', letterSpacing:'.08em'}}>Dobras cutâneas</div>
            <div className="row row-3">
              {[['Tríceps','10,2'],['Subescapular','8,4'],['Supra-ilíaca','9,1']].map(([l,v])=>(
                <div key={l}><label className="form-label">{l} (mm)</label><div className="input mono"><input defaultValue={v}/></div></div>
              ))}
            </div>
            <div className="row row-3">
              {[['Panturrilha','9,8'],['Abdominal','11,0'],['Coxa','13,5']].map(([l,v])=>(
                <div key={l}><label className="form-label">{l} (mm)</label><div className="input mono"><input defaultValue={v}/></div></div>
              ))}
            </div>

            <div style={{padding:'14px 0 8px', borderTop:'1px solid var(--border)', marginTop:8, fontSize:11.5, color:'var(--fg-muted)', textTransform:'uppercase', letterSpacing:'.08em'}}>Notas do coletor</div>
            <div className="input" style={{height:'auto', padding:10}}><textarea rows="2" defaultValue="Hidratação adequada. Coleta 1h pós-refeição leve." style={{width:'100%'}}/></div>
          </div>
        </div>

        <aside style={{display:'flex', flexDirection:'column', gap:12}}>
          <div className="card" style={{background:'var(--brand-soft)', border:'1px solid var(--brand-border)'}}>
            <div className="card-body">
              <div style={{fontSize:10.5, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--brand-fg)'}}>PHV — Maturação</div>
              <div className="mono" style={{fontSize:36, fontWeight:500, color:'var(--brand-fg)', marginTop:4, letterSpacing:'-0.02em'}}>−0,8 <span style={{fontSize:14}}>anos</span></div>
              <div style={{fontSize:12, color:'var(--brand-fg)', marginTop:4}}>pré-pico · ajustar cargas e proteger joelhos</div>
              <div style={{marginTop:12, position:'relative', height:28}}>
                <div style={{position:'absolute', left:0, right:0, top:13, height:2, background:'var(--brand-border)'}}/>
                {[-3,-2,-1,0,1,2,3].map(v=>(
                  <div key={v} style={{position:'absolute', left:`${(v+3)/6*100}%`, top:8, width:1, height:12, background:'var(--brand-border)'}}/>
                ))}
                <div style={{position:'absolute', left:`${(-0.8+3)/6*100}%`, top:2, transform:'translateX(-50%)'}}>
                  <div style={{width:18, height:18, background:'var(--brand)', borderRadius:'50%', border:'3px solid #fff', boxShadow:'var(--sh)'}}/>
                </div>
                <div className="mono" style={{position:'absolute', top:20, left:0, right:0, display:'flex', justifyContent:'space-between', fontSize:9, color:'var(--brand-fg)', opacity:.7}}>
                  <span>−3</span><span>−2</span><span>−1</span><span>0</span><span>+1</span><span>+2</span><span>+3</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">% Gordura (derivado)</div></div>
            <div className="card-body">
              <div className="mono" style={{fontSize:24, fontWeight:500}}>13,6%</div>
              <div style={{fontSize:11.5, color:'var(--fg-muted)'}}>Slaughter (jovem) · intervalo saudável 12–18%</div>
              <div className="bar brand" style={{marginTop:10}}><i style={{width:'44%'}}/></div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">Velocidade de crescimento</div></div>
            <div className="card-body">
              <div className="mono" style={{fontSize:24, fontWeight:500}}>8,0 <span style={{fontSize:12, color:'var(--fg-muted)'}}>cm/ano</span></div>
              <div style={{fontSize:11.5, color:'var(--warn)'}}>alerta · pico próximo · monitorar dores de crescimento</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Evolution ---------------------------------- */
function RadarChart() {
  const axes = ['Velocidade','Agilidade','Potência','Resistência','Técnico','Tático','Mental','Disciplina'];
  const cur = [82, 76, 68, 70, 78, 72, 80, 88];
  const prev = [68, 60, 58, 64, 70, 66, 74, 84];
  const cx=140, cy=140, r=110;
  const point = (val, i) => {
    const ang = (Math.PI*2*i/axes.length) - Math.PI/2;
    const rr = (val/100)*r;
    return [cx + Math.cos(ang)*rr, cy + Math.sin(ang)*rr];
  };
  const poly = vals => vals.map((v,i)=>point(v,i).join(',')).join(' ');
  return (
    <svg viewBox="0 0 280 280" width="100%" style={{maxWidth:360}}>
      {[20,40,60,80,100].map(pct => (
        <polygon key={pct} points={axes.map((_,i)=>point(pct,i).join(',')).join(' ')} fill="none" stroke="var(--border)" strokeDasharray="2 3"/>
      ))}
      {axes.map((_,i)=>{ const [x,y]=point(100,i); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)"/>;})}
      <polygon points={poly(prev)} fill="rgba(107,107,102,.12)" stroke="var(--fg-muted)" strokeWidth="1.5" strokeDasharray="4 3"/>
      <polygon points={poly(cur)}  fill="rgba(224,31,38,.18)" stroke="var(--brand)" strokeWidth="2"/>
      {axes.map((a,i) => { const [x,y]=point(118,i); return <text key={i} x={x} y={y} fontSize="10.5" textAnchor="middle" dominantBaseline="middle" fill="var(--fg-muted)">{a}</text>;})}
      {cur.map((v,i)=>{ const [x,y]=point(v,i); return <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" stroke="var(--brand)" strokeWidth="2"/>;})}
    </svg>
  );
}

function PageEvolution({ id, go }) {
  const a = findAthlete(id);
  return (
    <div className="page">
      <div style={{fontSize:11.5, color:'var(--fg-muted)', marginBottom:8}}>
        <a onClick={()=>go({name:'athlete', id:a.id})} style={{cursor:'pointer'}}>‹ voltar para {a.name}</a>
      </div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Evolução · {a.name}</h1>
          <p className="page-sub">Comparativo 12m com percentil interno da categoria {a.cat}</p>
        </div>
        <div className="segmented">
          {['3m','6m','12m','24m','tudo'].map((p,i)=><button key={p} className={'seg'+(i===2?' active':'')}>{p}</button>)}
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16}}>
        <div className="card">
          <div className="card-head"><div className="card-title">Perfil de competências</div><div className="card-sub">0–100 · normalizado na categoria</div></div>
          <div className="card-body radar-wrap">
            <RadarChart/>
            <div className="radar-legend">
              <span><span className="sw" style={{background:'var(--brand)'}}/>atual</span>
              <span><span className="sw" style={{background:'var(--fg-muted)'}}/>há 12 meses</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><div className="card-title">Altura e peso · 12 meses</div></div>
          <div className="card-body">
            <svg viewBox="0 0 360 180" width="100%">
              {[30,70,110,150].map(y=><line key={y} x1="30" x2="350" y1={y} y2={y} stroke="var(--border)" strokeDasharray="2 3"/>)}
              <path d="M30,140 L80,132 L130,126 L180,118 L230,108 L280,98 L330,88" stroke="var(--brand)" strokeWidth="2" fill="none"/>
              <path d="M30,150 L80,146 L130,142 L180,138 L230,130 L280,124 L330,118" stroke="#5c6b7a" strokeWidth="2" fill="none" strokeDasharray="5 3"/>
              {[[30,140],[80,132],[130,126],[180,118],[230,108],[280,98],[330,88]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke="var(--brand)" strokeWidth="2"/>)}
            </svg>
            <div className="radar-legend" style={{justifyContent:'center', marginTop:4}}>
              <span><span className="sw" style={{background:'var(--brand)'}}/>altura (cm)</span>
              <span><span className="sw" style={{background:'#5c6b7a'}}/>peso (kg)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><div className="card-title">Testes físicos — percentil interno Sub-12 (n=22)</div></div>
        <div className="card-body" style={{padding:0}}>
          <table className="tbl">
            <thead><tr><th>Teste</th><th>Há 12m</th><th>Há 6m</th><th>Há 3m</th><th>Atual</th><th>Δ 12m</th><th style={{width:200}}>Percentil interno</th></tr></thead>
            <tbody>
              {[
                ['Sprint 20m (s)','3.72','3.58','3.48','3.41','−0,31','82'],
                ['Sprint 10m (s)','2.08','2.01','1.94','1.88','−0,20','78'],
                ['CMJ (cm)','22,1','25,4','27,2','28,4','+6,3','68'],
                ['Agilidade Illinois (s)','18,9','18,2','17,6','17,2','−1,7','76'],
                ['Yo-Yo IR1 (m)','420','560','680','820','+400','70'],
                ['Chute (km/h)','72','76','79','82','+10','74'],
              ].map((r,i)=>(
                <tr key={i} style={{cursor:'default'}}>
                  <td style={{fontWeight:500}}>{r[0]}</td>
                  <td className="mono" style={{color:'var(--fg-muted)'}}>{r[1]}</td>
                  <td className="mono" style={{color:'var(--fg-muted)'}}>{r[2]}</td>
                  <td className="mono" style={{color:'var(--fg-muted)'}}>{r[3]}</td>
                  <td className="mono" style={{fontWeight:500}}>{r[4]}</td>
                  <td className="mono" style={{color: r[5].startsWith('−') && r[0].includes('s') ? 'var(--ok)' : r[5].startsWith('+') && !r[0].includes('s') ? 'var(--ok)' : 'var(--fg-muted)'}}>{r[5]}</td>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <div className="bar brand" style={{flex:1}}><i style={{width:r[6]+'%'}}/></div>
                      <span className="mono" style={{fontSize:11, width:28}}>p{r[6]}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PageAthleteEval, PageAnthro, PageEvolution });
