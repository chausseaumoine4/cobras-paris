"use strict";
const key = "cobras-paris-matches-v1";
const defaults = [
  { id: 1, date: "2025-09-14", opponent: "Meteors", venue: "Stade Georges Carpentier · Paris 13e", type: "À domicile", scoreHome: 21, scoreAway: 14 },
  { id: 2, date: "2025-09-28", opponent: "Warriors", venue: "Stade du Parc · Cergy", type: "À l'extérieur", scoreHome: 7, scoreAway: 28 },
  { id: 3, date: "2025-10-12", opponent: "Lions", venue: "Stade Georges Carpentier · Paris 13e", type: "À domicile", scoreHome: 0, scoreAway: 0 }
];
const matches = (() => { try { return JSON.parse(localStorage.getItem(key)) || defaults; } catch { return defaults; } })();
const today = new Date(); today.setHours(0, 0, 0, 0);
let viewedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const matchDate = (match) => new Date(`${match.date}T12:00:00`);
const isPast = (match) => matchDate(match) < today;
const score = (match) => match.scoreHome === null || match.scoreHome === undefined || match.scoreAway === null || match.scoreAway === undefined ? "Score à renseigner" : `${match.scoreHome} — ${match.scoreAway}`;

function renderMonth() {
  $("monthTitle").textContent = viewedMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }).replace(/^./, (char) => char.toUpperCase());
  const firstDay = new Date(viewedMonth);
  const mondayIndex = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let index = 0; index < mondayIndex; index++) cells.push('<div class="month-cell muted-cell"></div>');
  for (let day = 1; day <= daysInMonth; day++) {
    const current = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), day);
    const keyValue = dateKey(current);
    const dayMatches = matches.filter((match) => match.date === keyValue);
    cells.push(`<div class="month-cell${keyValue === dateKey(today) ? " today-cell" : ""}"><span class="day-number">${day}</span>${dayMatches.map((match) => `<div class="calendar-event ${isPast(match) ? "finished-event" : "upcoming-event"}"><b>${isPast(match) ? "TERMINÉ" : "MATCH"}</b><span>Cobras vs ${escapeHtml(match.opponent)}</span><small>${isPast(match) ? score(match) : escapeHtml(match.type)}</small></div>`).join("")}</div>`);
  }
  const trailing = (7 - (cells.length % 7)) % 7;
  for (let index = 0; index < trailing; index++) cells.push('<div class="month-cell muted-cell"></div>');
  $("monthGrid").innerHTML = cells.join("");
}
function renderList() {
  $("calendarList").innerHTML = matches.slice().sort((a, b) => a.date.localeCompare(b.date)).map((match) => `<article class="calendar-match ${isPast(match) ? "is-finished" : "is-upcoming"}"><div class="calendar-date"><b>${matchDate(match).getDate()}</b><span>${matchDate(match).toLocaleDateString("fr-FR", { weekday: "short", month: "long", year: "numeric" }).replace(".", "")}</span></div><div class="calendar-opponent"><small>${isPast(match) ? "MATCH TERMINÉ" : "À VENIR"} · ${escapeHtml(match.type).toUpperCase()}</small><h2>COBRAS <i>VS</i> ${escapeHtml(match.opponent)}</h2><p>${escapeHtml(match.venue)}</p></div><strong class="calendar-score">${isPast(match) ? score(match) : "À venir"}</strong></article>`).join("") || '<p class="calendar-empty">Aucun match programmé.</p>';
}
$("previousMonth").addEventListener("click", () => { viewedMonth = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() - 1, 1); renderMonth(); });
$("nextMonth").addEventListener("click", () => { viewedMonth = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 1); renderMonth(); });
$("todayButton").addEventListener("click", () => { viewedMonth = new Date(today.getFullYear(), today.getMonth(), 1); renderMonth(); });
renderMonth();
renderList();
