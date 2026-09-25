# Maintaining your portfolio (no AI needed)

Your site: **https://abdurrabbi23.github.io**
Your code: **https://github.com/abdurRabbi23/abdurRabbi23.github.io**
On your PC: **`D:\KUET_LIFE\portfolio`**

The whole site is plain files: HTML (content), CSS (looks), and a little JavaScript (theme toggle
and phone menu). There's no build step. What's in the folder is exactly what goes online.

---

## 0. The 30-second version

1. Edit a file (usually `index.html`).
2. Check it on your PC (section 2).
3. Publish, in PowerShell:
   ```powershell
   cd D:\KUET_LIFE\portfolio
   git add -A
   git commit -m "Describe what you changed"
   git push
   ```
4. Wait 1–2 minutes, then refresh https://abdurrabbi23.github.io (press **Ctrl+F5** to skip the cache).

---

## 1. Where everything is

| File / folder | What it is | Do you edit it? |
|---|---|---|
| `index.html` | **All the text on the site.** Each section starts with a comment banner like `===== PROJECTS =====` | Yes, often |
| `css/style.css` | Colors, fonts, layout. Colors are at the very top (section 1) | Rarely |
| `js/main.js` | Theme toggle + phone menu | Almost never |
| `assets/img/` | Photos (all JPG, under 300 KB each) | When adding images |
| `assets/cv/Md_Abdur_Rabbi_CV.pdf` | The CV behind the "Download CV" button | When your CV changes |
| `assets/fonts/` | The IBM Plex font files (+ their free license) | No |
| `404.html` | "Page not found" page | No |
| `sitemap.xml` | Tells Google about the site. Update the date after big changes | Sometimes |
| `favicon.svg`, `favicon.ico`, `robots.txt`, `.nojekyll` | Tab icons, search-engine rules, GitHub setting | No |
| `README.md` | Short description shown on your GitHub repo page | Rarely |
| `tools/shrink_image.py` | Makes photos small enough for the web | You run it |
| `PROGRESS.md`, `_notes/`, `_originals/` | Private notes and full-size originals. **Never uploaded** (listed in `.gitignore`) | Optional |

**Recommended editor:** VS Code (already installed). Open it, then **File → Open Folder → `D:\KUET_LIFE\portfolio`**.
Use **Ctrl+F** to find a section, e.g. search `===== EXPERIENCE`.

---

## 2. Preview changes on your PC before publishing

In PowerShell:
```powershell
cd D:\KUET_LIFE\portfolio
python -m http.server 8765
```
Open **http://localhost:8765** in your browser. After each edit, save the file and refresh the page.
Press **Ctrl+C** in PowerShell to stop the preview server.

To check the phone layout, press **F12** in Chrome/Edge, then click the phone/tablet icon (top-left of
the panel) and pick a phone size.

---

## 3. Common edits

### 3a. Change some text
Find it in `index.html` with Ctrl+F and change only the words **between** the tags. For example:
```html
<p class="availability">Open to full-time roles in robotics, automation and embedded systems.</p>
```
Only change the part between `<p ...>` and `</p>`.

Special characters in HTML: write `&amp;` for **&**, `&lt;` for **<**, `&gt;` for **>**.

### 3b. Add a new job or role (Experience section)
Search `===== EXPERIENCE`, then copy one `<li> ... </li>` block and paste it **at the top** of the list
(newest first):
```html
          <li>
            <h3>Job Title</h3>
            <p class="org">Company or Team Name, City</p>
            <p class="date">Jan 2027 – Present</p>
            <ul>
              <li>What you did, starting with a verb. Add a number if you have one.</li>
              <li>Second achievement.</li>
            </ul>
          </li>
```
Once you have a real job, also update the "What I'm looking for" line (ABOUT section), the green
"Open to…" line (HERO), and the "Let's talk" text (CONTACT).

### 3c. Add a new project ⭐ (copy-paste template)
1. Make the photo small (section 4). Save it as e.g. `assets/img/line-follower.jpg`.
2. Search `===== PROJECTS` in `index.html`. Paste this block **right after** the line
   `<div class="projects-grid">` to put it first (or between two other `</article>` / `<article>` blocks):

```html
          <!-- ----- Project: YOUR PROJECT NAME ----- -->
          <article class="card" data-category="embedded">
            <img class="card-img" src="assets/img/YOUR-IMAGE.jpg" width="1400" height="1050" loading="lazy"
                 alt="Describe what the photo shows, for blind visitors and Google">
            <div class="card-body">
              <h3>Your Project Name</h3>
              <p class="card-meta">2027 · Solo project</p>
              <p class="card-summary">One sentence: what it is and what it does.</p>
              <ul class="tags" aria-label="Technologies">
                <li>ESP32</li><li>C</li><li>PID control</li>
              </ul>
              <details>
                <summary>Read more</summary>
                <ul>
                  <li><strong>Problem:</strong> What problem did it solve?</li>
                  <li><strong>How it works:</strong> Hardware + software, in 2–3 sentences.</li>
                  <li><strong>Result:</strong> What worked? Numbers if you have them.</li>
                  <li><strong>My role:</strong> What YOU did (important for team projects).</li>
                </ul>
              </details>
              <div class="card-links">
                <a href="https://github.com/abdurRabbi23/YOUR-REPO" target="_blank" rel="noopener">Code on GitHub ↗</a>
              </div>
            </div>
          </article>
```
- **`data-category`** decides which filter button shows the card. Use one or more of `embedded`,
  `vision`, `mechanical`, separated by spaces (e.g. `data-category="vision embedded"`). The counts
  on the filter buttons update by themselves.
- **No photo?** Delete the whole `<img ... >` line (both lines of it). The card still looks fine.
- **No GitHub repo?** Delete the whole `<div class="card-links"> ... </div>` part.
- `width`/`height` should match your image. `tools/shrink_image.py` prints the size.
- Keep it honest: only claim what you actually did and can explain in an interview.

### 3d. Replace the CV
1. Export your new CV from Word as PDF.
2. Copy it into `assets/cv/` and name it **exactly** `Md_Abdur_Rabbi_CV.pdf` (overwrite the old one).
   Same name = the button keeps working with no HTML change.
3. Publish (section 0).

### 3e. Replace your profile photo
Use a square-ish photo with your face in the middle:
```powershell
python tools/shrink_image.py "C:\path\to\new-photo.jpg" assets/img/profile.jpg 480
```
If it isn't square, crop it square first (Windows Photos → Edit → Crop → Square).

### 3f. Add a skill
Search `===== SKILLS`, find the right group, and add `<li>New skill</li>` inside its `<ul class="tags">`.

### 3g. The interactive features (what they are and how to change them)
Everything below lives in `js/main.js` (numbered sections) and at the end of `css/style.css`
(section 16). **New projects, jobs and skills get the animations automatically**. You don't
need to do anything.

| Feature | How to change it |
|---|---|
| **Rotating keywords** in the headline | In `index.html`, search `ROTATING KEYWORDS`. Edit `data-words="A\|B\|C"`. Keep the first phrase identical to the text inside the `<span>` |
| **Project filter buttons** | In `index.html`, search `Filter buttons`. To add a category: copy a `<button ... data-filter="xyz">`, change the label, and use `xyz` in some cards' `data-category` |
| **Thesis numbers count up** | The `<b data-count="80" data-prefix="&gt;" data-suffix="%">&gt;80%</b>` tags. Change `data-count` **and** the visible text together |
| **Scroll fade-in, card hover, progress bar, back-to-top, active menu link, photo pop-up, copy-email** | Automatic, nothing to edit |

Visitors whose phone/computer is set to "reduce motion" get no animations, and if JavaScript
fails, all content still shows. **To switch one feature off**, open `js/main.js`, find its
numbered section, and put `//` at the start of each of its lines (or ask a developer friend).

### 3h. Change colors
Open `css/style.css`. Section 1 at the top has the light-mode colors, then two identical dark-mode
blocks (change both). Colors are hex codes like `#0e7c86`. Pick new ones at https://htmlcolorcodes.com.

---

## 4. Images: always shrink before adding
Phone photos are 2–5 MB, which makes the site slow on mobile data. Run:
```powershell
cd D:\KUET_LIFE\portfolio
python tools/shrink_image.py "C:\path\to\big-photo.jpg" assets/img/my-project.jpg
```
It prints the final size (aim for **under 300 KB**) and the width × height to put in the HTML.
File names: lowercase, dashes, no spaces (`my-project.jpg`, not `My Project (1).JPG`).
If `python` complains about PIL, run `pip install pillow` once.

---

## 5. Publishing, explained
```powershell
cd D:\KUET_LIFE\portfolio      # go to the site folder
git status                     # optional: see which files changed (red = not yet added)
git add -A                     # "stage" all changes: include them in the next snapshot
git commit -m "Add line follower project"   # save a snapshot with a short description
git push                       # upload the snapshot(s) to GitHub; the site updates in 1–2 min
```
- Watch the deploy at https://github.com/abdurRabbi23/abdurRabbi23.github.io/actions. A green ✓ on
  "pages build and deployment" means it's live.
- Still seeing the old version? Press **Ctrl+F5**, or wait a few minutes (browser cache).

---

## 6. Oops: undoing mistakes

| Situation | Command |
|---|---|
| Edited a file, haven't committed, want the old version back | `git restore index.html` |
| Want to throw away **all** uncommitted edits | `git restore .` |
| Committed but **not pushed**, want to undo the commit (keeps your edits) | `git reset --soft HEAD~1` |
| Already pushed something wrong | Fix the file and push again (simplest), or `git revert HEAD` then `git push` |
| See the history of changes | `git log --oneline` |

The site is never really "broken" forever. Every pushed version is saved on GitHub.

---

## 7. Troubleshooting

- **Page looks unstyled / images missing:** a file name or path has a typo. Names are
  case-sensitive online: `Photo.JPG` ≠ `photo.jpg`.
- **Layout suddenly broken:** you probably deleted a closing tag like `</div>` or `</article>`. Run
  `git diff` to see exactly what changed, or undo (section 6).
- **`git push` asks to sign in:** choose "Sign in with your browser" and approve on github.com.
- **`git push` rejected ("fetch first"):** you edited something on github.com directly. Run
  `git pull`, then `git push`.
- **Validate your HTML** (finds unclosed tags): paste `index.html` into https://validator.w3.org/#validate_by_input

---

## 8. Occasional housekeeping
- After big changes, update `<lastmod>` in `sitemap.xml` to today's date (YYYY-MM-DD).
- Once a year: update the CV PDF, and re-check that links (GitHub repos, LinkedIn) still work.
- LinkedIn preview looks outdated after changes? Paste your URL into
  https://www.linkedin.com/post-inspector/ to refresh it.

---

## 9. Later: get listed on Google (Google Search Console, one-time, ~10 min)
1. Go to https://search.google.com/search-console and sign in with your Google account.
2. **Add property** → choose **URL prefix** → type `https://abdurrabbi23.github.io/` → **Continue**.
3. Open **Other verification methods → HTML tag** and click **Copy**. You get a line like
   `<meta name="google-site-verification" content="AbC123...xyz" />`
4. In `index.html`, paste that line in the `<head>`, right below the line
   `<meta name="author" content="Md Abdur Rabbi">`. Save.
5. Publish (section 0), wait 2 minutes, then click **Verify** in Search Console.
   (Keep the tag in the file forever. Removing it un-verifies the site.)
6. In Search Console's left menu: **Sitemaps** → enter `sitemap.xml` → **Submit**.
7. Optional: **URL Inspection** → paste `https://abdurrabbi23.github.io/` → **Request indexing**.

Google usually lists a new site within a few days to two weeks. Linking the site from LinkedIn and
GitHub helps it get found faster.
