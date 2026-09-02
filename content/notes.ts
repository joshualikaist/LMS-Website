export type Note = {
  date: string;
  title: string;
  kind: "RESEARCH NOTE" | "LEARNING NOTE" | "ENGINEERING NOTE";
  minutes: number;
  status: "draft" | "published";
  slug?: string;
};

// Planned first notes. Move a note to status "published" (and give it a slug +
// content) when it is actually written — drafts render as non-clickable rows.
export const notes: Note[] = [
  {
    date: "2026.09",
    title: "Failure modes in sensor-only UAV navigation",
    kind: "RESEARCH NOTE",
    minutes: 7,
    status: "draft",
  },
  {
    date: "2026.08",
    title: "Understanding PPO through UAV navigation",
    kind: "LEARNING NOTE",
    minutes: 11,
    status: "draft",
  },
  {
    date: "2026.08",
    title: "Isaac Gym, Isaac Sim, and what actually changes",
    kind: "ENGINEERING NOTE",
    minutes: 9,
    status: "draft",
  },
];
