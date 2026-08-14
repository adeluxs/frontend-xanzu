# Clean GitHub push guide

## What should remain untracked

- `node_modules/`
- `.next/`, `out/`, `build/` and `dist/`
- coverage and cache folders
- `.env` and environment-specific secret files
- local logs and editor files

Do commit `package.json`, `package-lock.json`, source code, public assets and
`.env.example` when one is provided.

## One-time cleanup for an existing repository

Adding `.gitignore` does not automatically remove files Git already tracks.
Open Terminal, PowerShell or Git Bash in the project root and run:

```bash
git rm -r --cached .
git add .
git status
```

Confirm that generated folders are no longer staged, then run:

```bash
git commit -m "Stop tracking generated files"
git push
```

`git rm --cached` removes files only from Git's index. Your local
`node_modules` and `.next` folders remain on the computer and can be recreated
at any time with `npm ci` and `npm run build`.

## Verify before every push

```bash
git status
git ls-files | grep -E '(^|/)(node_modules|\.next|out|build|dist)/'
```

On Windows Command Prompt, use this instead of the final verification command:

```bat
git ls-files | findstr /R /C:"node_modules" /C:".next" /C:"dist" /C:"build"
```

The verification command should print nothing.
