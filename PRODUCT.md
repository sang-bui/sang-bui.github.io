# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience is broad and intentionally not narrowed to one lane: employers/recruiters, graduate program admissions readers and potential advisors, classmates and instructors in this course, and general visitors who land on the site. The site is not optimized to convert one audience at the expense of the others.

## Product Purpose

A personal website for Sang Bui (CS + Data Science, Colorado School of Mines, graduating Dec 2026) that presents real research and engineering work honestly. Success means a visitor comes away with an accurate, credible picture of the work and can find a way to reach out or learn more, not a generic "AI slop" portfolio template.

## Positioning

Breadth across three real, evidenced strands rather than a single narrow specialization:

- Autonomy & robotics research (SLAM benchmarking work at the ARIA lab, a LiDAR SLAM evaluation contract for an automotive client, an incoming Satellite Systems Engineer Associate role at Lockheed Martin Space)
- Applied data science (NSF NCAR Climate Data Guide internship: PDSI reimplementation, a 124-year global drought dataset, SPI/SPEI drought-penalty findings; cloud-gaming resource-utilization security research)
- Full-stack + applied AI engineering (Qualcomm field session: a GenAI analytics app translating natural language to SQL/visualizations, React/TypeScript + FastAPI, LangChain/LangGraph, local-vector-store RAG, Docker)

A neighboring "CS student" site could not truthfully claim this combination of published/preserved research artifacts (a DOI-registered poster, an NSF NCAR Climate Data Guide entry), an accepted engineering offer, and a shipped full-stack AI application.

## Operating Context

Purpose is deliberately kept open between job-search and graduate-school framing; the student has an accepted offer (Lockheed Martin Space, expected June 2027 start) but is also weighing graduate school, so the site should not commit hard to either narrative.

## Capabilities and Constraints

- Public repo (`<username>.github.io`): no phone number, no home address, no other people's photos without permission, no API keys or secrets.
- Content must be traceable to real, confirmed facts (resume, research outputs, course record). No invented testimonials, employers, benchmarks, or claims.
- Recommended stack is plain HTML/CSS (already in place from the P1 template); nothing to build or install.
- Source material (resume, private recommendation-letter notes) lives in this working copy only and is gitignored; never quote the recommendation notes' private framing (e.g. specific grad-application strategy) on the public site, only facts that also appear on the resume or are otherwise safe to publish.
- GPA is not published on the site (student preference); education section names the degree, specialization, school, and dates only.

## Brand Commitments

Name: Sang Bui. No existing visual identity, logo, or fixed voice to preserve; this is a from-scratch build on the P1 template.

## Evidence on Hand

Real, usable content from `Resume.pdf` (gitignored, local only):

- Education: B.S. Computer Science, Data Science specialization, Colorado School of Mines, Aug 2023 - Dec 2026, GPA 3.662. Honors: C-MAPP Scholar (2x), MURF Scholar (2x), SURF Scholar, FIRST Scholar.
- Research: SLAM & Autonomy Research Assistant (ARIA Lab, Nov 2023 - May 2026); Climate Data Guide Data Science Intern (NSF NCAR, Jun 2025 - May 2026); Computer Resource Utilization Research Assistant (CS@Mines, Sep 2023 - May 2025).
- Professional: Technical Consultant, GenAI Analytics Systems (Qualcomm Field Session, May-Jun 2026); SLAM Research Contractor (Spexal SARL, Feb-Jul 2025); Foundational Programming Concepts TA (CS@Mines, Aug 2024-Dec 2025, May 2026-present). Note: an incoming Satellite Systems Engineer Associate role at Lockheed Martin Space was on the resume but removed from the site at the student's explicit request; don't reintroduce it without asking.
- Research outputs: "The Temperature Penalty" (poster, Mines/NSF NCAR); "Benchmarking and exploiting resource utilization in cloud gaming" (poster, DOI 10.25676/11124/180538); "Palmer Drought Severity Index (PDSI)" (NSF NCAR Climate Data Guide, Oct 2025).
- Professional development: MATE FLOATS Marine Technology Workshop (Univ. of Washington, Aug 2025).
- Technical skills: Python, C++, SQL, Java, R, Bash, TypeScript; NumPy/pandas/SciPy/scikit-learn/TensorFlow/Dask/xarray/NetCDF/OpenCV/EVO; FastAPI/Flask/React/LangChain/LangGraph/RAG/vector databases; Git/Docker/Linux/Conda/HPC/Jupyter/JIRA.

A real headshot photo (`images/headshot.jpg`) was later provided by the student and is live in the sidebar; still never fabricate a headshot or stock imagery for any other purpose.

## Product Principles

1. Plain, honest, and evidenced beats polished and vague, this is what P1 is graded on.
2. Breadth is the pitch: don't force a single narrow specialization the student hasn't chosen.
3. Never state or imply a claim the resume or research record can't back up.
4. Never publish contact info beyond what the student explicitly approves (e.g. email), given the repo is public.
5. Keep job-search and grad-school framing both open; don't over-commit the copy to one path.

## Accessibility & Inclusion

No student-specific requirement established; general web accessibility practice (semantic HTML, sufficient contrast, alt text) applies as a baseline.
