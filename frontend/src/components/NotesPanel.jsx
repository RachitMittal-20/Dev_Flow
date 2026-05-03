import { useEffect, useState } from "react";

function loadNotes(storageKey) {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function createNoteId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function NotesPanel({
  storageKey,
  title = "Notes & Follow-Ups",
  subtitle = "Capture manager follow-ups or lightweight decisions tied to this month so action does not stay implicit.",
  placeholder = "Add a follow-up action, observation, or risk to revisit..."
}) {
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setItems(loadNotes(storageKey));
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  function addItem() {
    const value = draft.trim();

    if (!value) {
      return;
    }

    setItems((current) => [
      {
        id: createNoteId(),
        text: value,
        done: false,
        createdAt: new Date().toISOString()
      },
      ...current
    ]);
    setDraft("");
  }

  function toggleItem(id) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <section className="panel-surface rounded-[28px] p-6">
      <div className="mb-6 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
          {title}
        </div>
        <p className="max-w-2xl text-sm leading-6 text-[rgba(232,234,240,0.74)]">
          {subtitle}
        </p>
      </div>

      <div className="rounded-[22px] bg-[rgba(255,255,255,0.03)] p-4">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder={placeholder}
          className="min-h-[112px] w-full resize-none rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(10,14,26,0.72)] px-4 py-3 text-sm text-[rgba(232,234,240,0.92)] outline-none transition-colors duration-200 placeholder:text-[rgba(232,234,240,0.38)] focus:border-[rgba(79,142,247,0.4)]"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={addItem}
            className="rounded-full bg-[var(--accent-blue)] px-4 py-2 text-sm font-medium text-white shadow-[0_12px_24px_rgba(79,142,247,0.2)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Save follow-up
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[22px] bg-[rgba(255,255,255,0.03)] px-4 py-5 text-sm text-[rgba(232,234,240,0.72)]">
            No notes yet for this context.
          </div>
        ) : null}

        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-[22px] bg-[rgba(255,255,255,0.03)] px-4 py-4"
          >
            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                  item.done
                    ? "border-[rgba(62,207,142,0.24)] bg-[rgba(62,207,142,0.12)] text-[var(--accent-green)]"
                    : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-[var(--text-secondary)]"
                }`}
              >
                {item.done ? "✓" : ""}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm leading-6 ${
                    item.done
                      ? "text-[rgba(232,234,240,0.55)] line-through"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {item.text}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-xs text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
