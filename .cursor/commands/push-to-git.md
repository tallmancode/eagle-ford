# Push to Git

## Overview

For the **eagle-ford** repository (Eagle Ford dealership website), create a **GitHub issue** (labeled and assigned), sync **`develop`**, create a **branch** tied to that issue, run **auto-fix and quality checks**, **commit** with a concise message, **push**, and open a **pull request** to **`develop`** with **matching labels**. When finished, switch back to **`develop`**.

| Directory       | Stack                                              | Quality gate                                              |
| --------------- | -------------------------------------------------- | --------------------------------------------------------- |
| `.` (repo root) | Next.js 16 + Payload CMS 3 + React 19 + TypeScript | `lint:fix` + `format:write` + `lint` + `tsc` + `test:int` |

## Shell

All commands target **Windows PowerShell 5.x**. Run each command as a separate shell call — do not chain with `&&`. Use backtick (`` ` ``) for line continuation and `@" ... "@` for multi-line strings.

## Preconditions

1. **[GitHub CLI](https://cli.github.com/)** (`gh`) is installed and authenticated (`gh auth login`) with permission to create issues and pull requests and to **assign yourself**.
2. The workspace root is the git repository with `origin` pointing to `git@github.com:tallmancode/eagle-ford.git`. Verify with `git rev-parse --git-dir`. If not a git repo or no usable remote, **stop** and explain.
3. **Issue and PR labels** must exist on the repository. Run the setup commands below **once** before first use — the repo ships with GitHub default labels only.

   List labels with:

   ```bash
   gh label list -R tallmancode/eagle-ford
   ```

   Create missing labels as needed:

   ```bash
   gh label create feature  --description "New user-facing behavior"            -R tallmancode/eagle-ford
   gh label create bugfix   --description "Fixes incorrect behavior"            -R tallmancode/eagle-ford
   gh label create chore    --description "Maintenance, tooling, deps"          -R tallmancode/eagle-ford
   gh label create docs     --description "Documentation only"                  -R tallmancode/eagle-ford
   gh label create refactor --description "Internal change, no behavior change"  -R tallmancode/eagle-ford
   gh label create perf     --description "Performance improvement"             -R tallmancode/eagle-ford
   gh label create security --description "Security hardening"                  -R tallmancode/eagle-ford
   gh label create test     --description "Tests only"                          -R tallmancode/eagle-ford
   gh label create ci       --description "CI or automation config"             -R tallmancode/eagle-ford
   ```

## Label taxonomy

Pick **one primary** type label for the issue and matching PR:

| Label        | Use when                                         |
| ------------ | ------------------------------------------------ |
| **feature**  | New behavior or capability                       |
| **bugfix**   | Fixes incorrect behavior                         |
| **chore**    | Maintenance, dependencies, tooling               |
| **docs**     | Documentation only                               |
| **refactor** | Internal change without intended behavior change |
| **perf**     | Performance improvement                          |
| **security** | Security hardening                               |
| **test**     | Tests only                                       |
| **ci**       | CI or automation config                          |

Apply the **same label(s)** on both the **issue** and the **PR**.

## How to use this command

- Run when you have code changes ready to ship for the current task.
- One issue, one branch, one PR per logical unit of work.
- Use **`--assignee @me`** on issues so the issue is assigned to the authenticated GitHub user.

---

## Workflow

Run all commands from the **repository root**.

### 1. Detect changes

```powershell
git rev-parse --git-dir
git status
git log "@{u}..HEAD" --oneline
```

If there is nothing to publish, **stop**.

### 2. Set base branch

All feature branches and PRs target **`develop`** (not GitHub's default branch). Verify it exists on the remote:

```powershell
git fetch origin
git show-ref --verify --quiet refs/remotes/origin/develop
```

If `git show-ref` exits non-zero, **stop** — `origin/develop` does not exist.

### 3. Create GitHub issue (before the new branch)

Choose a clear title and body describing the change, then:

```bash
gh issue create \
  --title "Short imperative description" \
  --body "Detailed description of the change and motivation." \
  --label "feature" \
  --assignee "@me"
```

Capture the issue number from the output (e.g. `#42`). Repeat `--label` for additional labels if needed.

### 4. Sync base branch, then create branch

```bash
git checkout develop
git pull origin develop
```

If checkout is blocked by local changes, stash first:

```bash
git stash push -u
git checkout develop
git pull origin develop
# create branch, then:
git stash pop   # resolve conflicts if any
```

Create a branch linked to the issue number, URL-safe and short:

```bash
git checkout -b issue-42-short-description
```

### 5. Auto-fix pass (run before quality gate)

Run fixes against the **entire project** in order:

```bash
pnpm lint:fix       # ESLint safe fixes including TypeScript-ESLint fixable rules
pnpm format:write   # Prettier formats all files in the project
```

If `lint:fix` introduces new errors or cannot fix everything, note the remaining issues — they must be resolved before proceeding.

**Payload note:** if collection or schema files changed, regenerate types and stage the result:

```bash
pnpm generate:types
```

### 6. Quality gate (must pass before commit / PR)

Run each check from the repo root in order — **do not open a PR if any step fails; fix or stop**:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test:int
```

What each step covers:

- `pnpm lint` — ESLint (`next/core-web-vitals`, `next/typescript`) via `eslint.config.mjs`
- `pnpm exec tsc --noEmit` — TypeScript strict check via `tsconfig.json`. No auto-fix available; remaining type errors must be resolved manually.
- `pnpm test:int` — Vitest integration tests

**Not part of the default gate** (run manually when relevant):

- `pnpm test:e2e` — Playwright; starts the dev server; too slow for routine push workflow
- `pnpm build` — valid but heavy; run when touching Next.js build or config

### 7. Commit

Stage all changes (including any auto-fix modifications). **Never stage `.env` or other secret files** (`.env.example` is fine). Commit with a concise imperative subject line (50–72 characters):

```bash
git add -A
git commit -m "Add Blogs collection and homepage vehicle sections"
```

### 8. Push

```bash
git push -u origin issue-42-short-description
```

### 9. Open pull request

```powershell
$body = @"
Closes #42

Description of what changed and why.
"@

gh pr create `
  --base develop `
  --head issue-42-short-description `
  --title "Short imperative description" `
  --body $body `
  --label "feature"
```

`Closes #42` (or `Fixes #42`) in the body links the PR to the issue and closes it automatically on merge.

### 10. Return to develop

After the PR is opened, switch back to **`develop`** so the workspace is ready for the next task:

```bash
git checkout develop
```

---

## Checklist

- [ ] `gh` authenticated; `origin` points at `tallmancode/eagle-ford`
- [ ] Custom labels exist on the repo (or created via `gh label create`)
- [ ] Issue created with `--assignee @me` and primary label
- [ ] `develop` fetched, checked out, and pulled; branch name includes issue number
- [ ] `pnpm lint:fix` and `pnpm format:write` run against entire project
- [ ] `pnpm generate:types` run and `src/payload-types.ts` committed if schema changed
- [ ] `pnpm lint`, `tsc --noEmit`, and `test:int` all pass
- [ ] Commit message is concise and imperative; no secrets staged
- [ ] Branch pushed; PR opened to `develop` with matching labels and `Closes #<N>`
- [ ] Checked out `develop` after PR creation
