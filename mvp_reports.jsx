/* ============================================================
   Relatório pais + Dossiê Inter
   ============================================================ */

function PageReportParent({ go }) {
  const [mode, setMode] = React.useState('preview');
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Relatório trimestral — pais</h1>
          <p className="page-sub">Felipe De David Fonseca · Sub-11 · trimestre jan–mar/2026 · envio via WhatsApp para Pai do Felipe</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <div className="segmented">
            <button className={'seg'+(mode==='preview'?' active':'')} onClick={()=>setMode('preview')}>Preview PDF</button>
            <button className={'seg'+(mode==='edit'?' active':'')} onClick={()=>setMode('edit')}>Editar seções</button>
          </div>
          <button className="btn"><Icon.download/>PDF</button>
          <button className="btn primary"><Icon.send/>Enviar no WhatsApp</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:20, alignItems:'flex-start'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
          {/* page 1 */}
          <div className="pdf-page">
            <div className="pdf-head">
              <span>Escola do Inter · Rio Grande/RS</span>
              <span>jan–mar/2026 · pág 1/2</span>
            </div>
            <div style={{display:'flex', gap:10, alignItems:'center', paddingBottom:10, borderBottom:'2px solid var(--brand)'}}>
              <div style={{width:36, height:36, background:'var(--brand)', borderRadius:4, overflow:'hidden'}}>
                <img src="assets/logo-escola-inter-bg.png" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
              </div>
              <div>
                <div style={{fontSize:14, fontWeight:600}}>Relatório do trimestre</div>
                <div style={{fontSize:9, color:'var(--fg-muted)'}}>jan · fev · mar — 2026</div>
              </div>
              <div style={{marginLeft:'auto'}} className="pdf-ribbon">Sub-11</div>
            </div>

            <div style={{display:'flex', gap:10, padding:'8px 0'}}>
              <div style={{width:52, height:52, background:'var(--brand-soft)', borderRadius:4, display:'grid', placeItems:'center', fontWeight:600, color:'var(--brand-fg)'}}>FF</div>
              <div>
                <div style={{fontSize:13, fontWeight:600}}>Felipe De David Fonseca</div>
                <div style={{fontSize:9, color:'var(--fg-muted)'}}>10a 3m · atacante · ambidestro · Prof. Camila</div>
                <div style={{fontSize:9, color:'var(--fg-muted)'}}>matrícula 171273 · na escolinha há 1a 8m</div>
              </div>
            </div>

            <div style={{fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--brand)', marginTop:4}}>Mensagem do professor</div>
            <div style={{fontSize:10.5, lineHeight:1.55, color:'var(--fg)', textAlign:'justify'}}>
              Felipe teve um trimestre de muita evolução técnica. Ganhou segurança no 1v1 e melhorou a leitura para o passe decisivo. No físico, reduziu o tempo de 20m em 0,12s, mostrando efeito direto do trabalho de coordenação. Seguimos atentos ao momento de crescimento — ele está próximo do pico e precisa de cuidado com cargas.
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:6}}>
              {[['95%','Frequência'],['+4,0 cm','Altura (3m)'],['3,41 s','Sprint 20m'],['p82','Percentil cat.']].map(([v,l],i)=>(
                <div key={i} style={{border:'1px solid var(--border)', padding:'6px 8px', borderRadius:3}}>
                  <div style={{fontSize:14, fontWeight:600, color:'var(--brand)'}}>{v}</div>
                  <div style={{fontSize:8.5, color:'var(--fg-muted)', textTransform:'uppercase'}}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--brand)', marginTop:6}}>Evolução técnica</div>
            <svg viewBox="0 0 280 70" width="100%" height="70">
              {[[15,56],[60,52],[105,46],[150,40],[195,32],[240,26]].map(([x,y],i,a)=>{
                const n = a[i+1];
                return n && <line key={i} x1={x} y1={y} x2={n[0]} y2={n[1]} stroke="var(--brand)" strokeWidth="1.5"/>;
              })}
              {[[15,56,'out'],[60,52,'nov'],[105,46,'dez'],[150,40,'jan'],[195,32,'fev'],[240,26,'mar']].map(([x,y,l],i)=>(
                <g key={i}><circle cx={x} cy={y} r="2.5" fill="#fff" stroke="var(--brand)" strokeWidth="1.5"/><text x={x} y="68" textAnchor="middle" fontSize="7" fill="var(--fg-muted)">{l}</text></g>
              ))}
            </svg>
          </div>

          {/* page 2 */}
          <div className="pdf-page">
            <div className="pdf-head"><span>Escola do Inter · Rio Grande/RS</span><span>jan–mar/2026 · pág 2/2</span></div>

            <div style={{fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--brand)'}}>Pontos fortes</div>
            <ul style={{fontSize:10.5, margin:'2px 0 0 14px', padding:0, lineHeight:1.55}}>
              <li>Finalização com precisão na área</li>
              <li>Boa leitura tática em transições</li>
              <li>Atitude exemplar em dias ruins</li>
            </ul>

            <div style={{fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--brand)', marginTop:8}}>Pontos a desenvolver</div>
            <ul style={{fontSize:10.5, margin:'2px 0 0 14px', padding:0, lineHeight:1.55}}>
              <li>Reforço de perna não-dominante (canhota)</li>
              <li>Condicionamento aeróbico — Yo-Yo</li>
            </ul>

            <div style={{fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--brand)', marginTop:8}}>Frequência</div>
            <div style={{display:'flex', gap:2, marginTop:4}}>
              {Array.from({length:36}).map((_,i)=>(
                <div key={i} style={{flex:1, height:14, borderRadius:1, background: [5,12,19,28].includes(i)?'var(--border)':'var(--brand)', opacity:[5,12,19,28].includes(i)?1:.85}}/>
              ))}
            </div>
            <div style={{fontSize:8.5, color:'var(--fg-muted)', display:'flex', justifyContent:'space-between', marginTop:3}}>
              <span>36 sessões · 34 presenças · 2 ausências justificadas</span><span>95%</span>
            </div>

            <div style={{fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--brand)', marginTop:8}}>Objetivos para o próximo trimestre</div>
            <ol style={{fontSize:10.5, margin:'2px 0 0 14px', padding:0, lineHeight:1.55}}>
              <li>Reduzir sprint 20m para ≤ 3,35s</li>
              <li>Ampliar acertos de perna não-dominante para ≥ 40%</li>
              <li>Participar da seletiva interna de abril</li>
            </ol>

            <div style={{marginTop:'auto', padding:'8px 0 0', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', fontSize:8, color:'var(--fg-muted)'}}>
              <span>Documento gerado em 18/04/2026 · Prof. Rafael D.</span>
              <span>escoladointer-rg.com.br · (53) 3232-0000</span>
            </div>
          </div>
        </div>

        <aside style={{display:'flex', flexDirection:'column', gap:12}}>
          <div className="card">
            <div className="card-head"><div className="card-title">Conteúdo</div></div>
            <div className="card-body" style={{fontSize:12.5}}>
              {['Capa + dados','Mensagem do professor','Destaques (números)','Evolução técnica','Pontos fortes','A desenvolver','Frequência','Objetivos'].map((l,i)=>(
                <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'6px 0', borderTop:i>0?'1px solid var(--border)':'0'}}>
                  <span><span className="chk on"/>{l}</span>
                  <Icon.edit/>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">Envio</div></div>
            <div className="card-body">
              <div className="kv" style={{fontSize:12, rowGap:8}}>
                <span className="k">Canal</span><span>WhatsApp</span>
                <span className="k">Para</span><span>Pai do Felipe</span>
                <span className="k">Número</span><span className="mono">(53) 9 9969-6774</span>
                <span className="k">Consent.</span><span className="badge ok"><span className="dot"/>ok</span>
              </div>
              <div className="note ok" style={{marginTop:12, fontSize:11.5}}>
                Última entrega de relatório para este responsável: 12/jan/2026 · lido em 14/jan.
              </div>
            </div>
          </div>
          <div className="note warn" style={{fontSize:11.5}}>
            <b>Revisão pedagógica:</b> aguarda aprovação do Prof. Rafa antes do envio em lote para a turma.
          </div>
        </aside>
      </div>
    </div>
  );
}

/* --------------- Dossiê Inter -------------------------------- */
function PageDossier({ go }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Dossiê técnico — Internacional</h1>
          <p className="page-sub">Exportação padronizada para envio à base do SC Internacional · Felipe De David Fonseca · Sub-11</p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn">Preview PDF</button>
          <button className="btn"><Icon.download/>Baixar .zip</button>
          <button className="btn primary"><Icon.send/>Enviar via área Inter</button>
        </div>
      </div>

      <div className="note" style={{marginBottom:16}}>
        <b>Proteção de dados:</b> este dossiê inclui dados pessoais, de saúde e imagem. O consentimento específico "Exportação para clubes parceiros" é obrigatório e será registrado na trilha de auditoria.
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 380px', gap:16}}>
        <div className="card">
          <div className="card-head">
            <div><div className="card-title">Seções do dossiê</div><div className="card-sub">Formato padrão Inter · 8 blocos · ~14 páginas</div></div>
            <span className="badge plain">template v2.1</span>
          </div>
          <div className="card-body" style={{padding:0}}>
            {[
              ['01','Identificação & documentação','RG, CPF, endereço, CBF passport ID','ok','3 docs anexos'],
              ['02','Histórico esportivo','escolinhas, tempo de prática, posições','ok','desde 2022'],
              ['03','Antropometria & maturação','altura, peso, PHV, projeção adulta','ok','última 6d'],
              ['04','Testes físicos','sprint, salto, agilidade, yoyo · 12m','ok','bateria completa'],
              ['05','Avaliação técnica','notas 1–10 em 14 fundamentos','ok','prof. Léo'],
              ['06','Avaliação tática','leitura de jogo, posicionamento','warn','rever nota tática'],
              ['07','Vídeos em jogo','4 clipes tagueados · YouTube privado','ok','4 clipes · 3m18s'],
              ['08','Perfil psicossocial','resiliência, liderança, frequência','ok','questionário ago/25'],
            ].map(([n,t,d,s,meta],i)=>(
              <div key={i} style={{display:'flex', gap:14, padding:'14px 18px', borderBottom:'1px solid var(--border)', alignItems:'center'}}>
                <div className="mono" style={{width:26, color:'var(--fg-subtle)', fontSize:11}}>{n}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500, fontSize:13}}>{t}</div>
                  <div style={{fontSize:11.5, color:'var(--fg-muted)'}}>{d}</div>
                </div>
                <div className="mono" style={{fontSize:10.5, color:'var(--fg-subtle)', textAlign:'right', width:110}}>{meta}</div>
                <span className={'badge '+s}><span className="dot"/>{s==='ok'?'ok':'revisar'}</span>
                <button className="btn ghost sm"><Icon.edit/></button>
              </div>
            ))}
          </div>
        </div>

        <aside style={{display:'flex', flexDirection:'column', gap:12}}>
          <div className="card" style={{borderColor:'var(--brand-border)', background:'linear-gradient(180deg, var(--brand-soft), #fff)'}}>
            <div className="card-body" style={{textAlign:'center', padding:18}}>
              <div style={{width:64, height:64, margin:'0 auto 10px', background:'var(--brand)', borderRadius:12, overflow:'hidden'}}>
                <img src="assets/logo-escola-inter-bg.png" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
              </div>
              <div style={{fontSize:14, fontWeight:600, color:'var(--brand-fg)'}}>SC Internacional</div>
              <div style={{fontSize:11.5, color:'var(--brand-fg)', opacity:.8}}>Departamento de Base · Canal Escola do Inter</div>
              <button className="btn primary" style={{marginTop:14, width:'100%', justifyContent:'center'}}><Icon.send/>Enviar dossiê</button>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><div className="card-title">Consentimentos</div></div>
            <div className="card-body" style={{fontSize:12}}>
              {[['Uso de imagem','ok'],['Dados de saúde','ok'],['Exportação para clubes parceiros','warn'],['Publicação em redes (Inter)','ok']].map(([l,s],i)=>(
                <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'6px 0', borderTop:i>0?'1px solid var(--border)':'0'}}>
                  <span>{l}</span><span className={'badge '+s}><span className="dot"/>{s==='ok'?'concedido':'pendente'}</span>
                </div>
              ))}
              <button className="btn sm" style={{marginTop:10, width:'100%', justifyContent:'center'}}><Icon.qr/>Enviar termo p/ responsável</button>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><div className="card-title">Trilha de auditoria</div></div>
            <div className="card-body" style={{fontSize:11.5, color:'var(--fg-muted)', display:'flex', flexDirection:'column', gap:6}}>
              <div className="mono">18/04 14:22 · dossiê gerado · R. Damin</div>
              <div className="mono">16/04 10:05 · avaliação técnica registrada</div>
              <div className="mono">12/04 18:30 · termo imagem renovado</div>
              <div className="mono">08/04 09:12 · bateria física aplicada</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { PageReportParent, PageDossier });
