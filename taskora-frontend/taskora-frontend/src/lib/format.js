// Formatting helpers shared across pages.

export function money(value) {
  if (value === null || value === undefined || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return '$' + n.toLocaleString();
}

export function budgetRange(min, max) {
  if (min && max) return `${money(min)} - ${money(max)}`;
  return money(min || max);
}

export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

export function statusPill(status) {
  const map = {
    OPEN: 'tk-pill-green',
    CLOSED: 'tk-pill-gray',
    IN_PROGRESS: 'tk-pill-orange',
    COMPLETED: 'tk-pill-primary',
    PENDING: 'tk-pill-gray',
    SHORTLISTED: 'tk-pill-primary',
    REJECTED: 'tk-pill-orange',
    HIRED: 'tk-pill-green',
    ACCEPTED: 'tk-pill-green',
  };
  return map[status] || 'tk-pill-gray';
}
