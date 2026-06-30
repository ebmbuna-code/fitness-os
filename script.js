'use strict';

/* =========================================================
   STORE
========================================================= */
const STORAGE_KEY = 'fitnessos_v1';

const DEFAULT_DATA = {
  profile: {
    startWeight: 80.35,
    startDate: '2026-06-30',
    goalWeight: 66,
    goalDate: '2026-11-30',
    goalKcal: 1800,
    goalProtein: 160,
    goalFatMin: 50, goalFatMax: 55,
    goalCarbMin: 160, goalCarbMax: 180,
    goalWater: 3.0,
    goalSteps: 10000
  },
  settings: { theme: 'light' },
  dailyLogs: {},   // date -> {weight,kcal,protein,carbs,fat,fiber,water,steps,training,elliptical,running,notes}
  weightLog: [],   // [{date, weight}]
  foods: [],
  recipes: [],
  habitsLog: {}    // date -> { habitId: bool }
};

const HABIT_DEFS = [
  { id:'kcal', label:'Cumplir calorías', icon:'🔥' },
  { id:'protein', label:'Cumplir proteína', icon:'🥩' },
  { id:'water', label:'3 litros de agua', icon:'💧' },
  { id:'steps', label:'10.000 pasos', icon:'👟' },
  { id:'training', label:'Entrenamiento', icon:'🏋️' },
  { id:'running', label:'Running', icon:'🏃' },
  { id:'elliptical', label:'Elíptica', icon:'🚴' },
];
const SUPPLEMENTS = ['Ovapro','Omega 3','Magnesio bisglicinato'];

const SEED_FOODS = [
  // [name, cat, kcal, p, c, f, fiber]
  ['Pechuga de pollo','Proteínas',110,23,0,2,0],
  ['Contramuslo de pollo','Proteínas',172,18,0,11,0],
  ['Muslos de pollo','Proteínas',180,17,0,12,0],
  ['Cuartos de pollo','Proteínas',190,17,0,13,0],
  ['Alitas de pollo','Proteínas',203,18,0,14,0],
  ['Ternera magra','Proteínas',135,21,0,5,0],
  ['Carne picada magra','Proteínas',152,20,0,8,0],
  ['Hamburguesa casera','Proteínas',180,19,1,11,0],
  ['Chuleta de aguja de cerdo','Proteínas',195,18,0,13,0],
  ['Lomo de cerdo','Proteínas',143,21,0,6,0],
  ['Higaditos de pollo','Proteínas',119,17,1,5,0],
  ['Merluza','Proteínas',86,17,0,2,0],
  ['Rape','Proteínas',76,15,0,1.5,0],
  ['Corvina','Proteínas',95,18,0,2,0],
  ['Lubina','Proteínas',97,18,0,2.5,0],
  ['Dorada','Proteínas',96,18,0,2.5,0],
  ['Salmón','Proteínas',208,20,0,13,0],
  ['Sardinas','Proteínas',208,21,0,13,0],
  ['Calamares','Proteínas',92,15,3,1.4,0],
  ['Atún natural','Proteínas',116,26,0,1,0],
  ['Pechuga de pavo','Proteínas',104,24,0,1,0],
  ['Huevos','Proteínas',155,13,1.1,11,0],
  ['Bacon','Proteínas',541,37,1.4,42,0],
  ['Patata','Carbohidratos',77,2,17,0.1,2.2],
  ['Boniato','Carbohidratos',86,1.6,20,0.1,3],
  ['Arroz','Carbohidratos',130,2.7,28,0.3,0.4],
  ['Macarrones','Carbohidratos',158,5.8,31,0.9,1.8],
  ['Espaguetis','Carbohidratos',158,5.8,31,0.9,1.8],
  ['Pasta integral','Carbohidratos',124,5,27,0.6,3.9],
  ['Garbanzos','Carbohidratos',164,8.9,27,2.6,7.6],
  ['Lentejas','Carbohidratos',116,9,20,0.4,7.9],
  ['Alubias blancas','Carbohidratos',127,8.7,23,0.5,6.3],
  ['Alubias rojas','Carbohidratos',127,8.7,23,0.5,6.4],
  ['Pan integral 100%','Carbohidratos',247,13,41,3.4,7],
  ['Pan de hamburguesa integral','Carbohidratos',250,9,45,4,5],
  ['Tortillas de avena','Carbohidratos',210,9,28,7,4],
  ['Tortillas integrales','Carbohidratos',230,8,38,5,6],
  ['Yuca','Carbohidratos',160,1.4,38,0.3,1.8],
  ['Yuca fermentada (Bobolo)','Carbohidratos',150,1,36,0.2,1.5],
  ['Plátano macho','Carbohidratos',122,1.3,32,0.4,2.3],
  ['Lechuga','Verduras',15,1.4,2.9,0.2,1.3],
  ['Tomate','Verduras',18,0.9,3.9,0.2,1.2],
  ['Pepino','Verduras',15,0.7,3.6,0.1,0.5],
  ['Gazpacho','Verduras',30,1,4,1,0.8],
  ['Cebolla','Verduras',40,1.1,9.3,0.1,1.7],
  ['Pimientos','Verduras',31,1,6,0.3,2.1],
  ['Calabacín','Verduras',17,1.2,3.1,0.3,1],
  ['Berenjena','Verduras',25,1,5.9,0.2,3],
  ['Brócoli','Verduras',34,2.8,7,0.4,2.6],
  ['Coliflor','Verduras',25,1.9,5,0.3,2],
  ['Champiñones','Verduras',22,3.1,3.3,0.3,1],
  ['Espárragos','Verduras',20,2.2,3.9,0.1,2.1],
  ['Zanahoria','Verduras',41,0.9,10,0.2,2.8],
  ['Judías verdes','Verduras',31,1.8,7,0.1,3.4],
  ['Piña','Frutas',50,0.5,13,0.1,1.4],
  ['Melón','Frutas',34,0.8,8,0.2,0.9],
  ['Sandía','Frutas',30,0.6,8,0.2,0.4],
  ['Cerezas','Frutas',63,1.1,16,0.2,2.1],
  ['Plátano','Frutas',89,1.1,23,0.3,2.6],
  ['Fresas','Frutas',32,0.7,8,0.3,2],
  ['Arándanos','Frutas',57,0.7,14,0.3,2.4],
  ['Yogur griego 0%','Lácteos',59,10,3.6,0.4,0],
  ['Queso fresco batido 0%','Lácteos',45,8,3.6,0.2,0],
  ['Queso crema light','Lácteos',150,8,5,11,0],
  ['Queso cheddar light','Lácteos',280,28,2,18,0],
  ['Queso en lonchas light','Lácteos',180,22,3,8,0],
  ['Mozzarella light','Lácteos',220,26,3,11,0],
  ['Aceite de oliva virgen extra','Grasas',884,0,0,100,0],
  ['Aguacate','Grasas',160,2,9,15,7],
  ['Almendras','Grasas',579,21,22,50,12.5],
  ['Nueces','Grasas',654,15,14,65,6.7],
  ['Anacardos','Grasas',553,18,30,44,3.3],
  ['Pistachos','Grasas',560,20,28,45,10.6],
  ['Avellanas','Grasas',628,15,17,61,9.7],
  ['Crema de cacahuete 100%','Grasas',588,25,20,50,8],
  ['Mantequilla de almendra','Grasas',614,21,19,56,10],
  ['Pepitas de chocolate','Extras',480,4.5,60,26,5],
  ['Cacao puro','Extras',228,20,58,14,33],
  ['Mostaza','Extras',66,4,5,3.5,2.4],
  ['Pepinillos','Extras',11,0.3,2.3,0.1,1],
  ['Ketchup sin azúcar','Extras',30,1,7,0.1,0.5],
  ['Salsas bajas en calorías','Extras',35,1,5,1,0.5],
];

const RECIPE_NAMES = ['Tortitas proteicas','Hamburguesa fit','Burrito fit','Tacos de pollo','Tacos de ternera',
  'Macarrones con carne','Espaguetis con carne','Pasta con pollo','Garbanzos con pollo','Alitas con patatas',
  'Cuarto de pollo con verduras','Chuleta de aguja con boniato','Salmón con arroz','Merluza con patata',
  'Sardinas con ensalada','Ternera con patata','Ensalada con atún','Gazpacho con pollo','Gazpacho con atún',
  'Salsa de ogbono con bobolo','Plátano macho con pollo','Plátano macho con pescado','Plátano macho con carne'];

function uid(){ return Math.random().toString(36).slice(2,10) + Date.now().toString(36); }
function todayISO(){ return new Date().toISOString().slice(0,10); }

const Store = {
  data: null,
  load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      this.data = raw ? JSON.parse(raw) : structuredClone(DEFAULT_DATA);
    }catch(e){
      this.data = structuredClone(DEFAULT_DATA);
    }
    // seed foods once
    if(!this.data.foods || this.data.foods.length === 0){
      this.data.foods = SEED_FOODS.map(f => ({
        id: uid(), name:f[0], category:f[1], kcal:f[2], protein:f[3], carbs:f[4], fat:f[5], fiber:f[6]
      }));
    }
    if(!this.data.recipes || this.data.recipes.length === 0){
      this.data.recipes = RECIPE_NAMES.map(n => ({ id: uid(), name:n, servings:1, ingredients:[] }));
    }
    if(!this.data.profile) this.data.profile = structuredClone(DEFAULT_DATA.profile);
    if(!this.data.settings) this.data.settings = structuredClone(DEFAULT_DATA.settings);
    if(!this.data.dailyLogs) this.data.dailyLogs = {};
    if(!this.data.weightLog) this.data.weightLog = [];
    if(!this.data.habitsLog) this.data.habitsLog = {};
    this.save();
  },
  save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data)); },
};

/* =========================================================
   UTILITIES
========================================================= */
function fmt1(n){ return (Math.round((n||0)*10)/10).toLocaleString('es-ES'); }
function fmtInt(n){ return Math.round(n||0).toLocaleString('es-ES'); }
function dateLabel(d){
  return new Date(d+'T00:00:00').toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' });
}
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>t.classList.remove('show'), 2200);
}
function sortedWeightLog(){
  return [...Store.data.weightLog].sort((a,b)=> a.date.localeCompare(b.date));
}
function getLogsInRange(startISO, endISO){
  return Object.entries(Store.data.dailyLogs)
    .filter(([d]) => d >= startISO && d <= endISO)
    .sort((a,b)=> a[0].localeCompare(b[0]));
}
function dayAdherence(log, profile){
  if(!log) return 0;
  let hits = 0, total = 6;
  if(log.kcal && Math.abs(log.kcal - profile.goalKcal) <= 100) hits++;
  if(log.protein && log.protein >= profile.goalProtein*0.9) hits++;
  if(log.water && log.water >= profile.goalWater*0.9) hits++;
  if(log.steps && log.steps >= profile.goalSteps*0.9) hits++;
  if(log.training) hits++;
  if(log.running || log.elliptical) hits++;
  return hits/total;
}

/* =========================================================
   NAVIGATION
========================================================= */
function switchView(view){
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-'+view));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  if(view === 'dashboard') renderDashboard();
  if(view === 'weight') renderWeightView();
  if(view === 'nutrition') renderNutritionView();
  if(view === 'habits') renderHabitsView();
  if(view === 'calendar') renderCalendarView();
  if(view === 'stats') renderStatsView();
  if(view === 'settings') renderSettingsView();
  if(view === 'log') initLogView();
}

/* =========================================================
   THEME
========================================================= */
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('iconSun').style.display = theme === 'dark' ? 'block' : 'none';
  document.getElementById('iconMoon').style.display = theme === 'dark' ? 'none' : 'block';
  Store.data.settings.theme = theme;
  Store.save();
}

/* =========================================================
   DASHBOARD
========================================================= */
function renderDashboard(){
  const p = Store.data.profile;
  const wlog = sortedWeightLog();
  const current = wlog.length ? wlog[wlog.length-1].weight : p.startWeight;
  const lost = Math.max(0, p.startWeight - current);
  const totalToLose = Math.max(0.01, p.startWeight - p.goalWeight);
  const remaining = Math.max(0, current - p.goalWeight);
  const pct = Math.min(100, Math.max(0, (lost/totalToLose)*100));

  document.getElementById('dashGreeting').textContent = greetingForNow();
  document.getElementById('dashDate').textContent = dateLabel(todayISO());

  document.getElementById('statCurrentWeight').textContent = fmt1(current);
  document.getElementById('statLost').textContent = fmt1(lost);
  document.getElementById('statRemaining').textContent = fmt1(remaining);

  const today = new Date(); const goalD = new Date(p.goalDate+'T00:00:00');
  const daysLeft = Math.max(0, Math.ceil((goalD - today)/86400000));
  document.getElementById('statDaysLeft').textContent = daysLeft;

  const circumference = 439.8;
  const offset = circumference - (pct/100)*circumference;
  requestAnimationFrame(()=>{
    document.getElementById('ringProgress').style.strokeDashoffset = offset;
  });
  document.getElementById('ringPct').textContent = Math.round(pct)+'%';

  // weekly avg
  const last7 = wlog.filter(w => w.date >= addDays(todayISO(), -6));
  const avg7 = last7.length ? last7.reduce((s,w)=>s+w.weight,0)/last7.length : current;
  document.getElementById('weeklyAvgWeight').textContent = fmt1(avg7) + ' kg';
  const totalWeeks = Math.max(1, (goalD - new Date(p.startDate+'T00:00:00'))/(7*86400000));
  const weeklyTarget = totalToLose/totalWeeks;
  document.getElementById('weeklyTarget').textContent = fmt1(weeklyTarget);

  // streak + adherence (last 30 days)
  const logs30 = getLogsInRange(addDays(todayISO(),-29), todayISO());
  let streak = 0;
  for(let i=0;i<60;i++){
    const d = addDays(todayISO(), -i);
    const log = Store.data.dailyLogs[d];
    if(log && dayAdherence(log,p) >= 0.66){ streak++; } else { if(i>0 || log) break; if(i===0) continue; break; }
  }
  document.getElementById('streakCount').textContent = streak;
  const adh = logs30.length ? logs30.reduce((s,[,l])=>s+dayAdherence(l,p),0)/logs30.length : 0;
  document.getElementById('adherencePct').textContent = Math.round(adh*100)+'%';

  // today summary
  const t = Store.data.dailyLogs[todayISO()] || {};
  setBar('mCal', t.kcal||0, p.goalKcal, v=>fmtInt(v));
  setBar('mPro', t.protein||0, p.goalProtein, v=>fmtInt(v)+' g');
  setBar('mWater', t.water||0, p.goalWater, v=>fmt1(v)+' L');
  setBar('mSteps', t.steps||0, p.goalSteps, v=>fmtInt(v));

  document.getElementById('trainingStatus').textContent = t.training ? t.training + (t.elliptical ? ' + elíptica' : '') : 'Sin registrar';
  document.getElementById('cardTraining').querySelector('.status-dot').classList.toggle('done', !!t.training);
  document.getElementById('runningStatus').textContent = t.running ? 'Completado (45 min)' : 'Sin registrar';
  document.getElementById('cardRunning').querySelector('.status-dot').classList.toggle('done', !!t.running);
}
function greetingForNow(){
  const h = new Date().getHours();
  if(h<12) return 'Buenos días';
  if(h<20) return 'Buenas tardes';
  return 'Buenas noches';
}
function setBar(prefix, val, goal, formatter){
  const pct = goal ? Math.min(100, (val/goal)*100) : 0;
  document.getElementById(prefix+'Bar').style.width = pct+'%';
  document.getElementById(prefix+'Val').textContent = `${formatter(val)} / ${formatter(goal)}`;
}
function addDays(iso, n){
  const d = new Date(iso+'T00:00:00'); d.setDate(d.getDate()+n);
  return d.toISOString().slice(0,10);
}

/* =========================================================
   DAILY LOG VIEW
========================================================= */
function initLogView(){
  const dateInput = document.getElementById('logDate');
  if(!dateInput.value) dateInput.value = todayISO();
  loadLogForm(dateInput.value);
  dateInput.onchange = () => loadLogForm(dateInput.value);
}
function loadLogForm(date){
  const l = Store.data.dailyLogs[date] || {};
  document.getElementById('logWeight').value = l.weight ?? '';
  document.getElementById('logKcal').value = l.kcal ?? '';
  document.getElementById('logProtein').value = l.protein ?? '';
  document.getElementById('logCarbs').value = l.carbs ?? '';
  document.getElementById('logFat').value = l.fat ?? '';
  document.getElementById('logFiber').value = l.fiber ?? '';
  document.getElementById('logWater').value = l.water ?? '';
  document.getElementById('logSteps').value = l.steps ?? '';
  document.getElementById('logTraining').value = l.training ?? '';
  document.getElementById('logElliptical').checked = !!l.elliptical;
  document.getElementById('logRunning').checked = !!l.running;
  document.getElementById('logNotes').value = l.notes ?? '';
}
function bindLogForm(){
  document.getElementById('logForm').addEventListener('submit', e => {
    e.preventDefault();
    const date = document.getElementById('logDate').value || todayISO();
    const entry = {
      weight: parseFloat(document.getElementById('logWeight').value) || undefined,
      kcal: parseFloat(document.getElementById('logKcal').value) || undefined,
      protein: parseFloat(document.getElementById('logProtein').value) || undefined,
      carbs: parseFloat(document.getElementById('logCarbs').value) || undefined,
      fat: parseFloat(document.getElementById('logFat').value) || undefined,
      fiber: parseFloat(document.getElementById('logFiber').value) || undefined,
      water: parseFloat(document.getElementById('logWater').value) || undefined,
      steps: parseInt(document.getElementById('logSteps').value) || undefined,
      training: document.getElementById('logTraining').value || undefined,
      elliptical: document.getElementById('logElliptical').checked,
      running: document.getElementById('logRunning').checked,
      notes: document.getElementById('logNotes').value || undefined,
    };
    Store.data.dailyLogs[date] = entry;
    if(entry.weight){
      const idx = Store.data.weightLog.findIndex(w => w.date === date);
      if(idx >= 0) Store.data.weightLog[idx].weight = entry.weight;
      else Store.data.weightLog.push({ date, weight: entry.weight });
    }
    Store.save();
    showToast('Registro guardado ✓');
    renderDashboard();
  });
}

/* =========================================================
   WEIGHT VIEW
========================================================= */
let weightChartInstance = null;
function renderWeightView(){
  const p = Store.data.profile;
  const wlog = sortedWeightLog();
  const current = wlog.length ? wlog[wlog.length-1].weight : p.startWeight;
  const last7 = wlog.filter(w => w.date >= addDays(todayISO(),-6));
  const avg7 = last7.length ? last7.reduce((s,w)=>s+w.weight,0)/last7.length : current;
  const min = wlog.length ? Math.min(...wlog.map(w=>w.weight)) : current;
  const max = wlog.length ? Math.max(...wlog.map(w=>w.weight)) : current;

  document.getElementById('wCurrent').textContent = fmt1(current);
  document.getElementById('wAvg7').textContent = fmt1(avg7);
  document.getElementById('wMin').textContent = fmt1(min);
  document.getElementById('wMax').textContent = fmt1(max);

  const weekAgo = wlog.find(w => w.date <= addDays(todayISO(),-7));
  const monthAgo = wlog.find(w => w.date <= addDays(todayISO(),-30));
  document.getElementById('wWeekChange').textContent = weekAgo ? fmt1(current-weekAgo.weight)+' kg' : '--';
  document.getElementById('wMonthChange').textContent = monthAgo ? fmt1(current-monthAgo.weight)+' kg' : '--';

  // prediction: linear regression over last entries
  document.getElementById('predTargetWeight').textContent = p.goalWeight + ' kg';
  const predDateEl = document.getElementById('predDate');
  if(wlog.length >= 2){
    const xs = wlog.map(w => (new Date(w.date) - new Date(wlog[0].date))/86400000);
    const ys = wlog.map(w => w.weight);
    const n = xs.length;
    const sx = xs.reduce((a,b)=>a+b,0), sy = ys.reduce((a,b)=>a+b,0);
    const sxy = xs.reduce((s,x,i)=>s+x*ys[i],0), sxx = xs.reduce((s,x)=>s+x*x,0);
    const slope = (n*sxy - sx*sy) / (n*sxx - sx*sx || 1);
    if(slope < 0){
      const daysToGoal = (p.goalWeight - current) / slope;
      const predicted = addDays(todayISO(), Math.round(daysToGoal));
      predDateEl.textContent = new Date(predicted+'T00:00:00').toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'});
    } else {
      predDateEl.textContent = 'Sin tendencia descendente aún';
    }
  } else {
    predDateEl.textContent = 'Añade más registros';
  }

  // chart
  const ctx = document.getElementById('weightChart');
  const labels = wlog.map(w => new Date(w.date+'T00:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit'}));
  const values = wlog.map(w => w.weight);
  if(weightChartInstance) weightChartInstance.destroy();
  weightChartInstance = new Chart(ctx, {
    type:'line',
    data:{ labels, datasets:[
      { label:'Peso', data: values, borderColor:'#2F5D4E', backgroundColor:'rgba(47,93,78,0.08)', fill:true, tension:.35, pointRadius:2 },
      { label:'Objetivo', data: values.map(()=>p.goalWeight), borderColor:'#E0673E', borderDash:[5,5], pointRadius:0 }
    ]},
    options: chartBaseOptions()
  });

  // table
  const tbody = document.querySelector('#weightTable tbody');
  tbody.innerHTML = '';
  [...wlog].reverse().forEach(w => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${new Date(w.date+'T00:00:00').toLocaleDateString('es-ES')}</td><td>${fmt1(w.weight)} kg</td>
      <td class="row-actions"><button data-del="${w.date}">🗑</button></td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-del]').forEach(btn => btn.onclick = () => {
    Store.data.weightLog = Store.data.weightLog.filter(w => w.date !== btn.dataset.del);
    Store.save(); renderWeightView();
  });
}
function chartBaseOptions(){
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)';
  const tickColor = isDark ? '#8A958E' : '#6E7A73';
  return {
    responsive:true,
    plugins:{ legend:{ labels:{ color: tickColor, font:{ family:'Inter', size:11 } } } },
    scales:{
      x:{ grid:{ color:gridColor }, ticks:{ color:tickColor, font:{ size:10 } } },
      y:{ grid:{ color:gridColor }, ticks:{ color:tickColor, font:{ size:10 } } }
    }
  };
}

/* =========================================================
   NUTRITION VIEW — FOODS
========================================================= */
function renderNutritionView(){
  populateCategoryFilter();
  renderFoodTable();
  renderRecipeGrid();
}
function populateCategoryFilter(){
  const sel = document.getElementById('foodCategoryFilter');
  if(sel.options.length > 1) return;
  const cats = [...new Set(Store.data.foods.map(f=>f.category))];
  cats.forEach(c => { const o = document.createElement('option'); o.value=c; o.textContent=c; sel.appendChild(o); });
}
function renderFoodTable(){
  const q = document.getElementById('foodSearch').value.toLowerCase();
  const cat = document.getElementById('foodCategoryFilter').value;
  const tbody = document.querySelector('#foodTable tbody');
  tbody.innerHTML = '';
  Store.data.foods
    .filter(f => f.name.toLowerCase().includes(q) && (!cat || f.category===cat))
    .sort((a,b)=>a.name.localeCompare(b.name))
    .forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="name-cell">${f.name}</td><td>${f.category.slice(0,4)}</td>
        <td>${f.kcal}</td><td>${f.protein}</td><td>${f.carbs}</td><td>${f.fat}</td><td>${f.fiber}</td>
        <td class="row-actions"><button data-edit="${f.id}">✎</button><button data-del="${f.id}">🗑</button></td>`;
      tbody.appendChild(tr);
    });
  tbody.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => openFoodModal(b.dataset.edit));
  tbody.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    if(confirm('¿Eliminar este alimento?')){
      Store.data.foods = Store.data.foods.filter(f => f.id !== b.dataset.del);
      Store.save(); renderFoodTable();
    }
  });
}
function openFoodModal(id){
  const modal = document.getElementById('foodModal');
  const food = id ? Store.data.foods.find(f=>f.id===id) : null;
  document.getElementById('foodModalTitle').textContent = food ? 'Editar alimento' : 'Nuevo alimento';
  document.getElementById('foodId').value = food ? food.id : '';
  document.getElementById('foodName').value = food ? food.name : '';
  document.getElementById('foodCategory').value = food ? food.category : 'Proteínas';
  document.getElementById('foodKcal').value = food ? food.kcal : '';
  document.getElementById('foodProtein').value = food ? food.protein : '';
  document.getElementById('foodCarbs').value = food ? food.carbs : '';
  document.getElementById('foodFat').value = food ? food.fat : '';
  document.getElementById('foodFiber').value = food ? food.fiber : '';
  document.getElementById('foodDuplicateBtn').style.display = food ? 'inline-block' : 'none';
  modal.classList.add('open');
}
function closeFoodModal(){ document.getElementById('foodModal').classList.remove('open'); }
function saveFoodFromModal(duplicate=false){
  const id = document.getElementById('foodId').value;
  const food = {
    id: (id && !duplicate) ? id : uid(),
    name: document.getElementById('foodName').value.trim(),
    category: document.getElementById('foodCategory').value,
    kcal: parseFloat(document.getElementById('foodKcal').value)||0,
    protein: parseFloat(document.getElementById('foodProtein').value)||0,
    carbs: parseFloat(document.getElementById('foodCarbs').value)||0,
    fat: parseFloat(document.getElementById('foodFat').value)||0,
    fiber: parseFloat(document.getElementById('foodFiber').value)||0,
  };
  if(!food.name){ showToast('Pon un nombre al alimento'); return; }
  if(id && !duplicate){
    const idx = Store.data.foods.findIndex(f=>f.id===id);
    Store.data.foods[idx] = food;
  } else {
    if(duplicate) food.name += ' (copia)';
    Store.data.foods.push(food);
  }
  Store.save();
  closeFoodModal();
  renderFoodTable();
  showToast('Alimento guardado ✓');
}

/* =========================================================
   NUTRITION VIEW — RECIPES
========================================================= */
let currentRecipeIngredients = [];
function renderRecipeGrid(){
  const q = document.getElementById('recipeSearch').value.toLowerCase();
  const grid = document.getElementById('recipeGrid');
  grid.innerHTML = '';
  Store.data.recipes.filter(r => r.name.toLowerCase().includes(q)).forEach(r => {
    const totals = computeRecipeTotals(r);
    const div = document.createElement('div');
    div.className = 'recipe-card';
    div.innerHTML = `<h4>${r.name}</h4>
      <p class="muted small">${r.servings} ración(es) · ${r.ingredients.length} ingredientes</p>
      <div class="recipe-macros">
        <span>${fmtInt(totals.kcal/r.servings)} kcal</span>
        <span>P ${fmt1(totals.protein/r.servings)}g</span>
        <span>C ${fmt1(totals.carbs/r.servings)}g</span>
        <span>G ${fmt1(totals.fat/r.servings)}g</span>
      </div>`;
    div.onclick = () => openRecipeModal(r.id);
    grid.appendChild(div);
  });
}
function computeRecipeTotals(recipe){
  const totals = { kcal:0, protein:0, carbs:0, fat:0, fiber:0 };
  recipe.ingredients.forEach(ing => {
    const food = Store.data.foods.find(f=>f.id===ing.foodId);
    if(!food) return;
    const factor = ing.grams/100;
    totals.kcal += food.kcal*factor;
    totals.protein += food.protein*factor;
    totals.carbs += food.carbs*factor;
    totals.fat += food.fat*factor;
    totals.fiber += food.fiber*factor;
  });
  return totals;
}
function populateIngredientSelect(){
  const sel = document.getElementById('ingredientSelect');
  sel.innerHTML = '';
  [...Store.data.foods].sort((a,b)=>a.name.localeCompare(b.name)).forEach(f => {
    const o = document.createElement('option'); o.value = f.id; o.textContent = f.name; sel.appendChild(o);
  });
}
function openRecipeModal(id){
  const recipe = id ? Store.data.recipes.find(r=>r.id===id) : null;
  document.getElementById('recipeModalTitle').textContent = recipe ? 'Editar receta' : 'Nueva receta';
  document.getElementById('recipeId').value = recipe ? recipe.id : '';
  document.getElementById('recipeName').value = recipe ? recipe.name : '';
  document.getElementById('recipeServings').value = recipe ? recipe.servings : 1;
  currentRecipeIngredients = recipe ? structuredClone(recipe.ingredients) : [];
  populateIngredientSelect();
  renderIngredientList();
  document.getElementById('recipeModal').classList.add('open');
}
function closeRecipeModal(){ document.getElementById('recipeModal').classList.remove('open'); }
function renderIngredientList(){
  const ul = document.getElementById('ingredientList');
  ul.innerHTML = '';
  currentRecipeIngredients.forEach((ing, i) => {
    const food = Store.data.foods.find(f=>f.id===ing.foodId);
    const li = document.createElement('li');
    li.innerHTML = `<span>${food ? food.name : '?'} — ${ing.grams} g</span><button data-i="${i}">✕</button>`;
    ul.appendChild(li);
  });
  ul.querySelectorAll('button').forEach(b => b.onclick = () => {
    currentRecipeIngredients.splice(parseInt(b.dataset.i),1);
    renderIngredientList();
  });
  const servings = parseFloat(document.getElementById('recipeServings').value)||1;
  const totals = computeRecipeTotals({ ingredients: currentRecipeIngredients, servings });
  document.getElementById('recipeTotals').innerHTML =
    `<span>Total: ${fmtInt(totals.kcal)} kcal</span><span>P ${fmt1(totals.protein)}g</span>
     <span>C ${fmt1(totals.carbs)}g</span><span>G ${fmt1(totals.fat)}g</span>
     <span>/ración: ${fmtInt(totals.kcal/servings)} kcal</span>`;
}
function saveRecipeFromModal(){
  const id = document.getElementById('recipeId').value;
  const recipe = {
    id: id || uid(),
    name: document.getElementById('recipeName').value.trim(),
    servings: parseFloat(document.getElementById('recipeServings').value)||1,
    ingredients: currentRecipeIngredients,
  };
  if(!recipe.name){ showToast('Pon un nombre a la receta'); return; }
  if(id){
    const idx = Store.data.recipes.findIndex(r=>r.id===id);
    Store.data.recipes[idx] = recipe;
  } else {
    Store.data.recipes.push(recipe);
  }
  Store.save();
  closeRecipeModal();
  renderRecipeGrid();
  showToast('Receta guardada ✓');
}

/* =========================================================
   HABITS VIEW
========================================================= */
function renderHabitsView(){
  const dateInput = document.getElementById('habitsDate');
  if(!dateInput.value) dateInput.value = todayISO();
  const date = dateInput.value;
  const log = Store.data.habitsLog[date] || {};

  const list = document.getElementById('habitList');
  list.innerHTML = '';
  HABIT_DEFS.forEach(h => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="habit-name"><span class="habit-icon">${h.icon}</span>${h.label}</span>
      <input type="checkbox" class="switch" data-habit="${h.id}" ${log[h.id] ? 'checked':''}>`;
    list.appendChild(li);
  });
  list.querySelectorAll('input').forEach(inp => inp.onchange = () => {
    if(!Store.data.habitsLog[date]) Store.data.habitsLog[date] = {};
    Store.data.habitsLog[date][inp.dataset.habit] = inp.checked;
    Store.save();
  });

  const supList = document.getElementById('supplementList');
  supList.innerHTML = '';
  SUPPLEMENTS.forEach(s => {
    const key = 'sup_'+s;
    const li = document.createElement('li');
    li.innerHTML = `<span class="habit-name"><span class="habit-icon">💊</span>${s}</span>
      <input type="checkbox" class="switch" data-sup="${key}" ${log[key] ? 'checked':''}>`;
    supList.appendChild(li);
  });
  supList.querySelectorAll('input').forEach(inp => inp.onchange = () => {
    if(!Store.data.habitsLog[date]) Store.data.habitsLog[date] = {};
    Store.data.habitsLog[date][inp.dataset.sup] = inp.checked;
    Store.save();
  });

  dateInput.onchange = () => renderHabitsView();
}

/* =========================================================
   CALENDAR VIEW
========================================================= */
let calCursor = new Date();
function renderCalendarView(){
  const p = Store.data.profile;
  const label = calCursor.toLocaleDateString('es-ES', { month:'long', year:'numeric' });
  document.getElementById('calMonthLabel').textContent = label.charAt(0).toUpperCase()+label.slice(1);

  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';
  const year = calCursor.getFullYear(), month = calCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay()+6)%7; // Monday-first
  const daysInMonth = new Date(year, month+1, 0).getDate();

  for(let i=0;i<startOffset;i++){
    const empty = document.createElement('div'); empty.className='cal-cell empty'; grid.appendChild(empty);
  }
  for(let d=1; d<=daysInMonth; d++){
    const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const cell = document.createElement('div');
    cell.className = 'cal-cell';
    cell.textContent = d;
    if(iso > todayISO()){
      cell.classList.add('future');
    } else {
      const log = Store.data.dailyLogs[iso];
      const adh = dayAdherence(log, p);
      if(log){
        if(adh >= 0.8) cell.classList.add('green');
        else if(adh >= 0.4) cell.classList.add('yellow');
        else cell.classList.add('red');
      }
    }
    grid.appendChild(cell);
  }
}

/* =========================================================
   STATS VIEW
========================================================= */
let chartInstances = {};
function renderStatsView(){
  const p = Store.data.profile;
  const wlog = sortedWeightLog();
  const last7 = wlog.filter(w => w.date >= addDays(todayISO(),-6));
  const last30 = wlog.filter(w => w.date >= addDays(todayISO(),-29));
  document.getElementById('sPesoSem').textContent = last7.length ? fmt1(avg(last7.map(w=>w.weight))) : '--';
  document.getElementById('sPesoMes').textContent = last30.length ? fmt1(avg(last30.map(w=>w.weight))) : '--';

  const logs30 = getLogsInRange(addDays(todayISO(),-29), todayISO()).map(([,l])=>l);
  document.getElementById('sAdherencia').textContent = logs30.length ? Math.round(avg(logs30.map(l=>dayAdherence(l,p)))*100)+'%' : '--';
  document.getElementById('sKcal').textContent = logs30.filter(l=>l.kcal).length ? fmtInt(avg(logs30.filter(l=>l.kcal).map(l=>l.kcal))) : '--';
  document.getElementById('sProt').textContent = logs30.filter(l=>l.protein).length ? fmtInt(avg(logs30.filter(l=>l.protein).map(l=>l.protein)))+'g' : '--';
  document.getElementById('sPasos').textContent = logs30.filter(l=>l.steps).length ? fmtInt(avg(logs30.filter(l=>l.steps).map(l=>l.steps))) : '--';
  document.getElementById('sAgua').textContent = logs30.filter(l=>l.water).length ? fmt1(avg(logs30.filter(l=>l.water).map(l=>l.water)))+'L' : '--';
  document.getElementById('sEntren').textContent = logs30.filter(l=>l.training).length;
  document.getElementById('sRunning').textContent = logs30.filter(l=>l.running).length;

  const labels = getLogsInRange(addDays(todayISO(),-13), todayISO()).map(([d])=>new Date(d+'T00:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit'}));
  const entries14 = getLogsInRange(addDays(todayISO(),-13), todayISO());

  drawOrUpdate('chartNutrition', 'bar', {
    labels, datasets:[
      { label:'Kcal', data: entries14.map(([,l])=>l.kcal||0), backgroundColor:'#2F5D4E' },
      { label:'Proteína (g)', data: entries14.map(([,l])=>l.protein||0), backgroundColor:'#E0673E' }
    ]
  });
  drawOrUpdate('chartSteps','line',{ labels, datasets:[{ label:'Pasos', data:entries14.map(([,l])=>l.steps||0), borderColor:'#3E8C5F', backgroundColor:'rgba(62,140,95,.1)', fill:true, tension:.3 }]});
  drawOrUpdate('chartWater','bar',{ labels, datasets:[{ label:'Agua (L)', data:entries14.map(([,l])=>l.water||0), backgroundColor:'#3E8FC2' }]});
  drawOrUpdate('chartAdherence','line',{ labels, datasets:[{ label:'Adherencia %', data:entries14.map(([,l])=>Math.round(dayAdherence(l,p)*100)), borderColor:'#D6A53C', backgroundColor:'rgba(214,165,60,.1)', fill:true, tension:.3 }]});
}
function avg(arr){ return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0; }
function drawOrUpdate(canvasId, type, data){
  if(chartInstances[canvasId]) chartInstances[canvasId].destroy();
  chartInstances[canvasId] = new Chart(document.getElementById(canvasId), { type, data, options: chartBaseOptions() });
}

/* =========================================================
   SETTINGS VIEW
========================================================= */
function renderSettingsView(){
  const p = Store.data.profile;
  document.getElementById('setStartWeight').value = p.startWeight;
  document.getElementById('setStartDate').value = p.startDate;
  document.getElementById('setGoalWeight').value = p.goalWeight;
  document.getElementById('setGoalDate').value = p.goalDate;
  document.getElementById('setGoalKcal').value = p.goalKcal;
  document.getElementById('setGoalProtein').value = p.goalProtein;
  document.getElementById('setGoalWater').value = p.goalWater;
  document.getElementById('setGoalSteps').value = p.goalSteps;
}
function saveGoals(){
  const p = Store.data.profile;
  p.startWeight = parseFloat(document.getElementById('setStartWeight').value)||p.startWeight;
  p.startDate = document.getElementById('setStartDate').value||p.startDate;
  p.goalWeight = parseFloat(document.getElementById('setGoalWeight').value)||p.goalWeight;
  p.goalDate = document.getElementById('setGoalDate').value||p.goalDate;
  p.goalKcal = parseFloat(document.getElementById('setGoalKcal').value)||p.goalKcal;
  p.goalProtein = parseFloat(document.getElementById('setGoalProtein').value)||p.goalProtein;
  p.goalWater = parseFloat(document.getElementById('setGoalWater').value)||p.goalWater;
  p.goalSteps = parseInt(document.getElementById('setGoalSteps').value)||p.goalSteps;
  Store.save();
  showToast('Objetivos actualizados ✓');
  renderDashboard();
}

/* =========================================================
   EXPORT
========================================================= */
function exportJSON(){
  const blob = new Blob([JSON.stringify(Store.data, null, 2)], { type:'application/json' });
  downloadBlob(blob, 'fitnessos-export.json');
}
function exportCSV(){
  const rows = [['fecha','peso','kcal','proteina','carbohidratos','grasas','fibra','agua','pasos','entrenamiento','eliptica','running','notas']];
  Object.entries(Store.data.dailyLogs).sort((a,b)=>a[0].localeCompare(b[0])).forEach(([date,l]) => {
    rows.push([date,l.weight||'',l.kcal||'',l.protein||'',l.carbs||'',l.fat||'',l.fiber||'',l.water||'',l.steps||'',l.training||'',l.elliptical?'si':'no',l.running?'si':'no',(l.notes||'').replace(/,/g,';')]);
  });
  const csv = rows.map(r=>r.join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  downloadBlob(blob, 'fitnessos-registro.csv');
}
function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* =========================================================
   INIT / EVENT BINDING
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  Store.load();
  applyTheme(Store.data.settings.theme || 'light');

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
  document.getElementById('quickLogBtn').addEventListener('click', () => switchView('log'));

  document.getElementById('themeToggle').addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    // redraw charts with new theme colors if visible
    if(document.getElementById('view-weight').classList.contains('active')) renderWeightView();
    if(document.getElementById('view-stats').classList.contains('active')) renderStatsView();
  });

  bindLogForm();

  // Nutrition tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-'+btn.dataset.tab).classList.add('active');
    });
  });
  document.getElementById('foodSearch').addEventListener('input', renderFoodTable);
  document.getElementById('foodCategoryFilter').addEventListener('change', renderFoodTable);
  document.getElementById('addFoodBtn').addEventListener('click', () => openFoodModal(null));
  document.getElementById('foodModalClose').addEventListener('click', closeFoodModal);
  document.getElementById('foodSaveBtn').addEventListener('click', () => saveFoodFromModal(false));
  document.getElementById('foodDuplicateBtn').addEventListener('click', () => saveFoodFromModal(true));

  document.getElementById('recipeSearch').addEventListener('input', renderRecipeGrid);
  document.getElementById('addRecipeBtn').addEventListener('click', () => openRecipeModal(null));
  document.getElementById('recipeModalClose').addEventListener('click', closeRecipeModal);
  document.getElementById('recipeSaveBtn').addEventListener('click', saveRecipeFromModal);
  document.getElementById('recipeServings').addEventListener('input', renderIngredientList);
  document.getElementById('ingredientAddBtn').addEventListener('click', () => {
    const foodId = document.getElementById('ingredientSelect').value;
    const grams = parseFloat(document.getElementById('ingredientGrams').value);
    if(!foodId || !grams){ showToast('Selecciona alimento y cantidad'); return; }
    currentRecipeIngredients.push({ foodId, grams });
    document.getElementById('ingredientGrams').value = '';
    renderIngredientList();
  });

  // Calendar nav
  document.getElementById('calPrev').addEventListener('click', () => { calCursor.setMonth(calCursor.getMonth()-1); renderCalendarView(); });
  document.getElementById('calNext').addEventListener('click', () => { calCursor.setMonth(calCursor.getMonth()+1); renderCalendarView(); });

  // Settings
  document.getElementById('saveGoalsBtn').addEventListener('click', saveGoals);
  document.getElementById('exportCsvBtn').addEventListener('click', exportCSV);
  document.getElementById('exportJsonBtn').addEventListener('click', exportJSON);
  document.getElementById('resetDataBtn').addEventListener('click', () => {
    if(confirm('Esto borrará todos tus datos. ¿Continuar?')){
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });

  renderDashboard();
});
