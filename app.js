"use strict";

const newsKey = "cobras-paris-news-v2";
const matchesKey = "cobras-paris-matches-v1";
const $ = (id) => document.getElementById(id);
const defaultNews = [
  { id: 1, category: "Vie du club", title: "Les Cobras font leur rentrée", excerpt: "La saison démarre fort. Retrouvez-nous dès septembre pour les premiers entraînements.", date: "28 AOÛT 2025" },
  { id: 2, category: "Recrutement", title: "Le recrutement est ouvert", excerpt: "Envie de découvrir le football américain ? Les séances d'essai sont ouvertes à tous les niveaux.", date: "20 AOÛT 2025" },
  { id: 3, category: "Événement", title: "Un club, une famille", excerpt: "Retour en images sur la journée portes ouvertes qui a réuni toute la communauté Cobra.", date: "12 AOÛT 2025" }
];
const defaultMatches = [
  { id: 1, date: "2025-09-14", opponent: "Meteors", venue: "Stade Georges Carpentier · Paris 13e", type: "À domicile" },
  { id: 2, date: "2025-09-28", opponent: "Warriors", venue: "Stade du Parc · Cergy", type: "À l'extérieur" },
  { id: 3, date: "2025-10-12", opponent: "Lions", venue: "Stade Georges Carpentier · Paris 13e", type: "À domicile" }
];
function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}
function isPast(value) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${value}T12:00:00`) < today;
}
let news = read(newsKey, defaultNews);
let matches = read(matchesKey, defaultMatches);
async function syncPublicData() {
  try {
    const cloudNews = await window.cobrasCloud.load("news", news);
    const cloudMatches = await window.cobrasCloud.load("matches", matches);
    if (Array.isArray(cloudNews) && cloudNews.length) news = cloudNews;
    if (Array.isArray(cloudMatches) && cloudMatches.length) matches = cloudMatches;
    localStorage.setItem(newsKey, JSON.stringify(news));
    localStorage.setItem(matchesKey, JSON.stringify(matches));
  } catch (error) {
    console.warn("Données cloud indisponibles, utilisation des données locales.", error);
  }
  renderNews();
  renderMatches();
}
function renderNews() {
  $("newsGrid").innerHTML = news.map((item) => `<article class="news-card"><span class="news-tag">${escapeHtml(item.category)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.excerpt)}</p><span class="date">${escapeHtml(item.date)}</span></article>`).join("");
}
function renderMatches() {
  const upcoming = matches.filter((match) => !isPast(match.date)).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const next = upcoming[0];
  $("nextMatchName").textContent = next ? `COBRAS vs. ${next.opponent.toUpperCase()}` : "AUCUN MATCH PROGRAMMÉ";
  $("nextMatchDate").textContent = next ? new Date(`${next.date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" }).replace(".", "").toUpperCase() : "CALENDRIER À VENIR";
  $("nextMatchVenue").textContent = next ? next.venue.toUpperCase() : "";
  $("matchList").innerHTML = upcoming.map((match, index) => {
    const date = new Date(`${match.date}T12:00:00`);
    return `<article class="match-card${index === 0 ? " featured-match" : ""}"><div class="match-date"><b>${date.getDate()}</b><span>${date.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "").toUpperCase()}<br />${date.getFullYear()}</span></div><div class="match-teams"><small>JOURNÉE ${index + 1} · ${escapeHtml(match.type).toUpperCase()}</small><strong>COBRAS <i>VS</i> ${escapeHtml(match.opponent)}</strong><span>${escapeHtml(match.venue)}</span></div>${index === 0 ? `<a class="button button-primary small" href="#billetterie">Infos match →</a>` : `<span class="match-status">À VENIR</span>`}</article>`;
  }).join("") || '<p class="calendar-empty">Aucun prochain match programmé.</p>';
}
function smoothScrollTo(target) {
  const start = window.scrollY;
  const destination = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 92);
  const distance = destination - start;
  const duration = Math.min(1150, Math.max(550, Math.abs(distance) * 0.7));
  const startedAt = performance.now();
  const ease = (progress) => progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  function frame(now) {
    const progress = Math.min(1, (now - startedAt) / duration);
    window.scrollTo(0, start + distance * ease(progress));
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  event.preventDefault();
  smoothScrollTo(target);
  history.replaceState(null, "", link.getAttribute("href"));
});
syncPublicData();
