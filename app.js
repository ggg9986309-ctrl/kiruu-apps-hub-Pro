/* KIRUU APPS HUB PRO
   Local demo admin.
   Changes are saved in this browser only.
*/

"use strict";

const ADMIN_USERNAME = "kiran";
const ADMIN_PASSWORD = "ambi@0000";
const STORAGE_KEY = "kiruu_apps_hub_apps_v1";
const SESSION_KEY = "kiruu_apps_hub_admin_session";

const DEFAULT_APPS = [
  {
    id: "bgmi",
    name: "BGMI",
    category: "Games",
    icon: "🎮",
    description: "Battle royale gaming and intense action.",
    url: "https://www.battlegroundsmobileindia.com/",
    featured: true
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "Social",
    icon: "📸",
    description: "Share photos and connect with creators.",
    url: "https://www.instagram.com/",
    featured: false
  },
  {
    id: "youtube",
    name: "YouTube",
    category: "Entertainment",
    icon: "▶️",
    description: "Videos, music and gaming content.",
    url: "https://www.youtube.com/",
    featured: true
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "Social",
    icon: "💬",
    description: "Message and connect with friends.",
    url: "https://www.whatsapp.com/",
    featured: false
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "Entertainment",
    icon: "🎵",
    description: "Discover music and playlists.",
    url: "https://open.spotify.com/",
    featured: false
  },
  {
    id: "google",
    name: "Google",
    category: "Tools",
    icon: "🔎",
    description: "Search the web for information.",
    url: "https://www.google.com/",
    featured: false
  }
];

let apps = loadApps();
let activeCategory = "All";
let editingId = null;

function loadApps() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Could not load apps:", error);
  }

  return DEFAULT_APPS.map(app => ({ ...app }));
}

function persistApps() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    return true;
  } catch (error) {
    alert("Apps save nahi hui. Browser storage full ho sakti hai.");
    return false;
  }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function safeURL(value) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }
  } catch (_) {}
  return "";
}

function appIcon(icon) {
  const value = String(icon || "🎮").trim();

  if (/^https?:\/\//i.test(value)) {
    const url = safeURL(value);
    if (url) {
      return `<img src="${escapeHTML(url)}"
        alt="" loading="lazy"
        style="width:100%;height:100%;object-fit:cover;border-radius:inherit"
        onerror="this.style.display='none'">`;
    }
  }

  return escapeHTML(value || "🎮");
}

function renderApps() {
  const grid = document.getElementById("appGrid");
  const empty = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");

  if (!grid) {
    console.error("appGrid element nahi mila. index.html ke IDs check karo.");
    return;
  }

  const query = (searchInput?.value || "").trim().toLowerCase();

  const filtered = apps.filter(app => {
    const categoryMatch =
      activeCategory === "All" || app.category === activeCategory;

    const searchMatch = [
      app.name,
      app.category,
      app.description
    ].some(value => String(value || "").toLowerCase().includes(query));

    return categoryMatch && searchMatch;
  });

  grid.innerHTML = filtered.map(app => {
    const url = safeURL(app.url);
    const icon = appIcon(app.icon);

    return `
      <article class="app-card">
        <div class="app-icon">${icon}</div>
        <div class="app-info">
          <h3>${escapeHTML(app.name)}</h3>
          <span class="app-category">${escapeHTML(app.category)}</span>
          <p>${escapeHTML(app.description)}</p>
          ${app.featured ? '<span class="featured-badge">⭐ Featured</span>' : ""}
        </div>
        ${url
          ? `<a class="download-btn"
              href="${escapeHTML(url)}"
              target="_blank"
              rel="noopener noreferrer">Open App ↗</a>`
          : '<span class="download-btn">Link unavailable</span>'}
      </article>
    `;
  }).join("");

  if (empty) empty.style.display = filtered.length ? "none" : "block";

  updateCounts();
}

function updateCounts() {
  const count = apps.length;

  ["heroAppCount", "appCount"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = count;
  });

  const adminCount = document.getElementById("adminCount");
  if (adminCount) adminCount.textContent = count;

  renderAdminList();
}

function setCategory(category, button) {
  activeCategory = category;

  document.querySelectorAll(".categories button, .category-btn")
    .forEach(item => item.classList.remove("active"));

  if (button) button.classList.add("active");

  renderApps();
}

function openAdmin() {
  const modal = document.getElementById("adminModal");
  if (modal) modal.style.display = "flex";

  const loggedIn = sessionStorage.getItem(SESSION_KEY) === "true";
  showAdminDashboard(loggedIn);
}

function closeAdmin() {
  const modal = document.getElementById("adminModal");
  if (modal) modal.style.display = "none";
}

function loginAdmin(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("adminUsername")?.value || "";
  const password = document.getElementById("adminPassword")?.value || "";
  const error = document.getElementById("loginError");

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "true");
    if (error) error.textContent = "";
    showAdminDashboard(true);
    return;
  }

  if (error) error.textContent = "Username ya password galat hai.";
}

function showAdminDashboard(loggedIn) {
  const loginSection = document.getElementById("loginSection");
  const dashboard = document.getElementById("dashboard");

  if (loginSection) loginSection.style.display = loggedIn ? "none" : "block";
  if (dashboard) dashboard.style.display = loggedIn ? "block" : "none";

  if (loggedIn) renderAdminList();
}

function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
  editingId = null;
  resetAppForm();
  showAdminDashboard(false);
}

function togglePassword() {
  const input = document.getElementById("adminPassword");
  if (input) {
    input.type = input.type === "password" ? "text" : "password";
  }
}

function saveApp(event) {
  if (event) event.preventDefault();

  if (sessionStorage.getItem(SESSION_KEY) !== "true") {
    alert("Pehle admin login karo.");
    return;
  }

  const name = document.getElementById("newAppName")?.value.trim() || "";
  const category = document.getElementById("newAppCategory")?.value || "Games";
  const icon = document.getElementById("newAppIcon")?.value.trim() || "🎮";
  const description =
    document.getElementById("newAppDescription")?.value.trim() || "";
  const url = safeURL(
    document.getElementById("newAppUrl")?.value.trim() || ""
  );

  if (!name || !url) {
    alert("App ka naam aur valid HTTP/HTTPS link bharo.");
    return;
  }

  const allowedCategories = [
    "Games", "Tools", "Social", "Entertainment"
  ];

  if (!allowedCategories.includes(category)) {
    alert("Valid category select karo.");
    return;
  }

  const record = {
    id: editingId || (
      "app-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8)
    ),
    name,
    category,
    icon,
    description,
    url,
    featured: Boolean(
      document.getElementById("newAppFeatured")?.checked
    )
  };

  const previousApps = [...apps];

  if (editingId) {
    apps = apps.map(app => app.id === editingId ? record : app);
  } else {
    apps.unshift(record);
  }

  if (!persistApps()) {
    apps = previousApps;
    return;
  }

  editingId = null;
  resetAppForm();
  renderApps();
  showAdminDashboard(true);
}

function editApp(id) {
  if (sessionStorage.getItem(SESSION_KEY) !== "true") return;

  const app = apps.find(item => item.id === id);
  if (!app) return;

  editingId = id;

  const fields = {
    newAppName: app.name,
    newAppCategory: app.category,
    newAppIcon: app.icon,
    newAppDescription: app.description,
    newAppUrl: app.url
  };

  Object.entries(fields).forEach(([fieldId, value]) => {
    const element = document.getElementById(fieldId);
    if (element) element.value = value || "";
  });

  const featured = document.getElementById("newAppFeatured");
  if (featured) featured.checked = Boolean(app.featured);

  const button = document.getElementById("saveAppButton");
  if (button) button.textContent = "Update App";

  document.getElementById("appForm")?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function deleteApp(id) {
  if (sessionStorage.getItem(SESSION_KEY) !== "true") return;

  const app = apps.find(item => item.id === id);
  if (!app) return;

  if (!confirm(`"${app.name}" ko delete karna hai?`)) return;

  const previousApps = [...apps];
  apps = apps.filter(item => item.id !== id);

  if (!persistApps()) {
    apps = previousApps;
    return;
  }

  renderApps();
}

function renderAdminList() {
  const list = document.getElementById("adminAppList");
  if (!list) return;

  if (sessionStorage.getItem(SESSION_KEY) !== "true") {
    list.innerHTML = "";
    return;
  }

  list.innerHTML = apps.map(app => `
    <div class="admin-app-row"
      style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 0;border-bottom:1px solid #ffffff20">
      <span style="font-size:24px">${appIcon(app.icon)}</span>
      <div style="flex:1;min-width:120px">
        <strong>${escapeHTML(app.name)}</strong><br>
        <small>${escapeHTML(app.category)}</small>
      </div>
      <button type="button" onclick="editApp('${escapeHTML(app.id)}')">Edit</button>
      <button type="button" onclick="deleteApp('${escapeHTML(app.id)}')">Delete</button>
    </div>
  `).join("");
}

function resetAppForm() {
  const form = document.getElementById("appForm");
  if (form) form.reset();

  editingId = null;

  const button = document.getElementById("saveAppButton");
  if (button) button.textContent = "Save App";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (form) form.addEventListener("submit", loginAdmin);

  const appForm = document.getElementById("appForm");
  if (appForm) appForm.addEventListener("submit", saveApp);

  const search = document.getElementById("searchInput");
  if (search) search.addEventListener("input", renderApps);

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  showAdminDashboard(sessionStorage.getItem(SESSION_KEY) === "true");
  renderApps();
});

window.renderApps = renderApps;
window.setCategory = setCategory;
window.openAdmin = openAdmin;
window.closeAdmin = closeAdmin;
window.loginAdmin = loginAdmin;
window.togglePassword = togglePassword;
window.saveApp = saveApp;
window.resetAppForm = resetAppForm;
window.logoutAdmin = logoutAdmin;
window.editApp = editApp;
window.deleteApp = deleteApp;
