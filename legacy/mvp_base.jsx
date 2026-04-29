/* ============================================================
   Primitives + seed data compartilhados
   ============================================================ */

// Icons (lucide-style inline SVGs) -----------------------------
const Icon = {
  home:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z"/></svg>,
  users:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.5 3.3-5.5 6.5-5.5S15 16.5 15.6 20"/><circle cx="17" cy="8" r="2.5"/><path d="M22 18.5c-.3-2-1.8-3.3-3.8-3.7"/></svg>,
  plus:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>,
  search:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  clip:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="7" y="4" width="10" height="16" rx="2"/><path d="M10 4V3h4v1M9 10h6M9 14h6M9 18h4"/></svg>,
  chart:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 20V4M3 20h18M7 16l4-5 3 3 5-7"/></svg>,
  video:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></svg>,
  heart:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20s-7-4.5-7-11a4 4 0 0 1 7-2.5A4 4 0 0 1 19 9c0 6.5-7 11-7 11z"/></svg>,
  doc:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>,
  shield:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3 4 6v6c0 4.5 3.2 8.2 8 9 4.8-.8 8-4.5 8-9V6l-8-3z"/></svg>,
  settings:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a7.97 7.97 0 0 0 0-6l2-1.2-2-3.4-2.3.8a8 8 0 0 0-5.1-3L11 0h-4l-.8 2.2a8 8 0 0 0-5.2 3L-1 4.4l-2 3.4L-1 9a8 8 0 0 0 0 6l-2 1.2 2 3.4 2.3-.8a8 8 0 0 0 5.1 3L7 24h4l.8-2.2a8 8 0 0 0 5.2-3l2.3.8 2-3.4L19.4 15z"/></svg>,
  bolt:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>,
  grid:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>,
  cal:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>,
  play:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 4v16l14-8z"/></svg>,
  check:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m5 12 5 5L20 7"/></svg>,
  chevron:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m9 6 6 6-6 6"/></svg>,
  arrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  download:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 4v12m0 0 5-5m-5 5-5-5M4 20h16"/></svg>,
  send:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m4 20 17-8L4 4l3 8-3 8zM7 12h14"/></svg>,
  filter:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 5h18l-7 9v6l-4-2v-4L3 5z"/></svg>,
  dots:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="5" cy="12" r=".5"/><circle cx="12" cy="12" r=".5"/><circle cx="19" cy="12" r=".5"/></svg>,
  clock:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  wifi:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12a10 10 0 0 1 14 0M8 15a6 6 0 0 1 8 0M12 19v.01"/></svg>,
  wifiOff:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 3 18 18M5 12a10 10 0 0 1 3-2.5M19 12a10 10 0 0 0-4-2.7M8 15a6 6 0 0 1 3-1.5M16 15a6 6 0 0 0-1-.8M12 19v.01"/></svg>,
  camera:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>,
  lock:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>,
  eye:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>,
  flag:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V4m0 0h13l-2 5 2 5H4"/></svg>,
  star:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 3 2.9 6 6.6.9-4.8 4.7 1.2 6.6L12 18l-5.9 3.2 1.2-6.6L2.5 9.9 9.1 9z"/></svg>,
  med:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 4h6v4h4v6h-4v4H9v-4H5V8h4z"/></svg>,
  alert:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 3 10 18H2z"/><path d="M12 10v5M12 18v.01"/></svg>,
  link:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 14a4 4 0 0 1 0-6l2-2a4 4 0 0 1 6 6l-1.5 1.5M14 10a4 4 0 0 1 0 6l-2 2a4 4 0 0 1-6-6l1.5-1.5"/></svg>,
  tag:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 12 9-9h7v7l-9 9z"/><circle cx="15" cy="9" r="1.3"/></svg>,
  user:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4.5 4-7 8-7s7.2 2.5 8 7"/></svg>,
  building:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h2M9 12h2M9 16h2M13 8h2M13 12h2M13 16h2"/></svg>,
  pct:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 18 12-12"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/></svg>,
  file:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z"/><path d="M14 3v6h6"/></svg>,
  cloud:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 18a4 4 0 0 1-.5-8 5 5 0 0 1 9.5-1 4 4 0 0 1 1 7.9M12 12v8m0-8-3 3m3-3 3 3"/></svg>,
  upload:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20V8m0 0 5 5m-5-5-5 5M4 4h16"/></svg>,
  qr:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M20 14v3M14 20h3v1M20 17v4"/></svg>,
  export:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3v12m0-12 5 5m-5-5-5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></svg>,
  edit:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 20h4L20 8l-4-4L4 16v4zM14 6l4 4"/></svg>,
  trash:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></svg>,
  phone:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>,
  mail:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>,
  signal:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 18h2v3H4zM9 14h2v7H9zM14 10h2v11h-2zM19 5h2v16h-2z"/></svg>,
  bat:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/><rect x="4" y="9" width="10" height="6" fill="currentColor"/></svg>,
};

// Seed data -----------------------------------------------------
// Único atleta cadastrado no prototipo: Felipe De David Fonseca · matrícula 171273
const ATHLETES = [
  {
    id:'a1', ini:'FF',
    name:'Felipe De David Fonseca',
    matricula:'171273',
    cat:'Sub-11',
    pos:'Atacante',
    foot:'Ambidestro',
    coach:'Prof. Camila Reis',
    birth:'20/01/2016',
    age:'10a 3m',
    since:'1a 8m',
    lastEval:'há 18 dias',
    nextWin:'em 72 dias',
    freq:91,
    status:'ok',
    origin:'Mídias sociais',
    height:149.0,
    weight:40.0,
    sprint20:3.62,
    cmj:24.6,
    phv:-1.6,
    bf:13.8,
    school:'Bom Jesus',
    schoolType:'Particular',
    highlight:true,
    cpf:'050.249.390-93',
    rg:'—',
    cellphone:'(53) 9 9969-6774',
    email:'—',
    address:'Ana Pernigotti, nº 1061',
    neighborhood:'Cassino',
    city:'Rio Grande',
    state:'RS',
    zip:'96207-010',
    complement:'Rua H88 Bolaxa',
    sex:'Masculino',
    favoriteTeam:'Internacional',
    favoritePlayer:"D'Alessandro",
    idol:'Cristiano Ronaldo',
    nivelTecnico:'Intermediário II',
    secondaryPositions:['Ponta direita','Meia ofensivo'],
    attributes:[
      { label:'Velocidade', level:3 },
      { label:'Drible',     level:2 },
      { label:'Cabeceio',   level:2 },
      { label:'Passe',      level:2 },
    ],
    lastUpdate:'01/04/2026 14:07',
  },
];

const findAthlete = (id) => ATHLETES.find(a => a.id === id) || ATHLETES[0];

const CATEGORIES = ['Sub-5','Sub-7','Sub-9','Sub-10','Sub-11','Sub-12','Sub-13','Sub-14','Sub-15','Sub-16','Sub-17'];

// Avatar tints — uma cor para cada atleta (rotação determinística)
const AVATAR_TINTS = [
  ['#FFEDEE','#7A0F13'],  // brand soft / brand fg
  ['#E7F3EC','#1b5a37'],  // ok
  ['#FBF0DC','#7a4d0a'],  // warn
  ['#E8EEF5','#1f4670'],  // blue
  ['#F1ECF7','#4c2f7a'],  // violet
  ['#FDE9F0','#8a1e46'],  // pink
  ['#E8F1F1','#155c57'],  // teal
];
ATHLETES.forEach((a,i) => { a.tint = AVATAR_TINTS[i % AVATAR_TINTS.length]; });

// Equipe / professores
const STAFF = [
  { id:'u1', name:'Rafael Damin',     role:'Coordenador técnico', init:'RD', email:'rafael@escoladointer-rg.com.br', last:'há 2 min',  active:true  },
  { id:'u2', name:'Leonardo Ramos',   role:'Professor · Sub-14/15/16', init:'LR', email:'leo@escoladointer-rg.com.br',    last:'há 18 min', active:true  },
  { id:'u3', name:'Camila Reis',      role:'Professora · Sub-7/9/11',  init:'CR', email:'camila@escoladointer-rg.com.br', last:'há 1 h',    active:true  },
  { id:'u4', name:'Rafaela Pinheiro', role:'Professora · Sub-10/12/13',init:'RP', email:'rafa.p@escoladointer-rg.com.br', last:'há 3 h',    active:true  },
  { id:'u5', name:'Dra. Júlia Mota',  role:'Fisioterapeuta · parceira',init:'JM', email:'julia@clinicamota.com.br',        last:'ontem',     active:true  },
  { id:'u6', name:'Bruno Silveira',   role:'Administrativo',           init:'BS', email:'bruno@escoladointer-rg.com.br',   last:'há 4 dias', active:true  },
  { id:'u7', name:'Pai do Felipe',    role:'Responsável · portal pais',init:'PF', email:'responsavel@email.com',           last:'há 2 dias', active:true, portal:true },
];

// Turmas
const TEAMS = [
  { id:'t1', cat:'Sub-5',  n:8,  coach:'Camila Reis',      days:'seg/qua',    time:'17:00', field:'Campo A', age:'4–5a'  },
  { id:'t2', cat:'Sub-7',  n:12, coach:'Camila Reis',      days:'seg/qua',    time:'17:30', field:'Campo A', age:'6–7a'  },
  { id:'t3', cat:'Sub-9',  n:18, coach:'Camila Reis',      days:'seg/qua/sex',time:'18:00', field:'Campo B', age:'8–9a'  },
  { id:'t4', cat:'Sub-10', n:16, coach:'Rafaela Pinheiro', days:'ter/qui',    time:'17:30', field:'Campo A', age:'9–10a' },
  { id:'t5', cat:'Sub-11', n:14, coach:'Camila Reis',      days:'ter/qui',    time:'18:00', field:'Campo B', age:'10–11a'},
  { id:'t6', cat:'Sub-12', n:22, coach:'Rafaela Pinheiro', days:'qua/sex',    time:'18:30', field:'Campo B', age:'11–12a'},
  { id:'t7', cat:'Sub-13', n:18, coach:'Rafaela Pinheiro', days:'ter/qui',    time:'19:00', field:'Campo B', age:'12–13a'},
  { id:'t8', cat:'Sub-14', n:16, coach:'Leonardo Ramos',   days:'ter/qui',    time:'19:30', field:'Campo C', age:'13–14a'},
  { id:'t9', cat:'Sub-15', n:14, coach:'Leonardo Ramos',   days:'seg/qua/sex',time:'19:30', field:'Campo C', age:'14–15a'},
  { id:'t10',cat:'Sub-16', n:19, coach:'Leonardo Ramos',   days:'ter/qui/sáb',time:'20:00', field:'Campo C', age:'15–16a'},
  { id:'t11',cat:'Sub-17', n:11, coach:'Leonardo Ramos',   days:'ter/qui/sáb',time:'20:30', field:'Campo C', age:'16–17a'},
];

// Catálogo de testes (do brief)
const TEST_CATALOG = [
  { id:'tc1',  cat:'Físico',     name:'Sprint 10m',               unit:'s',   ages:'Sub-7+',  desc:'Velocidade · célula fotoelétrica ou app', ref:'mediana Sub-10: 2,10s' },
  { id:'tc2',  cat:'Físico',     name:'Sprint 20m',               unit:'s',   ages:'Sub-10+', desc:'Velocidade máxima · 2 tentativas',        ref:'mediana Sub-12: 3,58s' },
  { id:'tc3',  cat:'Físico',     name:'Salto vertical (CMJ)',     unit:'cm',  ages:'Sub-9+',  desc:'Potência · melhor de 3',                  ref:'Sub-12 p50 = 24cm'    },
  { id:'tc4',  cat:'Físico',     name:'Salto horizontal',         unit:'cm',  ages:'Sub-5+',  desc:'Potência · melhor de 3',                  ref:''                     },
  { id:'tc5',  cat:'Físico',     name:'Illinois Agility',         unit:'s',   ages:'Sub-11+', desc:'Agilidade · circuito 10m x 5m',            ref:'Sub-12 p50 = 18,4s'   },
  { id:'tc6',  cat:'Físico',     name:'Yo-Yo IR1',                unit:'m',   ages:'Sub-13+', desc:'Resistência intermitente',                ref:'Sub-14 p50 = 1120m'   },
  { id:'tc7',  cat:'Físico',     name:'Beep test',                unit:'nív', ages:'Sub-9+',  desc:'Condicionamento aeróbico',                ref:'Sub-12 p50 = 7.3'     },
  { id:'tc8',  cat:'Físico',     name:'Flexibilidade sentar/alc.',unit:'cm',  ages:'Sub-7+',  desc:'Banco de Wells',                          ref:''                     },
  { id:'tc9',  cat:'Técnico',    name:'Condução em slalom',       unit:'s',   ages:'Sub-7+',  desc:'5 cones · ida e volta',                   ref:''                     },
  { id:'tc10', cat:'Técnico',    name:'Precisão de passe',        unit:'/10', ages:'Sub-7+',  desc:'10 passes alvo 8m · alvo 1x1m',            ref:''                     },
  { id:'tc11', cat:'Técnico',    name:'Chute · velocidade',       unit:'km/h',ages:'Sub-11+', desc:'Radar · bola parada',                     ref:''                     },
  { id:'tc12', cat:'Técnico',    name:'Finalização · acertos',    unit:'/8',  ages:'Sub-9+',  desc:'8 chutes · área dividida em 4',            ref:''                     },
  { id:'tc13', cat:'Técnico',    name:'Perna não-dominante',      unit:'%',   ages:'Sub-11+', desc:'% acertos com a perna menos usada',        ref:''                     },
  { id:'tc14', cat:'Tático',     name:'Leitura de jogo',          unit:'1–10',ages:'Sub-9+',  desc:'Observação em jogo reduzido',              ref:'rubrica interna'      },
  { id:'tc15', cat:'Tático',     name:'Posicionamento',           unit:'1–10',ages:'Sub-9+',  desc:'Avaliação em pequenos jogos',              ref:''                     },
  { id:'tc16', cat:'Psicológico',name:'Resiliência · erro',       unit:'1–5', ages:'Sub-7+',  desc:'Reação a erros no treino',                ref:''                     },
  { id:'tc17', cat:'Psicológico',name:'Foco em sessão',           unit:'1–5', ages:'Sub-7+',  desc:'Atenção sustentada',                      ref:''                     },
  { id:'tc18', cat:'Psicológico',name:'Liderança',                unit:'1–5', ages:'Sub-11+', desc:'Observada pelo professor',                ref:''                     },
];

Object.assign(window, { Icon, ATHLETES, findAthlete, CATEGORIES, STAFF, TEAMS, TEST_CATALOG });

// Avatar com cor + iniciais + foto opcional
function Avatar({ a, size, photoOnly }) {
  const cls = 'avatar' + (size ? ' '+size : '');
  const [photo, setPhoto] = React.useState(() => {
    try { return localStorage.getItem('photo_'+a.id); } catch(e){ return null; }
  });
  // Re-read if athlete changes
  React.useEffect(() => {
    try { setPhoto(localStorage.getItem('photo_'+a.id)); } catch(e){}
  }, [a.id]);
  if (photo) {
    return <div className={cls}><img src={photo} alt={a.name}/></div>;
  }
  const tint = a.tint || ['#f4f4f2','#6b6b66'];
  return (
    <div className={cls} style={{background: tint[0], color: tint[1], borderColor: tint[0]}}>
      {a.ini}
    </div>
  );
}
window.Avatar = Avatar;
