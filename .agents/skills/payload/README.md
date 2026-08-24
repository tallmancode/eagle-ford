# Payload skill — use workspace root

This brand folder does **not** own the Payload skill.

**Canonical path**

| From               | Path                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| Brand repo root    | `../.agents/skills/payload/SKILL.md`                                 |
| Workspace root     | `.agents/skills/payload/SKILL.md`                                    |
| Absolute (typical) | `C:\development\Eagle Motor Company\.agents\skills\payload\SKILL.md` |

Open via `eagle-motor-company.code-workspace` so shared `.agents` is visible to Cursor.

Reference docs: `../.agents/skills/payload/reference/` (from brand root).

A local `SKILL.md` here is a **redirect stub** only. A local `reference/` tree may still exist as a legacy archive (older than workspace root) — prefer workspace-root copies. Do **not** add junctions/symlinks here pointing at the workspace skill.
