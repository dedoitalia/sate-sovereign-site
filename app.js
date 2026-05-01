const REDUCED=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const HERO=document.querySelector('.hero');

(function(){
  const c=document.getElementById('mesh-canvas');
  if(!c||!HERO)return;
  const gl=c.getContext('webgl',{antialias:false,alpha:true,premultipliedAlpha:false});
  if(!gl){document.body.classList.add('no-webgl');return}
  const VS='attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';
  const FS='precision highp float;uniform vec2 r;uniform float t;uniform vec2 m;\nvec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}\nvec2 mod289v(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}\nvec3 perm(vec3 x){return mod289(((x*34.0)+1.0)*x);}\nfloat n2(vec2 v){const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);\nvec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);\nvec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);\nvec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289v(i);\nvec3 p=perm(perm(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));\nvec3 mm=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);\nmm=mm*mm;mm=mm*mm;\nvec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;\nmm*=1.79284291400159-0.85373472095314*(a0*a0+h*h);\nvec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;\nreturn 130.0*dot(mm,g);}\nfloat fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<3;i++){v+=a*n2(p);p*=2.1;a*=0.55;}return v;}\nvoid main(){\n  vec2 uv=gl_FragCoord.xy/r.xy;vec2 p=uv*2.0-1.0;p.x*=r.x/r.y;\n  float tm=t*0.10;\n  vec2 q=p+0.18*vec2(fbm(p+tm),fbm(p-tm*0.7));\n  float a=fbm(q*1.1+vec2(tm,tm*0.7));\n  float b=fbm(q*0.6-vec2(tm*0.5,tm*1.2));\n  float d=fbm(q*1.7+vec2(tm*0.3,-tm*0.8));\n  float e=n2(q*3.0-vec2(tm*0.4,tm*0.2));\n  float md=length(p-m);float mh=smoothstep(0.85,0.0,md)*0.32;\n  vec3 c1=vec3(0.020,0.062,0.149);\n  vec3 c2=vec3(0.118,0.290,0.580);\n  vec3 c3=vec3(0.760,0.110,0.180);\n  vec3 c4=vec3(0.929,0.706,0.466);\n  vec3 col=c1;\n  col=mix(col,c2,smoothstep(-0.25,0.55,a));\n  col=mix(col,c3,smoothstep(0.15,0.85,b)*0.62);\n  col=mix(col,c4,smoothstep(0.35,0.95,d)*0.42);\n  col+=c4*mh;\n  col+=vec3(0.06,0.05,0.03)*smoothstep(0.4,0.9,e);\n  float v=1.0-smoothstep(0.5,1.4,length(p));col*=mix(0.55,1.0,v);\n  col=pow(col,vec3(0.92));\n  gl_FragColor=vec4(col,1.0);\n}';
  function compile(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s}
  const prog=gl.createProgram();
  gl.attachShader(prog,compile(gl.VERTEX_SHADER,VS));
  gl.attachShader(prog,compile(gl.FRAGMENT_SHADER,FS));
  gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){document.body.classList.add('no-webgl');return}
  gl.useProgram(prog);
  const buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const aLoc=gl.getAttribLocation(prog,'a');
  gl.enableVertexAttribArray(aLoc);
  gl.vertexAttribPointer(aLoc,2,gl.FLOAT,false,0,0);
  const uR=gl.getUniformLocation(prog,'r'),uT=gl.getUniformLocation(prog,'t'),uM=gl.getUniformLocation(prog,'m');
  let mx=0,my=0,tmx=0,tmy=0;
  HERO.addEventListener('mousemove',e=>{const rc=HERO.getBoundingClientRect();tmx=((e.clientX-rc.left)/rc.width)*2-1;tmy=-(((e.clientY-rc.top)/rc.height)*2-1)*(rc.height/rc.width);},{passive:true});
  function rs(){const rc=c.getBoundingClientRect();const dpr=Math.min(devicePixelRatio,2);c.width=rc.width*dpr;c.height=rc.height*dpr;gl.viewport(0,0,c.width,c.height)}
  rs();window.addEventListener('resize',rs);
  const start=performance.now();
  function f(now){const t=(now-start)/1000;mx+=(tmx-mx)*0.05;my+=(tmy-my)*0.05;gl.uniform2f(uR,c.width,c.height);gl.uniform1f(uT,t);gl.uniform2f(uM,mx,my);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);if(!REDUCED)requestAnimationFrame(f)}
  requestAnimationFrame(f);
})();

(function(){
  const c=document.getElementById('neural-canvas');
  if(!c||!HERO||REDUCED)return;
  const ctx=c.getContext('2d');
  let W,H,P,raf,mx=-9999,my=-9999,trail=[];
  let pulses=[];
  HERO.addEventListener('mousemove',e=>{const rc=HERO.getBoundingClientRect();mx=e.clientX-rc.left;my=e.clientY-rc.top;trail.push({x:mx,y:my,life:1});if(trail.length>22)trail.shift()},{passive:true});
  HERO.addEventListener('mouseleave',()=>{mx=-9999;my=-9999});
  function rs(){const re=HERO.getBoundingClientRect();W=c.width=re.width*devicePixelRatio;H=c.height=re.height*devicePixelRatio;c.style.width=re.width+'px';c.style.height=re.height+'px';ctx.setTransform(1,0,0,1,0,0);ctx.scale(devicePixelRatio,devicePixelRatio);ip()}
  function ip(){const n=Math.min(85,Math.floor((W*H)/34000));P=[];for(let i=0;i<n;i++)P.push({x:Math.random()*(W/devicePixelRatio),y:Math.random()*(H/devicePixelRatio),vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:Math.random()*1.6+0.6,ph:Math.random()*Math.PI*2});pulses=[]}
  const M=140;
  function spawnPulse(){
    if(P.length<2)return;
    const i=Math.floor(Math.random()*P.length);
    let best=-1,bestD=M*M;
    for(let j=0;j<P.length;j++){if(j===i)continue;const dx=P[i].x-P[j].x,dy=P[i].y-P[j].y,d=dx*dx+dy*dy;if(d<bestD&&Math.random()>0.4){best=j;bestD=d}}
    if(best>=0)pulses.push({a:i,b:best,t:0,sp:0.012+Math.random()*0.012})
  }
  function tk(){
    const w=W/devicePixelRatio,he=H/devicePixelRatio;
    ctx.clearRect(0,0,w,he);
    if(trail.length){
      for(let i=0;i<trail.length;i++){const tp=trail[i];tp.life-=0.04;}
      trail=trail.filter(tp=>tp.life>0);
      for(let i=0;i<trail.length;i++){const tp=trail[i];const a=tp.life*0.35;ctx.beginPath();ctx.arc(tp.x,tp.y,3+tp.life*5,0,Math.PI*2);ctx.fillStyle='rgba(255,225,180,'+a+')';ctx.fill()}
    }
    const intensities=new Array(P.length);
    const tt=performance.now()*0.001;
    for(let i=0;i<P.length;i++){
      const p=P[i];
      p.x+=p.vx+Math.sin(tt+p.ph)*0.05;
      p.y+=p.vy+Math.cos(tt*0.8+p.ph)*0.04;
      if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>he)p.vy*=-1;
      const dx=p.x-mx,dy=p.y-my,dm=Math.sqrt(dx*dx+dy*dy);
      const I=dm<200?Math.max(0,1-dm/200):0;
      intensities[i]=I;
      if(I>0){p.vx-=dx*0.00022*I;p.vy-=dy*0.00022*I}
      p.vx*=0.992;p.vy*=0.992;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r*(1+I*1.1),0,Math.PI*2);
      ctx.fillStyle='rgba(220,180,130,'+(0.6+I*0.4)+')';ctx.fill();
      if(I>0.35){ctx.beginPath();ctx.arc(p.x,p.y,p.r*(2.4+I*2.4),0,Math.PI*2);ctx.fillStyle='rgba(255,225,180,'+(I*0.18)+')';ctx.fill()}
    }
    for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){
      const a=P[i],b=P[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;
      if(d<M*M){
        const al=(1-Math.sqrt(d)/M)*0.28;
        const Ib=Math.max(intensities[i],intensities[j]);
        const lw=0.6+Ib*1.4;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle='rgba(212,165,116,'+(al+Ib*0.55)+')';
        ctx.lineWidth=lw;ctx.stroke();
      }
    }
    if(Math.random()<0.18&&pulses.length<14)spawnPulse();
    for(let i=pulses.length-1;i>=0;i--){
      const pu=pulses[i];if(!P[pu.a]||!P[pu.b]){pulses.splice(i,1);continue}
      pu.t+=pu.sp;
      if(pu.t>=1){pulses.splice(i,1);continue}
      const a=P[pu.a],b=P[pu.b];
      const x=a.x+(b.x-a.x)*pu.t,y=a.y+(b.y-a.y)*pu.t;
      ctx.beginPath();ctx.arc(x,y,2.2,0,Math.PI*2);ctx.fillStyle='rgba(255,235,200,0.95)';ctx.fill();
      ctx.beginPath();ctx.arc(x,y,5.5,0,Math.PI*2);ctx.fillStyle='rgba(255,210,150,0.32)';ctx.fill();
      ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.fillStyle='rgba(212,165,116,0.12)';ctx.fill();
    }
    raf=requestAnimationFrame(tk);
  }
  rs();window.addEventListener('resize',()=>{cancelAnimationFrame(raf);rs();tk()});tk();
})();

(function(){
  const c=document.getElementById('rain-canvas');
  if(!c||REDUCED)return;
  const ctx=c.getContext('2d');
  const TOKENS=['MOVE_J','TON_T','OPC_UA','KRL','RAPID','LoRA','PLC','IF NOT','FB_run','PROFINET','256GB','Hermes','master_v1','PR_merge','distill','0x42AF','0x0E1F','token++','GRAFCET','MMLU','EtherCAT','TwinCAT','SET DO','GET AI','S7-1500','IEC 61131','ST_FB','LD_NET','vLLM','Pro 120B','sovereign','405B','TIA','Pi5','ESP32','STM32'];
  let cols,drops,W,H;
  function rs(){const r=c.getBoundingClientRect();W=c.width=r.width;H=c.height=r.height;cols=Math.floor(W/22);drops=new Array(cols).fill(0).map(()=>Math.random()*H/14)}
  rs();window.addEventListener('resize',rs);
  function dr(){
    ctx.fillStyle='rgba(10,31,61,0.10)';ctx.fillRect(0,0,W,H);
    ctx.font='10px "JetBrains Mono", monospace';
    for(let i=0;i<cols;i++){
      const tok=TOKENS[(i*7+Math.floor(drops[i]/8))%TOKENS.length];
      const y=drops[i]*14;
      const fade=Math.min(y/H,1);
      ctx.fillStyle='rgba(212,165,116,'+(0.45-fade*0.3)+')';
      ctx.fillText(tok,i*22+(i%3)*3,y);
      if(y>H&&Math.random()>0.975)drops[i]=0;
      drops[i]++;
    }
    requestAnimationFrame(dr);
  }
  dr();
})();

(function(){
  const s=document.getElementById('token-stream');
  if(!s||REDUCED)return;
  const T=['FB_Conveyor','IF NOT bSafety','MOVE_J p1, v1000','TON Timer1','OPC UA','MovL p[1] V100','CALL FC_PID','SET DO[5]','WaitTime 500','IEC 61131-3','ST: VAR_INPUT','KRL: PTP HOME','RAPID: MoveL','GRAFCET','PLCopen','TIA Portal','CODESYS V3.5','ROS 2 Humble','EtherCAT','PROFINET','TwinCAT 3','FANUC Karel','palletizing','pick&place','force_feedback','OpenHands','Hermes 4 405B','tool_call','sandbox_run','PR #1247','GPIO.setup(18)','MicroPython','ESP32-S3','STM32F4','LoRA distill','knowledge_distill','master_teacher','student_v+1','MMLU','MT-Bench'];
  function sp(){const t=document.createElement('div');t.className='token';t.textContent=T[Math.floor(Math.random()*T.length)];t.style.left=(Math.random()*100)+'%';t.style.bottom='-30px';const d=14+Math.random()*12;t.style.animationDuration=d+'s';s.appendChild(t);setTimeout(()=>t.remove(),d*1000+200)}
  for(let i=0;i<6;i++)setTimeout(sp,i*1500);setInterval(sp,2000);
})();

(function(){
  const eng=document.getElementById('calc-eng');
  if(!eng)return;
  const engV=document.getElementById('calc-eng-val');
  const tiers=document.querySelectorAll('.calc-tiers button');
  const monthly=document.getElementById('calc-monthly');
  const equiv=document.getElementById('calc-equiv');
  const roi=document.getElementById('calc-roi');
  let perUser=249;
  function fmt(n){return n.toLocaleString('it-IT')}
  function update(){
    const n=parseInt(eng.value);engV.textContent=n;
    const m=n*perUser;
    monthly.textContent='€ '+fmt(m);
    const juniors=(m/2917).toFixed(1).replace('.',',');
    equiv.textContent='≈ '+juniors+' eng. junior';
    const annualGain=n*24000;
    const annualCost=m*12;
    const roiPct=Math.round((annualGain-annualCost)/annualCost*100);
    roi.textContent=(roiPct>0?'+':'')+roiPct+'%';
  }
  eng.addEventListener('input',update);
  tiers.forEach(b=>{
    b.addEventListener('click',()=>{
      tiers.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      perUser=parseInt(b.dataset.tier);
      update();
    });
  });
  update();
})();

(function(){
  if(REDUCED)return;
  const mesh=document.getElementById('mesh-canvas');
  const grid=document.querySelector('.hero-grid');
  const rain=document.getElementById('rain-canvas');
  const beam=document.querySelector('.scan-beam');
  let ticking=false;
  function up(){
    const y=window.scrollY;
    if(y>900){ticking=false;return}
    if(mesh)mesh.style.transform='translate3d(0,'+(y*0.25)+'px,0)';
    if(grid)grid.style.transform='translate3d(0,'+(y*0.5)+'px,0)';
    if(rain)rain.style.transform='translate3d(0,'+(y*0.35)+'px,0)';
    if(beam)beam.style.transform='translate(-30%,-30%) translate3d(0,'+(y*0.4)+'px,0)';
    ticking=false;
  }
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(up);ticking=true}},{passive:true});
})();
