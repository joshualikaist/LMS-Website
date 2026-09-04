---
name: academic-research
description: Literature search, paper reading, and manuscript hygiene for MOTAR / UAV / robot-learning work. Use when the user asks to find papers, review related work, check claims, or follow a research → write → review loop. Does not ghost-write publications.
---

# Academic research (MOTAR-scoped)

Full suite (Claude/Cursor import): [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills)

Install globally if you want the entire paper pipeline:

```bash
npx skills add Imbad0202/academic-research-skills --agent cursor
```

Companion search stack: [SebastianElvis/reaper](https://github.com/SebastianElvis/reaper), [ultimatile/arxiv-skills](https://github.com/ultimatile/arxiv-skills), [O0000-code/paper-search-pro](https://github.com/O0000-code/paper-search-pro).

## This site’s rules

- Primary research project is **MOTAR**: sensor-only UAV interception of a moving target in clutter (FAIR Lab, KAIST).
- Do **not** invent publications, metrics, hardware results, or affiliations that are not on the website.
- Notes live in `content/notes.ts` and `/notes/[slug]`. Keep the same voice as existing field notes.
- Related-work searches should prefer arXiv `cs.RO`, `cs.LG`, robot learning, vision-based flight, sim-to-real.

## Default loop

1. **Clarify** the question (failure mode, algorithm, simulator contract).
2. **Search** arXiv / Semantic Scholar / OpenAlex. Record title, year, venue, URL.
3. **Extract** only claims that the paper actually states. Quote or paraphrase with a pointer.
4. **Map** to MOTAR: observation, intercept, clutter, onboard-only.
5. **Write** a short note or a bullet list. Human writes the argument; the agent does grunt search and structure.
6. **Review** for leaked privileged state, missing baselines, and overclaim.

## Integrity

If a number, citation, or “we showed that…” is not in the repo or a fetched paper, say it is unknown. Never fill gaps with plausible robotics jargon.
