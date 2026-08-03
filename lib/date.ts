export function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDueDate(dueDateIso: string) {
  const due = new Date(`${dueDateIso}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);

  const label = due.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  let relative: string;
  if (diffDays === 0) {
    relative = "heute fällig";
  } else if (diffDays > 0) {
    relative = `in ${diffDays} Tag${diffDays === 1 ? "" : "en"}`;
  } else {
    relative = `vor ${Math.abs(diffDays)} Tag${Math.abs(diffDays) === 1 ? "" : "en"}`;
  }

  return { label, relative, isDueOrOverdue: diffDays <= 0 };
}

export function formatRelativeDay(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - date.getTime()) / 86400000);

  if (diffDays === 0) return "Heute";
  if (diffDays === 1) return "Gestern";

  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
