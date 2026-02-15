# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### GitHub clone troubleshooting (for beginners)

If `git clone` fails with `Invalid username or token. Password authentication is not supported for Git operations.`, try this checklist in order:

1. Open `https://github.com/<owner>/<repo>` in your browser and confirm you can access the repo.
2. **Public repository:** clone with the exact URL `https://github.com/<owner>/<repo>.git`.
3. **Private repository:** use a Personal Access Token (PAT) when Git asks for a password, or use GitHub Desktop/Codespaces.

If you accidentally ran `git init` in your home folder (`~`) and `git status` lists your personal folders, move that accidental `.git` folder to a backup location first:

```sh
cd ~
mv .git .git_backup_$(date +%Y%m%d_%H%M%S)
```

Then clone again into a clean folder:

```sh
cd ~/Desktop
git clone https://github.com/<owner>/<repo>.git
cd <repo>
```

### Slow, first-time setup checklist

If you are returning to terminal after a long time, run one line at a time:

```sh
# 1) Go to a safe location for projects
cd ~/Desktop

# 2) Clone (replace with your own URL)
git clone https://github.com/<owner>/<repo>.git

# 3) Enter the project
cd <repo>

# 4) Install dependencies
npm i

# 5) Start local preview
npm run dev
```


### Use GitHub Codespaces (slow path, no local setup)

If you are already in Codespaces and see a prompt like `@<username> ➜ /workspaces/<repo> (main) $`, continue one command at a time:

```sh
# 1) Confirm you are in the project folder
pwd

# 2) Install dependencies (first run may take a few minutes)
npm i

# 3) Start the dev server
npm run dev
```

After `npm run dev`, Codespaces should show a popup to open the forwarded port in browser.

- If popup does not appear: open the **PORTS** tab in VS Code and click the local URL for port `8080`.
- To stop the app later: press `Ctrl + C` in terminal.

What your current output means:
- `VITE ... ready` means your app started successfully.
- `npm warn deprecated ...` are common dependency warnings (not a blocker for local preview).
- `8 vulnerabilities` is a dependency audit result; do **not** run `npm audit fix` yet unless you want to test upgrades later.

Next 3 slow steps after preview works:

```sh
# 1) Stop server (if still running)
Ctrl + C

# 2) Confirm files changed or not
git status

# 3) If you changed anything, save it with a commit
git add .
git commit -m "chore: update my lucky wheel"
```

If `git status` only shows `modified: package-lock.json` after `npm i`, choose one:

```sh
# Option A: keep it (recommended if you will commit dependency updates)
git add package-lock.json
git commit -m "chore: update lockfile"

# Option B: discard it (if you did not intend to change dependencies)
git restore package-lock.json
```

Note: `git restore ...` is usually silent on success. If the command returns to a new prompt with no error message, that is normal.
Run `git status` right after to confirm the file is clean.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

### If `git status` is clean, your next step

If you see `nothing to commit, working tree clean`, great — you are ready to deploy.

For a beginner-friendly deploy via GitHub Pages (from Codespaces):

```sh
# 1) Build production files
npm run build

# 2) Verify build output exists
ls dist
```

Then in GitHub:
1. Open **Settings** → **Pages**.
2. In **Build and deployment**, choose **GitHub Actions**.
3. Do **not** add the suggested `Static HTML`/`Jekyll` starter workflows for this repo (they publish source files and can cause blank pages for Vite apps).
4. Use the existing workflow at `.github/workflows/deploy-pages.yml` and wait for it to publish `dist`.

Tip: your current preview URL (`...app.github.dev`) is temporary. GitHub Pages gives a stable URL.


### White screen on custom domain (important fix)

If the site is "live" but completely blank, check **View Source** in browser:

- If you see `<script type="module" src="/src/main.tsx"></script>` then GitHub is serving your raw repository files (Branch mode), not the built Vite files.
- In that case, go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- Use the workflow in `.github/workflows/deploy-pages.yml`, then push once to `main` (do not use the starter `Static HTML`/`Jekyll` templates for this Vite repo).

After Actions deploy completes, View Source should reference built assets like `./assets/index-xxxx.js` and the page should render normally.

If DevTools Console shows `Failed to load module script ... MIME type "application/octet-stream"` and source contains `/src/main.tsx`, the site is still publishing repository source files instead of built artifacts.


### Actions error: `npm ci` lockfile not in sync

If build fails with `npm ci` saying `package.json and package-lock.json are not in sync`, use the repository workflow that installs dependencies with `npm install` for deploys, then later refresh lockfile in a development environment.

In this repo, `deploy-pages.yml` tries `npm ci` first and automatically falls back to `npm install --no-audit --no-fund` when lock drift is detected, so Pages deploy is not blocked.

### Actions build fails with webpack-cli prompt

If Actions log shows lines like:

- `Run npm install`
- `webpack@... will be installed`
- `Do you want to install 'webpack-cli' (yes/no):`

then you are running GitHub's starter `Static HTML` workflow (webpack), **not** this repo's Vite workflow.

Fix:

1. In GitHub, open **Actions** and run workflow named **Deploy to GitHub Pages**.
2. In repo file tree, check `.github/workflows/` and delete starter files such as `static.yml`, `jekyll-gh-pages.yml`, or any workflow that runs webpack.
3. Keep only `.github/workflows/deploy-pages.yml` for Pages deploy in this repo.
4. Re-run **Deploy to GitHub Pages** and wait for success.

### 404 "File not found" on custom domain

If Pages shows:

- `404`
- `File not found`
- `For root URLs ... you must provide an index.html file`

then deployment is usually not serving your built `dist` artifact yet. Check these in order:

1. **Settings → Pages** must be **Source: GitHub Actions** (not Branch).
2. **Actions** must show a successful run for `Deploy to GitHub Pages`.
3. The workflow build job must upload `./dist` (this repo is already configured that way).
4. Keep `public/CNAME` in repo so every deployment includes your custom domain (`lucky.eugeneyip.net`).

After a successful deploy, opening `https://lucky.eugeneyip.net/` should load `index.html` from the deployed artifact instead of showing 404.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Option A: Publish from Lovable
Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

### Option B: GitHub Pages (recommended for your own stable URL)
This repo now includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.
It also sets Vite `base` to relative assets (`./`) so Pages/custom-domain deployments do not render a blank page due to absolute asset paths.

1. Push your latest commit to `main`.
2. In GitHub repo, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Source: GitHub Actions**.
4. If GitHub shows template suggestions (`Static HTML` / `Jekyll`), skip them for this repository.
5. Wait for workflow **Deploy to GitHub Pages** to complete.
6. Your site URL will be shown in the workflow summary and Pages settings.

Note: Codespaces preview URLs (`*.app.github.dev`) are temporary session URLs. GitHub Pages is the persistent public URL.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
