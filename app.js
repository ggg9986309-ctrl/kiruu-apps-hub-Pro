const starterApps = [
 {id:"demo-1",name:"Nova Tools",category:"Tools",icon:"🧰",description:"A demo listing for useful everyday utilities.",url:"https://www.google.com",featured:true},
 {id:"demo-2",name:"Pixel Studio",category:"Creative",icon:"🎨",description:"A sample creative app listing for designers and makers.",url:"https://www.adobe.com",featured:true},
 {id:"demo-3",name:"Game Zone",category:"Gaming",icon:"🎮",description:"A demo gaming listing. Add your trusted game links here.",url:"https://play.google.com/store",featured:false},
 {id:"demo-4",name:"AI Companion",category:"AI",icon:"🤖",description:"A sample AI tools listing for curious minds.",url:"https://chatgpt.com",featured:true},
 {id:"demo-5",name:"Clip Maker",category:"Creative",icon:"✂️",description:"A demo video and editing tools listing.",url:"https://www.capcut.com",featured:false},
 {id:"demo-6",name:"File Manager",category:"Tools",icon:"📁",description:"A sample file utility listing for your collection.",url:"https://www.google.com",featured:false}
];
const STORAGE_KEY = "kiruu_apps_hub_v1";
let apps = loadApps();
let currentCategory = "All";
const $ = id => document.getElementById(id);
function loadApps(){try{const saved=localStorage.getItem(STORAGE_KEY);return saved?JSON.parse(saved):starterApps.slice()}catch{return starterApps.slice()}}
function saveApps(){localStorage.setItem(STORAGE_KEY,JSON.stringify(apps))}
function safeUrl(value){try{const u=new URL(value);return ["https:","http:"].includes(u.protocol)?u.href:null}catch{return null}}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderApps(){
 const q=$("searchInput").value.trim().toLowerCase();
 const filtered=apps.filter(a=>(currentCategory==="All"||a.category===currentCategory)&&[a.name,a.category,a.description].join(" ").toLowerCase().includes(q));
 $("appGrid").innerHTML=filtered.map(a=>`<article class="app-card"><div class="app-card-top"><div class="app-icon">${escapeHTML(a.icon||"✨")}</div><span class="tag">${escapeHTML(a.category)}</span></div><h3>${escapeHTML(a.name)}</h3><p>${escapeHTML(a.description)}</p><div class="card-foot"><small>${a.featured?"✦ Featured app":"KIRUU collection"}</small><a class="card-link" href="${escapeHTML(safeUrl(a.url)||"#")}" target="_blank" rel="noopener noreferrer">Visit source ↗</a></div></article>`).join("");
 $("emptyState").classList.toggle("hidden",filtered.length>0);
 $("appCount").textContent=apps.length;$("allCount").textContent=apps.length;
}
function renderManage(){
 $("manageList").innerHTML=apps.map(a=>`<div class="manage-item"><span>${escapeHTML(a.icon||"✨")}</span><div class="manage-name"><b>${escapeHTML(a.name)}</b><small>${escapeHTML(a.category)}</small></div><button class="delete-btn" data-delete="${escapeHTML(a.id)}">Delete</button></div>`).join("")||'<p class="dialog-note">No apps yet.</p>';
}
function toast(message){const t=$("toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
$("searchInput").addEventListener("input",renderApps);
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{currentCategory=btn.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));renderApps()}));
$("adminOpen").addEventListener("click",()=>{$("adminDialog").showModal();$("navLinks").classList.remove("open")});
$("menuBtn").addEventListener("click",()=>$("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>$("navLinks").classList.remove("open")));
$("loginBtn").addEventListener("click",()=>{
 if($("adminUser").value.trim().toLowerCase()==="kiran"&&$("adminPass").value==="demo123"){
  $("loginError").classList.add("hidden");$("loginPane").classList.add("hidden");$("adminPane").classList.remove("hidden");renderManage();toast("Demo panel opened");
 }else $("loginError").classList.remove("hidden");
});
$("addAppBtn").addEventListener("click",()=>{
 const name=$("newName").value.trim(),category=$("newCategory").value,icon=$("newIcon").value.trim()||"✨",description=$("newDescription").value.trim(),url=safeUrl($("newUrl").value.trim());
 if(!name||!description||!url){toast("Add name, description and a valid http(s) URL.");return}
 apps.unshift({id:"app-"+Date.now(),name,category,icon,description,url,featured:false});saveApps();renderApps();renderManage();
 ["newName","newIcon","newDescription","newUrl"].forEach(id=>$(id).value="");toast("App added in this browser");
});
$("manageList").addEventListener("click",e=>{const btn=e.target.closest("[data-delete]");if(!btn)return;apps=apps.filter(a=>a.id!==btn.dataset.delete);saveApps();renderApps();renderManage();toast("App removed from this browser")});
$("logoutBtn").addEventListener("click",()=>{$("adminPane").classList.add("hidden");$("loginPane").classList.remove("hidden");$("adminUser").value="";$("adminPass").value="";toast("Logged out")});
$("adminDialog").addEventListener("close",()=>{if(!$("adminPane").classList.contains("hidden")){$("adminPane").classList.add("hidden");$("loginPane").classList.remove("hidden")}});
$("year").textContent=new Date().getFullYear();
if("serviceWorker" in navigator && location.protocol.startsWith("http")) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
renderApps();
