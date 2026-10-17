/* ==========================================
   KIRUU APPS HUB PRO
   Made with ⚡ by KIRAN
========================================== */

const DEFAULT_APPS = [
  {
    id: "bgmi",
    name: "BGMI",
    category: "Games",
    icon: "🎮",
    description: "Battle royale gaming experience.",
    url: "https://www.battlegroundsmobileindia.com/"
  },
  {
    id: "youtube",
    name: "YouTube",
    category: "Entertainment",
    icon: "▶️",
    description: "Videos, creators and gaming highlights.",
    url: "https://www.youtube.com/"
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "Social",
    icon: "📸",
    description: "Share photos, reels and moments.",
    url: "https://www.instagram.com/"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "Social",
    icon: "💬",
    description: "Message and call your friends.",
    url: "https://www.whatsapp.com/"
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "Entertainment",
    icon: "🎧",
    description: "Discover music and playlists.",
    url: "https://www.spotify.com/"
  },
  {
    id: "google",
    name: "Google",
    category: "Tools",
    icon: "🔎",
    description: "Search the web and find information.",
    url: "https://www.google.com/"
  },
  {
    id: "telegram",
    name: "Telegram",
    category: "Social",
    icon: "✈️",
    description: "Connect with friends and communities.",
    url: "https://telegram.org/"
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "Tools",
    icon: "🤖",
    description: "Explore AI tools and get help with ideas.",
    url: "https://chatgpt.com/"
  }
];

const STORAGE_KEY = "kiruuApps";

let apps = loadApps();
let selectedCategory = "All";
let editingId = null;


/* ---------- STORAGE ---------- */

function loadApps() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("App storage could not be loaded:", error);
  }

  return DEFAULT_APPS.map(app => ({ ...app }));
}

function saveAppsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    return true;
  } catch (error) {
    alert("Storage unavailable. Please check your browser settings.");
    return false;
  }
}


/* ---------- HELPERS ---------- */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function safeURL(value) {
  try {
    const url = new URL(String(value).trim());

    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }
  } catch (error) {
    // Invalid URL
  }

  return "";
}

function getElement(id) {
  return document.getElementById(id);
}


/* ---------- HOMEPAGE ---------- */

function renderApps() {
  const grid = getElement("appGrid");

  if (!grid) return;

  const searchInput = getElement("searchInput");
  const search = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  const filteredApps = apps.filter(app => {
    const categoryMatch =
      selectedCategory === "All" ||
      app.category === selectedCategory;

    const searchableText = [
      app.name,
      app.category,
      app.description
    ].join(" ").toLowerCase();

    return categoryMatch && searchableText.includes(search);
  });

  if (filteredApps.length === 0) {
    grid.innerHTML = "";
  } else {
    grid.innerHTML = filteredApps.map((app, index) => {
      const url = safeURL(app.url);

      return `
        <article class="app-card"
          style="animation-delay:${Math.min(index * 70, 350)}ms">

          <div class="app-icon">
            ${escapeHTML(app.icon || "📱")}
          </div>

          <h3>${escapeHTML(app.name)}</h3>

          <p>${escapeHTML(app.description)}</p>

          <div class="app-meta">
            <span class="app-category">
              ${escapeHTML(app.category)}
            </span>

            ${
              url
                ? `<a class="download-button"
                     href="${escapeHTML(url)}"
                     target="_blank"
                     rel="noopener noreferrer">
                     VISIT ↗
                   </a>`
                : `<span>Link unavailable</span>`
            }
          </div>
        </article>
      `;
    }).join("");
  }

  const emptyState = getElement("emptyState");

  if (emptyState) {
    emptyState.hidden = filteredApps.length > 0;
  }

  updateCount("appCount", apps.length);
  updateCount("heroAppCount", apps.length);
  updateCount("adminCount", apps.length);

  renderAdminApps();
}

function updateCount(id, count) {
  const element = getElement(id);

  if (element) {
    element.textContent = count;
  }
}


/* ---------- CATEGORY FILTER ---------- */

function setCategory(category, button) {
  selectedCategory = category;

  document.querySelectorAll(".category").forEach(item => {
    item.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  }

  renderApps();
}


/* ---------- ADMIN LOGIN ---------- */

function openAdmin() {
  const modal = getElement("adminModal");

  if (modal) {
    modal.hidden = false;
  }

  const loginSection = getElement("loginSection");
  const dashboard = getElement("dashboard");

  if (loginSection) loginSection.hidden = false;
  if (dashboard) dashboard.hidden = true;

  const error = getElement("loginError");

  if (error) error.textContent = "";

  document.body.style.overflow = "hidden";
}

function closeAdmin() {
  const modal = getElement("adminModal");

  if (modal) {
    modal.hidden = true;
  }

  document.body.style.overflow = "";
}

function loginAdmin(event) {
  event.preventDefault();

  const username = getElement("adminUsername")?.value.trim();
  const password = getElement("adminPassword")?.value;

  const error = getElement("loginError");

  if (username === "kiran" && password === "demo123") {
    getElement("loginSection").hidden = true;
    getElement("dashboard").hidden = false;

    if (error) error.textContent = "";

    renderApps();
  } else {
    if (error) {
      error.textContent = "Incorrect username or password.";
    }
  }
}

function logoutAdmin() {
  const loginSection = getElement("loginSection");
  const dashboard = getElement("dashboard");

  if (loginSection) loginSection.hidden = false;
  if (dashboard) dashboard.hidden = true;

  const username = getElement("adminUsername");
  const password = getElement("adminPassword");

  if (username) username.value = "";
  if (password) password.value = "";

  const error = getElement("loginError");

  if (error) error.textContent = "";
}


/* ---------- ADD / EDIT APP ---------- */

function saveApp(event) {
  event.preventDefault();

  const name = getElement("newAppName").value.trim();
  const category = getElement("newAppCategory").value;
  const icon = getElement("newAppIcon").value.trim() || "📱";
  const description =
    getElement("newAppDescription").value.trim();
  const rawURL = getElement("newAppUrl").value.trim();
  const url = safeURL(rawURL);

  if (!name || !description || !url) {
    alert("Please enter the app name, description and a valid website URL.");
    return;
  }

  if (
    !["Games", "Tools", "Social", "Entertainment"].includes(category)
  ) {
    alert("Please select a valid category.");
    return;
  }

  if (editingId) {
    const index = apps.findIndex(app => app.id === editingId);

    if (index !== -1) {
      apps[index] = {
        ...apps[index],
        name,
        category,
        icon,
        description,
        url
      };
    }
  } else {
    apps.unshift({
      id: "app-" + Date.now(),
      name,
      category,
      icon,
      description,
      url
    });
  }

  if (!saveAppsToStorage()) return;

  resetAppForm();
  renderApps();

  alert(editingId ? "App updated successfully!" : "App added successfully!");
}

function editApp(id) {
  const app = apps.find(item => item.id === id);

  if (!app) return;

  editingId = id;

  getElement("editId").value = id;
  getElement("newAppName").value = app.name;
  getElement("newAppCategory").value = app.category;
  getElement("newAppIcon").value = app.icon || "";
  getElement("newAppDescription").value = app.description;
  getElement("newAppUrl").value = app.url;

  const submitButton = getElement("appForm")
    ?.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.textContent = "UPDATE APP ✓";
  }

  getElement("appForm")?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function resetAppForm() {
  const form = getElement("appForm");

  if (form) form.reset();

  editingId = null;

  const editId = getElement("editId");

  if (editId) editId.value = "";

  const submitButton = form
    ?.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.textContent = "SAVE APP +";
  }
}


/* ---------- DELETE APP ---------- */

function deleteApp(id) {
  const app = apps.find(item => item.id === id);

  if (!app) return;

  const confirmed = confirm(
    `Are you sure you want to delete "${app.name}"?`
  );

  if (!confirmed) return;

  apps = apps.filter(item => item.id !== id);

  if (!saveAppsToStorage()) return;

  if (editingId === id) {
    resetAppForm();
  }

  renderApps();
}


/* ---------- ADMIN APP LIST ---------- */

function renderAdminApps() {
  const list = getElement("adminAppList");

  if (!list) return;

  if (apps.length === 0) {
    list.innerHTML = "<p>No apps available yet.</p>";
    return;
  }

  list.innerHTML = apps.map(app => `
    <div class="admin-app-item">

      <div class="app-icon">
        ${escapeHTML(app.icon || "📱")}
      </div>

      <div class="admin-app-details">
        <strong>${escapeHTML(app.name)}</strong>
        <small>${escapeHTML(app.category)}</small>
      </div>

      <button
        type="button"
        class="small-action"
        onclick="editApp('${escapeHTML(app.id)}')">
        EDIT
      </button>

      <button
        type="button"
        class="small-action delete-action"
        onclick="deleteApp('${escapeHTML(app.id)}')">
        DELETE
      </button>

    </div>
  `).join("");
}


/* ---------- ANNOUNCEMENT ---------- */

function closeNotice() {
  const notice = getElement("noticeWrap");

  if (notice) {
    notice.hidden = true;
  }
}


/* ---------- STARTUP ---------- */

document.addEventListener("DOMContentLoaded", function () {
  const year = getElement("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const noticeClose = getElement("noticeClose");

  if (noticeClose) {
    noticeClose.addEventListener("click", closeNotice);
  }

  renderApps();
});
