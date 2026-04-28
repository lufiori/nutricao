const NV={
  meals:['Café da manhã','Almoço','Lanche','Jantar'],
  targets:{kcal:2000,proteina:100,carbo:250,gordura:70,fibra:25,calcio:1000,ferro:14,vitc:75},
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
function calcTotals(items=diaryToday()){return items.reduce((a,it)=>{const f=byId(it.foodId)||it.food;const q=(Number(it.grams)||100)/100;['kcal','proteina','carbo','gordura','fibra','calcio','ferro','vitc'].forEach(k=>a[k]+=(num(f?.[k])*q));return a},{kcal:0,proteina:0,carbo:0,gordura:0,fibra:0,calcio:0,ferro:0,vitc:0})}
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
function label(k){return {kcal:'Calorias',proteina:'Proteínas',carbo:'Carboidratos',gordura:'Gorduras',fibra:'Fibras',calcio:'Cálcio',ferro:'Ferro',vitc:'Vitamina C',colesterol:'Colesterol'}[k]||k}
function unit(k){return {kcal:' kcal',proteina:' g',carbo:' g',gordura:' g',fibra:' g',calcio:' mg',ferro:' mg',vitc:' mg',colesterol:' mg'}[k]||''}
function renderMissing(){const el=document.getElementById('missingList');if(!el)return;const t=calcTotals();const keys=['proteina','fibra','calcio','ferro','vitc'];el.innerHTML=keys.map(k=>{const falta=Math.max(0,NV.targets[k]-t[k]);return `<div class="meal"><div><b>${label(k)}</b><br><small>${falta>0?'Faltam aproximadamente':'Meta atingida'} ${fmt(falta,1)}${unit(k)}</small></div><span class="pill">${pct(t[k],NV.targets[k])}%</span></div>`}).join('')}
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
function renderHome(){renderSummary();renderMissing();renderMeals();renderNeeds()}
function renderNeeds(){const el=document.getElementById('needsTable');if(!el)return;const t=calcTotals();const rows=Object.keys(NV.targets).map(k=>`<tr><td>${label(k)}</td><td>${fmt(NV.targets[k],k==='kcal'?0:1)}${unit(k)}</td><td>${fmt(t[k],k==='kcal'?0:1)}${unit(k)}</td><td>${pct(t[k],NV.targets[k])}%</td></tr>`).join('');el.innerHTML=rows}

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
