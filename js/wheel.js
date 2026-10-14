/* =========================================================================
   2. GÉOMÉTRIE
   ========================================================================= */
const C=410, R2=392, R1=252, HUB=228;
const O1=4, O2=148, B1=152, B2=208, S1=212, S2=356;

function pol(cx,cy,r,a){const t=(a-90)*Math.PI/180;return[cx+r*Math.cos(t),cy+r*Math.sin(t)]}
function ring(cx,cy,r1,r2,a1,a2,pad){
  pad=pad||0;a1+=pad;a2-=pad;
  const[x1,y1]=pol(cx,cy,r2,a1),[x2,y2]=pol(cx,cy,r2,a2),
        [x3,y3]=pol(cx,cy,r1,a2),[x4,y4]=pol(cx,cy,r1,a1),la=(a2-a1)>180?1:0;
  return`M${x1.toFixed(2)} ${y1.toFixed(2)}A${r2} ${r2} 0 ${la} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}L${x3.toFixed(2)} ${y3.toFixed(2)}A${r1} ${r1} 0 ${la} 0 ${x4.toFixed(2)} ${y4.toFixed(2)}Z`;
}
function arc(cx,cy,r,a1,a2){
  const[x1,y1]=pol(cx,cy,r,a1),[x2,y2]=pol(cx,cy,r,a2),la=Math.abs(a2-a1)>180?1:0,sw=a2>a1?1:0;
  return`M${x1.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 ${la} ${sw} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function wrapTxt(txt,max){
  const w=txt.split(" "),l=[];let c="";
  w.forEach(x=>{if((c+" "+x).trim().length>max&&c){l.push(c);c=x}else c=(c?c+" ":"")+x});
  if(c)l.push(c);return l.slice(0,3);
}
/* largeur approximative d'un texte circulaire */
function advW(str,fs,ls){
  const adv=c=>(c===" "?fs*0.30:(/[·.\-&]/.test(c)?fs*0.38:fs*0.63))+ls;
  return Array.from(str).reduce((a,c)=>a+adv(c),0);
}
function arcText(cx,cy,r,aMid,str,fs,fill,ls,inward,weight,cls){
  ls=(ls===undefined?0:ls);
  const adv=c=>(c===" "?fs*0.30:(/[·.\-&]/.test(c)?fs*0.38:fs*0.63))+ls;
  const chars=Array.from(str), ws=chars.map(adv);
  const perDeg=Math.PI*r/180, totalDeg=ws.reduce((a,b)=>a+b,0)/perDeg, dir=inward?-1:1;
  let a=aMid-dir*totalDeg/2, out="";
  chars.forEach((ch,i)=>{
    const wd=ws[i]/perDeg, ac=a+dir*wd/2, [x,y]=pol(cx,cy,r,ac), rot=inward?ac+180:ac;
    if(ch!==" ")out+=`<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" transform="rotate(${rot.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)})" text-anchor="middle" dy="${(fs*0.34).toFixed(2)}" font-size="${fs.toFixed(2)}" font-weight="${weight||700}" fill="${fill}" font-family="Miriam Libre, sans-serif">${esc(ch)}</text>`;
    a+=dir*wd;
  });
  return `<g class="${cls||''}" pointer-events="none">${out}</g>`;
}
/* ajuste automatiquement la taille pour tenir dans maxDeg degrés : corrige le débordement de CONNECTIVITY SUITE */
function arcTextFit(cx,cy,r,aMid,str,fsMax,fill,inward,maxDeg,lsMax,cls){
  let fs=fsMax, ls=(lsMax===undefined?1.2:lsMax);
  const perDeg=Math.PI*r/180;
  let guard=0;
  while(guard++<80 && advW(str,fs,ls)/perDeg > maxDeg){
    fs-=0.3; ls=Math.max(0,ls-0.06);
    if(fs<=5.5){fs=5.5;break}
  }
  return arcText(cx,cy,r,aMid,str,fs,fill,ls,inward,700,cls);
}

/* =========================================================================
   3. LA GRANDE ROUE
   ========================================================================= */
function segment(a1,a2,id,fs,maxc,idx){
  const m=byId(id); if(!m) return "";
  const am=(a1+a2)/2, c=m.c, soon=!m.videos.length;
  const[tx,ty]=pol(0,0,10,am);
  const[ix,iy]=pol(0,0,-26,am);
  let rot=((am-90)%360+360)%360; if(rot>90&&rot<270)rot+=180;
  const rl=(R1+R2)/2+2,[lx,ly]=pol(C,C,rl,am);
  const lines=wrapTxt(m.label,maxc||15);
  const lh=fs+2.4, blockH=lines.length*lh, off=-(blockH-lh)/2-lh*.25;
  const note = soon ? "Bientôt" : m.videos.length+" vidéo"+(m.videos.length>1?"s":"");
  let t=`<text class="slab" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" transform="rotate(${rot.toFixed(2)} ${lx.toFixed(1)} ${ly.toFixed(1)})" text-anchor="middle" font-size="${fs}" font-weight="700" fill="#163467" letter-spacing=".2" font-family="Miriam Libre, sans-serif">`;
  lines.forEach((L,i)=>{t+=`<tspan x="${lx.toFixed(1)}" dy="${i===0?off.toFixed(1):lh.toFixed(1)}">${esc(L)}</tspan>`});
  t+=`<tspan class="scnt" x="${lx.toFixed(1)}" dy="${(lh+3).toFixed(1)}" font-size="${(fs-2.5).toFixed(1)}" font-weight="700" fill="${soon?'#9aa7bb':c}" font-family="Barlow, sans-serif">${note}</tspan></text>`;
  return`<g class="seg${soon?' soon':''}" id="seg-${id}" role="button" tabindex="0"
    style="--c:${c};--tx:${tx.toFixed(2)}px;--ty:${ty.toFixed(2)}px;--ix:${ix.toFixed(2)}px;--iy:${iy.toFixed(2)}px;--d:${(0.18+idx*0.045).toFixed(3)}s"
    data-id="${id}" data-suite="${m.suite}">
  <title>${esc(m.label)} : ${soon?'vidéo à venir':note}</title>
  <path class="sglow" d="${ring(C,C,R1-5,R2+5,a1,a2,.3)}" fill="${c}" opacity="0" filter="url(#blur10)"/>
  <path class="sfill" d="${ring(C,C,R1,R2,a1,a2,.55)}" fill="#fff" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"${soon?' opacity=".86"':''}/>
  <path class="srim" d="${ring(C,C,R1,R1+6,a1,a2,.55)}" fill="${c}" opacity="${soon?'.45':'.92'}" pointer-events="none"/>
  ${t}</g>`;
}

function suiteArc(a1,a2,suite,label){
  const r=R1-30;
  return `<g class="suitegrp" id="arc-${suite}" data-suite="${suite}">
    <path class="suitearc-base" d="${arc(C,C,r,a1+4,a2-4)}" fill="none" stroke="#13b4e2" stroke-width="3.4" stroke-linecap="round" opacity=".75"/>
    <path class="suitearc-flow" d="${arc(C,C,r,a1+4,a2-4)}" fill="none" stroke="#6b51ed" stroke-width="2.4" stroke-linecap="round" opacity=".5"/>
    <path class="suitearc-comet" d="${arc(C,C,r,a1+4,a2-4)}" fill="none" stroke="url(#gComet)" stroke-width="4.6" stroke-linecap="round"/>
    ${arcText(C,C,R1-14,(a1+a2)/2,label,18,"#163467",4,false,700,"suitelab")}
    <circle class="suite-node" cx="${pol(C,C,r,a1+4)[0].toFixed(1)}" cy="${pol(C,C,r,a1+4)[1].toFixed(1)}" r="6.5" fill="#13b4e2"/>
    <circle class="suite-node" cx="${pol(C,C,r,a2-4)[0].toFixed(1)}" cy="${pol(C,C,r,a2-4)[1].toFixed(1)}" r="6.5" fill="#13b4e2"/>
    ${arcText(C,C,R1-50,(a1+a2)/2,"EXPLORER LA SUITE",9.5,"#13b4e2",2.2,false,700,"suitehint")}
    <path class="suite-hit" d="${arc(C,C,R1-25,a1+2,a2-2)}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="54" pointer-events="stroke"><title>Explorer la suite ${label}</title></path>
  </g>`;
}

function decor(){
  let d=`<g class="rot-slow" style="transform-origin:${C}px ${C}px">
    <circle cx="${C}" cy="${C}" r="${R2+10}" fill="none" stroke="#13b4e2" stroke-width="1.2" stroke-dasharray="2 13" opacity=".45"/></g>
  <g class="rot-rev" style="transform-origin:${C}px ${C}px">
    <circle cx="${C}" cy="${C}" r="${R2+22}" fill="none" stroke="#6b51ed" stroke-width="1" stroke-dasharray="26 20" opacity=".2"/></g>
  <g class="rot-med" style="transform-origin:${C}px ${C}px">
    <circle cx="${C}" cy="${C}" r="${R2+34}" fill="none" stroke="#13b4e2" stroke-width="1" stroke-dasharray="1 18" opacity=".3"/></g>
  <g class="rot-fast" style="transform-origin:${C}px ${C}px">`;
  for(let i=0;i<3;i++){const[x,y]=pol(C,C,R2+10,i*120);
    d+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="#13b4e2" opacity=".85"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="#13b4e2" opacity=".16"/>`}
  d+=`</g><g class="rot-rev" style="transform-origin:${C}px ${C}px">`;
  for(let i=0;i<2;i++){const[x,y]=pol(C,C,R2+22,40+i*180);d+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="#6b51ed" opacity=".6"/>`}
  d+=`</g><g class="rot-med" style="transform-origin:${C}px ${C}px">`;
  for(let i=0;i<5;i++){const[x,y]=pol(C,C,R2+34,22+i*72);d+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.2" fill="#13b4e2" opacity=".5"/>`}
  return d+`</g>`;
}
function icoAI(x,y,sc,c){
  let g=`<g transform="translate(${x} ${y}) scale(${sc})" stroke="${c}" stroke-width="1.8" fill="none">`;
  const P=[[0,-11],[10,-4],[7,8],[-7,8],[-10,-4]];
  P.forEach((a,i)=>{P.forEach((b,j)=>{if(j>i)g+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" opacity=".45"/>`})});
  P.forEach((a,i)=>{g+=`<circle class="ainode" style="animation-delay:${(i*0.35).toFixed(2)}s" cx="${a[0]}" cy="${a[1]}" r="3" fill="${c}" stroke="none"/>`});
  return g+`<circle class="aicore" cx="0" cy="0" r="2.4" fill="${c}" stroke="none"/></g>`;
}

function buildWheel(){
  let g=`<svg class="wheel-svg" id="bigWheel" viewBox="-22 -22 864 864" role="img" aria-label="Roue interactive des modules Esker pour l'Office of the CFO">
  <defs>
    <linearGradient id="gBand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFCF63"/><stop offset="1" stop-color="#F5A623"/></linearGradient>
    <linearGradient id="gComet" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#13b4e2" stop-opacity="0"/><stop offset=".5" stop-color="#6b51ed"/><stop offset="1" stop-color="#13b4e2" stop-opacity="0"/></linearGradient>
    <radialGradient id="gHub"><stop offset="0" stop-color="#ffffff"/><stop offset=".72" stop-color="#fbfdfe"/><stop offset="1" stop-color="#eaf3f7"/></radialGradient>
    <radialGradient id="gSweep"><stop offset="0" stop-color="#13b4e2" stop-opacity=".22"/><stop offset="1" stop-color="#13b4e2" stop-opacity="0"/></radialGradient>
    <filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#163467" flood-opacity=".1"/></filter>
    <filter id="blur10" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10"/></filter>
  </defs>`;
  g+=decor();
  /* noyau */
  g+=`<circle cx="${C}" cy="${C}" r="${HUB}" fill="url(#gHub)" filter="url(#sh)"/>`;
  g+=`<g class="hub-sweep" style="transform-origin:${C}px ${C}px"><path d="M${C} ${C} L${C} ${C-HUB} A${HUB} ${HUB} 0 0 1 ${(C+HUB*Math.cos(-Math.PI/3)).toFixed(1)} ${(C+HUB*Math.sin(-Math.PI/3)).toFixed(1)} Z" fill="url(#gSweep)"/></g>`;
  g+=`<circle class="hub-ring-a" style="transform-origin:${C}px ${C}px" cx="${C}" cy="${C}" r="${HUB-9}" fill="none" stroke="#13b4e2" stroke-width="1" stroke-dasharray="4 9" opacity=".45"/>`;
  g+=`<circle class="hub-ring-b breathe" style="transform-origin:${C}px ${C}px" cx="${C}" cy="${C}" r="${HUB-22}" fill="none" stroke="#6b51ed" stroke-width=".9" stroke-dasharray="22 14"/>`;
  /* arcs de suite animés */
  g+=suiteArc(S1,S2,"S2P","SOURCE-TO-PAY");
  g+=suiteArc(O1,O2,"O2C","ORDER-TO-CASH");
  /* segments */
  const ws=(S2-S1)/ORDER_S2P.length, wo=(O2-O1)/ORDER_O2C.length;
  ORDER_S2P.forEach((id,i)=>{g+=segment(S1+i*ws,S1+(i+1)*ws,id,13,15,i)});
  ORDER_O2C.forEach((id,i)=>{g+=segment(O1+i*wo,O1+(i+1)*wo,id,12.5,15,i+6)});
  /* socle plateforme : textes auto-ajustés pour ne jamais déborder */
  g+=`<g class="bandg"><title>Socle plateforme Esker</title>
    <path d="${ring(C,C,R1,R2,B1,B2,.55)}" fill="url(#gBand)"/>
    <path class="bandsheen" d="${ring(C,C,R1,R2,B1,B2,.55)}" fill="#fff" opacity=".12"/>`;
  const COLL=166, COLR=194, MAXD=24;
  g+=arcTextFit(C,C,R2-26,COLL,"AI AGENTS",12,"#6B3E00",true,MAXD,1.2);
  g+=arcTextFit(C,C,R2-50,COLL,"B2B PAYMENTS",12,"#6B3E00",true,MAXD,1.2);
  g+=arcTextFit(C,C,R2-74,COLL,"CONNECTIVITY SUITE",11,"#6B3E00",true,MAXD,1.0);
  g+=arcTextFit(C,C,R2-26,COLR,"UNIFIED UX",12,"#6B3E00",true,MAXD,1.2);
  g+=arcTextFit(C,C,R2-50,COLR,"DATALAKE",12,"#6B3E00",true,MAXD,1.2);
  g+=arcTextFit(C,C,R2-74,COLR,"ISO 27001",12,"#6B3E00",true,MAXD,1.2);
  g+=`</g>`;
  /* pastille Synergy AI */
  const[sx,sy]=pol(C,C,R1+2,180);
  g+=`<g class="aihub"><title>Synergy AI, le moteur d'intelligence artificielle Esker</title>
    <g class="aiorb" style="transform-origin:${sx.toFixed(1)}px ${sy.toFixed(1)}px">
      <circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="42" fill="#fff" stroke="#F5A623" stroke-width="3"/>
      <circle class="airing" style="transform-origin:${sx.toFixed(1)}px ${sy.toFixed(1)}px" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="49" fill="none" stroke="#F5A623" stroke-width="1.6" stroke-dasharray="5 7" opacity=".6"/>
      ${icoAI(sx,sy-7,.72,"#B45309")}
      <text x="${sx.toFixed(1)}" y="${(sy+22).toFixed(1)}" text-anchor="middle" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#92400E" font-family="Miriam Libre, sans-serif">SYNERGY AI</text>
    </g></g>`;
  /* contenu du noyau : état par défaut */
  g+=`<g class="hub-default">
    <g transform="translate(${C-78} ${C-92}) scale(0.1215)"><use href="#eskerword" width="1283" height="290" style="color:#db001b"/></g>
    <text x="${C}" y="${C-14}" text-anchor="middle" font-size="22" font-weight="700" fill="#163467" letter-spacing="-.5" font-family="Miriam Libre, sans-serif">AI Automation Suite</text>
    <text x="${C}" y="${C+14}" text-anchor="middle" font-size="22" font-weight="700" fill="#163467" letter-spacing="-.5" font-family="Miriam Libre, sans-serif">for the Office of the CFO</text>
    <text x="${C}" y="${C+50}" text-anchor="middle" font-size="12" font-weight="700" fill="#9aa7bb" letter-spacing="1.6" font-family="Barlow, sans-serif">${TOTV} VIDÉOS · ${M.length} MODULES</text>
    <text x="${C}" y="${C+76}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#13b4e2" letter-spacing=".4" font-family="Barlow, sans-serif">Survolez un module pour le découvrir</text>
  </g>`;
  /* contrôle de taille intégré au noyau : il reste au centre, donc il ne « saute » plus */
  g+=`<g class="hubzoom" id="hubZoom" transform="translate(${C} ${C+152})">
    <title>Ajuster la taille de la roue</title>
    <rect class="hzbar" x="-70" y="-19" width="140" height="38" rx="19" fill="#ffffff" stroke="#163467" stroke-opacity=".12" stroke-width="1.2"/>
    <g class="hz-btn" id="hzMinus" role="button" tabindex="0" data-step="-1">
      <title>Réduire la roue</title>
      <circle class="hz-bg" cx="-48" cy="0" r="14" fill="#f0f6f8" stroke="#163467" stroke-opacity=".1" stroke-width="1"/>
      <path class="hz-ico" d="M-55 0 H-41" stroke="#163467" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    </g>
    <foreignObject x="-33" y="-16" width="66" height="32">
      <input xmlns="http://www.w3.org/1999/xhtml" class="hz-input" id="hzInput" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="100%" aria-label="Taille de la roue en pourcentage" title="Saisissez une taille, de 50 % à 200 %"/>
    </foreignObject>
    <text class="hz-cap" x="0" y="-24" text-anchor="middle" font-size="8.5" font-weight="700" letter-spacing="1.6" fill="#a9b6c9" font-family="Barlow, sans-serif">TAILLE</text>
    <g class="hz-btn" id="hzPlus" role="button" tabindex="0" data-step="1">
      <title>Agrandir la roue</title>
      <circle class="hz-bg" cx="48" cy="0" r="14" fill="#f0f6f8" stroke="#163467" stroke-opacity=".1" stroke-width="1"/>
      <path class="hz-ico" d="M41 0 H55 M48 -7 V7" stroke="#163467" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    </g>
  </g>`;
  /* contenu du noyau : état survol */
  g+=`<g class="hub-hover" id="hubHover" role="button" tabindex="-1" style="cursor:pointer">
    <circle id="hhRing" cx="${C}" cy="${C-72}" r="31" fill="#f0f6f8"/>
    <text id="hhIcon" x="${C}" y="${C-61}" text-anchor="middle" font-size="31">🔎</text>
    <text id="hhSuite" x="${C}" y="${C-18}" text-anchor="middle" font-size="11.5" font-weight="700" letter-spacing="2.4" fill="#13b4e2" font-family="Barlow, sans-serif">SOURCE-TO-PAY</text>
    <text id="hhName" x="${C}" y="${C+16}" text-anchor="middle" font-size="25" font-weight="700" fill="#163467" font-family="Miriam Libre, sans-serif">Sourcing</text>
    <text id="hhName2" x="${C}" y="${C+44}" text-anchor="middle" font-size="25" font-weight="700" fill="#163467" font-family="Miriam Libre, sans-serif"></text>
    <g id="hhCta" transform="translate(${C} ${C+78})">
      <rect x="-82" y="-15" width="164" height="30" rx="15" fill="#13b4e2"/>
      <text id="hhCtaT" x="0" y="5" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" letter-spacing=".6" font-family="Barlow, sans-serif">LANCER LA VIDÉO</text>
    </g>
  </g>`;
  return g+`</svg>`;
}

/* =========================================================================
   4. LA MINI ROUE (widget)
   ========================================================================= */
function miniSegment(a1,a2,id,idx){
  const m=byId(id); if(!m) return "";
  const am=(a1+a2)/2, soon=!m.videos.length;
  const[tx,ty]=pol(0,0,11,am);
  let rot=((am-90)%360+360)%360; if(rot>90&&rot<270)rot+=180;
  const[ex,ey]=pol(C,C,347,am);           /* emoji */
  const[lx,ly]=pol(C,C,296,am);           /* code court */
  return`<g class="mini-seg${soon?' soon':''}" data-id="${id}" role="button" tabindex="0"
    style="--c:${m.c};--tx:${tx.toFixed(2)}px;--ty:${ty.toFixed(2)}px;--sd:${(0.17+(idx||0)*0.028).toFixed(3)}s;--sdo:${(0.014*(6-(idx||0))).toFixed(3)}s" data-suite="${m.suite}">
    <title>${esc(m.label)}${soon?' (vidéo à venir)':''}</title>
    <path class="msf" d="${ring(C,C,R1,R2,a1,a2,.8)}" fill="#fff" stroke="${m.c}" stroke-width="2.6" stroke-linejoin="round"${soon?' opacity=".86"':''}/>
    <path class="mrim" d="${ring(C,C,R1,R1+8,a1,a2,.8)}" fill="${m.c}" opacity="${soon?'.45':'.92'}" pointer-events="none"/>
    <text class="mico" x="${ex.toFixed(1)}" y="${ey.toFixed(1)}" transform="rotate(${rot.toFixed(2)} ${ex.toFixed(1)} ${ey.toFixed(1)})" text-anchor="middle" dy="13" font-size="38">${m.icon}</text>
    <text class="mlab" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" transform="rotate(${rot.toFixed(2)} ${lx.toFixed(1)} ${ly.toFixed(1)})" text-anchor="middle" dy="9" font-size="25" font-weight="700" letter-spacing="1" fill="#163467" font-family="Miriam Libre, sans-serif">${esc(m.code)}</text>
  </g>`;
}
function miniSuiteArc(a1,a2,suite,label){
  const r=R1-30;
  return `<g class="suitegrp" id="marc-${suite}" data-suite="${suite}">
    <path class="suitearc-base" d="${arc(C,C,r,a1+4,a2-4)}" fill="none" stroke="#13b4e2" stroke-width="3.2" stroke-linecap="round" opacity=".7"/>
    <path class="suitearc-flow" d="${arc(C,C,r,a1+4,a2-4)}" fill="none" stroke="#6b51ed" stroke-width="2.2" stroke-linecap="round" opacity=".45"/>
    <path class="suitearc-comet" d="${arc(C,C,r,a1+4,a2-4)}" fill="none" stroke="url(#gCometM)" stroke-width="4.4" stroke-linecap="round"/>
    ${arcText(C,C,R1-13,(a1+a2)/2,label,17,"#163467",3.6,false,700,"suitelab")}
    <circle class="suite-node" cx="${pol(C,C,r,a1+4)[0].toFixed(1)}" cy="${pol(C,C,r,a1+4)[1].toFixed(1)}" r="6" fill="#13b4e2"/>
    <circle class="suite-node" cx="${pol(C,C,r,a2-4)[0].toFixed(1)}" cy="${pol(C,C,r,a2-4)[1].toFixed(1)}" r="6" fill="#13b4e2"/>
    <path class="suite-hit" d="${arc(C,C,R1-25,a1+2,a2-2)}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="54" pointer-events="stroke"><title>Explorer la suite ${label}</title></path>
  </g>`;
}
/* Mini roue : exactement la même géométrie et les mêmes cinématiques que la grande.
   Seuls les libellés sont remplacés par emoji + acronyme. */
/* ===== outils du champ gravitationnel ===== */
/* bras spiral logarithmique, dessiné seulement dans la couronne extérieure */
function spiralArm(r0, r1, turns, phase){
  const n = 90, pts = [];
  for(let i = 0; i <= n; i++){
    const t = i / n;
    const r = r0 + (r1 - r0) * Math.pow(t, .78);
    const [x, y] = pol(C, C, r, phase + t * turns * 360);
    pts.push((i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1));
  }
  return pts.join(" ");
}
/* ellipse complète en deux arcs, pour servir de trajectoire aux astéroïdes */
function ellipsePath(rx, ry){
  return `M ${(C-rx).toFixed(1)} ${C} A ${rx} ${ry} 0 1 0 ${(C+rx).toFixed(1)} ${C} A ${rx} ${ry} 0 1 0 ${(C-rx).toFixed(1)} ${C}`;
}
/* ceintures d'astéroïdes : trois orbites inclinées, vitesses et phases décalées */
const BELTS = [
  {rx:472, ry:296, tilt:-22, dur:19, n:3, c:"#13b4e2", r:4.2},
  {rx:452, ry:238, tilt: 31, dur:26, n:2, c:"#6b51ed", r:3.6},
  {rx:478, ry:158, tilt: 76, dur:33, n:2, c:"#F5A623", r:3.2}
];
function galaxyLayer(){
  let o = `<g class="galaxy" pointer-events="none">`;
  o += `<circle class="neb" cx="${C}" cy="${C}" r="500" fill="url(#gNeb)"/>`;
  /* bras spiraux : masqués sous les segments, visibles dans la couronne */
  for(let k = 0; k < 3; k++){
    o += `<path class="arm" d="${spiralArm(R1 - 10, R2 + 92, .62, k * 120)}" fill="none" stroke="url(#gArm)" stroke-width="2.4" stroke-linecap="round" opacity=".5"/>`;
  }
  /* ceintures */
  BELTS.forEach((b, bi) => {
    o += `<g transform="rotate(${b.tilt} ${C} ${C})">
      <path class="orbit" d="${ellipsePath(b.rx, b.ry)}" fill="none" stroke="${b.c}" stroke-width="1.1" stroke-dasharray="2 13" opacity=".2"/>`;
    for(let k = 0; k < b.n; k++){
      o += `<g class="aster"><circle r="${b.r}" fill="${b.c}" opacity=".9"/><circle r="${(b.r*2.8).toFixed(1)}" fill="${b.c}" opacity=".13"/>
        <animateMotion dur="${b.dur}s" repeatCount="indefinite" begin="${(-k * b.dur / b.n).toFixed(2)}s" path="${ellipsePath(b.rx, b.ry)}"/></g>`;
    }
    o += `</g>`;
  });
  o += `</g>`;
  /* le trou noir : invisible au repos, il avale la galaxie à la fermeture.
     Horizon sombre, disque d'accrétion incliné, anneau de photons. */
  o += `<g class="hole" pointer-events="none">
    <circle cx="${C}" cy="${C}" r="430" fill="url(#gHole)"/>
    <g class="accretion">
      <ellipse cx="${C}" cy="${C}" rx="400" ry="108" fill="none" stroke="url(#gAcc)" stroke-width="15" opacity=".85" transform="rotate(-17 ${C} ${C})"/>
      <ellipse cx="${C}" cy="${C}" rx="330" ry="76" fill="none" stroke="url(#gAcc)" stroke-width="8" opacity=".9" transform="rotate(-17 ${C} ${C})"/>
      <ellipse cx="${C}" cy="${C}" rx="252" ry="44" fill="none" stroke="#fff" stroke-width="3.4" opacity=".75" transform="rotate(-17 ${C} ${C})"/>
    </g>
    <circle class="photon" cx="${C}" cy="${C}" r="196" fill="none" stroke="#9ef0ff" stroke-width="2.6" opacity=".9"/>
    <circle class="photon2" cx="${C}" cy="${C}" r="214" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="5 11" opacity=".7"/>
  </g>`;

  /* onde de choc : trois cercles qui se propagent une fois à l'ouverture */
  o += `<g class="shock" pointer-events="none">`;
  [[0,"#13b4e2",2.6],[.13,"#6b51ed",1.8],[.26,"#F5A623",1.3]].forEach(([d,c,w]) => {
    o += `<g style="--sd:${d}s"><circle cx="${C}" cy="${C}" r="452" fill="none" stroke="${c}" stroke-width="${w}"/></g>`;
  });
  return o + `</g>`;
}

function buildMiniWheel(){
  let g=`<svg class="wheel-svg" id="miniWheel" viewBox="-110 -110 1040 1040" role="img" aria-label="Roue Esker, sélecteur rapide de module">
  <defs>
    <linearGradient id="gBandM" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFCF63"/><stop offset="1" stop-color="#F5A623"/></linearGradient>
    <linearGradient id="gCometM" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#13b4e2" stop-opacity="0"/><stop offset=".5" stop-color="#6b51ed"/><stop offset="1" stop-color="#13b4e2" stop-opacity="0"/></linearGradient>
    <radialGradient id="gHubM"><stop offset="0" stop-color="#ffffff"/><stop offset=".72" stop-color="#fbfdfe"/><stop offset="1" stop-color="#eaf3f7"/></radialGradient>
    <radialGradient id="gSweepM"><stop offset="0" stop-color="#13b4e2" stop-opacity=".2"/><stop offset="1" stop-color="#13b4e2" stop-opacity="0"/></radialGradient>
    <radialGradient id="gNeb">
      <stop offset=".42" stop-color="#13b4e2" stop-opacity="0"/>
      <stop offset=".74" stop-color="#6b51ed" stop-opacity=".13"/>
      <stop offset=".9" stop-color="#13b4e2" stop-opacity=".09"/>
      <stop offset="1" stop-color="#13b4e2" stop-opacity="0"/></radialGradient>
    <radialGradient id="gHole">
      <stop offset="0" stop-color="#04060e"/>
      <stop offset=".40" stop-color="#070b1c"/>
      <stop offset=".50" stop-color="#2b1d6b" stop-opacity=".92"/>
      <stop offset=".57" stop-color="#6b51ed"/>
      <stop offset=".63" stop-color="#1dc0d5"/>
      <stop offset=".68" stop-color="#ffffff" stop-opacity=".97"/>
      <stop offset=".76" stop-color="#13b4e2" stop-opacity=".32"/>
      <stop offset="1" stop-color="#13b4e2" stop-opacity="0"/></radialGradient>
    <linearGradient id="gAcc" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#13b4e2" stop-opacity="0"/>
      <stop offset=".3" stop-color="#ffffff"/>
      <stop offset=".55" stop-color="#6b51ed"/>
      <stop offset="1" stop-color="#13b4e2" stop-opacity="0"/></linearGradient>
    <linearGradient id="gArm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#13b4e2" stop-opacity="0"/>
      <stop offset=".45" stop-color="#6b51ed" stop-opacity=".42"/>
      <stop offset="1" stop-color="#13b4e2" stop-opacity="0"/></linearGradient>
  </defs>`;
  g += galaxyLayer();
  /* décor : anneaux en rotations opposées + particules, comme la grande roue */
  g+=`<g class="rot-slow" style="transform-origin:${C}px ${C}px">
        <circle cx="${C}" cy="${C}" r="${R2+20}" fill="none" stroke="#13b4e2" stroke-width="1.6" stroke-dasharray="2 14" opacity=".5"/></g>
      <g class="rot-rev" style="transform-origin:${C}px ${C}px">
        <circle cx="${C}" cy="${C}" r="${R2+38}" fill="none" stroke="#6b51ed" stroke-width="1.3" stroke-dasharray="24 20" opacity=".22"/></g>
      <g class="rot-fast" style="transform-origin:${C}px ${C}px">`;
  for(let i=0;i<3;i++){const[x,y]=pol(C,C,R2+20,i*120);
    g+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#13b4e2" opacity=".85"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="#13b4e2" opacity=".16"/>`}
  g+=`</g>`;
  /* noyau */
  g+=`<circle cx="${C}" cy="${C}" r="${HUB}" fill="url(#gHubM)"/>
      <g class="hub-sweep" style="transform-origin:${C}px ${C}px"><path d="M${C} ${C} L${C} ${C-HUB} A${HUB} ${HUB} 0 0 1 ${(C+HUB*Math.cos(-Math.PI/3)).toFixed(1)} ${(C+HUB*Math.sin(-Math.PI/3)).toFixed(1)} Z" fill="url(#gSweepM)"/></g>
      <circle class="hub-ring-a" style="transform-origin:${C}px ${C}px" cx="${C}" cy="${C}" r="${HUB-9}" fill="none" stroke="#13b4e2" stroke-width="1.2" stroke-dasharray="4 9" opacity=".45"/>
      <circle class="hub-ring-b breathe" style="transform-origin:${C}px ${C}px" cx="${C}" cy="${C}" r="${HUB-22}" fill="none" stroke="#6b51ed" stroke-width="1" stroke-dasharray="22 14"/>`;
  g+=miniSuiteArc(S1,S2,"S2P","SOURCE-TO-PAY");
  g+=miniSuiteArc(O1,O2,"O2C","ORDER-TO-CASH");
  const ws=(S2-S1)/ORDER_S2P.length, wo=(O2-O1)/ORDER_O2C.length;
  ORDER_S2P.forEach((id,i)=>{g+=miniSegment(S1+i*ws,S1+(i+1)*ws,id,ORDER_S2P.length-1-i)});
  ORDER_O2C.forEach((id,i)=>{g+=miniSegment(O1+i*wo,O1+(i+1)*wo,id,i)});
  /* socle */
  g+=`<g class="bandg"><title>Socle plateforme Esker</title>
      <path d="${ring(C,C,R1,R2,B1,B2,.8)}" fill="url(#gBandM)"/>`;
  g+=arcTextFit(C,C,R2-30,172,"PLATEFORME",13,"#6B3E00",true,30,1.4);
  g+=arcTextFit(C,C,R2-30,196,"ESKER",13,"#6B3E00",true,22,1.4);
  g+=arcTextFit(C,C,R2-62,180,"AI · PAYMENTS · DATALAKE",10,"#6B3E00",true,50,.6);
  g+=`</g>`;
  /* pastille Synergy AI */
  const[sx,sy]=pol(C,C,R1+2,180);
  g+=`<g class="aihub"><title>Synergy AI</title>
      <g class="aiorb" style="transform-origin:${sx.toFixed(1)}px ${sy.toFixed(1)}px">
        <circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="36" fill="#fff" stroke="#F5A623" stroke-width="2.6"/>
        <circle class="airing" style="transform-origin:${sx.toFixed(1)}px ${sy.toFixed(1)}px" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="42" fill="none" stroke="#F5A623" stroke-width="1.5" stroke-dasharray="5 7" opacity=".6"/>
        ${icoAI(sx,sy-4,.62,"#B45309")}
        <text x="${sx.toFixed(1)}" y="${(sy+21).toFixed(1)}" text-anchor="middle" font-size="7.6" font-weight="700" letter-spacing=".7" fill="#92400E" font-family="Miriam Libre, sans-serif">SYNERGY AI</text>
      </g></g>`;
  /* noyau : repos */
  g+=`<g class="mini-hub-default">
      <g transform="translate(${C-88} ${C-78}) scale(0.137)"><use href="#eskerword" width="1283" height="290" style="color:#db001b"/></g>
      <text class="mini-hub-label" x="${C}" y="${C+6}" text-anchor="middle" font-size="31">Choisir un module</text>
      <text x="${C}" y="${C+44}" text-anchor="middle" font-size="22" font-weight="700" fill="#9aa7bb" letter-spacing="2.4" font-family="Barlow, sans-serif">SURVOLEZ LA ROUE</text>
      <text x="${C}" y="${C+92}" text-anchor="middle" font-size="21" font-weight="700" fill="#13b4e2" letter-spacing=".6" font-family="Barlow, sans-serif">${TOTV} vidéos · ${M.length} modules</text>
    </g>`;
  /* noyau : survol */
  g+=`<g class="mini-hub-hover" id="miniHubHover">
      <circle id="mhRing" cx="${C}" cy="${C-76}" r="40" fill="#f0f6f8"/>
      <text id="mhIcon" x="${C}" y="${C-62}" text-anchor="middle" font-size="40">🔎</text>
      <text id="mhSuite" x="${C}" y="${C-14}" text-anchor="middle" font-size="19" font-weight="700" letter-spacing="3" fill="#13b4e2" font-family="Barlow, sans-serif">SOURCE-TO-PAY</text>
      <text class="mini-hub-label" id="mhName" x="${C}" y="${C+24}" text-anchor="middle" font-size="33">Sourcing</text>
      <text class="mini-hub-label" id="mhName2" x="${C}" y="${C+62}" text-anchor="middle" font-size="33"></text>
      <g id="mhCta" transform="translate(${C} ${C+108})">
        <rect x="-96" y="-19" width="192" height="38" rx="19" fill="#13b4e2"/>
        <text id="mhCtaT" x="0" y="7" text-anchor="middle" font-size="18" font-weight="700" fill="#fff" letter-spacing=".8" font-family="Barlow, sans-serif">LANCER LA VIDÉO</text>
      </g>
    </g>`;
  return g+`</svg>`;
}

