# Release to Main

## Overview

For the **eagle-ford** repository (Eagle Ford dealership website), open a **pull request** from **`staging`** to **`main`** for a production release. Collect **`Closes #N`** references from merged PRs in the release range and include them in the PR body so linked issues close automatically when the release PR merges to **`main`**. If an open **`staging` → `main`** PR already exists, **stop** and report its URL. When finished, switch back to **`develop`**.

| Branch flow                  | Purpose                                                 |
| ---------------------------- | ------------------------------------------------------- |
| feature branches → `develop` | Day-to-day work ([`push-to-git`](push-to-git.md))       |
| `develop` → `staging`        | Staging deploy (`.github/workflows/deploy-staging.yml`) |
| `staging` → `main`           | Production release (this command)                       |

**No quality gate** — staging is already built and deployed. This command only publishes the release PR.

## Shell

All commands target **Windows PowerShell 5.x**. Run each command as a separate shell call — do not chain with `&&`. Use backtick (`` ` ``) for line continuation and `@" ... "@` for multi-line strings.

## Preconditions

1. **[GitHub CLI](https://cli.github.com/)** (`gh`) is installed and authenticated (`gh auth login`) with permission to create pull requests.
2. The workspace root is the git repository with `origin` pointing to `git@github.com:tallmancode/eagle-ford.git`. Verify with `git rev-parse --git-dir`. If not a git repo or no usable remote, **stop** and explain.
3. Remote branches **`origin/staging`** and **`origin/main`** must exist.

## How to use this command

- Run when **`staging`** has been tested and is ready to ship to production.
- One release PR per production deploy (`staging` → `main`).
- Issues linked via `Closes #N` in feature PRs (merged to `develop`) close when **this** release PR merges to `main`.

---

## Workflow

Run all commands from the **repository root**. Use `git fetch` and remote refs for range detection — do not require a clean working tree except for the final checkout to `develop`.

### 1. Preconditions and fetch

```powershell
git rev-parse --git-dir
git fetch origin
git show-ref --verify --quiet refs/remotes/origin/staging
git show-ref --verify --quiet refs/remotes/origin/main
```

Stop if any check fails.

### 2. Verify there is something to release

```powershell
git rev-list --count origin/main..origin/staging
```

If the count is `0`, **stop** — `staging` is not ahead of `main`.

### 3. Block duplicate release PR

```powershell
gh pr list --state open --base main --head staging --json number,url -R tallmancode/eagle-ford
```

If the result is non-empty, **stop** and print the existing PR number and URL. Do not create a second release PR.

### 4. Collect merged PR numbers in the release range

Parse merge commits between `origin/main` and `origin/staging`:

```powershell
$prNumbers = git log origin/main..origin/staging --merges --format=%s |
  ForEach-Object {
    if ($_ -match 'Merge pull request #(\d+)') { [int]$Matches[1] }
  } |
  Sort-Object -Unique
```

This captures feature PRs (e.g. #70, #67) and batch **Develop** PRs (e.g. #71, #68). Batch PRs typically have empty bodies; feature PR bodies contain `Closes #N`.

### 5. Extract linked issue numbers from PR bodies

For each PR number, fetch the body and match GitHub closing keywords (`closes`, `fixes`, `resolves` + `#N`). Deduplicate and sort:

```powershell
$issueNumbers = @()
foreach ($pr in $prNumbers) {
  $body = gh pr view $pr -R tallmancode/eagle-ford --json body -q .body
  if (-not $body) { continue }
  foreach ($m in [regex]::Matches($body, '(?i)(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s+#(\d+)')) {
    $issueNumbers += [int]$m.Groups[1].Value
  }
}
$issueNumbers = $issueNumbers | Sort-Object -Unique
```

Filter to **open issues only** so the PR body stays clean:

```powershell
$openIssues = gh issue list --state open -R tallmancode/eagle-ford --json number -q '.[].number'
$issueNumbers = $issueNumbers | Where-Object { $openIssues -contains $_ }
```

If no `Closes #N` references are found, still proceed — warn that no issues will auto-close on merge.

### 6. Build release PR body

Build a `Closes` block and a summary of included PRs (number + title):

```powershell
$closesBlock = ($issueNumbers | ForEach-Object { "Closes #$_" }) -join "`n"

$summaryLines = @()
foreach ($pr in $prNumbers) {
  $title = gh pr view $pr -R tallmancode/eagle-ford --json title -q .title
  if ($title -and $title -ne 'Develop') {
    $summaryLines += "- #$pr $title"
  }
}
$summaryBlock = $summaryLines -join "`n"

$body = @"
$closesBlock

## Release summary

$summaryBlock

Issues listed above will close automatically when this PR merges to main.
"@
```

PR title: `Release staging to main` (append the date if multiple releases are expected the same day).

### 7. Open the pull request

```powershell
gh pr create `
  --repo tallmancode/eagle-ford `
  --base main `
  --head staging `
  --title "Release staging to main" `
  --body $body
```

No label is required for release PRs.

### 8. Return to develop

After the PR is opened, switch back to **`develop`** so the workspace is ready for the next task:

```bash
git checkout develop
```

---

## Edge cases

| Case                                | Behavior                                                    |
| ----------------------------------- | ----------------------------------------------------------- |
| `staging` not ahead of `main`       | Stop — nothing to release                                   |
| Open `staging` → `main` PR exists   | Stop — print existing PR URL                                |
| No `Closes #N` found in any PR body | Open release PR anyway; warn that no issues will auto-close |
| Issue already closed                | Excluded by open-issue filter in step 5                     |
| Dirty working tree                  | Use remote refs only until step 8; checkout `develop` last  |

---

## Checklist

- [ ] `gh` authenticated; `origin` points at `tallmancode/eagle-ford`
- [ ] `origin/staging` and `origin/main` exist; `staging` is ahead of `main`
- [ ] No open `staging` → `main` PR already exists
- [ ] Merged PR numbers collected from `origin/main..origin/staging`
- [ ] Linked open issues extracted and included as `Closes #<N>` lines
- [ ] Release PR opened (`staging` → `main`) with summary of included PRs
- [ ] Checked out `develop` after PR creation
