// Chigui World Cup: salas reales y autenticación con Supabase.
// Este archivo contiene exclusivamente la clave PUBLICABLE del proyecto.
(async()=>{
"use strict";
const PROJECT_URL="https://hsmdviobvrixmjgqadaj.supabase.co";
const PUBLIC_KEY="sb_publishable_YXyVtnPLfrgEfw_UlLnNSA_lGXP5i5H";
let sb=null,session=null,room=null,profile=null,loading=false,onlineError="",onlineTab="login",polling=null;
const escapeText=esc;
try {
 const lib=await import("https://esm.sh/@supabase/supabase-js@2.57.0");
 sb=lib.createClient(PROJECT_URL,PUBLIC_KEY,{auth:{persistSession:true,autoRefreshToken:true}});
 const {data}=await sb.auth.getSession();session=data.session;
 sb.auth.onAuthStateChange((_event,newSession)=>{session=newSession;setTimeout(()=>refreshOnline(),0);});
 if(session)await refreshOnline(false);
} catch(e){onlineError="No se pudo cargar Supabase: "+e.message;}
function errorMessage(error){return error?.message||String(error);}
async function refreshOnline(refresh=true){
 if(!sb||!session){room=null;profile=null;if(refresh)render();return;}
 try{
  const {data:p,error:ep}=await sb.rpc("cwc_register",{p_nickname:extra.nick||"Jugador"});
  if(ep)throw ep;profile=p;
  const stored=localStorage.getItem("cwc_room_id");
  if(stored){const {data:r,error:er}=await sb.from("cwc_rooms").select("*").eq("id",stored).maybeSingle();if(er)throw er;room=r;if(!r)localStorage.removeItem("cwc_room_id");}
  onlineError="";
 }catch(e){onlineError=errorMessage(e);}
 if(refresh&&["online","profile"].includes(page))render();
}
function note(text){onlineError=text;render();toast(text);}
async function act(action){
 if(loading)return;loading=true;
 try{await action();onlineError="";}catch(e){onlineError=errorMessage(e);toast(onlineError);}
 finally{loading=false;render();}
}
function showLogin(){return '<div class="panel"><h2>🔐 Cuenta de Chigui World Cup</h2><p class="muted">Regístrate o inicia sesión para unirte a salas online. Tu correo se utiliza para la autenticación; no aparecerá públicamente.</p><div class="btnrow"><button class="btn '+(onlineTab==="login"?"":"secondary")+'" data-online-tab="login">Entrar</button><button class="btn '+(onlineTab==="signup"?"":"secondary")+'" data-online-tab="signup">Registrarse</button></div><div class="toolbar"><label class="field">Correo electrónico<input id="cwcemail" type="email" autocomplete="email" placeholder="correo@ejemplo.com"></label><label class="field">Contraseña<input id="cwcpassword" type="password" autocomplete="'+(onlineTab==="signup"?"new-password":"current-password")+'" minlength="8" placeholder="Mínimo 8 caracteres"></label></div><button class="btn" data-online-action="auth">'+(onlineTab==="signup"?"Crear cuenta":"Iniciar sesión")+'</button></div>';}
function screenRoom(){
 if(!room)return '<section class="panel"><h2>🌐 Multijugador online</h2><p class="muted">Comparte un código de seis caracteres para invitar a tus amigos. El anfitrión simula los partidos y todos pueden pronosticar.</p><div class="toolbar"><label class="field">Nombre de nueva sala<input id="newroomname" maxlength="60" value="Mundial Chigui"></label><button class="btn" data-online-action="create">Crear sala</button></div><div class="toolbar"><label class="field">Código para unirse<input id="joincode" maxlength="6" placeholder="ABC123"></label><button class="btn secondary" data-online-action="join">Unirse</button></div></section>';
 let games=room.state?.games||[],m=games.find(g=>!g.played),host=room.host_id===session.user.id;
 let content='<section class="panel"><div class="sectiontitle"><div><div class="badge">'+esc(room.status.toUpperCase())+'</div><h2 style="margin-top:12px">'+esc(room.name)+'</h2><p class="muted">Código de sala: <strong>'+esc(room.code)+'</strong></p></div><button class="btn secondary" data-online-action="leave">Salir de esta vista</button></div><div class="btnrow"><button class="btn secondary" data-online-action="copy">📋 Copiar código</button><button class="btn secondary" data-online-action="refresh">🔄 Actualizar</button></div></section>';
 if(room.status==="lobby")content+='<section class="panel"><h3>👥 Sala de espera</h3><p>Comparte el código con tus amigos. Pueden entrar, crear sus cuentas y esperar al inicio.</p>'+(host?'<p class="muted">Como anfitrión, elige '+[8,16,32].join(", ")+' selecciones en Nueva copa o inicia con una selección automática de 16 equipos.</p><button class="btn" data-online-action="start">🏆 Iniciar Mundial online</button>':'<p>Esperando a que el anfitrión inicie la copa…</p>')+'</section>';
 if(room.status!=="lobby"){
 const champ=room.state?.champion;
 content+='<section class="panel"><h3>🏆 '+(champ?"Campeón: "+esc(byId[champ]?.name||champ):"Mundial en curso")+'</h3><p class="muted">'+games.filter(x=>x.played).length+' / '+games.length+' encuentros completados</p>'+(m?'<div class="match"><div class="small muted">'+esc(m.group?"Grupo "+m.group:m.stage)+'</div><div class="matchline"><div>'+team(m.a)+'</div><div class="score">vs</div><div class="right">'+team(m.b)+'</div></div></div>':'')+(m&&host?'<div class="btnrow" style="margin-top:16px"><button class="btn" data-online-action="next">⚽ Simular siguiente partido</button></div>':'')+'</section>';
 if(m){content+='<section class="panel"><h3>🪙 Pronóstico próximo partido</h3><div class="toolbar"><label class="field">Resultado<select id="onlinebetoutcome"><option value="a">'+esc(byId[m.a]?.name||m.a)+'</option><option value="draw">Empate</option><option value="b">'+esc(byId[m.b]?.name||m.b)+'</option></select></label><label class="field">Chiguicoins<input id="onlinebetstake" type="number" min="10" max="500" value="50"></label><button class="btn secondary" data-online-action="predict">Pronosticar</button></div><p class="muted small">Cuotas ficticias: ganador 2×; empate 3×. Los pronósticos se cierran cuando el anfitrión simula el partido.</p></section>';}
 content+='<section class="panel"><h3>📋 Resultados de la sala</h3><div class="matches">'+games.slice(-40).map(g=>'<div class="match"><div class="small muted">'+esc(g.group?"Grupo "+g.group:g.stage)+'</div><div class="matchline"><div>'+team(g.a)+'</div><div class="score">'+(g.played?g.sa+" : "+g.sb:"vs")+'</div><div class="right">'+team(g.b)+'</div></div>'+(g.penalties?'<p class="small muted">Penaltis: '+g.penalties.join(" - ")+'</p>':"")+'</div>').join("")+'</div></section>';
 }
 return content;
}
function renderOnlineReal(){return (onlineError?'<div class="panel" style="border-color:#bf6279"><strong>Atención:</strong> '+esc(onlineError)+'</div>':'')+(!sb?'<div class="panel"><h2>Sin conexión</h2><p>Comprueba tu conexión a Internet y vuelve a cargar.</p></div>':!session?showLogin():screenRoom());}
function renderProfileReal(){if(!session)return showLogin();return '<section class="panel"><h2>👤 Tu cuenta online</h2><p class="muted">'+esc(session.user.email||"Cuenta iniciada")+'</p><div class="grid"><div class="card"><h2>🪙 '+(profile?.coins??"…")+'</h2><p>Chiguicoins online</p></div><div class="card"><h2>'+(profile?.correct??0)+' / '+(profile?.total??0)+'</h2><p>Pronósticos acertados</p></div></div><div class="btnrow" style="margin-top:18px"><button class="btn secondary" data-online-action="refresh">Actualizar saldo</button><button class="btn danger" data-online-action="logout">Cerrar sesión</button></div></section>';}
const oldRender=render;
render=function(){if(page==="online")document.getElementById("main").innerHTML=renderOnlineReal();else if(page==="profile")document.getElementById("main").innerHTML=renderProfileReal();else oldRender();};
document.getElementById("main").addEventListener("click",e=>{
 let t=e.target.closest("[data-online-action],[data-online-tab]");if(!t)return;
 if(t.dataset.onlineTab){onlineTab=t.dataset.onlineTab;render();return;}
 let action=t.dataset.onlineAction;
 act(async()=>{
  if(!sb)throw Error("No se ha cargado Supabase.");
  if(action==="auth"){
    const email=document.getElementById("cwcemail")?.value.trim(),password=document.getElementById("cwcpassword")?.value;
    if(!email||!password||password.length<8)throw Error("Ingresa un correo y contraseña de 8 o más caracteres.");
    const res=onlineTab==="signup"?await sb.auth.signUp({email,password}):await sb.auth.signInWithPassword({email,password});
    if(res.error)throw res.error;
    session=res.data.session;
    if(onlineTab==="signup"&&!session)toast("Cuenta creada. Revisa tu correo para confirmar el registro.");
    await refreshOnline(false);
  }
  else if(action==="logout"){const r=await sb.auth.signOut();if(r.error)throw r.error;session=null;room=null;profile=null;localStorage.removeItem("cwc_room_id");}
  else if(action==="create"){const name=document.getElementById("newroomname")?.value.trim();const r=await sb.rpc("cwc_create_room",{p_name:name});if(r.error)throw r.error;room=r.data;localStorage.setItem("cwc_room_id",room.id);}
  else if(action==="join"){const code=document.getElementById("joincode")?.value.trim();const r=await sb.rpc("cwc_join_room",{p_code:code});if(r.error)throw r.error;room=r.data;localStorage.setItem("cwc_room_id",room.id);}
  else if(action==="start"){
   const amount=[8,16,32].includes(cupSize)?cupSize:16;
   const ids=selected.size===amount?[...selected]:shuffle(COUNTRIES).slice(0,16).map(x=>x.id);
   const r=await sb.rpc("cwc_start_room",{p_room:room.id,p_teams:ids});if(r.error)throw r.error;room=r.data;
  }
  else if(action==="next"){const r=await sb.rpc("cwc_play_next",{p_room:room.id});if(r.error)throw r.error;room=r.data;await refreshOnline(false);}
  else if(action==="predict"){
   const m=room.state?.games.find(g=>!g.played);if(!m)throw Error("No hay partido disponible");
   const r=await sb.rpc("cwc_predict",{p_room:room.id,p_match:m.index,p_outcome:document.getElementById("onlinebetoutcome").value,p_stake:Number(document.getElementById("onlinebetstake").value)});
   if(r.error)throw r.error;await refreshOnline(false);toast("Pronóstico registrado.");
  }
  else if(action==="refresh")await refreshOnline(false);
  else if(action==="copy"){await navigator.clipboard.writeText(room.code);toast("Código copiado.");}
  else if(action==="leave"){room=null;localStorage.removeItem("cwc_room_id");}
 });
});
polling=setInterval(async()=>{if(session&&room&&!loading){try{const {data,error}=await sb.from("cwc_rooms").select("*").eq("id",room.id).maybeSingle();if(!error&&data&&JSON.stringify(data.state)!==JSON.stringify(room.state)){room=data;if(page==="online")render();}}catch(e){console.warn("Error de sincronización",e);}}},3500);
render();
})();