# 🎨 SagaCSS — Free Visual CSS Toolkit for Developers

> Design gradients, shadows, animations, palettes, and layouts visually — then copy production-ready CSS, Tailwind, or Bootstrap code. No sign-up, no paywall, all client-side.

🌐 **Live:** [https://sagacss.vercel.app/](https://sagacss.vercel.app/)
💻 **GitHub:** [https://github.com/tripathipawan/Saga_CSS_Website](https://github.com/tripathipawan/Saga_CSS_Website)

---

## 📌 Table of Contents

1. [What is SagaCSS?](#what-is-sagacss)
2. [Why I Built This](#why-i-built-this)
3. [What It Can Do](#what-it-can-do)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Features In Detail](#features-in-detail)
7. [Testing & CI](#testing--ci)
8. [Getting Started](#getting-started)
9. [Available Scripts](#available-scripts)
10. [Known Limitations](#known-limitations)
11. [Challenges & How I Solved Them](#challenges--how-i-solved-them)
12. [What I Learned](#what-i-learned)

---

## 🧠 What is SagaCSS?

**SagaCSS** is a free, all-in-one visual CSS toolkit for frontend developers. Instead of memorizing syntax for gradients, box-shadows, clip-paths, cubic-bezier curves, or CSS Grid, you design everything visually with live sliders and previews — and the tool generates clean, copy-ready code for you in CSS, Tailwind, and Bootstrap formats.

Beyond the generators, SagaCSS also bundles a design-style showcase library (glassmorphism, neumorphism, cyberpunk, etc.), a full interview-prep question bank, hands-on CSS practice challenges with automated pass/fail checks, and a personal "My Kit" snippet saver — making it as much a learning platform as it is a utility toolkit.

---

## 💡 Why I Built This

As a frontend developer, I kept bouncing between a dozen different single-purpose CSS generator websites — one for gradients, another for box-shadows, another for cubic-bezier curves — each with a different UI, ad-heavy pages, and no consistency. There was no single place that combined generation, learning, and reference in one clean, fast tool.

I built SagaCSS to fix that: one toolkit, one design system, over 30 tools, zero backend dependency, and genuinely useful learning resources (interview prep + practice challenges) baked into the same product — built and shipped end-to-end by me, from architecture to deployment to CI/CD.

---

## ✅ What It Can Do

- 🎨 **30+ CSS generators** — gradients, shadows, borders, animations, 3D shapes, filters, clip-path, grid, flexbox, and more — all with live visual previews
- 🖌️ **7 design-style showcases** — glassmorphism, neumorphism, claymorphism, neubrutalism, Y2K/retro, cyberpunk neon, and art deco, each with ready-to-copy code snippets
- 📋 **Copy-ready output** in raw CSS, Tailwind utility classes, and Bootstrap where applicable
- 🧰 **My Kit** — save favorite snippets locally and revisit them anytime, no account needed
- 📖 **CSS Cheat Sheet** — quick reference for common properties and values
- 🎓 **Interview Prep** — a searchable, filterable question bank (HTML/CSS, by difficulty level) with shareable deep-links and a filtered PDF export
- 🏋️ **Practice Challenges** — hands-on CSS exercises with an automated checker that validates your solution against expected selectors/properties and gives instant pass/fail feedback
- 📱 **Responsive Preview Tester** — render your HTML+CSS across 4 breakpoints (375 / 768 / 1024 / 1440) side-by-side with synced scrolling
- 🌐 **Browser Compatibility Checker** — look up support for ~120 CSS features across Chrome, Firefox, Safari, Edge, Opera, and mobile browsers
- 🎯 **CSS Specificity Visualizer** — parses selectors into their specificity tuple and compares two selectors head-to-head
- 📝 **Blog** — articles on CSS techniques, with tags, pagination, and Open Graph metadata
- 🌙 **Dark / Light mode**, fully responsive layout, and a persistent sidebar navigation
- 🔍 **SEO-optimized** — per-route meta tags, canonical URLs, JSON-LD structured data, sitemap, and Core Web Vitals reporting

---

## ⚙️ Tech Stack

| Category            | Technology                                  |
| -------------------- | -------------------------------------------- |
| Framework            | React 19 + TanStack Start (SSR) + TanStack Router |
| Language              | TypeScript                                   |
| Build Tool            | Vite 8 (via Nitro server target)             |
| Styling               | Tailwind CSS v4                              |
| UI Components         | shadcn/ui + Radix UI primitives              |
| Animations            | Framer Motion                                |
| Data Fetching         | TanStack Query                               |
| Forms & Validation    | React Hook Form + Zod                        |
| Charts                | Recharts                                     |
| PDF Export            | jsPDF                                        |
| CSS Preprocessing     | Less (in-browser SCSS/LESS compiler tool)    |
| Icons                 | Lucide React                                 |
| Package Manager       | Bun                                           |
| E2E Testing           | Playwright + @axe-core/playwright (accessibility) |
| Performance Auditing  | Lighthouse CI                                |
| Linting/Formatting    | ESLint + Prettier                            |
| Deployment            | Vercel                                       |
| CI/CD                 | GitHub Actions                               |


# 🎨 SagaCSS — Free Visual CSS Toolkit for Developers

> Design gradients, shadows, animations, palettes, and layouts visually — then copy production-ready CSS, Tailwind, or Bootstrap code. No sign-up, no paywall, all client-side.

🌐 **Live:** [https://sagacss.vercel.app/](https://sagacss.vercel.app/)
💻 **GitHub:** [https://github.com/tripathipawan/Saga_CSS_Website](https://github.com/tripathipawan/Saga_CSS_Website)

---

## 📌 Table of Contents

1. [What is SagaCSS?](#what-is-sagacss)
2. [Why I Built This](#why-i-built-this)
3. [What It Can Do](#what-it-can-do)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Features In Detail](#features-in-detail)
7. [Testing & CI](#testing--ci)
8. [Getting Started](#getting-started)
9. [Available Scripts](#available-scripts)
10. [Known Limitations](#known-limitations)
11. [Challenges & How I Solved Them](#challenges--how-i-solved-them)
12. [What I Learned](#what-i-learned)

---

## 🧠 What is SagaCSS?

**SagaCSS** is a free, all-in-one visual CSS toolkit for frontend developers. Instead of memorizing syntax for gradients, box-shadows, clip-paths, cubic-bezier curves, or CSS Grid, you design everything visually with live sliders and previews — and the tool generates clean, copy-ready code for you in CSS, Tailwind, and Bootstrap formats.

Beyond the generators, SagaCSS also bundles a design-style showcase library (glassmorphism, neumorphism, cyberpunk, etc.), a full interview-prep question bank, hands-on CSS practice challenges with automated pass/fail checks, and a personal "My Kit" snippet saver — making it as much a learning platform as it is a utility toolkit.

---

## 💡 Why I Built This

As a frontend developer, I kept bouncing between a dozen different single-purpose CSS generator websites — one for gradients, another for box-shadows, another for cubic-bezier curves — each with a different UI, ad-heavy pages, and no consistency. There was no single place that combined generation, learning, and reference in one clean, fast tool.

I built SagaCSS to fix that: one toolkit, one design system, over 30 tools, zero backend dependency, and genuinely useful learning resources (interview prep + practice challenges) baked into the same product — built and shipped end-to-end by me, from architecture to deployment to CI/CD.

---

## ✅ What It Can Do

- 🎨 **30+ CSS generators** — gradients, shadows, borders, animations, 3D shapes, filters, clip-path, grid, flexbox, and more — all with live visual previews
- 🖌️ **7 design-style showcases** — glassmorphism, neumorphism, claymorphism, neubrutalism, Y2K/retro, cyberpunk neon, and art deco, each with ready-to-copy code snippets
- 📋 **Copy-ready output** in raw CSS, Tailwind utility classes, and Bootstrap where applicable
- 🧰 **My Kit** — save favorite snippets locally and revisit them anytime, no account needed
- 📖 **CSS Cheat Sheet** — quick reference for common properties and values
- 🎓 **Interview Prep** — a searchable, filterable question bank (HTML/CSS, by difficulty level) with shareable deep-links and a filtered PDF export
- 🏋️ **Practice Challenges** — hands-on CSS exercises with an automated checker that validates your solution against expected selectors/properties and gives instant pass/fail feedback
- 📱 **Responsive Preview Tester** — render your HTML+CSS across 4 breakpoints (375 / 768 / 1024 / 1440) side-by-side with synced scrolling
- 🌐 **Browser Compatibility Checker** — look up support for ~120 CSS features across Chrome, Firefox, Safari, Edge, Opera, and mobile browsers
- 🎯 **CSS Specificity Visualizer** — parses selectors into their specificity tuple and compares two selectors head-to-head
- 📝 **Blog** — articles on CSS techniques, with tags, pagination, and Open Graph metadata
- 🌙 **Dark / Light mode**, fully responsive layout, and a persistent sidebar navigation
- 🔍 **SEO-optimized** — per-route meta tags, canonical URLs, JSON-LD structured data, sitemap, and Core Web Vitals reporting

---

## ⚙️ Tech Stack

| Category            | Technology                                  |
| -------------------- | -------------------------------------------- |
| Framework            | React 19 + TanStack Start (SSR) + TanStack Router |
| Language              | TypeScript                                   |
| Build Tool            | Vite 8 (via Nitro server target)             |
| Styling               | Tailwind CSS v4                              |
| UI Components         | shadcn/ui + Radix UI primitives              |
| Animations            | Framer Motion                                |
| Data Fetching         | TanStack Query                               |
| Forms & Validation    | React Hook Form + Zod                        |
| Charts                | Recharts                                     |
| PDF Export            | jsPDF                                        |
| CSS Preprocessing     | Less (in-browser SCSS/LESS compiler tool)    |
| Icons                 | Lucide React                                 |
| Package Manager       | Bun                                           |
| E2E Testing           | Playwright + @axe-core/playwright (accessibility) |
| Performance Auditing  | Lighthouse CI                                |
| Linting/Formatting    | ESLint + Prettier                            |
| Deployment            | Vercel                                       |
| CI/CD                 | GitHub Actions                               |

---

## 📁 Project Structure

CSS Craft Studio/
├─ .github/
│  └─ workflows/
│     ├─ ci.yml
│     └─ prod-audit.yml
├─ .lovable/
│  ├─ plan.md
│  └─ project.json
├─ .output/
│  ├─ public/
│  │  ├─ assets/
│  │  │  ├─ 3d-shapes-Bzqbi7p8.js
│  │  │  ├─ about-gfrx22Zp.js
│  │  │  ├─ animation-rqp8trvv.js
│  │  │  ├─ arrow-left-DeWUefty.js
│  │  │  ├─ arrow-right-DMlx-ndy.js
│  │  │  ├─ art-deco-BOpl8hO3.js
│  │  │  ├─ badge-BiS8sqGB.js
│  │  │  ├─ base64-Dg5ur6MH.js
│  │  │  ├─ bezier-Tv65fOM1.js
│  │  │  ├─ blog-listing-BY-Tmxk3.js
│  │  │  ├─ blog._slug-B_pN4SId.js
│  │  │  ├─ blog._slug-B7dRkGdT.js
│  │  │  ├─ blog.index-CXVfnHPB.js
│  │  │  ├─ blog.page._page-B-rzZIy7.js
│  │  │  ├─ blog.page._page-BJ7btEwS.js
│  │  │  ├─ border-radius-5S-cy7Ar.js
│  │  │  ├─ box-shadow-CzzdwwdL.js
│  │  │  ├─ box-sizing-DELZ5KN9.js
│  │  │  ├─ button-vLUi6j2g.js
│  │  │  ├─ cheat-sheet-Ba1LlALf.js
│  │  │  ├─ check-D9wkJQ6o.js
│  │  │  ├─ checkbox-l1ibPwh0.js
│  │  │  ├─ chevron-down-pd9kQrte.js
│  │  │  ├─ chevron-left-DWAMC5eW.js
│  │  │  ├─ chevron-right-CI6BH5nv.js
│  │  │  ├─ circle-x-C0Qj2RNB.js
│  │  │  ├─ clamp-B9ALFLjg.js
│  │  │  ├─ claymorphism-DVNnlqYD.js
│  │  │  ├─ clip-path-DW2oUM--.js
│  │  │  ├─ color-converter-CpWpq29d.js
│  │  │  ├─ color-mixer-eq6iS3mw.js
│  │  │  ├─ color-palette-DaURWtUR.js
│  │  │  ├─ color-SynUP4z7.js
│  │  │  ├─ compatibility-EWTAc5B1.js
│  │  │  ├─ contact-DqK7VYXk.js
│  │  │  ├─ contrast-oN9ufL3R.js
│  │  │  ├─ cookies-C1ayCrB3.js
│  │  │  ├─ copy-BTRlwyix.js
│  │  │  ├─ cyberpunk-Bga74xlI.js
│  │  │  ├─ dialog-D4cmqDnf.js
│  │  │  ├─ dist-C2J943E6.js
│  │  │  ├─ dist-CEEgxtJU.js
│  │  │  ├─ dist-CrvgwOXu.js
│  │  │  ├─ dist-D8a0J2d1.js
│  │  │  ├─ dist-DRDLgAyM.js
│  │  │  ├─ dist-DSxGyVi_.js
│  │  │  ├─ dist-x7XCJDlp.js
│  │  │  ├─ download-Bz8y5GMR.js
│  │  │  ├─ eye-DpRR1NvA.js
│  │  │  ├─ faq-BnrdKAPE.js
│  │  │  ├─ filter-DKlZTKts.js
│  │  │  ├─ flexbox-Cm-BRnGx.js
│  │  │  ├─ fonts-8LX_90nH.js
│  │  │  ├─ glassmorphism-BsaJSxMm.js
│  │  │  ├─ gradient-B2o9v9dj.js
│  │  │  ├─ grid-Bmoc-zZm.js
│  │  │  ├─ html2canvas-CbbIgMYO.js
│  │  │  ├─ image-text-BpO5TECJ.js
│  │  │  ├─ index-IHmSb0QA.js
│  │  │  ├─ index.es-fz32M2bg.js
│  │  │  ├─ interview-prep-Bpzkibd2.js
│  │  │  ├─ jspdf.es.min-BJ8os3V0.js
│  │  │  ├─ jsx-runtime-B6jttwkn.js
│  │  │  ├─ label-zdhKqtEY.js
│  │  │  ├─ less-CIgeYRiV.js
│  │  │  ├─ link-BDPQAmgU.js
│  │  │  ├─ link-CmiubHTA.js
│  │  │  ├─ my-kit-5pNvreGI.js
│  │  │  ├─ my-kit-LhGOaD-F.js
│  │  │  ├─ neubrutalism-w_gNNcMc.js
│  │  │  ├─ neumorphism-CA-hXZlg.js
│  │  │  ├─ play-BVGYFC2N.js
│  │  │  ├─ plus-BabVofps.js
│  │  │  ├─ practice-BNH5uSrv.js
│  │  │  ├─ preprocessor-CgVXzjBj.js
│  │  │  ├─ privacy-DAaqBk9d.js
│  │  │  ├─ purify.es-ZPrpXrUc.js
│  │  │  ├─ react-CES6V0Ih.js
│  │  │  ├─ react-dom-DWuVlKIp.js
│  │  │  ├─ reset-6vhVcwwC.js
│  │  │  ├─ responsive-DzyNo1Al.js
│  │  │  ├─ rolldown-runtime-Bh1tDfsg.js
│  │  │  ├─ routes-gKMyr8IR.js
│  │  │  ├─ scrollbar-BYCJJ1k4.js
│  │  │  ├─ select-tkkliiDm.js
│  │  │  ├─ settings-wo_wye2F.js
│  │  │  ├─ shuffle-BRtgeQWn.js
│  │  │  ├─ slider-txiHiLuE.js
│  │  │  ├─ specificity-CBx-jepq.js
│  │  │  ├─ spinner-1Xg5OApu.js
│  │  │  ├─ sticky-code-BblTR1vB.js
│  │  │  ├─ styles-BA2ISnXF.css
│  │  │  ├─ svg-CvCp9c6d.js
│  │  │  ├─ switch-68l7eg5T.js
│  │  │  ├─ terms-YNiHwNRr.js
│  │  │  ├─ text-shadow-BR4WAK5R.js
│  │  │  ├─ textarea-D_gmu_4E.js
│  │  │  ├─ theme-3ioJyNkp.js
│  │  │  ├─ theme-variables-BVoVO0w5.js
│  │  │  ├─ tool-header-DmhHeH1c.js
│  │  │  ├─ trash-2-Z9ZQSsA1.js
│  │  │  ├─ typeof-B5XbjTb1.js
│  │  │  ├─ upload-Dq_C7pzE.js
│  │  │  ├─ useStore-DG_K-2X6.js
│  │  │  ├─ utils-BqKe6Eo2.js
│  │  │  ├─ web-vitals-client-Dy2u2yjy.js
│  │  │  └─ y2k-mJQhnRk1.js
│  │  ├─ _headers
│  │  ├─ favicon.svg
│  │  ├─ og-image.jpg
│  │  └─ robots.txt
│  ├─ server/
│  │  ├─ _chunks/
│  │  │  └─ ssr-renderer.mjs
│  │  ├─ _libs/
│  │  │  ├─ @floating-ui/
│  │  │  │  ├─ core+[...].mjs
│  │  │  │  ├─ dom+[...].mjs
│  │  │  │  └─ react-dom+[...].mjs
│  │  │  ├─ @radix-ui/
│  │  │  │  ├─ react-accordion+[...].mjs
│  │  │  │  ├─ react-checkbox+[...].mjs
│  │  │  │  ├─ react-dialog+[...].mjs
│  │  │  │  ├─ react-dropdown-menu+[...].mjs
│  │  │  │  └─ react-select+[...].mjs
│  │  │  ├─ @tanstack/
│  │  │  │  ├─ react-router+[...].mjs
│  │  │  │  └─ router-core+[...].mjs
│  │  │  ├─ babel__runtime.mjs
│  │  │  ├─ canvg+[...].mjs
│  │  │  ├─ class-variance-authority+clsx.mjs
│  │  │  ├─ copy-anything+is-what.mjs
│  │  │  ├─ dompurify.mjs
│  │  │  ├─ fast-png+iobuffer+pako.mjs
│  │  │  ├─ fflate.mjs
│  │  │  ├─ h3-v2+rou3.mjs
│  │  │  ├─ h3+rou3+srvx.mjs
│  │  │  ├─ hookable.mjs
│  │  │  ├─ html2canvas.mjs
│  │  │  ├─ jspdf.mjs
│  │  │  ├─ less+parse-node-version.mjs
│  │  │  ├─ lucide-react.mjs
│  │  │  ├─ radix-ui__number.mjs
│  │  │  ├─ radix-ui__primitive.mjs
│  │  │  ├─ radix-ui__react-arrow.mjs
│  │  │  ├─ radix-ui__react-label.mjs
│  │  │  ├─ radix-ui__react-slider.mjs
│  │  │  ├─ radix-ui__react-switch.mjs
│  │  │  ├─ radix-ui__react-tabs.mjs
│  │  │  ├─ radix-ui__react-tooltip.mjs
│  │  │  ├─ sonner.mjs
│  │  │  ├─ tailwind-merge.mjs
│  │  │  ├─ tanstack__history.mjs
│  │  │  ├─ tanstack__query-core.mjs
│  │  │  ├─ tanstack__react-query.mjs
│  │  │  ├─ tanstack__zod-adapter+zod.mjs
│  │  │  ├─ unenv.mjs
│  │  │  └─ web-vitals.mjs
│  │  ├─ _ssr/
│  │  │  ├─ 3d-shapes-Ct08Iq0C.mjs
│  │  │  ├─ about-CD_VWiJr.mjs
│  │  │  ├─ animation-CIwzBpNm.mjs
│  │  │  ├─ art-deco-C03l6Tuf.mjs
│  │  │  ├─ badge-D1Dupn2y.mjs
│  │  │  ├─ base64-BXuU2TMW.mjs
│  │  │  ├─ bezier-CgwMcRyk.mjs
│  │  │  ├─ blog-DMGEGB3V.mjs
│  │  │  ├─ blog-listing-BA91Cr1A.mjs
│  │  │  ├─ blog._slug-1IDed_0U.mjs
│  │  │  ├─ blog._slug-CCfnb-ch.mjs
│  │  │  ├─ blog._slug-DsyzL8y5.mjs
│  │  │  ├─ blog.index-0Fs0Ydeg.mjs
│  │  │  ├─ blog.index-BbcVc4e3.mjs
│  │  │  ├─ blog.page._page-Bz5LLZWf.mjs
│  │  │  ├─ blog.page._page-CHbYYDa0.mjs
│  │  │  ├─ blog.page._page-DRALWAvJ.mjs
│  │  │  ├─ border-radius-BUJIIFVb.mjs
│  │  │  ├─ box-shadow-B4ZoG4yo.mjs
│  │  │  ├─ box-sizing-BJ56s1PH.mjs
│  │  │  ├─ button-Bq5vK6RO.mjs
│  │  │  ├─ button-Bv1dHIBp.mjs
│  │  │  ├─ cheat-sheet-DZPsuYmb.mjs
│  │  │  ├─ checkbox-kt6FvQcE.mjs
│  │  │  ├─ clamp-CC5n32W0.mjs
│  │  │  ├─ claymorphism-CLscA1HA.mjs
│  │  │  ├─ clip-path-DBMfrMdH.mjs
│  │  │  ├─ color-converter-DLjZ7uul.mjs
│  │  │  ├─ color-D2MAPZPc.mjs
│  │  │  ├─ color-mixer-wrzefKe1.mjs
│  │  │  ├─ color-palette-Cmq21bPe.mjs
│  │  │  ├─ compatibility-zVw5PZeQ.mjs
│  │  │  ├─ contact-ubsS69SP.mjs
│  │  │  ├─ contrast-B-K-EiBQ.mjs
│  │  │  ├─ cookies-DdL_-4Ah.mjs
│  │  │  ├─ createStart-Dt05N14y.mjs
│  │  │  ├─ cyberpunk-CDpCKWSr.mjs
│  │  │  ├─ dialog-DIo89e4g.mjs
│  │  │  ├─ empty-plugin-adapters-D9UWiqvJ.mjs
│  │  │  ├─ faq-D_R1Ektt.mjs
│  │  │  ├─ filter-BVwrb4ws.mjs
│  │  │  ├─ flexbox-B4WwGiHG.mjs
│  │  │  ├─ fonts--_7lTnmR.mjs
│  │  │  ├─ glassmorphism-jx415ORc.mjs
│  │  │  ├─ gradient-DysCLDvz.mjs
│  │  │  ├─ grid-CraFLIhl.mjs
│  │  │  ├─ image-text-eRctdwgU.mjs
│  │  │  ├─ input-B8Q2ztVi.mjs
│  │  │  ├─ interview-prep-4QJcuRiI.mjs
│  │  │  ├─ interview-prep-wX2sD4_o.mjs
│  │  │  ├─ label-DBD1bRRP.mjs
│  │  │  ├─ lovable-error-reporting-4GCzfVkY.mjs
│  │  │  ├─ my-kit-Cm369dlY.mjs
│  │  │  ├─ my-kit-IT2LWPFK.mjs
│  │  │  ├─ neubrutalism-BopaUfxA.mjs
│  │  │  ├─ neumorphism-WyyxTk9F.mjs
│  │  │  ├─ practice-C1ottcDf.mjs
│  │  │  ├─ practice-DpiFl-AM.mjs
│  │  │  ├─ preprocessor-iRjCuwJu.mjs
│  │  │  ├─ privacy-CBNSE6MO.mjs
│  │  │  ├─ reset-CRr9FjgG.mjs
│  │  │  ├─ responsive-WY4R8e9a.mjs
│  │  │  ├─ router-KJj_ARxx.mjs
│  │  │  ├─ routes-D4L4UmFJ.mjs
│  │  │  ├─ scrollbar-CWTf3X9n.mjs
│  │  │  ├─ select-Dg1urBTx.mjs
│  │  │  ├─ server-fch9M0y5.mjs
│  │  │  ├─ settings-BieHlnjH.mjs
│  │  │  ├─ sheet-nNBP-y5w.mjs
│  │  │  ├─ slider-D7iqiWp9.mjs
│  │  │  ├─ specificity-B1zceqBO.mjs
│  │  │  ├─ spinner-DFkZSPFp.mjs
│  │  │  ├─ ssr.mjs
│  │  │  ├─ start-Ok9K6Nid.mjs
│  │  │  ├─ sticky-code-DW-JZxh-.mjs
│  │  │  ├─ svg-BEQSV1pq.mjs
│  │  │  ├─ switch-Cn1w-cIH.mjs
│  │  │  ├─ terms-BlLOWqrS.mjs
│  │  │  ├─ text-shadow-_gZ3b94e.mjs
│  │  │  ├─ textarea-kko37XEX.mjs
│  │  │  ├─ theme-DSsYo74w.mjs
│  │  │  ├─ theme-provider-Drg-rbhs.mjs
│  │  │  ├─ theme-variables-CFSeN8eX.mjs
│  │  │  ├─ tool-header-BHQDoi2W.mjs
│  │  │  ├─ utils-C_uf36nf.mjs
│  │  │  ├─ web-vitals-client-BCovSY6e.mjs
│  │  │  └─ y2k-BvxXKvvK.mjs
│  │  ├─ _runtime.mjs
│  │  ├─ _tanstack-start-manifest_v-D0736X8S.mjs
│  │  ├─ index.mjs
│  │  └─ wrangler.json
│  ├─ nitro.json
│  ├─ package-lock.json
│  └─ package.json
├─ .wrangler/
│  └─ deploy/
│     └─ config.json
├─ public/
│  ├─ favicon.svg
│  ├─ og-image.jpg
│  └─ robots.txt
├─ scripts/
│  ├─ lint-bootstrap.mjs
│  └─ prod-seo-audit.mjs
├─ src/
│  ├─ components/
│  │  ├─ blog/
│  │  │  ├─ blog-listing.tsx
│  │  │  └─ share-buttons.tsx
│  │  ├─ layout/
│  │  │  ├─ app-footer.tsx
│  │  │  ├─ app-header.tsx
│  │  │  ├─ app-shell.tsx
│  │  │  └─ app-sidebar.tsx
│  │  ├─ ui/
│  │  │  ├─ accordion.tsx
│  │  │  ├─ alert-dialog.tsx
│  │  │  ├─ alert.tsx
│  │  │  ├─ aspect-ratio.tsx
│  │  │  ├─ avatar.tsx
│  │  │  ├─ badge.tsx
│  │  │  ├─ breadcrumb.tsx
│  │  │  ├─ button.tsx
│  │  │  ├─ calendar.tsx
│  │  │  ├─ card.tsx
│  │  │  ├─ carousel.tsx
│  │  │  ├─ chart.tsx
│  │  │  ├─ checkbox.tsx
│  │  │  ├─ collapsible.tsx
│  │  │  ├─ command.tsx
│  │  │  ├─ context-menu.tsx
│  │  │  ├─ dialog.tsx
│  │  │  ├─ drawer.tsx
│  │  │  ├─ dropdown-menu.tsx
│  │  │  ├─ form.tsx
│  │  │  ├─ hover-card.tsx
│  │  │  ├─ input-otp.tsx
│  │  │  ├─ input.tsx
│  │  │  ├─ label.tsx
│  │  │  ├─ menubar.tsx
│  │  │  ├─ navigation-menu.tsx
│  │  │  ├─ pagination.tsx
│  │  │  ├─ popover.tsx
│  │  │  ├─ progress.tsx
│  │  │  ├─ radio-group.tsx
│  │  │  ├─ resizable.tsx
│  │  │  ├─ scroll-area.tsx
│  │  │  ├─ select.tsx
│  │  │  ├─ separator.tsx
│  │  │  ├─ sheet.tsx
│  │  │  ├─ sidebar.tsx
│  │  │  ├─ skeleton.tsx
│  │  │  ├─ slider.tsx
│  │  │  ├─ sonner.tsx
│  │  │  ├─ switch.tsx
│  │  │  ├─ table.tsx
│  │  │  ├─ tabs.tsx
│  │  │  ├─ textarea.tsx
│  │  │  ├─ toggle-group.tsx
│  │  │  ├─ toggle.tsx
│  │  │  └─ tooltip.tsx
│  │  ├─ code-block.tsx
│  │  ├─ coming-soon.tsx
│  │  ├─ sticky-code.tsx
│  │  ├─ theme-provider.tsx
│  │  ├─ theme-toggle.tsx
│  │  └─ tool-header.tsx
│  ├─ hooks/
│  │  └─ use-mobile.tsx
│  ├─ lib/
│  │  ├─ blog-posts.ts
│  │  ├─ blog.ts
│  │  ├─ color.ts
│  │  ├─ compat-data.ts
│  │  ├─ error-capture.ts
│  │  ├─ error-page.ts
│  │  ├─ interview-questions.ts
│  │  ├─ lovable-error-reporting.ts
│  │  ├─ my-kit.ts
│  │  ├─ palettes.ts
│  │  ├─ practice-challenges.ts
│  │  ├─ practice-checks.ts
│  │  ├─ socials.ts
│  │  ├─ specificity.ts
│  │  ├─ storage-migration.ts
│  │  ├─ tools.ts
│  │  ├─ utils.ts
│  │  └─ web-vitals-client.ts
│  ├─ routes/
│  │  ├─ api/
│  │  │  └─ public/
│  │  │     └─ vitals.ts
│  │  ├─ styles/
│  │  │  ├─ art-deco.tsx
│  │  │  ├─ claymorphism.tsx
│  │  │  ├─ cyberpunk.tsx
│  │  │  ├─ glassmorphism.tsx
│  │  │  ├─ neubrutalism.tsx
│  │  │  ├─ neumorphism.tsx
│  │  │  └─ y2k.tsx
│  │  ├─ tools/
│  │  │  ├─ 3d-shapes.tsx
│  │  │  ├─ animation.tsx
│  │  │  ├─ base64.tsx
│  │  │  ├─ bezier.tsx
│  │  │  ├─ border-radius.tsx
│  │  │  ├─ box-shadow.tsx
│  │  │  ├─ box-sizing.tsx
│  │  │  ├─ button.tsx
│  │  │  ├─ clamp.tsx
│  │  │  ├─ clip-path.tsx
│  │  │  ├─ color-converter.tsx
│  │  │  ├─ color-mixer.tsx
│  │  │  ├─ color-palette.tsx
│  │  │  ├─ compatibility.tsx
│  │  │  ├─ contrast.tsx
│  │  │  ├─ filter.tsx
│  │  │  ├─ flexbox.tsx
│  │  │  ├─ fonts.tsx
│  │  │  ├─ gradient.tsx
│  │  │  ├─ grid.tsx
│  │  │  ├─ image-text.tsx
│  │  │  ├─ preprocessor.tsx
│  │  │  ├─ reset.tsx
│  │  │  ├─ responsive.tsx
│  │  │  ├─ scrollbar.tsx
│  │  │  ├─ specificity.tsx
│  │  │  ├─ spinner.tsx
│  │  │  ├─ svg.tsx
│  │  │  ├─ text-shadow.tsx
│  │  │  ├─ theme-variables.tsx
│  │  │  └─ theme.tsx
│  │  ├─ __root.tsx
│  │  ├─ about.tsx
│  │  ├─ blog.$slug.tsx
│  │  ├─ blog.index.tsx
│  │  ├─ blog.page.$page.tsx
│  │  ├─ cheat-sheet.tsx
│  │  ├─ contact.tsx
│  │  ├─ cookies.tsx
│  │  ├─ faq.tsx
│  │  ├─ index.tsx
│  │  ├─ interview-prep.tsx
│  │  ├─ my-kit.tsx
│  │  ├─ practice.tsx
│  │  ├─ privacy.tsx
│  │  ├─ README.md
│  │  ├─ settings.tsx
│  │  ├─ sitemap[.]xml.ts
│  │  └─ terms.tsx
│  ├─ types/
│  │  └─ less.d.ts
│  ├─ router.tsx
│  ├─ routeTree.gen.ts
│  ├─ server.ts
│  ├─ start.ts
│  └─ styles.css
├─ tests/
│  └─ e2e/
│     ├─ a11y.spec.ts
│     ├─ blog.spec.ts
│     ├─ bootstrap-tab.spec.ts
│     ├─ cheat-sheet.spec.ts
│     ├─ footer.spec.ts
│     ├─ generators.spec.ts
│     ├─ my-kit.spec.ts
│     ├─ pdf-and-clipboard.spec.ts
│     ├─ prod-smoke.spec.ts
│     ├─ responsive-viewports.spec.ts
│     ├─ seo.spec.ts
│     ├─ social-jsonld.spec.ts
│     └─ tools.spec.ts
├─ .gitignore
├─ .prettierignore
├─ .prettierrc
├─ AGENTS.md
├─ bun.lock
├─ bunfig.toml
├─ components.json
├─ eslint.config.js
├─ lighthouserc.json
├─ package-lock.json
├─ package.json
├─ playwright.config.ts
├─ tsconfig.json
└─ vite.config.ts

---

## 🔬 Features In Detail

### 🎨 CSS Generators (30+ tools)

Every tool under `/tools/*` follows the same pattern: adjust values with sliders/inputs, see a **live preview** update instantly, and get **copy-ready code** in one click. Covers layout (Grid, Flexbox, Box Sizing), visual effects (Gradient, Box Shadow, Text Shadow, Filter, Clip Path, 3D Shapes), color (Palette, Converter, Mixer, Contrast Checker), motion (Animation, Cubic Bezier), and utility generators (CSS Reset, Clamp Calculator, Base64 Image Converter, SCSS/LESS Compiler, Scrollbar Styler, Loader/Spinner).

### 🖌️ Design Style Showcases

Seven dedicated pages (`/styles/*`) demonstrate popular UI aesthetics — glassmorphism, neumorphism, claymorphism, neubrutalism, Y2K/retro, cyberpunk neon, art deco — each with live component examples and the exact CSS needed to recreate the look.

### 🎓 Interview Prep

A searchable, filterable HTML/CSS interview question bank at `/interview-prep`, with difficulty levels (Beginner / Intermediate / Advanced), bookmarking, shareable deep-links (`?q=<id>`) that scroll to and highlight a specific question, and a filtered PDF export (scope, language, and level selectable before download).

### 🏋️ Practice Challenges

Hands-on CSS exercises at `/practice` where users write CSS against a prompt and get **automated pass/fail feedback** — the checker runner validates the solution against expected selectors, properties, and values (supporting exact match, substring, regex, and numeric-tolerance checks), with a detailed per-check results table.

### 🌐 Browser Compatibility Checker

`/tools/compatibility` — a searchable local dataset of ~120 CSS features mapped to support across 7 browsers/platforms, with color-coded support badges, vendor-prefix notes, fallback tips, and estimated global usage.

### 🎯 CSS Specificity Visualizer

`/tools/specificity` — parses any CSS selector (including `:not()`, `:is()`, `:where()`, attribute selectors, pseudo-elements) into its specificity tuple, visualizes the weight as a color-coded bar chart, and supports a two-selector comparison mode with a clear "which one wins" verdict.

### 📱 Responsive Preview Tester

`/tools/responsive` — paste HTML+CSS (or pull from My Kit) and preview it simultaneously across 4 breakpoints (375 / 768 / 1024 / 1440) with optional synced scrolling across all frames.

### 🧰 My Kit

A personal snippet library (`/my-kit`) — save any generated CSS from any tool and revisit it later. Stored entirely in `localStorage`, no account or backend required.

### 📝 Blog

A lightweight blog system with listing, pagination, tag filtering, individual post pages, and social share buttons — built for SEO with per-post Open Graph tags and JSON-LD.

### 🔍 SEO & Performance

Every route ships its own `<title>`, meta description, canonical URL, and Open Graph tags. The site also generates a dynamic `sitemap.xml`, reports Core Web Vitals to a custom API route, and is regularly audited with Lighthouse CI for performance, accessibility, best practices, and SEO scores.

---

## 🧪 Testing & CI

This project takes testing seriously for a personal project — every push and PR to `main` runs a full GitHub Actions pipeline (`ci.yml`):

- **Lint** — ESLint across the codebase
- **Build** — production build via Vite/Nitro
- **E2E tests (Playwright)** — tool functionality, generator + copy behavior, accessibility (axe-core), SEO metadata, blog flows, footer, PDF export, clipboard, My Kit, and responsive viewport regression (375/768/1024/1440)
- **SEO / JSON-LD sameAs regression** — verifies structured data stays correct

A separate manually-triggered workflow (`prod-audit.yml`) runs **Lighthouse CI** and Playwright smoke tests against the real deployed production URL after every release, so performance/SEO scores are always checked against what users actually see — not a stale or hardcoded URL.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (latest)
- Node.js 18+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tripathipawan/Saga_CSS_Website.git
cd Saga_CSS_Website

# 2. Install dependencies
bun install

# 3. Start the dev server
bun run dev
```

The app will be available at `http://localhost:3000` (or the port Vite assigns).

### Build for Production

```bash
bun run build
```

---

## 📜 Available Scripts

| Script                  | Description                                          |
| ------------------------ | ----------------------------------------------------- |
| `bun run dev`             | Start the local development server                   |
| `bun run build`           | Production build                                      |
| `bun run lint`            | Run ESLint                                             |
| `bun run format`          | Format code with Prettier                              |
| `bun run test:e2e`        | Run the full Playwright E2E suite                       |
| `bun run test:a11y`       | Run accessibility tests only                            |
| `bun run test:lh`         | Run Lighthouse CI locally                               |
| `bun run test:responsive` | Run responsive-viewport regression tests                |
| `bun run seo:audit`       | Run the SEO audit script against a given URL             |
| `bun run smoke:prod`      | Run production smoke tests against a deployed URL        |

---

## ⚠️ Known Limitations

| Limitation                     | Details                                                                                                   |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **No backend / database**        | All user data (My Kit snippets, bookmarks, theme preference) is stored in the browser via `localStorage`. Clearing browser data or switching devices loses saved data. |
| **No user accounts**             | By design — everything works instantly with zero friction, but there's no cross-device sync.                |
| **Compatibility dataset is static** | The browser-support data in the Compatibility Checker is a curated local dataset, not a live API — it needs manual updates as browsers evolve. |
| **SSR + Nitro preview mismatch**  | `vite preview` doesn't currently serve the TanStack Start/Nitro server output correctly in this setup, so local E2E tests run against the dev server instead of a production build. |

---

## 🧩 Challenges & How I Solved Them

### 1. 🖥️ Keeping 30+ Tool Pages Consistent

With so many generator pages, keeping the UI, copy behavior, and code-output format consistent was a real risk. I solved this by extracting shared building blocks — `tool-header.tsx` for every tool's header, `sticky-code.tsx` for the persistent "copy code" panel, and a central `tools.ts` registry that every navigation surface (sidebar, homepage, sitemap) reads from — so adding a new tool means registering it once, not touching five different files.

### 2. 🧮 Building an Accurate CSS Specificity Parser

Writing a selector parser that correctly tokenizes `:not()`, `:is()`, `:where()` (which has zero specificity), attribute selectors, and compound selectors — without pulling in a heavy CSS parsing library — took several iterations. I built a small tokenizer in `specificity.ts` that walks the selector string, classifies each token, and accumulates the `a-b-c-d` specificity tuple, with dedicated handling for zero-specificity pseudo-classes.

### 3. 🔁 Automated Pass/Fail Checking for Practice Challenges

Practice challenges needed a way to verify a user's CSS solution automatically rather than just showing a static answer. I designed a check-runner that supports multiple matcher types (exact, substring, regex, numeric-with-tolerance) per challenge, so each challenge can validate the exact selector/property/value combination and return a clear per-check pass/fail table instead of a single opaque result.

### 4. 🌐 CI Testing Against a Stale Hardcoded URL

The CI pipeline originally ran Lighthouse CI against a hardcoded live URL that eventually went offline, breaking every single CI run regardless of code changes. I restructured the workflow so **Lighthouse/performance auditing runs separately**, as a manually-triggered `prod-audit.yml` workflow that accepts the real deployed URL as an input — decoupling the correctness of every-push CI from the uptime of any one external URL.

### 5. 🔗 Shareable Deep-Links for Interview Questions & Challenges

Users wanted to share a link directly to one interview question or practice challenge. I used TanStack Router's `validateSearch` to add typed `?q=<id>` / `?c=<id>` search params, and on mount, scroll to and highlight the matching card with an ephemeral ring animation — plus a "Copy link" button on every item that writes the full shareable URL to the clipboard.

### 6. 📱 Synced Scrolling Across Multiple Preview Iframes

The Responsive Preview Tester renders the same content in 4 separate iframes at different widths. Getting scroll position to stay in sync across all of them (without triggering an infinite feedback loop of scroll events) required carefully guarding each iframe's scroll listener so it ignores scroll events it triggered itself while mirroring the others.

---

## 📚 What I Learned

Working on this project pushed me deeper into several areas:

- **TanStack Start (SSR) + TanStack Router** — file-based routing, typed search params, and server-rendered routes in a real production app, beyond the more common Next.js/Vite SPA setup
- **Building a design-system-driven codebase at scale** — keeping 30+ near-identical tool pages consistent and maintainable through shared components and a central registry, instead of copy-pasting each one
- **Writing a CSS parser from scratch** — implementing specificity calculation without external dependencies deepened my understanding of the CSS cascade
- **CI/CD pipeline design** — structuring GitHub Actions so that fast, deterministic checks (lint, build, E2E) run on every push, while slower or environment-dependent checks (Lighthouse against a live URL) run separately and don't block development
- **Accessibility testing at scale** — integrating `axe-core` into Playwright to catch a11y regressions automatically across dozens of pages, not just spot-checking manually
- **SEO for a multi-route SSR app** — per-route meta tags, dynamic sitemap generation, JSON-LD structured data, and Core Web Vitals reporting done properly across 40+ routes

---

## 📬 Contact

**Pawan Tripathi**
GitHub: [@tripathipawan](https://github.com/tripathipawan)

---

> Built to make writing CSS faster, and to make learning it a little less painful. 🎨
