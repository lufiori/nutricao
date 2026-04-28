const NV={
  meals:['Café da manhã','Almoço','Lanche','Jantar'],
  defaultTargets:{kcal:2000,proteina:100,carbo:250,gordura:70,fibra:25,calcio:1000,ferro:14,vitc:75,retinol:700,zinco:8},
  get targets(){return getPersonalTargets()},
  foods:[
    {id:'arroz',nome:'Arroz branco cozido',grupo:'Cereais',kcal:128,proteina:2.5,carbo:28.1,gordura:.2,fibra:1.6,calcio:4,ferro:.1,vitc:0},
    {id:'feijao',nome:'Feijão carioca cozido',grupo:'Leguminosas',kcal:76,proteina:4.8,carbo:13.6,gordura:.5,fibra:8.5,calcio:27,ferro:1.3,vitc:0},
    {id:'frango',nome:'Peito de frango grelhado',grupo:'Carnes',kcal:159,proteina:32,carbo:0,gordura:2.5,fibra:0,calcio:5,ferro:.5,vitc:0},
    {id:'banana',nome:'Banana prata',grupo:'Frutas',kcal:98,proteina:1.3,carbo:26,gordura:.1,fibra:2,calcio:8,ferro:.4,vitc:21.6},
    {id:'ovo',nome:'Ovo de galinha cozido',grupo:'Ovos',kcal:146,proteina:13.3,carbo:.6,gordura:9.5,fibra:0,calcio:49,ferro:1.5,vitc:0}
  ],
  get diary(){return JSON.parse(localStorage.getItem('nv_diary')||'[]')},
  set diary(v){localStorage.setItem('nv_diary',JSON.stringify(v))},
  get favs(){return JSON.parse(localStorage.getItem('nv_favs')||'[]')},
  set favs(v){localStorage.setItem('nv_favs',JSON.stringify(v))},
  get profile(){return JSON.parse(localStorage.getItem('nv_profile')||'{}')},
  set profile(v){localStorage.setItem('nv_profile',JSON.stringify(v))}
};


function getPersonalTargets(){
  const p=NV.profile||{};
  return Object.assign({}, NV.defaultTargets, p.targets||{});
}
function calcProfileTargets(profile){
  const sexo=profile.sexo||'feminino';
  const idade=Math.max(1, Number(profile.idade)||30);
  const peso=Math.max(1, Number(profile.peso)||70);
  const altura=Math.max(1, Number(profile.altura)||170);
  const atividade=Number(profile.atividade)||1.2;
  const objetivo=profile.objetivo||'manter';
  const tmb=(sexo==='masculino') ? (10*peso + 6.25*altura - 5*idade + 5) : (10*peso + 6.25*altura - 5*idade - 161);
  let kcal=tmb*atividade;
  if(objetivo==='emagrecer') kcal*=0.85;
  if(objetivo==='ganhar') kcal*=1.15;
  kcal=Math.round(kcal/10)*10;
  const proteinaPorKg = objetivo==='ganhar' ? 2.0 : (objetivo==='emagrecer' ? 1.8 : 1.6);
  const proteina=Math.round(peso*proteinaPorKg);
  const gordura=Math.round(peso*0.8);
  const kcalRestante=Math.max(0, kcal - (proteina*4) - (gordura*9));
  const carbo=Math.round(kcalRestante/4);
  const fibra=Math.max(25, Math.round(kcal/1000*14));
  const calcio=idade>=51 ? 1200 : 1000;
  let ferro=8;
  if(sexo==='feminino' && idade>=14 && idade<=50) ferro=18;
  const vitc=sexo==='masculino' ? 90 : 75;
  const retinol=sexo==='masculino' ? 900 : 700;
  const zinco=sexo==='masculino' ? 11 : 8;
  return {kcal,proteina,carbo,gordura,fibra,calcio,ferro,vitc,retinol,zinco};
}
function profileIsComplete(p=NV.profile){
  return !!(p && p.sexo && Number(p.idade)>0 && Number(p.peso)>0 && Number(p.altura)>0 && p.objetivo);
}
function saveProfileAuto(){
  const p={
    sexo:document.getElementById('sexo')?.value || 'feminino',
    idade:Number(document.getElementById('idade')?.value)||0,
    peso:Number(document.getElementById('peso')?.value)||0,
    altura:Number(document.getElementById('altura')?.value)||0,
    atividade:Number(document.getElementById('atividade')?.value)||1.2,
    objetivo:document.getElementById('objetivo')?.value || 'manter'
  };
  if(!p.idade || !p.peso || !p.altura){ alert('Preencha idade, peso e altura para calcular suas metas.'); return; }
  p.targets=calcProfileTargets(p);
  NV.profile=p;
  renderProfileResult?.();
  renderHome?.();
  alert('Perfil e metas salvos com sucesso.');
}
function loadProfilePage(){
  const p=Object.assign({sexo:'feminino',idade:30,peso:70,altura:170,atividade:1.2,objetivo:'manter'}, NV.profile||{});
  ['sexo','idade','peso','altura','atividade','objetivo'].forEach(k=>{const el=document.getElementById(k); if(el) el.value=p[k];});
  renderProfileResult();
}
function renderProfileResult(){
  const box=document.getElementById('profileResult'); if(!box) return;
  const p={
    sexo:document.getElementById('sexo')?.value || 'feminino',
    idade:Number(document.getElementById('idade')?.value)||0,
    peso:Number(document.getElementById('peso')?.value)||0,
    altura:Number(document.getElementById('altura')?.value)||0,
    atividade:Number(document.getElementById('atividade')?.value)||1.2,
    objetivo:document.getElementById('objetivo')?.value || 'manter'
  };
  const targets=(p.idade && p.peso && p.altura) ? calcProfileTargets(p) : NV.targets;
  const cards=['kcal','proteina','carbo','gordura','fibra'].map(k=>`<div class="metric"><span>${label(k)}</span><b>${fmt(targets[k],k==='kcal'?0:1)}${unit(k)}</b><small>meta diária calculada</small></div>`).join('');
  const micros=['calcio','ferro','vitc','retinol','zinco'].map(k=>`<tr><td>${label(k)}</td><td>${fmt(targets[k],1)}${unit(k)}</td></tr>`).join('');
  box.innerHTML=`<div class="grid grid4">${cards}</div><div class="table-wrap" style="margin-top:14px"><table><thead><tr><th>Micronutriente</th><th>Meta</th></tr></thead><tbody>${micros}</tbody></table></div>`;
}
function resetProfile(){
  if(!confirm('Apagar perfil salvo e voltar às metas padrão?')) return;
  NV.profile={};
  loadProfilePage?.();
  renderHome?.();
}

async function loadFoods(){
  const files=['taco.json','alimentos.json','dados_taco.json','base_taco.json'];
  for(const file of files){
    try{
      const r=await fetch(file);
      if(r.ok){
        const data=await r.json();
        const arr=extractFoodArray(data);
        if(arr.length){
          NV.foods=arr.map(normalizeFood).filter(f=>f.nome && f.nome !== 'Alimento');
          if(!NV.foods.length) NV.foods=arr.map(normalizeFood);
          localStorage.setItem('nv_food_source', file);
          break;
        }
      }
    }catch(e){}
  }
}
function extractFoodArray(data){
  if(Array.isArray(data)) return data;
  if(!data || typeof data!=='object') return [];
  const possible=['alimentos','foods','dados','data','items','taco','base'];
  for(const k of possible){ if(Array.isArray(data[k])) return data[k]; }
  for(const v of Object.values(data)){ if(Array.isArray(v) && v.length && typeof v[0]==='object') return v; }
  return [];
}
function normKey(k){return String(k||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'')}
function pick(obj, aliases){
  if(!obj) return undefined;
  const map={};
  Object.keys(obj).forEach(k=>map[normKey(k)]=obj[k]);
  for(const a of aliases){
    const nk=normKey(a);
    if(map[nk]!==undefined && map[nk]!==null && String(map[nk]).trim()!=='') return map[nk];
  }
  return undefined;
}
function normalizeFood(f,i){
  const nome=pick(f,[
    'descricao_alimento','descricao alimento','descrição alimento',
    'nome','alimento','descrição','descricao','descrição do alimento','descricao do alimento',
    'descrição dos alimentos','descricao dos alimentos','description','food','name','produto','item'
  ]);
  const grupo=pick(f,[
    'grupo','categoria','categoria do alimento','grupo alimentar','classificação','classificacao',
    'preparação','preparacao','tipo'
  ]);
  const food={
    id:String(pick(f,['id','codigo','código','cod','numero','número']) ?? i),
    nome:String(nome ?? 'Alimento'),
    grupo:String(grupo ?? 'Outros'),
    umidade:num(pick(f,['umidade_percentual','umidade','umidade (%)','umidade_%'])),
    kcal:num(pick(f,['energia_kcal','kcal','energia kcal','energia(kcal)','energia (kcal)','calorias','valor energetico','valor energético','energia'])),
    kj:num(pick(f,['energia_kj','kj','energia kj','energia (kj)'])),
    proteina:num(pick(f,['proteina_g','proteina','proteína','proteina g','proteína g','proteina (g)','proteína (g)','protein'])),
    carbo:num(pick(f,['carboidrato_g','carbo_g','carbo','carboidrato','carboidratos','carboidrato g','carboidratos g','carboidrato (g)','carboidratos (g)','cho'])),
    gordura:num(pick(f,['lipideos_g','lipidios_g','gordura_g','gordura','lipidios','lipídios','lipideos','lipídeos','lipidios (g)','lipídios (g)','gorduras totais','gordura total'])),
    colesterol:num(pick(f,['colesterol_mg','colesterol','colesterol (mg)'])),
    fibra:num(pick(f,['fibra_alimentar_g','fibra_g','fibra','fibras','fibra alimentar','fibra alimentar (g)','fibras (g)'])),
    cinzas:num(pick(f,['cinzas_g','cinzas','cinzas (g)'])),
    calcio:num(pick(f,['calcio_mg','calcio','cálcio','calcio (mg)','cálcio (mg)','ca'])),
    magnesio:num(pick(f,['magnesio_mg','magnésio','magnesio','magnésio (mg)','magnesio (mg)','mg'])),
    manganes:num(pick(f,['manganes_mg','manganês','manganes','manganês (mg)','manganes (mg)'])),
    fosforo:num(pick(f,['fosforo_mg','fósforo','fosforo','fósforo (mg)','fosforo (mg)','p'])),
    ferro:num(pick(f,['ferro_mg','ferro','ferro (mg)','fe'])),
    sodio:num(pick(f,['sodio_mg','sódio','sodio','sódio (mg)','sodio (mg)','na'])),
    potassio:num(pick(f,['potassio_mg','potássio','potassio','potássio (mg)','potassio (mg)','k'])),
    cobre:num(pick(f,['cobre_mg','cobre','cobre (mg)','cu'])),
    zinco:num(pick(f,['zinco_mg','zinco','zinco (mg)','zn'])),
    retinol:num(pick(f,['retinol_mcg','retinol','retinol (mcg)'])),
    tiamina:num(pick(f,['tiamina_mg','tiamina','vitamina b1','b1'])),
    riboflavina:num(pick(f,['riboflavina_mg','riboflavina','vitamina b2','b2'])),
    piridoxina:num(pick(f,['piridoxina_mg','piridoxina','vitamina b6','b6'])),
    niacina:num(pick(f,['niacina_mg','niacina','vitamina b3','b3'])),
    vitc:num(pick(f,['vitamina_c_mg','vitamina c','vitamina_c','vitc','vit c','ácido ascórbico','acido ascorbico'])),
    original:f
  };
  return food;
}
function num(v){
  if(v===undefined || v===null) return 0;
  if(typeof v === 'number') return Number.isFinite(v) ? v : 0;
  let s=String(v).trim();
  if(!s || s==='-' || s.toUpperCase()==='NA' || s.toLowerCase()==='tr') return 0;
  s=s.replace(/\s/g,'').replace(/[^0-9,.-]/g,'');
  const hasComma=s.includes(',');
  const hasDot=s.includes('.');
  if(hasComma && hasDot){
    if(s.lastIndexOf(',') > s.lastIndexOf('.')) s=s.replace(/\./g,'').replace(',','.');
    else s=s.replace(/,/g,'');
  }else if(hasComma){
    s=s.replace(',','.');
  }
  const n=Number(s);
  return Number.isFinite(n) ? n : 0;
}
function byId(id){return NV.foods.find(f=>String(f.id)===String(id))}
function todayKey(){return new Date().toISOString().slice(0,10)}
function diaryToday(){return NV.diary.filter(x=>(x.when||todayKey())===todayKey())}
function clearToday(){NV.diary=NV.diary.filter(x=>(x.when||todayKey())!==todayKey());renderHome?.()}
function calcTotals(items=diaryToday()){return items.reduce((a,it)=>{const f=byId(it.foodId)||it.food;const q=(Number(it.grams)||100)/100;['kcal','proteina','carbo','gordura','fibra','calcio','ferro','vitc','retinol','zinco'].forEach(k=>a[k]+=(num(f?.[k])*q));return a},{kcal:0,proteina:0,carbo:0,gordura:0,fibra:0,calcio:0,ferro:0,vitc:0,retinol:0,zinco:0})}
function fmt(v,d=0){return (Number(v)||0).toLocaleString('pt-BR',{maximumFractionDigits:d,minimumFractionDigits:d})}
function pct(v,t){return Math.min(100,Math.round(((v||0)/(t||1))*100))}
function openMore(){document.getElementById('moreMenu')?.classList.toggle('open')}
function closeMore(){document.getElementById('moreMenu')?.classList.remove('open')}
function switchHome(tab){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.querySelectorAll('[data-tab]').forEach(b=>b.classList.remove('active'));document.getElementById(tab)?.classList.add('active');document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');closeMore()}
function addDiary(foodId,meal='Almoço',grams=100){const f=byId(foodId);if(!f)return;const d=NV.diary;d.push({id:Date.now()+Math.floor(Math.random()*999),foodId:String(foodId),food:f,meal,grams:Number(grams)||100,when:todayKey()});NV.diary=d;renderHome?.();}
function removeDiary(id){NV.diary=NV.diary.filter(x=>String(x.id)!==String(id));renderHome?.();}
function updateDiaryGrams(id,grams){const d=NV.diary.map(x=>String(x.id)===String(id)?{...x,grams:Math.max(1,Number(grams)||100)}:x);NV.diary=d;renderHome?.();}
function updateDiaryMeal(id,meal){const d=NV.diary.map(x=>String(x.id)===String(id)?{...x,meal}:x);NV.diary=d;renderHome?.();}
function toggleFav(foodId){let favs=NV.favs;favs=favs.includes(foodId)?favs.filter(x=>x!==foodId):[...favs,foodId];NV.favs=favs;renderFoods?.();renderFavs?.();}
function renderSummary(containerId='summaryCards'){const el=document.getElementById(containerId);if(!el)return;const t=calcTotals(),tar=NV.targets;el.innerHTML=['kcal','proteina','carbo','gordura','fibra'].map(k=>`<div class="metric"><span>${label(k)}</span><b>${fmt(t[k],k==='kcal'?0:1)}${unit(k)}</b><div class="progress"><div class="bar" style="width:${pct(t[k],tar[k])}%"></div></div><small>${pct(t[k],tar[k])}% da meta</small></div>`).join('')}
function label(k){return {kcal:'Calorias',proteina:'Proteínas',carbo:'Carboidratos',gordura:'Gorduras',fibra:'Fibras',calcio:'Cálcio',ferro:'Ferro',vitc:'Vitamina C',retinol:'Vitamina A',zinco:'Zinco',colesterol:'Colesterol'}[k]||k}
function unit(k){return {kcal:' kcal',proteina:' g',carbo:' g',gordura:' g',fibra:' g',calcio:' mg',ferro:' mg',vitc:' mg',retinol:' mcg',zinco:' mg',colesterol:' mg'}[k]||''}
function renderMissing(){const el=document.getElementById('missingList');if(!el)return;const t=calcTotals();const keys=['kcal','proteina','carbo','gordura','fibra'];const profileMsg=profileIsComplete()?'' : `<div class="meal warning"><div><b>Complete seu perfil</b><br><small>Use idade, peso, altura e objetivo para calcular metas personalizadas.</small></div><a class="pill" href="perfil.html">Editar perfil</a></div>`;el.innerHTML=profileMsg+keys.map(k=>{const meta=NV.targets[k];const falta=Math.max(0,meta-t[k]);const passou=Math.max(0,t[k]-meta);let texto=falta>0?`Faltam aproximadamente ${fmt(falta,k==='kcal'?0:1)}${unit(k)}`:(passou>0?`Meta atingida • passou ${fmt(passou,k==='kcal'?0:1)}${unit(k)}`:'Meta atingida');return `<div class="meal"><div><b>${label(k)}</b><br><small>${texto}</small></div><span class="pill">${pct(t[k],meta)}%</span></div>`}).join('')}
function renderMicros(){const el=document.getElementById('microCards');if(!el)return;const t=calcTotals();const keys=['vitc','calcio','ferro','retinol','zinco'];el.innerHTML=keys.map(k=>{const meta=NV.targets[k]||0;const atual=t[k]||0;const p=pct(atual,meta);let status='baixo';let msg='Abaixo da meta';if(p>=100){status='ok';msg='Meta atingida';}else if(p>=70){status='medio';msg='Perto da meta';}return `<div class="micro-card ${status}"><div><span>${label(k)}</span><b>${fmt(atual,k==='retinol'?0:1)}${unit(k)}</b><small>${msg} • meta ${fmt(meta,k==='retinol'?0:1)}${unit(k)}</small></div><div class="micro-percent">${p}%</div><div class="progress"><div class="bar" style="width:${p}%"></div></div></div>`}).join('')}
function renderMeals(){const el=document.getElementById('mealList');if(!el)return;const d=diaryToday();el.innerHTML=NV.meals.map(m=>{const itens=d.filter(x=>x.meal===m);const totals=calcTotals(itens);const itemHtml=itens.map(x=>{const f=byId(x.foodId)||x.food||{};const q=(Number(x.grams)||100)/100;return `<div class="diary-item"><div class="diary-main"><b>${f.nome||'Alimento'}</b><small>${fmt(num(f.kcal)*q)} kcal • ${fmt(num(f.proteina)*q,1)}g proteína • ${fmt(num(f.carbo)*q,1)}g carbo • ${fmt(num(f.gordura)*q,1)}g gordura</small></div><div class="diary-actions"><input type="number" min="1" value="${Number(x.grams)||100}" onchange="updateDiaryGrams('${x.id}',this.value)" title="gramas"><span>g</span><button class="danger-btn" onclick="removeDiary('${x.id}')">Remover</button></div></div>`}).join('');return `<div class="meal meal-block"><div class="meal-head"><div><h3>${m}</h3><small>${itens.length} item(ns) • ${fmt(totals.kcal)} kcal • ${fmt(totals.proteina,1)}g proteína</small></div><button class="ghost" onclick="openAdd('${m}')">+ Adicionar</button></div>${itens.length?`<div class="diary-list">${itemHtml}</div>`:'<div class="empty meal-empty">Nenhum alimento lançado nesta refeição.</div>'}</div>`}).join('')}
function openAdd(meal='Almoço', foodId=''){
  const b=document.getElementById('addModal');
  if(!b)return;
  b.classList.add('open');
  const mealEl=document.getElementById('modalMeal'); if(mealEl) mealEl.value=meal;
  const grams=document.getElementById('modalGrams'); if(grams && !grams.value) grams.value=100;
  const q=document.getElementById('modalFoodSearch');
  if(q){
    const f=byId(foodId);
    q.value=f?f.nome:'';
    setTimeout(()=>q.focus(),80);
  }
  if(foodId) selectFoodForModal(foodId, false);
  else clearSelectedFood();
  fillFoodSelect(foodId);
}
function closeAdd(){document.getElementById('addModal')?.classList.remove('open')}
function clearSelectedFood(){
  const hidden=document.getElementById('modalFood'); if(hidden) hidden.value='';
  const box=document.getElementById('modalSelectedBox'); if(box){box.style.display='none';box.innerHTML='';}
  const btn=document.getElementById('modalAddBtn'); if(btn){btn.disabled=true;btn.textContent='Escolha um alimento';}
}
function normalizeSearchText(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function fillFoodSelect(selectedId=''){
  const q=document.getElementById('modalFoodSearch');
  const text=normalizeSearchText(q?.value||'');
  let arr=NV.foods;
  if(text){
    arr=NV.foods.filter(f=>normalizeSearchText(`${f.nome} ${f.grupo}`).includes(text));
  }
  arr=arr.slice(0,20);
  renderModalFoodResults(arr, selectedId);
}
function renderModalFoodResults(arr, selectedId=''){
  const box=document.getElementById('modalFoodResults');
  if(!box)return;
  const selected=selectedId || document.getElementById('modalFood')?.value;
  box.innerHTML=(arr||[]).slice(0,10).map(f=>`<button type="button" class="food-pick ${String(f.id)===String(selected)?'active':''}" onclick="selectFoodForModal('${f.id}')"><b>${f.nome}</b><small>${f.grupo} • ${fmt(f.kcal)} kcal • ${fmt(f.proteina,1)}g prot.</small></button>`).join('') || '<div class="empty small">Nenhum alimento encontrado.</div>';
}
function selectFoodForModal(id, updateSearch=true){
  const f=byId(id); if(!f)return;
  const hidden=document.getElementById('modalFood'); if(hidden) hidden.value=f.id;
  const q=document.getElementById('modalFoodSearch'); if(q && updateSearch) q.value=f.nome;
  const box=document.getElementById('modalSelectedBox');
  if(box){
    box.style.display='block';
    box.innerHTML=`<div><span class="pill">Selecionado</span><h3>${f.nome}</h3><small>${f.grupo} • ${fmt(f.kcal)} kcal • ${fmt(f.proteina,1)}g proteína por 100g</small></div>`;
  }
  const btn=document.getElementById('modalAddBtn'); if(btn){btn.disabled=false;btn.textContent='Adicionar ao diário';}
  renderModalFoodResults([f], f.id);
}
function setModalGrams(v){
  const g=document.getElementById('modalGrams');
  if(g) g.value=v;
}
function submitAdd(){
  const foodId=document.getElementById('modalFood')?.value;
  if(!foodId){alert('Toque em um alimento da lista primeiro.');return;}
  addDiary(foodId,document.getElementById('modalMeal').value,document.getElementById('modalGrams').value);
  closeAdd();
}
function renderHome(){renderSummary();renderMissing();renderSmartSuggestions();renderMicros();renderMeals();renderNeeds()}
function renderNeeds(){const el=document.getElementById('needsTable');if(!el)return;const t=calcTotals();const keys=['kcal','proteina','carbo','gordura','fibra','vitc','calcio','ferro','retinol','zinco'];const rows=keys.map(k=>`<tr><td>${label(k)}</td><td>${fmt(NV.targets[k],k==='kcal'||k==='retinol'?0:1)}${unit(k)}</td><td>${fmt(t[k],k==='kcal'||k==='retinol'?0:1)}${unit(k)}</td><td>${pct(t[k],NV.targets[k])}%</td></tr>`).join('');el.innerHTML=rows}


function missingNutrientsForSuggestions(){
  const t=calcTotals();
  const targets=NV.targets||{};
  const keys=['proteina','fibra','carbo','gordura','kcal','vitc','calcio','ferro','retinol','zinco'];
  const missing={};
  keys.forEach(k=>{
    const meta=num(targets[k]);
    const atual=num(t[k]);
    if(meta>0) missing[k]=Math.max(0, meta-atual);
  });
  return missing;
}
function foodSuggestionScore(food, missing){
  if(!food) return 0;
  let score=0;
  const weights={proteina:3.0,fibra:2.4,vitc:2.2,ferro:2.2,calcio:1.8,zinco:1.7,retinol:1.4,carbo:0.45,kcal:0.25,gordura:0.15};
  Object.keys(weights).forEach(k=>{
    const falta=num(missing[k]);
    const meta=num(NV.targets?.[k]);
    if(falta<=0 || meta<=0) return;
    const prioridade=Math.min(1.8, falta/meta + 0.25);
    const valor=num(food[k]);
    const divisor=k==='kcal'?250:(k==='retinol'?300:(k==='calcio'?200:(k==='vitc'?60:(k==='ferro'?4:(k==='zinco'?4:25)))));
    score += (valor/divisor) * weights[k] * prioridade;
  });
  // evita sugerir itens quase sem valor nutricional para o que está faltando
  if(num(food.kcal)>450 && num(missing.kcal)<200) score *= .65;
  if(num(food.gordura)>25 && num(missing.gordura)<8) score *= .75;
  return score;
}
function suggestionReason(food, missing){
  const reasons=[];
  const pairs=[
    ['proteina','proteína',5,'g'],['fibra','fibras',2,'g'],['vitc','vitamina C',10,'mg'],['ferro','ferro',1,'mg'],['calcio','cálcio',80,'mg'],['zinco','zinco',1,'mg'],['retinol','vitamina A',80,'mcg']
  ];
  pairs.forEach(([k,n,min,u])=>{
    if(num(missing[k])>0 && num(food[k])>=min) reasons.push(n);
  });
  if(!reasons.length && num(missing.kcal)>0) reasons.push('energia');
  return reasons.slice(0,3).join(', ');
}
function renderSmartSuggestions(){
  const el=document.getElementById('smartSuggestions');
  if(!el) return;
  const missing=missingNutrientsForSuggestions();
  const relevantMissing=Object.entries(missing).filter(([k,v])=>v>0 && ['proteina','fibra','vitc','calcio','ferro','retinol','zinco','kcal'].includes(k));
  if(!NV.foods || !NV.foods.length){
    el.innerHTML='<div class="empty">Carregando base de alimentos...</div>';
    return;
  }
  if(!relevantMissing.length){
    el.innerHTML='<div class="card suggestion-ok"><h3>🎉 Dia muito bem encaminhado</h3><p class="subtitle">As principais metas já estão atingidas. Continue registrando suas refeições para manter o acompanhamento.</p></div>';
    return;
  }
  const suggestions=NV.foods
    .map(f=>({food:f,score:foodSuggestionScore(f,missing),reason:suggestionReason(f,missing)}))
    .filter(x=>x.score>0 && x.food && x.food.nome)
    .sort((a,b)=>b.score-a.score)
    .slice(0,6);
  const faltaTxt=relevantMissing.slice(0,3).map(([k,v])=>`${label(k)}: faltam ${fmt(v,k==='kcal'||k==='retinol'?0:1)}${unit(k)}`).join(' • ');
  if(!suggestions.length){
    el.innerHTML=`<div class="empty">Ainda não encontrei boas sugestões automáticas. ${faltaTxt}</div>`;
    return;
  }
  el.innerHTML=`<div class="suggestion-note"><b>Prioridade agora:</b> ${faltaTxt}</div>` + suggestions.map(({food,reason})=>{
    const reasonText=reason ? `Boa fonte de ${reason}` : 'Pode ajudar a completar o dia';
    return `<div class="suggestion-card"><div class="suggestion-top"><div><h3>${food.nome}</h3><small>${food.grupo||'Alimento'} • ${reasonText}</small></div><span class="pill">${fmt(food.kcal)} kcal</span></div><div class="suggestion-metas"><span>${fmt(food.proteina,1)}g prot.</span><span>${fmt(food.fibra,1)}g fibras</span><span>${fmt(food.ferro,1)}mg ferro</span><span>${fmt(food.vitc,1)}mg vit. C</span></div><div class="toolbar suggestion-actions"><button class="primary" onclick="openAdd('Almoço','${food.id}')">Adicionar</button><button class="ghost" onclick="openFoodDetail('${food.id}')">Ver ficha</button></div></div>`;
  }).join('');
}

const nutrientDefs=[
  ['kcal','Energia','kcal','macro'],['proteina','Proteínas','g','macro'],['carbo','Carboidratos','g','macro'],['gordura','Gorduras','g','macro'],['fibra','Fibras','g','macro'],
  ['colesterol','Colesterol','mg','micro'],['calcio','Cálcio','mg','micro'],['magnesio','Magnésio','mg','micro'],['manganes','Manganês','mg','micro'],['fosforo','Fósforo','mg','micro'],['ferro','Ferro','mg','micro'],['sodio','Sódio','mg','micro'],['potassio','Potássio','mg','micro'],['cobre','Cobre','mg','micro'],['zinco','Zinco','mg','micro'],['retinol','Retinol','mcg','micro'],['tiamina','Tiamina','mg','vit'],['riboflavina','Riboflavina','mg','vit'],['piridoxina','Piridoxina','mg','vit'],['niacina','Niacina','mg','vit'],['vitc','Vitamina C','mg','vit']
];
function ensureDetailModal(){
  if(document.getElementById('detailModal'))return;
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-back" id="detailModal"><div class="modal detail-modal"><div class="modal-head"><div><h2 id="detailTitle">Ficha do alimento</h2><p class="subtitle" id="detailSub"></p></div><button class="close" onclick="closeFoodDetail()">Fechar</button></div><div id="detailBody"></div></div></div>`);
}
function openFoodDetail(id){
  const f=byId(id); if(!f)return;
  ensureDetailModal();
  document.getElementById('detailTitle').textContent=f.nome;
  document.getElementById('detailSub').textContent=`${f.grupo} • valores aproximados por 100g`;
  const macros=[['proteina','Proteínas'],['carbo','Carboidratos'],['gordura','Gorduras'],['fibra','Fibras']];
  const maxMacro=Math.max(1,...macros.map(([k])=>num(f[k])));
  const macroHtml=macros.map(([k,n],i)=>`<div class="chart-row c${i+1}"><span>${n}</span><div class="chart-track"><div style="width:${Math.min(100,(num(f[k])/maxMacro)*100)}%"></div></div><b>${fmt(f[k],1)}g</b></div>`).join('');
  const cards=['kcal','proteina','carbo','gordura','fibra','colesterol'].map(k=>`<div class="nutri-mini"><span>${label(k)}</span><b>${fmt(f[k],k==='kcal'?0:1)}${unit(k)}</b></div>`).join('');
  const rows=nutrientDefs.filter(([k])=>num(f[k])>0 || ['kcal','proteina','carbo','gordura','fibra'].includes(k)).map(([k,n,u])=>`<tr><td>${n}</td><td>${fmt(f[k],k==='kcal'?0:2)} ${u}</td></tr>`).join('');
  document.getElementById('detailBody').innerHTML=`<div class="nutri-grid">${cards}</div><div class="pretty-chart"><h3>Gráfico nutricional</h3>${macroHtml}</div><div class="toolbar"><button class="primary" onclick="closeFoodDetail();openAdd('Almoço','${f.id}')">Adicionar ao diário</button><button class="ghost" onclick="toggleFav('${f.id}')">${NV.favs.includes(String(f.id))?'★ Remover favorito':'☆ Favoritar'}</button></div><div class="table-wrap"><table><thead><tr><th>Nutriente</th><th>Quantidade por 100g</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  document.getElementById('detailModal').classList.add('open');
}
function closeFoodDetail(){document.getElementById('detailModal')?.classList.remove('open')}
document.addEventListener('click',e=>{if(!e.target.closest('.more-menu')&&!e.target.closest('[data-more]'))closeMore()});
