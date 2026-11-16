const $=s=>document.querySelector(s);
/* ===== Hero ===== */
const stage=$('#stage'),dots=[...stage.querySelectorAll('.dot')];
stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
dots.forEach((d,i)=>{const k=[70,-70,40][i],j=[40,60,-90][i];d.style.transform=`translate(${x*k*(i?1:-1)*2}px,${y*j*2}px)`})});

/* ===== Lab Warna ===== */
function hex(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1)))).toString(16).padStart(2,'0')};return '#'+f(0)+f(8)+f(4)}
const SK={
 'Monokromatik':{o:[0],d:'Satu hue, lima tingkat terang-gelap. Aman dan rapi untuk UI dan branding minimalis.'},
 'Analogus':{o:[-40,-20,0,20,40],d:'Hue bersebelahan di roda. Terasa tenang dan menyatu, cocok untuk background dan ilustrasi alam.'},
 'Komplementer':{o:[0,180],d:'Dua hue berseberangan. Kontras paling kuat, cocok untuk poster dan CTA. Pakai satu sebagai dominan, satu sebagai aksen.'},
 'Split komplementer':{o:[0,150,210],d:'Satu hue dan dua tetangga lawannya. Tetap kontras tapi tidak setegang komplementer.'},
 'Triadik':{o:[0,120,240],d:'Tiga hue berjarak 120°. Ceria dan seimbang, sering dipakai desain anak muda dan event.'},
 'Tetradik':{o:[0,90,180,270],d:'Empat hue (dua pasang komplementer). Kaya, tapi butuh satu warna dominan agar tidak ramai.'}
};
let sk='Komplementer',pal=[];
const H=$('#h'),S=$('#s'),L=$('#l'),wheel=$('#wheel');
$('#tabs').innerHTML=Object.keys(SK).map(k=>`<button data-k="${k}">${k}</button>`).join('');
$('#tabs').onclick=e=>{if(e.target.dataset.k){sk=e.target.dataset.k;drawLab()}};
function drawLab(){
 const h=+H.value,s=+S.value,l=+L.value;
 pal=sk=='Monokromatik'?[20,35,50,65,82].map(x=>hex(h,s,x)):SK[sk].o.map(o=>hex(h+o,s,l));
 document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.k==sk));
 $('#sw').innerHTML=pal.map(c=>`<button style="background:${c}" data-c="${c}"><span>${c.toUpperCase()}</span></button>`).join('');
 $('#desc').textContent=SK[sk].d;
 wheel.querySelectorAll('.pin').forEach(p=>p.remove());
 (sk=='Monokromatik'?[0]:SK[sk].o).forEach((o,i)=>{const a=(h+o)*Math.PI/180,p=document.createElement('div');p.className='pin';p.style.cssText=`left:${50+37*Math.cos(a)}%;top:${50+37*Math.sin(a)}%;background:${pal[i]}`;wheel.append(p)});
}
[H,S,L].forEach(i=>i.oninput=drawLab);
function pick(e){const r=wheel.getBoundingClientRect();H.value=Math.round((Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2)*180/Math.PI+360)%360);drawLab()}
wheel.onpointerdown=e=>{wheel.setPointerCapture(e.pointerId);pick(e);wheel.onpointermove=pick};
wheel.onpointerup=()=>wheel.onpointermove=null;
$('#sw').onclick=e=>{const b=e.target.closest('button');if(!b)return;try{navigator.clipboard.writeText(b.dataset.c)}catch(_){}$('#copied').textContent='Tersalin '+b.dataset.c.toUpperCase()};
drawLab();

/* ===== Studio Vektor ===== */
const T={
'Rumah':[['Langit','rect','x=0 y=0 width=400 height=300','#BFE9FF'],['Matahari','circle','cx=340 cy=60 r=34','#FFE600'],['Bukit','path','d="M0 225 Q120 140 260 215 T400 200 V300 H0Z"','#7ED957'],['Tanah','rect','x=0 y=240 width=400 height=60','#3FA34D'],['Dinding','rect','x=110 y=135 width=150 height=110','#FFD6A5'],['Atap','polygon','points="95,140 185,70 275,140"','#EC008C'],['Pintu','rect','x=165 y=190 width=38 height=55','#6B3E26'],['Jendela kiri','rect','x=122 y=160 width=32 height=32','#00AEEF'],['Jendela kanan','rect','x=216 y=160 width=32 height=32','#00AEEF'],['Batang pohon','rect','x=305 y=190 width=14 height=55','#6B3E26'],['Daun pohon','circle','cx=312 cy=175 r=34','#1F8F4E']],
'Gunung':[['Langit','rect','x=0 y=0 width=400 height=300','#FFB88C'],['Matahari','circle','cx=200 cy=115 r=52','#FFE600'],['Gunung kiri','polygon','points="0,245 120,90 250,245"','#7C6CF0'],['Gunung kanan','polygon','points="140,245 290,65 400,245"','#3D2C8D'],['Salju','polygon','points="290,65 262,108 280,102 292,120 308,102 322,110"','#FFFFFF'],['Danau','rect','x=0 y=240 width=400 height=60','#00AEEF'],['Pohon kiri','polygon','points="30,240 55,170 80,240"','#1B7F4B'],['Pohon kanan','polygon','points="330,240 352,180 374,240"','#1B7F4B']],
'Kota':[['Langit','rect','x=0 y=0 width=400 height=300','#1B1464'],['Bulan','circle','cx=330 cy=55 r=26','#FFE600'],['Gedung 1','rect','x=30 y=120 width=70 height=150','#EC008C'],['Gedung 2','rect','x=110 y=70 width=80 height=200','#00AEEF'],['Gedung 3','rect','x=200 y=140 width=60 height=130','#FFE600'],['Gedung 4','rect','x=270 y=95 width=90 height=175','#7C4DFF'],['Jalan','rect','x=0 y=255 width=400 height=45','#333333']],
'Logo Kopi':[['Latar','rect','x=0 y=0 width=400 height=300','#FFE600'],['Lingkaran','circle','cx=200 cy=150 r=115','#EC008C'],['Gagang','rect','x=255 y=130 width=48 height=48 rx=22','#00AEEF'],['Cangkir','path','d="M140 115 H265 V165 Q265 215 202 215 Q140 215 140 165Z"','#FFFFFF'],['Tatakan','ellipse','cx=202 cy=222 rx=85 ry=12','#111111'],['Uap besar','circle','cx=185 cy=88 r=11','#FFFFFF'],['Uap kecil','circle','cx=212 cy=68 r=8','#FFFFFF']]
};
let tn='Rumah',cur={},sel=-1;
const cv=$('#canvas');
const PAL=['#FFFFFF','#111111','#FFE600','#00AEEF','#EC008C','#7ED957','#FF8A00','#7C4DFF'];
function drawPal(){const p=[...pal,...PAL].slice(0,16);$('#pal').innerHTML=p.map(c=>`<button style="background:${c}" data-c="${c}" title="${c}" aria-label="${c}"></button>`).join('')}
function draw(){
 cur[tn]=cur[tn]||T[tn].map(i=>i[3]);sel=-1;$('#now').textContent='belum ada';
 cv.innerHTML=`<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">${T[tn].map((it,i)=>`<${it[1]} class="f" data-i="${i}" ${it[2]} fill="${cur[tn][i]}"><title>${it[0]}</title></${it[1]}>`).join('')}</svg>`;
 document.querySelectorAll('#tpl button').forEach(b=>b.classList.toggle('on',b.dataset.t==tn));
}
$('#tpl').innerHTML=Object.keys(T).map(k=>`<button data-t="${k}">${k}</button>`).join('');
$('#tpl').onclick=e=>{if(e.target.dataset.t){tn=e.target.dataset.t;draw()}};
cv.onclick=e=>{const el=e.target.closest('.f');if(!el)return;cv.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));el.classList.add('sel');sel=+el.dataset.i;$('#now').textContent=T[tn][sel][0]};
function paint(c){if(sel<0){$('#now').textContent='klik bagian gambar dulu';return}cur[tn][sel]=c;cv.querySelector(`[data-i="${sel}"]`).setAttribute('fill',c)}
$('#pal').onclick=e=>{if(e.target.dataset.c)paint(e.target.dataset.c)};
$('#free').oninput=e=>paint(e.target.value);
$('#reset').onclick=()=>{delete cur[tn];draw()};
$('#toStudio').onclick=()=>{drawPal();location.hash='#studio'};
function svgText(){const s=cv.querySelector('svg').cloneNode(true);s.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));s.querySelectorAll('.f').forEach(x=>{x.setAttribute('stroke','#111');x.setAttribute('stroke-width','2.5')});s.setAttribute('width',800);s.setAttribute('height',600);return new XMLSerializer().serializeToString(s)}
function save(url,name){const a=document.createElement('a');a.href=url;a.download=name;a.click()}
$('#svg').onclick=()=>{const u=URL.createObjectURL(new Blob([svgText()],{type:'image/svg+xml'}));save(u,tn.toLowerCase().replace(' ','-')+'.svg')};
$('#png').onclick=()=>{const img=new Image(),u=URL.createObjectURL(new Blob([svgText()],{type:'image/svg+xml'}));img.onload=()=>{const c=document.createElement('canvas');c.width=800;c.height=600;c.getContext('2d').drawImage(img,0,0);save(c.toDataURL('image/png'),tn.toLowerCase().replace(' ','-')+'.png')};img.src=u};
drawPal();draw();

/* ===== Kuis ===== */
const Q=[
['Model warna apa yang tepat untuk desain poster yang akan dicetak offset?',['RGB','CMYK','HEX saja','Grayscale saja'],1,'Cetak memakai tinta Cyan, Magenta, Yellow, dan Key (hitam), jadi file desain disiapkan dalam CMYK. RGB untuk layar.'],
['Warna primer pada model RGB adalah…',['Merah, Kuning, Biru','Cyan, Magenta, Yellow','Merah, Hijau, Biru','Hitam, Putih, Abu'],2,'RGB adalah warna cahaya: Red, Green, Blue. Campuran ketiganya pada intensitas penuh menghasilkan putih.'],
['Huruf "K" pada CMYK berarti…',['Kuning','Kontras','Key (hitam)','Kromatik'],2,'K = Key, yaitu plat hitam yang menjadi acuan detail dan teks pada cetak. Kuning sudah diwakili huruf Y.'],
['Pada roda warna, pasangan komplementer dari biru adalah…',['Hijau','Ungu','Oranye','Cyan'],2,'Komplementer berada tepat berseberangan. Pada roda RYB, biru berhadapan dengan oranye.'],
['Skema analogus adalah kombinasi warna yang…',['Berseberangan','Bersebelahan di roda warna','Berjarak 120°','Hanya hitam putih'],1,'Analogus memakai 2 sampai 5 hue bersebelahan sehingga terasa harmonis dan menyatu.'],
['Tiga warna dengan jarak 120° di roda warna disebut skema…',['Triadik','Tetradik','Monokromatik','Analogus'],0,'Triad = tiga. Contoh klasik: merah, kuning, biru atau oranye, hijau, ungu.'],
['Saturation menunjukkan…',['Terang gelap warna','Jenis warna','Kemurnian atau kepekatan warna','Suhu warna'],2,'Saturasi rendah tampak pucat/abu, saturasi tinggi tampak pekat. Terang gelap adalah Brightness/Lightness.'],
['Warna biru ditambah putih menghasilkan…',['Shade','Tint','Tone','Hue'],1,'Tint = warna + putih. Shade = warna + hitam. Tone = warna + abu.'],
['Kelompok mana yang termasuk warna hangat?',['Biru, hijau, ungu','Merah, oranye, kuning','Cyan, biru, abu','Hijau, biru, nila'],1,'Merah, oranye, kuning memberi kesan energik dan terasa "maju" mendekati mata.'],
['Logo bank sering memakai warna biru karena memberi kesan…',['Marah dan agresif','Lapar','Tepercaya dan stabil','Murah meriah'],2,'Dalam psikologi warna, biru dikaitkan dengan kepercayaan, keamanan, dan profesionalitas.'],
['Teks kuning terang di atas latar putih sulit dibaca. Masalahnya ada di…',['Hue','Kontras terlalu rendah','Font terlalu tebal','Mode CMYK'],1,'Keduanya sama-sama terang sehingga selisih kecerahannya kecil. Pakai teks gelap atau ganti latar.'],
['Aturan 60-30-10 dalam komposisi warna berarti…',['60% hitam, 30% putih, 10% abu','60% dominan, 30% pendukung, 10% aksen','60 px, 30 px, 10 px','60 warna berbeda'],1,'Satu warna dominan, satu pendukung, dan sedikit warna aksen untuk elemen yang harus menarik perhatian.'],
['Kode HEX #FF0000 menghasilkan warna…',['Hijau','Biru','Merah','Kuning'],2,'HEX terdiri dari tiga pasang angka: RR GG BB. FF 00 00 = merah penuh, hijau dan biru nol.'],
['Skema monokromatik memakai…',['Satu hue dengan variasi terang gelap','Hitam dan putih saja','Semua warna pelangi','Dua warna komplementer'],0,'Satu hue yang diubah saturasi atau brightness-nya. Aman, rapi, susah salah.'],
['Pada desain bertema "es krim stroberi dan mint" yang kontras tapi lembut, skema paling cocok adalah…',['Komplementer pastel (pink + mint)','Monokromatik hitam','Hanya warna netral','Warna neon semua'],0,'Pink dan mint berseberangan di roda warna (komplementer). Dibuat pastel dengan menaikkan brightness dan menurunkan saturasi.']
];
let qi=0,sc=0,ans=false;
const qz=$('#quiz');
function qShow(){
 if(qi>=Q.length){const p=Math.round(sc/Q.length*100);qz.innerHTML=`<p class="big">${sc}/${Q.length}</p><h3 style="font-size:1.6rem">${p>=80?'Siap jadi desainer.':p>=60?'Sudah bagus, rapikan lagi.':'Baca materi lagi, lalu coba ulang.'}</h3><p style="margin:12px 0 20px">Nilai kamu ${p}.</p><button class="btn pri" id="again">Ulangi kuis</button>`;$('#again').onclick=()=>{qi=sc=0;qShow()};return}
 const q=Q[qi];ans=false;
 qz.innerHTML=`<div class="bar"><div style="width:${qi/Q.length*100}%"></div></div><p><b>Soal ${qi+1} dari ${Q.length}</b></p><p class="q">${q[0]}</p>${q[1].map((o,i)=>`<button class="opt" data-i="${i}">${'ABCD'[i]}. ${o}</button>`).join('')}<div id="fb"></div>`;
}
qz.onclick=e=>{const b=e.target.closest('.opt');if(!b||ans)return;ans=true;const q=Q[qi],i=+b.dataset.i;
 qz.querySelectorAll('.opt').forEach((o,k)=>{o.disabled=true;if(k==q[2])o.classList.add('ok')});
 if(i==q[2])sc++;else b.classList.add('no');
 $('#fb').innerHTML=`<div class="exp"><b>${i==q[2]?'Benar.':'Kurang tepat.'}</b> ${q[3]}</div><button class="btn" id="nx">${qi==Q.length-1?'Lihat nilai':'Soal berikutnya'}</button>`;
 $('#nx').onclick=()=>{qi++;qShow()}};
qShow();
