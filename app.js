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
  for(const file of files){try{const r=await fetch(file);if(r.ok){const data=await r.json();const arr=Array.isArray(data)?data:(data.alimentos||data.foods||[]);if(arr.length){NV.foods=arr.map(normalizeFood);break}}}catch(e){}}
}
function normalizeFood(f,i){return {id:f.id||f.codigo||String(i),nome:f.nome||f.alimento||f.description||'Alimento',grupo:f.grupo||f.categoria||'Outros',kcal:num(f.kcal??f.energia_kcal??f.energia),proteina:num(f.proteina??f.proteinas),carbo:num(f.carbo??f.carboidrato??f.carboidratos),gordura:num(f.gordura??f.lipidios??f.lipideos),fibra:num(f.fibra??f.fibras),calcio:num(f.calcio),ferro:num(f.ferro),vitc:num(f.vitamina_c??f.vitc)}}
function num(v){v=String(v??0).replace(',','.');return Number(v)||0}
function byId(id){return NV.foods.find(f=>String(f.id)===String(id))}
function calcTotals(){return NV.diary.reduce((a,it)=>{const f=byId(it.foodId)||it.food;const q=(Number(it.grams)||100)/100;['kcal','proteina','carbo','gordura','fibra','calcio','ferro','vitc'].forEach(k=>a[k]+=(num(f?.[k])*q));return a},{kcal:0,proteina:0,carbo:0,gordura:0,fibra:0,calcio:0,ferro:0,vitc:0})}
function fmt(v,d=0){return (Number(v)||0).toLocaleString('pt-BR',{maximumFractionDigits:d,minimumFractionDigits:d})}
function pct(v,t){return Math.min(100,Math.round(((v||0)/(t||1))*100))}
function openMore(){document.getElementById('moreMenu')?.classList.toggle('open')}
function closeMore(){document.getElementById('moreMenu')?.classList.remove('open')}
function switchHome(tab){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.querySelectorAll('[data-tab]').forEach(b=>b.classList.remove('active'));document.getElementById(tab)?.classList.add('active');document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');closeMore()}
function addDiary(foodId,meal='Almoço',grams=100){const f=byId(foodId);if(!f)return;const d=NV.diary;d.push({id:Date.now(),foodId,food:f,meal,grams:Number(grams)||100,when:new Date().toISOString().slice(0,10)});NV.diary=d;renderHome?.();}
function removeDiary(id){NV.diary=NV.diary.filter(x=>x.id!==id);renderHome?.();}
function toggleFav(foodId){let favs=NV.favs;favs=favs.includes(foodId)?favs.filter(x=>x!==foodId):[...favs,foodId];NV.favs=favs;renderFoods?.();renderFavs?.();}
function renderSummary(containerId='summaryCards'){const el=document.getElementById(containerId);if(!el)return;const t=calcTotals(),tar=NV.targets;el.innerHTML=['kcal','proteina','carbo','gordura'].map(k=>`<div class="metric"><span>${label(k)}</span><b>${fmt(t[k],k==='kcal'?0:1)}${unit(k)}</b><div class="progress"><div class="bar" style="width:${pct(t[k],tar[k])}%"></div></div><small>${pct(t[k],tar[k])}% da meta</small></div>`).join('')}
function label(k){return {kcal:'Calorias',proteina:'Proteínas',carbo:'Carboidratos',gordura:'Gorduras',fibra:'Fibras',calcio:'Cálcio',ferro:'Ferro',vitc:'Vitamina C'}[k]||k}
function unit(k){return {kcal:' kcal',proteina:' g',carbo:' g',gordura:' g',fibra:' g',calcio:' mg',ferro:' mg',vitc:' mg'}[k]||''}
function renderMissing(){const el=document.getElementById('missingList');if(!el)return;const t=calcTotals();const keys=['proteina','fibra','calcio','ferro','vitc'];el.innerHTML=keys.map(k=>{const falta=Math.max(0,NV.targets[k]-t[k]);return `<div class="meal"><div><b>${label(k)}</b><br><small>${falta>0?'Faltam aproximadamente':'Meta atingida'} ${fmt(falta,1)}${unit(k)}</small></div><span class="pill">${pct(t[k],NV.targets[k])}%</span></div>`}).join('')}
function renderMeals(){const el=document.getElementById('mealList');if(!el)return;const d=NV.diary;el.innerHTML=NV.meals.map(m=>{const itens=d.filter(x=>x.meal===m);const kcal=itens.reduce((s,x)=>s+num((byId(x.foodId)||x.food)?.kcal)*(x.grams/100),0);return `<div class="meal"><div><h3>${m}</h3><small>${itens.length?itens.map(x=>`${(byId(x.foodId)||x.food)?.nome} (${x.grams}g)`).join(' • '):'Nenhum alimento lançado'}</small></div><div style="text-align:right"><b>${fmt(kcal)} kcal</b><br><button class="ghost" onclick="openAdd('${m}')">Adicionar</button></div></div>`}).join('')}
function openAdd(meal='Almoço'){const b=document.getElementById('addModal');if(!b)return;b.classList.add('open');document.getElementById('modalMeal').value=meal;fillFoodSelect()}
function closeAdd(){document.getElementById('addModal')?.classList.remove('open')}
function fillFoodSelect(){const s=document.getElementById('modalFood');if(!s)return;s.innerHTML=NV.foods.map(f=>`<option value="${f.id}">${f.nome}</option>`).join('')}
function submitAdd(){addDiary(document.getElementById('modalFood').value,document.getElementById('modalMeal').value,document.getElementById('modalGrams').value);closeAdd()}
function renderHome(){renderSummary();renderMissing();renderMeals();renderNeeds()}
function renderNeeds(){const el=document.getElementById('needsTable');if(!el)return;const t=calcTotals();const rows=Object.keys(NV.targets).map(k=>`<tr><td>${label(k)}</td><td>${fmt(NV.targets[k],k==='kcal'?0:1)}${unit(k)}</td><td>${fmt(t[k],k==='kcal'?0:1)}${unit(k)}</td><td>${pct(t[k],NV.targets[k])}%</td></tr>`).join('');el.innerHTML=rows}
document.addEventListener('click',e=>{if(!e.target.closest('.more-menu')&&!e.target.closest('[data-more]'))closeMore()});
