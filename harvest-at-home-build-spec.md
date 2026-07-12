# Harvest at Home — Landing Page Build Spec

> **For:** Claude Code · **Output:** production-quality static landing page (HTML/CSS/JS or the framework you're told to use)
> **Working name:** "Harvest at Home" — brand name is TBD and will change. Build the wordmark as a single token/component so renaming is one edit.
> **Design north star:** https://getcasa.com — warm premium-service minimalism. Photographic, calm, pill-shaped UI, generous whitespace, one serif voice.
> **Hero:** The designer's hero comp is final and authoritative — implement it exactly as specified in §1.7 and §4.1. Background asset: `assets/hero-bg.jpg` (provided by the designer; a copy ships with this spec as `hero-bg.jpg`). It will later be replaced by a looping video of the same scene — build the container video-ready from day one.

---

## 1. Design language (Casa-derived)

### 1.1 Typography
- **Display serif:** Fraunces (Google Fonts, variable). Weights 300–500, use `opsz` axis high (~100) for large headlines. Italic for emphasized words inside headlines (`<em>`).
- **Body/UI sans:** DM Sans. Weights 300 (body), 400–500 (UI), 600 (labels/badges).
- Headline pattern: sentence case, one italic emphasized phrase — e.g. "Your backyard, *engineered* to feed you."
- Eyebrow labels: 0.7rem, uppercase, letter-spacing 0.2em, sage color.
- Body: 0.9–1rem, weight 300, line-height ~1.7, max-width ~54ch.

### 1.2 Color tokens
```css
--sage:        #5a6b52;  /* accents, labels */
--sage-light:  #8a9d80;  /* borders on dark, secondary */
--sage-dark:   #2e3a28;  /* primary buttons, dark sections */
--ink:         #22281e;  /* body text */
--cream:       #f8f4ec;  /* alternating section bg */
--warm-white:  #faf9f6;  /* base bg */
--mid:         #6b6860;  /* secondary text */
--line:        #e3ded0;  /* hairline borders */
--gold:        #b8942a;  /* micro-accents only: badges, streaks, numbers */
--gold-light:  #d4b060;  /* gold on dark backgrounds */
--mint:        #7ef0a8;  /* hero headline emphasis + in-app UI accent (sample from comp; eyedrop the exact value from hero-bg comp before shipping) */
```
Rules: light warm backgrounds dominate; `--sage-dark` is reserved for the final CTA section and primary buttons; gold is never a surface color, only small accents. On the hero video, logo/text are always single-color white. **Mint is scoped to the hero headline emphasis and phone-screen app UI only** — it does not replace gold/sage elsewhere on the page unless the designer extends it.

### 1.3 Shape & surface
- Buttons and inputs: fully rounded pills (`border-radius: 999px`).
- Cards and image containers: 16–20px radius, 1px `--line` border on light surfaces.
- Glass surfaces on imagery/dark: `rgba(250,249,246,0.72–0.94)` + `backdrop-filter: blur(10–14px)` + subtle 1px white-ish border.
- Shadows: large, soft, low-opacity (`0 20px 50px rgba(0,0,0,0.3)` on hero pill; `0 24px 60px rgba(46,58,40,0.13)` on featured card). No hard shadows.

### 1.4 Motion
- Hero: looping background video (autoplay, muted, playsinline, poster). Until the final video asset exists use a warm golden-hour garden photo with a slow Ken Burns (scale 1→1.09 over ~26s, alternate).
- Scroll: gentle fade-up on section entry (IntersectionObserver, translateY 20px → 0, ~0.6s ease-out, stagger children ~80ms).
- Marquee: seamless infinite horizontal loop (duplicate track, translateX −50%).
- Respect `prefers-reduced-motion: reduce` — disable all of the above.

### 1.5 Imagery
Photography is FPO for now **except the hero** — `assets/hero-bg.jpg` is approved and defines the lighting family for everything else (golden hour, natural, warm green-honey tones, corten/steel bed material). Remaining shot list:
1. Hero: ✅ delivered (`hero-bg.jpg`); video loop of the same scene to follow
2. Hands harvesting tomatoes/greens, close-up
3. Harvest basket / vegetable flat-lay
4. Phone held in hand in the garden
5. Drip line + sensor macro
6. Muted/cool-toned store shelf (the "before" side of the comparison)
7. Site walk, blueprint/design, build day, planting hands, harvest basket (one per process step)
8. 3 small testimonial avatars

### 1.6 Logo (temporary)
- Glyph: raised bed + sprout mark (SVG provided separately: `bed-sprout-mark-sage.svg` / `bed-sprout-mark-white.svg`). White variant on hero/dark, sage on light.
- Wordmark: in the approved hero comp the wordmark renders simply as lowercase **"harvest"** in white sans next to the white glyph. Keep glyph and wordmark independent; wordmark text must be swappable in one place (name will change).

### 1.7 Hero — implementation spec (from the designer's comp, authoritative)
**Layout:** full-bleed background image/video, all content centered on top, ~100vh.
- **Background:** `assets/hero-bg.jpg` — golden-hour backyard: modern house with lit interior, corten raised beds, misting sprinklers, woman on the right holding the app. Later replaced by a looping video of the same scene (`<video autoplay muted loop playsinline poster="assets/hero-bg.jpg">`); until then apply a very slow Ken Burns to the still (see §1.4). Add a subtle dark scrim only as needed for text legibility (comp shows mild darkening behind the headline band; do not flatten the golden tones).
- **Nav (over hero):** left — white glyph + lowercase "harvest" wordmark; center — links in uppercase, letter-spaced: `HOW IT WORKS · SYSTEMS · THE APP · YIELD`; right — **white pill button** `Request a design` (dark text). All nav elements single-color white over the image.
- **Headline:** centered, two lines: `Your backyard,` / `engineered to feed you.` — set in a **rounded geometric sans** (comp appears to be Poppins-like; use Poppins Medium 500 from Google Fonts, fallback DM Sans 500 — match the comp, not §1.1's Fraunces rule, which governs the rest of the page). The word **"engineered" is `--mint`**; all other headline text white.
- **Sub:** original copy verbatim (§4.1), centered, white, max ~52ch, 3 lines as in comp.
- **ZIP pill (primary hero CTA):** centered below the sub — dark translucent glass pill (`rgba(20,26,17,~0.45)` + blur, 1px light border), left sparkle icon ✦, placeholder `Enter your ZIP to get started`, and a **white pill button `Check`** docked inside the right edge. Behavior per §3.1; the in-area/waitlist result renders inline directly below the pill.
- **Service note:** `Currently serving the greater Austin metro area` — small, white/70, centered under the pill.
- **Not in the hero (deliberate designer decisions):** no stat trio, no `Begin Your Garden` / `See how it works` buttons, no eyebrow. The 400+/1–2/0 stats already live in the Yield section; do not re-add them to the hero.

---

## 2. Page structure (final UX order — do not reorder)

The order is deliberate: **value → proof → price**. Pricing (Tiers) must come after App, Yield, and Testimonials.

1. **Nav** (over hero)
2. **Hero** — outcome-led, video background (design direction provided separately)
3. **Marquee strip**
4. **The Difference** — light-based comparison
5. **How It Works** — 6 steps with photo bands
6. **The App**
7. **Yield**
8. **Testimonials**
9. **Mid-page CTA band**
10. **Tiers** (pricing)
11. **CTA / Contact form** (with ZIP logic)
12. **Footer**

Layout rhythm: alternate `--warm-white` and `--cream` section backgrounds; container max-width ~1180px; section padding ~6.5rem desktop / 4rem mobile.

---

## 3. Behaviors

### 3.1 ZIP lookup (hero pill + CTA form — shared logic)
- Two entry points: the **hero ZIP pill** (§1.7) and the **contact form ZIP field** (§4.10). Same validation and states in both; hero result renders inline under the pill, form result under the submit button.
- 5-digit validation. ZIPs matching `^787\d{2}$` (Austin metro) → **in-area state**; all other valid ZIPs → **waitlist state**.
- In-area result: `**You're in our service area.** We'll reach out within 5 business days with your custom layout design.` (green-tinted glass panel)
- Waitlist result: `**Not in your area yet.** You're on the waitlist — we've logged your zip code, and it helps decide where we expand next.` (gold-tinted glass panel)
- Invalid: `Enter a 5-digit zip code to request your site visit.`
- Production: log out-of-area ZIPs (endpoint/sheet TBD — stub the call).

### 3.2 Conversion moments
- Nav CTA (`Request a design` white pill) → `#contact`
- Hero ZIP pill → primary hero conversion (inline states; in-area result may also link to `#contact`)
- Mid-page CTA band after Testimonials (`Begin Your Garden`) → `#contact`
- Every tier card button → `#contact`

### 3.3 Survey note (open decision)
The form is designed native-looking. Implementation may later point the submit to Typeform/Tally instead of a backend — keep the submit handler isolated so swapping is trivial.

---

## 4. Final copy — VERBATIM (do not rewrite, retitle, or "improve")

### 4.1 Nav + Hero (matches approved comp — see §1.7 for layout)
- Nav links (uppercase in UI): `HOW IT WORKS` · `SYSTEMS` · `THE APP` · `YIELD` — Nav CTA pill: `Request a design`
- Wordmark next to glyph: `harvest`
- H1: `Your backyard, engineered to feed you.` — "engineered" in `--mint`, rest white (no italics in hero; hero headline is sans, see §1.7)
- Sub: `White-glove design, installation, and weekly maintenance. Sensor-driven automation. A harvest app that makes growing feel like a ritual, not a chore.`
- ZIP pill placeholder: `Enter your ZIP to get started` — button: `Check`
- Service note: `Currently serving the greater Austin metro area`
- Not present in hero (by design): eyebrow, `Begin Your Garden` / `See how it works` buttons, stat trio. `Begin Your Garden` still appears in the mid-page CTA band (§4.8); the stats live in Yield (§4.6).

### 4.2 Marquee items (loop)
`Chemical-free inputs · Sensor-driven irrigation · Weekly white-glove maintenance · Same-day harvest freshness · Year-round production · 400+ lbs per bed annually · Gamified harvest tracking · Cedar, steel, or composite beds`

### 4.3 The Difference
- Label: `Why Harvest at Home`
- H2: `Not gardening. Food infrastructure.`
- Body: `"Organic" produce still uses approved pesticides, travels days from field to table, and was never grown under conditions you control. We build an alternative.`

**Comparison — Store Organic** (badge: `Unknown inputs`; muted/cool card):
- ✗ `Approved pesticides still used`
- ✗ `Multi-step supply chain handling`
- ✗ `Days-to-weeks old at purchase`
- ✗ `Label-based transparency only`
- ✗ `Nutrient density lost in transit`

**Comparison — Harvest at Home System** (badge: `Full control`; warm golden card):
- ✓ `Zero synthetic inputs, ever`
- ✓ `From bed to kitchen, same day`
- ✓ `Harvested at peak ripeness`
- ✓ `Every variable you can see and track`
- ✓ `Engineered for maximum nutrient density`

**Right column** — H3: `Every variable, defined and measured.` (italic on "defined and measured")
Body: `We rebuild your soil from scratch, engineer precision drip zones, and install sensors that monitor moisture, temperature, and nutrient levels in real time.`
- `01 — Rebuilt soil, contamination-free` / `Compost-dominant, biologically active blend with no legacy chemicals. Your foundation is clean before the first seed.`
- `02 — Precision drip irrigation` / `Pressure-regulated, zoned delivery. No overwatering. No dry patches. Timed to your micro-climate.`
- `03 — Sensor-closed-loop automation` / `Moisture and temperature sensors feed a smart controller. The system adjusts before you even notice a change.`

### 4.4 How It Works
- Label: `Process` — H2: `From consultation to first harvest.`
- Body: `Six steps. Typically four to six weeks from initial visit to your first plate.`
1. `Site Analysis` — `We assess sun exposure, water access, soil conditions, and available footprint. Full layout recommendation included.`
2. `System Design` — `Custom bed layout, irrigation zones, crop plan, and automation spec. Delivered as a visual blueprint before anything is built.`
3. `Build & Install` — `Beds constructed, soil laid, drip network installed, smart controller connected. Two-day installation, zero mess left behind.`
4. `Initial Planting` — `Seasonal alignment, succession planting schedule set, first crops in the ground. Your Harvest at Home agronomist explains the plan.`
5. `App Activation` — `The Harvest at Home app connects to your sensors. Track moisture, harvest yields, streak goals, and upcoming maintenance—all in real time.`
6. `Ongoing Production` — `Weekly visits from your assigned horticulturalist. Watering automated. Your only job: harvest and eat.`

### 4.5 The App
- Label: `The Harvest at Home App` — H2: `Grow streaks, not just vegetables.`
- Body: `Track your beds, log harvests, earn milestones, and watch your garden's real-time vitals from your phone. Your garden is a living system—the app makes it feel like one.`
- Feature 1: `Live sensor dashboard` / `Soil moisture, temperature, and watering events in real time. Know your garden's health at a glance.`
- Feature 2: `Harvest milestones & streaks` / `Log every harvest and earn badges—First Tomato, 100-lb Club, Winter Greens streak. Unlock care recommendations as you level up.`
- Feature 3: `Seasonal crop calendar` / `What's ready to harvest, what's coming next, when your Harvest at Home team visits. Everything scheduled, nothing to remember.`

**Phone mockup UI content** (render as in-app UI, placed in-context over a garden photo):
- Header: `Good morning, Sarah` / `Tuesday · Week 14 of growing season`
- Streak banner: `Harvest streak — 7 weeks` (7 gold dots)
- `Your beds`: `Bed 01 · Butter lettuce · 85% · Ready to harvest` — `Bed 02 · Heirloom tomatoes · 62% · Est. 12 days` — `Bed 03 · Carrots & radish · 40% · Est. 24 days` — `Bed 04 · Delicata squash · 28% · Est. 38 days`
- Harvest bar: `This week — 14.2 lbs harvested` / badge `+22% vs last week`
- `Today's tasks`: ✓ `Morning watering — automated` · ✓ `Harvest butter lettuce (Bed 01)` · ☐ `Harvest at Home team visit — 2:00 PM`

### 4.6 Yield
- Label: `Output by the numbers` — H2: `What your backyard actually produces.`
- Body: `Based on a four-bed system in the Austin/Texas Hill Country climate. Output scales linearly with additional beds.`
- `10–20 / lbs/week (peak)` — `Spring and fall production at maximum yield per 4-bed system. Continuous harvest rotations.`
- `600+ / lbs/year total` — `Annual output across four beds with managed rotation, seasonal crops, and year-round greens production.`
- `52 / weeks of harvest` — `With cold-tolerant varieties, row covers, and managed succession planting, your garden never stops.`
- `1–2 / hrs/week your time` — `With managed + automated tier. Harvest, enjoy, repeat. Your Harvest at Home team handles everything else.`

### 4.7 Testimonials
- Label: `What clients say` — H2: `From families who made the switch.`
1. `The first time we cooked an entirely homegrown dinner, my kids asked why vegetables at restaurants don't taste this good. That was the moment I understood what we'd built.` — `Megan T.` / `Austin, TX · Managed Garden · 2 years`
2. `We'd tried organic delivery boxes for years. Harvest at Home isn't in the same category. The app streak gamification is weirdly motivating—our whole family competes to log the harvest first.` — `David & Clara R.` / `Westlake Hills, TX · Fully Controlled · 18 months`
3. `I'm an MD and I care deeply about what goes into my family's food. The fact that I can open the app and see every input logged, every irrigation event, every amendment—that level of transparency is priceless.` — `Dr. Priya S.` / `Tarrytown, TX · Fully Controlled · 1 year`

### 4.8 Mid-page CTA band (after Testimonials)
- H3: `Own the system that feeds you.` (italic on "that feeds you") — Button: `Begin Your Garden` → `#contact`
- Warm dark-green photo band (FPO: harvest photo).

### 4.9 Tiers
- Label: `Service Systems` — H2: `Choose your level of control.`
- Body: `Every system begins with a custom design. Select how involved you want to be.`

**Tier 1 — tag `Foundation`, name `The Install`, price `From $3,400`**
Desc: `A professionally engineered foundation. You manage day-to-day, we do the heavy lifting upfront.`
Features: `Site analysis & custom layout design` · `4×8 ft modular raised bed construction` · `High-performance biologically active soil blend` · `Full drip irrigation network, zoned` · `Smart watering controller configured` · `Initial seasonal planting` · `Harvest at Home app onboarding`
Button: `Start Here`

**Tier 2 — tag `Most Popular` (featured), name `Managed Garden`, price `From $280/mo`**
Desc: `Stable, predictable yield with minimal effort on your end. Your agronomist comes weekly.`
Features: `Everything in The Install` · `Weekly maintenance visits (1.5 hrs)` · `Crop rotation & seasonal replanting` · `Soil health monitoring & amendments` · `Non-synthetic pest & disease control` · `Harvest scheduling & guidance` · `Monthly production report in app`
Button: `Get a Design`

**Tier 3 — tag `Full Automation`, name `Fully Controlled`, price `From $480/mo`**
Desc: `Complete closed-loop system. Sensors manage everything. You only show up to harvest.`
Features: `Everything in Managed Garden` · `Full sensor array (moisture, temp, nutrients)` · `Weather-adaptive irrigation control` · `Remote real-time monitoring dashboard` · `Automated alerts & auto-adjustments` · `Dedicated Harvest at Home agronomist on-call` · `Architectural bed upgrade options`
Button: `Design My System`

### 4.10 CTA / Contact
- Label: `Begin Your Harvest at Home`
- H2: `Own the system that feeds you.` (italic on "that feeds you")
- Body: `We take on a limited number of new installations per season. Request a site visit and receive a custom layout design within 5 business days.`
- Fields: `First name` · `Last name` · `Email address` · `Zip code`
- Button: `Request a Site Visit →`
- ZIP result states: see §3.1
- Note under form: `Austin metro area currently served · Expanding to Bay Area Q3 2025`
- Section background: `--sage-dark`, centered layout, glass form panel.

### 4.11 Footer
- Logo + tagline: `Private kitchen garden systems. Designed, installed, and maintained for families who care what goes into their food.`
- Sub-line: `Austin, TX · Currently accepting new clients`
- Column `Systems`: The Install · Managed Garden · Fully Controlled · Design Options
- Column `Company`: Our Approach · The Agronomy Team · The App · Client Stories
- Column `Get Started`: Request a Site Visit · Yield Calculator · FAQ · Contact
- Bottom: `© 2025 Harvest at Home Garden Systems. All rights reserved.` · `Serving the greater Austin metro area`

---

## 5. Content flags (do NOT fix silently — client decision pending)
1. `Expanding to Bay Area Q3 2025` — date is stale; keep verbatim until Maria updates.
2. Hero says `400+ lbs/year per bed`, Yield says `600+ lbs/year total` for a 4-bed system (4×400=1600 — inconsistent). Keep both verbatim; flagged to Maria.
3. Old brand remnant `GROVE · SYSTEM LAYOUT` existed in the original hero SVG — that SVG is retired in this design; do not carry it over anywhere.

## 6. Responsive
- Breakpoint ~900px: single-column grids, nav links collapse (hamburger or hide, keep nav CTA), hero stats wrap, phone mockup scales down.
- Breakpoint ~560px: yield grid 1-col, marquee font unchanged.
- Touch targets ≥ 44px; inputs `inputmode="numeric"` + `maxlength="5"` on ZIP.

## 7. Quality bar
- Lighthouse a11y ≥ 95: semantic landmarks, labeled inputs, focus-visible styles on pills, contrast ≥ 4.5:1 for body text (mid-gray on cream passes at 0.9rem+ weights used).
- No layout shift from the hero video: reserve space, poster image.
- All copy exactly as §4 — the client approved these strings; any change is a bug.
