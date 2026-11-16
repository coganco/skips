const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function h2r(h,s,l){s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return[f(0),f(8),f(4)].map(x=>Math.round(x*255))}
const hex=(h,s,l)=>'#'+h2r((h%360+360)%360,s,l).map(x=>x.toString(16).padStart(2,'0')).join('');
function x2h(x){const r=parseInt(x.slice(1,3),16)/255,g=parseInt(x.slice(3,5),16)/255,b=parseInt(x.slice(5,7),16)/255,M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m,l=(M+m)/2;let h=0,s=0;if(d){s=d/(1-Math.abs(2*l-1));h=M==r?((g-b)/d+6)%6:M==g?(b-r)/d+2:(r-g)/d+4;h*=60}return[Math.round(h),Math.round(s*100),Math.round(l*100)]}
const rgb=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16));
const lum=x=>{const c=rgb(x).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const cr=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const txc=x=>lum(x)>.4?'#111':'#fff';
const NAMES={Merah:'#e03131',Oranye:'#f76707',Kuning:'#fcc419',Hijau:'#2f9e44',Tosca:'#12b886',Biru:'#1c7ed6',Nila:'#4c3fd1',Ungu:'#9c36b5',Magenta:'#d6336c',Pink:'#f783ac',Coklat:'#7f4f24',Hitam:'#111111',Abu:'#868e96',Putih:'#f8f9fa',Krem:'#f1e3c6',Navy:'#16275e',Hijau_Lumut:'#5c7a29',Emas:'#d4af6a'};
const cname=x=>{const c=rgb(x);let b,bd=1e9;for(const[n,v]of Object.entries(NAMES)){const d=rgb(v).reduce((a,e,i)=>a+(e-c[i])**2,0);if(d<bd){bd=d;b=n}}return b.replace('_',' ')};
/* nav */
const V=[['home','Beranda'],['materi','Materi'],['lab','Lab Warna'],['studio','Studio Vektor'],['kuis','Kuis']];
$('#menu').innerHTML=V.map(v=>`<button data-v="${v[0]}">${v[1]}</button>`).join('');
$('#cards').innerHTML=[['materi','1. Materi','15 topik + demo interaktif: sejarah, pencampur RGB, ilusi kontras, buta warna, budaya, branding.'],['lab','2. Lab Warna','Roda warna, 6 skema, pipet layar, tint/tone/shade, gradien, kontras WCAG.'],['studio','3. Studio Vektor','14 template, 6 bentuk, seret, layer, undo/redo, ekspor SVG/PNG.'],['kuis','4. Kuis','16 soal bergambar: pilihan ganda, benar/salah, pilih warna, isian, praktik campur warna.']].map(c=>`<button class="card" data-go="${c[0]}"><b>${c[1]}</b><span>${c[2]}</span></button>`).join('');
$('#hsw').innerHTML=['#e03131','#f76707','#fcc419','#2f9e44','#1c7ed6','#9c36b5'].map(c=>`<i style="background:${c}"></i>`).join('');
function go(v){$$('.view').forEach(e=>e.hidden=e.id!='v-'+v);$$('#menu button').forEach(b=>b.classList.toggle('on',b.dataset.v==v));if(v=='studio')draw();scrollTo(0,0)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-v],[data-go]');if(b)go(b.dataset.v||b.dataset.go)});
/* materi */
const M=[
['Primer, sekunder, tersier','<p><b>Warna primer</b> (merah, kuning, biru) tidak bisa dibuat dari campuran warna lain. <b>Sekunder</b> (oranye, hijau, ungu) lahir dari dua primer. <b>Tersier</b> adalah primer + sekunder di sebelahnya, mis. merah-oranye, kuning-hijau, biru-ungu.</p><ul><li>Roda warna RYB dipakai seni rupa dan DKV tradisional.</li><li>Lihat tiap warnanya di panel RYB pada Lab Warna.</li></ul>'],
['Model warna: RGB, CMYK, RYB','<p><b>RGB</b> (aditif): cahaya layar; merah+hijau+biru = putih. <b>CMYK</b> (subtraktif): tinta cetak; cyan, magenta, kuning, hitam. <b>RYB</b>: model pigmen klasik.</p><p>Desain digital dibuat dalam RGB; naskah cetak dikonversi ke CMYK, sehingga warna neon bisa meredup.</p>'],
['Hue, saturation, lightness','<p><b>Hue</b> adalah posisi di roda (0-359°). <b>Saturation</b> adalah kemurnian: rendah terlihat kelabu. <b>Lightness</b> adalah terang-gelap.</p><p><b>Tint</b> = warna + putih, <b>shade</b> = + hitam, <b>tone</b> = + abu. Gunakan slider di Lab untuk merasakannya.</p>'],
['Skema harmoni','<ul><li><b>Komplementer</b>: berseberangan; kontras kuat.</li><li><b>Analogus</b>: bertetangga; tenang.</li><li><b>Triadik</b>: segitiga 120°; ceria dan seimbang.</li><li><b>Split-komplementer</b>: kontras lebih lembut.</li><li><b>Tetradik</b>: dua pasang komplementer.</li><li><b>Monokromatik</b>: satu hue, variasi terang-gelap.</li></ul>'],
['Suhu warna','<p>Warna <b>hangat</b> (merah, oranye, kuning) terkesan maju dan energik. Warna <b>dingin</b> (biru, hijau, ungu) terkesan mundur dan tenang. Gunakan suhu untuk menciptakan kedalaman ruang.</p>'],
['Psikologi warna','<ul><li>Merah: energi, urgensi, gairah.</li><li>Biru: percaya, tenang, korporat.</li><li>Hijau: alam, sehat, pertumbuhan.</li><li>Kuning: optimis, perhatian.</li><li>Ungu: mewah, kreatif.</li><li>Hitam: elegan, eksklusif.</li></ul><p>Makna bergantung budaya; uji pada audiens sasaranmu.</p>'],
['Kontras & aksesibilitas','<p>WCAG menetapkan rasio kontras minimal <b>4.5:1</b> untuk teks biasa dan <b>3:1</b> untuk teks besar. Sekitar 8% pria punya buta warna; jangan hanya mengandalkan merah vs hijau untuk membedakan informasi.</p>'],
['Aturan 60-30-10','<p>Bagi komposisi: <b>60%</b> warna dominan (latar), <b>30%</b> sekunder (bidang pendukung), <b>10%</b> aksen (tombol, titik fokus). Aturan sederhana yang membuat palet terasa profesional.</p>']];
$('#mlist').innerHTML=M.map((m,i)=>`<button data-i="${i}">${i+1}. ${m[0]}</button>`).join('');
function mat(i){$('#mbody').innerHTML=`<h3>${M[i][0]}</h3>${M[i][1]}`;$$('#mlist button').forEach((b,j)=>b.classList.toggle('on',i==j))}
$('#mlist').onclick=e=>{const b=e.target.closest('button');if(b)mat(+b.dataset.i)};mat(0);
/* lab */
const HM={Komplementer:[0,180],Analogus:[-30,0,30],Triadik:[0,120,240],'Split-komp.':[0,150,210],Tetradik:[0,90,180,270],Monokromatik:null};
const DS={Komplementer:'Dua warna berseberangan: kontras paling tegas.',Analogus:'Tiga warna bertetangga: harmonis dan tenang.',Triadik:'Tiga warna berjarak 120°: ceria dan seimbang.','Split-komp.':'Satu warna + dua tetangga komplemennya: kontras lembut.',Tetradik:'Dua pasang komplementer: kaya tetapi perlu hierarki.',Monokromatik:'Satu hue dengan tingkat terang-gelap berbeda.'};
let H=340,S=70,L=50,mode='Komplementer',pal=[];
$('#tabs').innerHTML=Object.keys(HM).map(k=>`<button>${k}</button>`).join('');
$('#wheel').style.background='conic-gradient(from 90deg,'+[...Array(13)].map((_,i)=>`hsl(${i*30} 85% 52%)`).join(',')+')';
$('#wheel').innerHTML='<div class="pin" id="pin"></div>';
function lab(){
 const b=hex(H,S,L);$('#base').value=b;$('#hex').value=b;$('#h').value=H;$('#s').value=S;$('#l').value=L;
 pal=HM[mode]?HM[mode].map(o=>hex(H+o,S,L)):[hex(H,S,Math.max(L-30,12)),hex(H,S,Math.max(L-15,15)),b,hex(H,S,Math.min(L+15,88)),hex(H,S,Math.min(L+30,94))];
 if(HM[mode]&&!HM[mode].includes(0))pal.splice(1,0,b);
 $$('#tabs button').forEach(t=>t.classList.toggle('on',t.textContent==mode));
 $('#sw').innerHTML=pal.map(c=>`<button style="background:${c};color:${txc(c)};text-shadow:none" data-c="${c}">${c}</button>`).join('');
 $('#desc').textContent=DS[mode];
 const r=rgb(b),k=1-Math.max(...r)/255,cm=v=>k>=1?0:Math.round((1-v/255-k)/(1-k)*100);
 $('#info').innerHTML=[['Nama',cname(b)],['RGB',r.join(', ')],['HSL',`${H}°, ${S}%, ${L}%`],['CMYK',`${cm(r[0])}, ${cm(r[1])}, ${cm(r[2])}, ${Math.round(k*100)}`]].map(x=>`<div>${x[0]}<b>${x[1]}</b></div>`).join('');
 const R=$('#wheel').getBoundingClientRect(),a=(H-90+180)*Math.PI/180;const p=$('#pin');p.style.background=b;p.style.left=50+36.5*Math.cos((H-90)*Math.PI/180)+'%';p.style.top=50+36.5*Math.sin((H-90)*Math.PI/180)+'%';
 $$('.pin.m').forEach(e=>e.remove());
 pal.forEach(c=>{const hh=x2h(c)[0],m=document.createElement('div');m.className='pin m';m.style.background=c;m.style.left=50+36.5*Math.cos((hh-90)*Math.PI/180)+'%';m.style.top=50+36.5*Math.sin((hh-90)*Math.PI/180)+'%';$('#wheel').append(m)});
 drawPal();
}
$('#tabs').onclick=e=>{if(e.target.tagName=='BUTTON'){mode=e.target.textContent;lab()}};
$('#sw').onclick=e=>{const c=e.target.dataset.c;if(c){[H,S,L]=x2h(c);lab()}};
const wp=e=>{const r=$('#wheel').getBoundingClientRect();H=Math.round((Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2)*180/Math.PI+90+360)%360);lab()};
let wd=0;$('#wheel').onpointerdown=e=>{wd=1;$('#wheel').setPointerCapture(e.pointerId);wp(e)};$('#wheel').onpointermove=e=>wd&&wp(e);$('#wheel').onpointerup=()=>wd=0;
$('#base').oninput=e=>{[H,S,L]=x2h(e.target.value);lab()};
$('#hex').oninput=e=>{if(/^#[0-9a-f]{6}$/i.test(e.target.value)){[H,S,L]=x2h(e.target.value);lab()}};
$('#h').oninput=e=>{H=+e.target.value;lab()};$('#s').oninput=e=>{S=+e.target.value;lab()};$('#l').oninput=e=>{L=+e.target.value;lab()};
$('#cssBtn').onclick=()=>{const t=':root{\n'+pal.map((c,i)=>`  --warna-${i+1}: ${c};`).join('\n')+'\n}';(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>$('#copied').textContent='Tersalin',()=>$('#copied').textContent='Salin manual: '+pal.join(' '))};
$('#toStudio').onclick=()=>go('studio');
$('#pt').innerHTML=[['Merah',0],['Merah-oranye',15],['Oranye',30],['Kuning-oranye',45],['Kuning',60],['Kuning-hijau',90],['Hijau',120],['Biru-hijau',180],['Biru',225],['Biru-ungu',255],['Ungu',285],['Merah-ungu',320]].map(([n,h])=>{const c=hex(h,78,50);return`<div style="background:${c}">${n}</div>`}).join('');
function ctr(){const f=$('#fg').value,b=$('#bg').value,r=cr(f,b);$('#cprev').style.cssText=`color:${f};background:${b}`;$('#cres').textContent=`Rasio ${r.toFixed(2)}:1 — teks biasa ${r>=4.5?'LULUS':'GAGAL'}, teks besar ${r>=3?'LULUS':'GAGAL'}`}
$('#fg').oninput=$('#bg').oninput=ctr;
/* studio */
const R=(x,y,w,h,f)=>({k:'r',a:[x,y,w,h],f}),C=(x,y,r,f)=>({k:'c',a:[x,y,r],f}),P=(d,f)=>({k:'p',a:[d],f});
const T={
Rumah:[R(0,0,400,300,'#bde0fe'),C(340,50,26,'#ffd43b'),R(0,220,400,80,'#69a85a'),R(110,130,160,100,'#f4d6a0'),P('M95 135L190 65L285 135Z','#c2255c'),R(172,170,36,60,'#7a4a2a'),R(125,150,34,34,'#74c0fc'),R(222,150,34,34,'#74c0fc'),R(310,170,14,60,'#7a4a2a'),C(317,160,30,'#2f9e44')],
Gunung:[R(0,0,400,300,'#ffb88c'),C(200,120,50,'#fff3bf'),P('M0 240L110 90L220 240Z','#5f4b8b'),P('M140 240L270 70L400 240Z','#3b2f63'),P('M255 100L270 70L285 100L270 92Z','#fff'),R(0,230,400,70,'#1b2a41'),P('M0 245Q100 235 200 245T400 245V255H0Z','#324a6d')],
Kota:[R(0,0,400,300,'#1a1b3a'),C(320,55,24,'#f1e3c6'),R(20,130,60,170,'#3d3f6b'),R(90,90,70,210,'#4c4e86'),R(170,150,55,150,'#2f3159'),R(235,70,60,230,'#5a5da0'),R(305,140,75,160,'#3d3f6b'),R(105,110,12,12,'#ffd43b'),R(130,140,12,12,'#ffd43b'),R(250,95,12,12,'#ffd43b'),R(270,130,12,12,'#ffd43b'),R(325,165,12,12,'#ffd43b')],
Logo:[R(0,0,400,300,'#f4f2ee'),C(200,150,100,'#16171f'),P('M200 70L270 190H130Z','#d4af6a'),C(200,150,32,'#c2255c'),C(200,150,12,'#f4f2ee')],
Bunga:[R(0,0,400,300,'#fff0f6'),R(194,150,12,150,'#2f9e44'),...[0,60,120,180,240,300].map(a=>C(200+50*Math.cos(a*Math.PI/180),110+50*Math.sin(a*Math.PI/180),36,'#f06595')),C(200,110,28,'#fcc419'),P('M206 230Q260 200 290 230Q250 260 206 230Z','#51cf66')],
Layar:[R(0,0,400,300,'#a5d8ff'),C(80,60,28,'#ffd43b'),R(0,200,400,100,'#1c7ed6'),P('M200 40L200 180L110 180Z','#fff'),P('M210 70L210 180L290 180Z','#f76707'),P('M100 190H300L270 235H130Z','#7a4a2a'),R(198,40,5,150,'#333')],
Roket:[R(0,0,400,300,'#0b0d2a'),C(70,70,3,'#fff'),C(330,40,2,'#fff'),C(350,200,3,'#fff'),C(60,230,2,'#fff'),C(320,120,40,'#9c36b5'),P('M200 40Q250 110 250 190H150Q150 110 200 40Z','#f1f3f5'),C(200,120,18,'#74c0fc'),P('M150 160L110 220L150 200Z','#e03131'),P('M250 160L290 220L250 200Z','#e03131'),P('M175 190H225L200 255Z','#ff922b')],
Kopi:[R(0,0,400,300,'#f1e3c6'),R(110,110,150,130,'#7a4a2a'),R(110,110,150,24,'#4a2c17'),P('M260 140Q320 140 320 180Q320 220 260 220','#7a4a2a'),R(80,240,230,14,'#a47148'),P('M150 90Q140 60 160 40','#adb5bd'),P('M200 90Q190 60 210 40','#adb5bd')]};
const SH={rect:()=>R(150,100,100,80,0),circ:()=>C(200,150,45,0),tri:()=>P('M200 100L250 190H150Z',0),star:()=>P('M200 95L214 135L257 135L222 160L235 200L200 176L165 200L178 160L143 135L186 135Z',0)};
let cur='Rumah',st=[],sel=-1,hist=[],hi=-1,palS=[];
const cl=o=>JSON.parse(JSON.stringify(o));
function load(n){cur=n;st=cl(T[n]).map(s=>({...s,s:'#16171f',w:n=='Logo'?0:1.5,o:100,x:0,y:0}));sel=-1;hist=[JSON.stringify(st)];hi=0;draw()}
$('#tpl').innerHTML=Object.keys(T).map(k=>`<button>${k}</button>`).join('');
$('#tpl').onclick=e=>{if(e.target.tagName=='BUTTON')load(e.target.textContent)};
function el(s,i){const t=`transform="translate(${s.x} ${s.y})"`,c=`data-i="${i}" fill="${s.f||'#adb5bd'}" stroke="${s.s}" stroke-width="${s.w}" opacity="${s.o/100}" stroke-linejoin="round" style="cursor:move" ${t}`;
 return s.k=='r'?`<rect ${c} x="${s.a[0]}" y="${s.a[1]}" width="${s.a[2]}" height="${s.a[3]}"/>`:s.k=='c'?`<circle ${c} cx="${s.a[0]}" cy="${s.a[1]}" r="${s.a[2]}"/>`:`<path ${c} d="${s.a[0]}"/>`}
function draw(){
 $('#svg').innerHTML=st.map(el).join('')+(sel>=0&&st[sel]?`<g id="hl"></g>`:'');
 if(sel>=0&&st[sel]){const n=$('#svg').querySelector(`[data-i="${sel}"]`),b=n.getBBox(),s=st[sel];$('#hl').innerHTML=`<rect x="${b.x+s.x-3}" y="${b.y+s.y-3}" width="${b.width+6}" height="${b.height+6}" fill="none" stroke="#c2255c" stroke-width="1.5" stroke-dasharray="5 3" pointer-events="none"/>`;
  $('#now').textContent=`#${sel+1} ${({r:'kotak',c:'lingkaran',p:'path'})[s.k]}`;$('#fill').value=s.f||'#adb5bd';$('#strk').value=s.s;$('#sw2').value=s.w;$('#op').value=s.o}else $('#now').textContent='belum ada';
 $$('#tpl button').forEach(b=>b.classList.toggle('on',b.textContent==cur));$('#undo').disabled=hi<1;$('#redo').disabled=hi>=hist.length-1}
function push(){hist=hist.slice(0,hi+1);hist.push(JSON.stringify(st));hi++;draw()}
function drawPal(){palS=[...pal,'#ffffff','#16171f','#e03131','#fcc419','#1c7ed6','#2f9e44'];$('#pal').innerHTML=palS.map(c=>`<button style="background:${c}" data-c="${c}" aria-label="${c}"></button>`).join('')}
$('#pal').onclick=e=>{const c=e.target.dataset.c;if(c&&sel>=0){st[sel].f=c;push()}};
let drag=null;
$('#svg').onpointerdown=e=>{const t=e.target.closest('[data-i]');sel=t?+t.dataset.i:-1;if(t){const r=$('#svg').getBoundingClientRect();drag={px:e.clientX,py:e.clientY,x:st[sel].x,y:st[sel].y,k:400/r.width,m:0};$('#svg').setPointerCapture(e.pointerId)}draw()};
$('#svg').onpointermove=e=>{if(!drag)return;const s=st[sel];s.x=Math.round(drag.x+(e.clientX-drag.px)*drag.k);s.y=Math.round(drag.y+(e.clientY-drag.py)*drag.k);drag.m=1;draw()};
$('#svg').onpointerup=()=>{if(drag&&drag.m)push();drag=null};
const ed=(k,v)=>{if(sel>=0){st[sel][k]=v;draw()}};
$('#fill').oninput=e=>ed('f',e.target.value);$('#strk').oninput=e=>ed('s',e.target.value);$('#sw2').oninput=e=>ed('w',+e.target.value);$('#op').oninput=e=>ed('o',+e.target.value);
['fill','strk','sw2','op'].forEach(i=>$('#'+i).onchange=push);
document.querySelector('.tool').onclick=e=>{const a=e.target.dataset.a;if(!a)return;
 if(SH[a]){st.push({...SH[a](),f:palS[0]||'#c2255c',s:'#16171f',w:1.5,o:100,x:0,y:0});sel=st.length-1}
 else if(a=='rand'){const ps=pal.concat(['#16171f','#f4f2ee']);st.forEach((s,i)=>{if(!(T[cur][i]&&T[cur][i].f==0))s.f=ps[Math.floor(Math.random()*ps.length)]})}
 else if(sel>=0){const s=st[sel];if(a=='dup'){st.push({...cl(s),x:s.x+14,y:s.y+14});sel=st.length-1}else if(a=='del'){st.splice(sel,1);sel=-1}else if(a=='up'&&sel<st.length-1){[st[sel],st[sel+1]]=[st[sel+1],st[sel]];sel++}else if(a=='down'&&sel>0){[st[sel],st[sel-1]]=[st[sel-1],st[sel]];sel--}}
 push()};
const und=()=>{if(hi>0){st=JSON.parse(hist[--hi]);sel=-1;draw()}},red=()=>{if(hi<hist.length-1){st=JSON.parse(hist[++hi]);sel=-1;draw()}};
$('#undo').onclick=und;$('#redo').onclick=red;$('#reset').onclick=()=>load(cur);
document.addEventListener('keydown',e=>{if($('#v-studio').hidden||/INPUT/.test(e.target.tagName))return;if((e.ctrlKey||e.metaKey)&&e.key=='z'){e.preventDefault();und()}else if(e.key=='Delete'&&sel>=0){st.splice(sel,1);sel=-1;push()}});
function svgTxt(){const n=$('#svg').cloneNode(true);n.querySelector('#hl')?.remove();n.removeAttribute('style');n.querySelectorAll('[style]').forEach(x=>x.removeAttribute('style'));n.setAttribute('xmlns','http://www.w3.org/2000/svg');n.setAttribute('width',800);n.setAttribute('height',600);return n.outerHTML}
function dl(u,n){const a=document.createElement('a');a.href=u;a.download=n;a.click()}
$('#dsvg').onclick=()=>dl('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgTxt()),'colorcraft-'+cur+'.svg');
$('#dpng').onclick=()=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=1600;c.height=1200;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,1600,1200);x.drawImage(i,0,0,1600,1200);try{dl(c.toDataURL('image/png'),'colorcraft-'+cur+'.png')}catch(e){alert('PNG gagal, gunakan SVG')}};i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgTxt())};
/* kuis */
const sv=(b,bg='#fff')=>`<svg viewBox="0 0 200 110" role="img"><rect width="200" height="110" fill="${bg}"/>${b}</svg>`;
const mixI=(a,b,m)=>sv(`<defs><clipPath id="cp"><circle cx="82" cy="55" r="40"/></clipPath></defs><circle cx="82" cy="55" r="40" fill="${a}"/><circle cx="118" cy="55" r="40" fill="${b}"/><circle cx="118" cy="55" r="40" fill="${m}" clip-path="url(#cp)"/>`,'#f4f2ee');
const palI=cs=>sv(cs.map((c,i)=>`<rect x="${i*200/cs.length}" width="${200/cs.length+1}" height="110" fill="${c}"/>`).join(''));
const Rd='#e03131',Yl='#fcc419',Bl='#1c7ed6',Or='#f76707',Gr='#2f9e44',Pu='#9c36b5';
const Q=[
{t:'mc',img:mixI(Bl,Yl,Gr),q:'Dua tinta dicampur seperti gambar. Warna irisannya?',o:['Hijau','Ungu','Oranye'],a:0,e:'Biru + kuning = hijau (sekunder).'},
{t:'mc',img:mixI(Rd,Yl,Or),q:'Merah dan kuning bertemu. Irisannya berwarna…',o:['Ungu','Hijau','Oranye'],a:2,e:'Merah + kuning = oranye.'},
{t:'mc',img:mixI(Rd,Bl,Pu),q:'Merah dan biru bertemu. Irisannya berwarna…',o:['Ungu','Coklat','Hijau'],a:0,e:'Merah + biru = ungu.'},
{t:'color',q:'Pilih satu warna SEKUNDER.',o:[Rd,Yl,Bl,Gr],a:3,e:'Hijau lahir dari biru + kuning. Merah, kuning, biru adalah primer.'},
{t:'color',q:'Pilih komplementer biru (di roda RYB).',o:[Or,Gr,Pu,Rd],a:0,e:'Oranye berseberangan dengan biru.'},
{t:'mc',img:palI(['#e8590c',Or,'#fd9a14',Yl]),q:'Palet ini bertetangga di roda. Skemanya?',o:['Komplementer','Analogus','Triadik'],a:1,e:'Warna bertetangga disebut analogus.'},
{t:'mc',img:palI([Or,Bl]),q:'Oranye dan biru berseberangan. Skemanya?',o:['Komplementer','Analogus','Monokromatik'],a:0,e:'Dua warna berseberangan = komplementer.'},
{t:'mc',img:palI([Rd,Yl,Bl]),q:'Tiga warna berjarak sama (120°) ini disebut?',o:['Tetradik','Triadik','Analogus'],a:1,e:'Tiga warna berjarak 120° = triadik.'},
{t:'mc',img:sv('<text x="100" y="66" text-anchor="middle" font-size="26" font-weight="700" fill="#ffe066" font-family="Figtree,sans-serif">Diskon 50%</text>'),q:'Teks kuning muda di atas putih. Kontrasnya?',o:['Lulus WCAG','Gagal, terlalu rendah'],a:1,e:'Kuning terang di atas putih rasionya sekitar 1.3:1, jauh di bawah 4.5:1.'},
{t:'mc',img:sv('<defs><linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="#ff6b35"/><stop offset="1" stop-color="#f7c548"/></linearGradient></defs><rect width="200" height="110" fill="url(#g)"/><circle cx="100" cy="82" r="26" fill="#fff3b0"/>'),q:'Suasana senja ini didominasi warna…',o:['Hangat','Dingin','Netral'],a:0,e:'Oranye dan kuning termasuk warna hangat.'},
{t:'tf',q:'Merah-oranye termasuk warna tersier.',a:0,e:'Tersier = primer + sekunder di sebelahnya.'},
{t:'tf',q:'CMYK adalah model warna untuk layar.',a:1,e:'Layar memakai RGB. CMYK untuk cetak.'},
{t:'in',q:'Warna murni ditambah putih disebut… (satu kata)',k:['tint'],e:'Tint = warna + putih. Shade = + hitam. Tone = + abu.'},
{t:'in',q:'Di RGB, merah + hijau penuh menghasilkan warna…',k:['kuning','yellow'],e:'Campuran cahaya (aditif): merah + hijau = kuning.'},
{t:'mc',q:'Pada aturan 60-30-10, angka 10 untuk…',o:['Latar','Aksen','Teks'],a:1,e:'10% dipakai untuk aksen, seperti tombol dan titik fokus.'},
{t:'mix',c:'#e8743b',rgb:[232,116,59],q:'Praktik: campur RGB agar mendekati warna target.',e:'Target #e8743b (R232 G116 B59).'}];
let qi=0,sc=0,sk=0,bs=0,rv=[];
function ans(ok,q){const z=$('#quiz');if(ok){sc++;sk++;bs=Math.max(bs,sk)}else sk=0;rv.push(ok);z.querySelectorAll('.opt,button.btn,input').forEach(x=>x.disabled=true);
 $('#fb').innerHTML=`<div class="exp ${ok?'ok':'no'}"><b>${ok?'Benar!':'Kurang tepat.'}</b> ${q.e}</div><div class="row"><button class="btn pri" id="nb">${qi==Q.length-1?'Lihat hasil':'Lanjut'}</button></div>`;$('#nb').onclick=()=>{qi++;quiz()}}
function quiz(){const z=$('#quiz');if(qi>=Q.length)return fin();const q=Q[qi];
 let b=`<div class="bar"><div style="width:${qi/Q.length*100}%"></div></div><div class="qm"><span>Soal ${qi+1}/${Q.length}</span><span>Skor ${sc} · Streak ${sk}</span></div>`;
 if(q.img)b+=`<figure class="qimg">${q.img}</figure>`;b+=`<p class="q">${q.q}</p>`;
 if(q.t=='mc'||q.t=='tf')b+=(q.t=='tf'?['Benar','Salah']:q.o).map((x,i)=>`<button class="opt" data-i="${i}">${x}</button>`).join('');
 if(q.t=='color')b+='<div class="opts-c">'+q.o.map((c,i)=>`<button class="opt" data-i="${i}" style="background:${c}" aria-label="Pilihan ${i+1}"></button>`).join('')+'</div>';
 if(q.t=='in')b+='<input class="in" id="ans" placeholder="Ketik jawabanmu..." autocomplete="off"><div class="row"><button class="btn pri" id="ok">Periksa</button></div>';
 if(q.t=='mix')b+=`<div class="mixp" style="background:${q.c}"></div><p class="hint">Target di atas. Campuranmu:</p><div class="mixp" id="mm" style="background:rgb(128,128,128)"></div>`+['R','G','B'].map(c=>`<label>${c}<input type="range" min="0" max="255" value="128" class="mr"></label>`).join('')+'<div class="row"><button class="btn pri" id="ok">Periksa</button></div>';
 z.innerHTML=b+'<div id="fb"></div>';
 if(q.t=='in')$('#ok').onclick=()=>ans(q.k.includes($('#ans').value.trim().toLowerCase()),q);
 else if(q.t=='mix'){const v=()=>[...z.querySelectorAll('.mr')].map(x=>+x.value);z.querySelectorAll('.mr').forEach(x=>x.oninput=()=>$('#mm').style.background=`rgb(${v()})`);$('#ok').onclick=()=>ans(Math.hypot(...v().map((n,i)=>n-q.rgb[i]))<90,q)}
 else z.querySelectorAll('.opt').forEach(x=>x.onclick=()=>{const i=+x.dataset.i;z.querySelectorAll('.opt').forEach((y,j)=>{if(j==q.a)y.classList.add('ok');else if(j==i)y.classList.add('no')});ans(i==q.a,q)})}
function fin(){const z=$('#quiz'),g=sc>=14?'Master Warna':sc>=10?'Desainer Handal':sc>=6?'Pemula Berbakat':'Terus Berlatih';
 z.innerHTML=`<div class="bar"><div style="width:100%"></div></div><p class="kick">Hasil akhir</p><div class="big">${sc}/${Q.length}</div><h3>${g}</h3><p class="hint">Streak terbaik: ${bs} benar berturut-turut.</p><div class="rv">${rv.map((o,i)=>`<i class="${o?'ok':'no'}" style="animation-delay:${i*50}ms"></i>`).join('')}</div><button class="btn pri" id="again">Ulangi</button>`;
 $('#again').onclick=()=>{qi=sc=sk=bs=0;rv=[];quiz()};
 if(sc>=10)for(let i=0;i<46;i++){const c=document.createElement('i');c.className='cf';c.style.cssText=`--x:${Math.random()*100}%;--c:${hex(Math.random()*360,80,58)};--d:${Math.random()*.9}s`;document.body.append(c);setTimeout(()=>c.remove(),4000)}}

/* tambahan */
Object.assign(T,{
Pantai:[R(0,0,400,300,'#8ecae6'),C(320,60,30,'#ffd166'),R(0,150,400,80,'#219ebc'),R(0,215,400,85,'#f4e3b2'),P('M88 235L98 100L108 100L106 235Z','#7a4a2a'),P('M100 100Q55 65 25 105Q70 88 100 100Z','#2f9e44'),P('M100 100Q150 65 180 105Q135 88 100 100Z','#2f9e44'),P('M100 98Q90 60 70 55Q95 70 104 98Z','#40c057'),C(270,258,16,'#ef476f')],
'Es Krim':[R(0,0,400,300,'#ffe5ec'),P('M150 140L250 140L200 275Z','#e0a96d'),C(200,125,52,'#ff8fab'),C(200,82,40,'#fff0f3'),C(200,40,10,'#d00000'),C(300,60,14,'#ffd6e0'),C(90,230,18,'#fcd5ce')],
Mobil:[R(0,0,400,300,'#caf0f8'),R(0,225,400,75,'#495057'),R(60,150,280,62,'#e63946'),P('M110 150L150 105H250L290 150Z','#e63946'),P('M122 150L156 114H196V150Z','#a8dadc'),P('M204 150V114H244L278 150Z','#a8dadc'),C(120,215,28,'#212529'),C(280,215,28,'#212529'),C(120,215,12,'#ced4da'),C(280,215,12,'#ced4da'),C(330,50,24,'#ffd166')],
Hutan:[R(0,0,400,300,'#d8f3dc'),C(70,55,26,'#ffe066'),R(0,240,400,60,'#40916c'),P('M100 60L150 150H50Z','#2d6a4f'),P('M100 100L160 200H40Z','#2d6a4f'),R(92,200,16,42,'#6f4e37'),P('M270 80L320 170H220Z','#1b4332'),P('M270 120L330 220H210Z','#1b4332'),R(262,220,16,30,'#6f4e37')],
Ikan:[R(0,0,400,300,'#0077b6'),C(80,60,8,'#90e0ef'),C(100,38,5,'#90e0ef'),C(330,70,6,'#90e0ef'),P('M90 150Q170 70 270 150Q170 230 90 150Z','#ff9f1c'),P('M270 150L335 108V192Z','#ff9f1c'),P('M180 95Q200 150 180 205Q215 190 215 150Q215 110 180 95Z','#ffbf69'),C(130,140,8,'#fff'),C(132,140,4,'#111'),R(0,265,400,35,'#023e8a')],
Pesawat:[R(0,0,400,300,'#74c0fc'),C(70,70,26,'#fff'),C(100,76,30,'#fff'),C(320,235,28,'#fff'),C(350,240,22,'#fff'),P('M60 150Q60 130 100 130H300Q350 140 350 155Q350 170 300 172H100Q60 170 60 150Z','#f8f9fa'),P('M170 152L120 232H168L245 154Z','#e03131'),P('M80 135L55 90H92L122 133Z','#e03131'),R(170,140,18,12,'#74c0fc'),R(200,140,18,12,'#74c0fc'),R(230,140,18,12,'#74c0fc')]});
$('#tpl').innerHTML=Object.keys(T).map(k=>`<button>${k}</button>`).join('');
SH.heart=()=>P('M200 210C120 150 130 90 175 100C190 104 200 118 200 118C200 118 210 104 225 100C270 90 280 150 200 210Z',0);
SH.hex=()=>P('M200 90L250 120V180L200 210L150 180V120Z',0);
$('.tool').insertAdjacentHTML('afterbegin','<button class="btn" data-a="heart">+ Hati</button><button class="btn" data-a="hex">+ Segi6</button>');
const _ld=load;load=function(n){_ld(n);$('#svg').querySelectorAll('[data-i]').forEach((e,i)=>{e.style.animation=`fade .5s ${i*45}ms backwards`})};
const _lab=lab;lab=function(){_lab();ts()};
function ts(){const row=(n,f)=>`<p class="hint">${n}</p><div class="sw sm">${[1,2,3,4,5,6,7].map(i=>{const c=f(i/8);return`<button style="background:${c};color:${txc(c)};text-shadow:none" data-c="${c}">${c}</button>`}).join('')}</div>`;
 $('#tts').innerHTML=row('Tint (+putih)',t=>hex(H,S,L+(97-L)*t))+row('Tone (+abu)',t=>hex(H,S*(1-t*.9),L))+row('Shade (+hitam)',t=>hex(H,S,L*(1-t*.85)));
 const g=`linear-gradient(135deg,${pal.join(',')})`;$('#grad').style.backgroundImage=g;$('#gcode').textContent='background: '+g+';'}
$('#tts').onclick=e=>{const c=e.target.dataset.c;if(c){[H,S,L]=x2h(c);lab()}};
if(window.EyeDropper){$('#toStudio').insertAdjacentHTML('beforebegin','<button class="btn" id="eye">Pipet layar</button>');$('#eye').onclick=()=>new EyeDropper().open().then(r=>{[H,S,L]=x2h(r.sRGBHex);lab()}).catch(()=>{})}
function dm(){const v=[...$$('.dr')].map(x=>+x.value),h='#'+v.map(n=>n.toString(16).padStart(2,'0')).join('');$('#dm').style.background=h;$('#dmt').textContent=`rgb(${v}) · ${h}`}
M.push(
['Demo: pencampur RGB','<p>Layar mencampur cahaya merah, hijau, dan biru. Geser slider dan amati hasilnya.</p><div class="mixp" id="dm" style="background:rgb(128,128,128)"></div><p class="hint" id="dmt">rgb(128,128,128) · #808080</p>'+['R','G','B'].map(c=>`<label>${c}<input type="range" min="0" max="255" value="128" class="dr" oninput="dm()"></label>`).join('')+'<p>Coba R=255, G=255, B=0: hasilnya kuning, bukan hijau. Itu ciri campuran aditif.</p>'],
['Sejarah teori warna','<ul><li><b>1666</b> Isaac Newton menguraikan cahaya putih dengan prisma menjadi spektrum.</li><li><b>1810</b> Goethe menulis <i>Zur Farbenlehre</i> tentang persepsi dan efek psikologis warna.</li><li><b>1839</b> Chevreul merumuskan kontras simultan.</li><li><b>1905</b> Munsell menyusun sistem hue, value, chroma.</li><li><b>1961</b> Johannes Itten (Bauhaus) menerbitkan <i>The Art of Color</i>, dasar banyak skema harmoni yang diajarkan sekarang.</li></ul>'],
['Kontras simultan (ilusi)','<p>Warna yang sama tampak berbeda tergantung latarnya. Kedua kotak abu di bawah persis sama.</p><div class="sim"><div style="background:#222"><i></i></div><div style="background:#eee"><i></i></div></div><p>Pelajaran untuk desainer: warna tidak pernah dinilai sendirian. Selalu uji di konteks aslinya.</p>'],
['Buta warna','<p>Sekitar 8% pria dan 0,5% wanita punya defisiensi penglihatan warna, paling umum merah-hijau (deuteranopia, protanopia).</p><div class="sim"><div style="background:#d9534f"></div><div style="background:#5cb85c"></div></div><p>Dua warna ini bisa terlihat mirip. Selalu tambahkan ikon, pola, atau label, dan cek kontras terang-gelapnya.</p>'],
['Warna dan budaya','<ul><li>Merah: keberuntungan di Tiongkok, tetapi tanda peringatan di banyak konteks lain.</li><li>Putih: kesucian di Barat, simbol duka di sebagian budaya Asia Timur.</li><li>Merah-putih: identitas nasional Indonesia.</li><li>Hijau: sering dikaitkan dengan alam dan Islam.</li></ul><p>Riset audiens sebelum memutuskan palet untuk pasar lintas budaya.</p>'],
['Warna dalam branding','<ul><li>Tentukan kepribadian merek dulu, baru warnanya.</li><li>Pakai 1 warna utama, 1-2 pendukung, dan netral.</li><li>Konsisten di semua media; simpan nilai HEX dan CMYK.</li><li>Cek keterbacaan logo pada latar terang, gelap, dan hitam-putih.</li></ul>'],
['Warna di UI & tipografi','<ul><li>Hierarki: aksen hanya untuk aksi utama.</li><li>Beri status jelas: sukses, peringatan, error, info, plus ikon.</li><li>Teks isi minimal 4.5:1, hindari hitam murni di atas putih murni.</li><li>Sediakan mode gelap dengan menurunkan saturasi.</li></ul>']);
$('#mlist').innerHTML=M.map((m,i)=>`<button data-i="${i}">${i+1}. ${m[0]}</button>`).join('');
const seen=new Set(),_mat=mat;
mat=function(i){_mat(i);seen.add(i);const h=i*47;$('#mbody').insertAdjacentHTML('afterbegin',`<div class="ban" style="background-image:linear-gradient(110deg,hsl(${h} 80% 55%),hsl(${h+60} 85% 60%),hsl(${h+130} 75% 50%),hsl(${h} 80% 55%))"></div>`);$$('#mlist button').forEach((b,j)=>b.classList.toggle('done',seen.has(j)));const e=$('#mbody');e.style.animation='none';e.offsetWidth;e.style.animation='rise .5s'};
mat(0);
$('#hsw').innerHTML=[...Array(14)].map((_,i)=>`<i style="--i:${i};background:${hex(i*26,78,52)}"></i>`).join('');
$$('.cards .card').forEach((c,i)=>c.style.setProperty('--i',i));
$$('.stats b').forEach(b=>{const n=+b.dataset.n;let t0;const f=t=>{t0=t0||t;const p=Math.min((t-t0)/1200,1);b.textContent=Math.round(n*(1-(1-p)**3));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)});
document.addEventListener('pointermove',e=>{const c=e.target.closest('.card,.panel');if(c){const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}});

/* init */
lab();ctr();load('Rumah');quiz();go('home');