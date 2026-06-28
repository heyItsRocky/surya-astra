# ⚡ Surya-Astra — Execution Strategy

## Model Context
- All 4 agents (Ghost, Hellcat, Viper, Raven) run on `opencode/big-pickle`
- No true parallelism, but `/task` tool queues sessions sequentially
- Strategy: Maximize concurrent prep work, minimize idle time

## Antigravity Accounts (Available but not configured)
- 5 accounts, each with Gemini 3 Pro/3.1 Pro quota
- Remaining fraction: 0.954-1.0 (95-100%)
- Reset: July 5, 2026
- Model count per cycle: 3
- **Currently unused** — all agents on big-pickle

## Optimal Agent Model Mapping (Future)
| Agent | Recommended Model | Why |
|---|---|---|
| Ghost | Gemini 3.1 Pro (high thinking) | Complex planning, architecture |
| Hellcat | Gemini 3.1 Pro (low thinking) | Fast code generation |
| Viper | Gemini 3 Flash (minimal) | Docs writing, PPT |
| Raven | Gemini 3 Flash (minimal) | Git ops, build commands |

## Dispatch Sequence (Current big-pickle preset)

### Parallel Kickoff (Day 1)
| Task | Agent | Phase | Est. Time |
|---|---|---|---|
| **TASK 1** | Hellcat | Phase 0 — Scaffold + deps | 30 min |
| **TASK 2** | code-architect | Phase 2 — R3F Sun component spec | 30 min |

Both dispatched simultaneously. Task 2 is read-only research (no file writes), returns a spec for Hellcat.

### After Task 1 Completes
| Task | Agent | Phase | Est. Time |
|---|---|---|---|
| **TASK 3** | Hellcat | Phase 1 — Layout + Nav + Scroll | 1 hr |
| **TASK 4** | Hellcat | Phase 1B — Types + Mock API | 30 min |

Send both to Hellcat as a single task (related work, same context).

### After Task 2 (Architect Spec) + Task 3+4 Complete
| Task | Agent | Phase | Est. Time |
|---|---|---|---|
| **TASK 5** | Hellcat | Phase 2 — 3D Sun (using architect spec) | 3 hrs |
| **TASK 6** | code-architect | Phase 4 — Recharts dashboard design | 30 min |

Task 5 is big (R3F). Task 6 runs parallel as read-only.

### After Task 5 Complete
| Task | Agent | Phase | Est. Time |
|---|---|---|---|
| **TASK 7** | Hellcat | Phase 3 — Content sections | 2 hrs |
| **TASK 8** | Hellcat | Phase 4 — Dashboard widgets | 2 hrs |

**These CAN run as two parallel tasks** — different files, no overlap.

### After Task 7+8 Complete
| Task | Agent | Phase | Est. Time |
|---|---|---|---|
| **TASK 9** | Hellcat | Phase 5 — Animations + Polish | 3 hrs |

Biggest single task. Includes Anime.js scroll triggers, counter hooks, performance, responsive.

### After Task 9 Complete
| Task | Agent | Phase | Est. Time |
|---|---|---|---|
| **TASK 10** | Hellcat | Phase 6 — Screenshots | 30 min |
| **TASK 11** | Viper | Phase 6 — PPT content draft | 1 hr |

Parallel again. Different concerns.

## Ghost's Role During Execution
While tasks run, Ghost in main thread:
- Researches next phase requirements (MCP tools, docs lookup)
- Pre-writes specs for Hellcat's next task
- Reviews returned results
- Adjusts plan based on what works/doesn't
- Keeps todo list updated

## What to Do On Resumption
1. ✅ Verify /mnt/e/Surya-Astra/plan.md exists
2. ✅ Read user-experience.md for alignment
3. 🔄 User confirms "Start Phase 0"
4. Ghost dispatches TASK 1 + TASK 2 simultaneously
5. Ghost researches Anime.js v4 API while tasks run
6. Ghost reviews results, dispatches next batch
