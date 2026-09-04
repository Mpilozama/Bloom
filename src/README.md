# Bloom 🌱

### Wellbeing that works for the person — not the streak.

Bloom is an adaptive wellbeing companion designed to help people make meaningful improvements to their overall wellbeing without turning self-care into another responsibility.

Most wellness apps depend heavily on users continuously reporting how they feel, what they did, and whether they completed their goals. But self-reported data is not always reliable. People can forget, misjudge themselves, answer differently depending on their mood, or change their answers simply because they want to maintain a streak.

Bloom explores a different approach:

> **Don't treat every piece of user input as absolute truth. Treat it as a signal.**

The goal is not to keep people inside the app.

The goal is to help them become healthier, more aware, and more capable of taking care of themselves **outside of the app**.

---

## 🧠 The Problem

Improving wellbeing is not one-dimensional.

A person's overall wellbeing can be influenced by areas such as:

* Mental and emotional health
* Physical activity
* Sleep and recovery
* Social connection
* Stress
* Daily routines
* Environment
* Sense of purpose and fulfillment

Yet many wellness applications reduce this complexity to simple inputs such as:

> "How are you feeling today?"

or:

> "Did you complete your habit?"

That creates two major problems.

### 1. Self-reported data isn't always reliable

Users may provide inaccurate information because they:

* Forget what actually happened
* Misinterpret their own state
* Don't want to acknowledge that they are struggling
* Give answers they think the application expects
* Change answers to maintain progress or streaks
* Simply don't have enough awareness to accurately assess themselves

When an application blindly trusts those inputs, its recommendations can be built on an inaccurate picture of the user.

### 2. Wellness can become another obligation

Streaks and constant check-ins are designed to increase engagement.

But engagement is not the same thing as wellbeing.

A user may eventually interact with an application because they don't want to:

> "Lose their streak."

rather than because the interaction is actually helping them.

Bloom therefore treats **meaningful improvement as the objective — not maximum app usage.**

---

# 💡 The Bloom Approach

Bloom is built around three ideas.

### 01 — Wellbeing is multidimensional

Instead of reducing wellbeing to a single score, Bloom considers different aspects of a person's life and looks for areas that may need attention.

### 02 — User input is a signal, not unquestionable truth

Bloom is designed around uncertainty.

A user's answer is valuable, but it should not automatically be treated as a perfect representation of their wellbeing.

When information conflicts, becomes outdated, or appears unreliable, the system can seek additional context rather than confidently making assumptions.

### 03 — Engagement should serve the user

Bloom does not use streaks as the primary motivation.

The purpose of an interaction is to help the person take a meaningful step toward better wellbeing.

If someone needs the application less over time because they are doing better, **that is a successful outcome.**

---

# 🌱 How It Works

At a high level, Bloom follows an adaptive loop:

```text
        ┌─────────────────┐
        │      User       │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  Low-friction   │
        │     signals     │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Signal analysis │
        │  + uncertainty  │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Identify areas  │
        │  needing focus  │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │   Personalized  │
        │   next action   │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ User experiences│
        │   the action    │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ New information │
        │     / signal    │
        └────────┬────────┘
                 │
                 └──────────────► Adapt
```

Rather than repeatedly asking the same questions, Bloom aims to learn from the **pattern of signals over time**.

The system can then decide when it has enough confidence to recommend something and when it needs more information.

---

# 🔎 Handling Uncertainty

One of Bloom's core design principles is that the system should be careful about claiming to know something it cannot actually know.

For example:

```text
User input:
"I'm feeling fine."

Recent signals:
- Very low activity
- Poor sleep
- Repeatedly abandoned activities
- Increasingly negative reflections

Instead of:

"You are struggling."

Bloom should recognize:

"The available signals don't fully agree."
```

This distinction matters.

Bloom is not intended to diagnose a user or determine their mental-health condition.

It is intended to recognize **uncertainty** and respond cautiously.

---

# 🎯 Meaningful Engagement

Bloom intentionally avoids making the user's primary goal:

> "Use Bloom every day."

Instead, the goal is:

> **"Use Bloom when it can help you make a meaningful change."**

That means avoiding mechanics such as:

* ❌ Daily streak pressure
* ❌ Punishment for missed days
* ❌ Engagement-based guilt
* ❌ Artificial productivity scores
* ❌ Endless check-ins
* ❌ Rewards that encourage using the app instead of improving yourself

Instead, Bloom focuses on:

* ✅ Small actionable interventions
* ✅ Personalized recommendations
* ✅ Reflection and awareness
* ✅ Multiple dimensions of wellbeing
* ✅ Confidence-aware interpretation
* ✅ Progress that belongs to the user

---

# 🛡️ Safety & Responsibility

Bloom is a wellbeing prototype, **not a medical device or replacement for professional healthcare.**

The system should never:

* Diagnose mental-health conditions
* Present uncertain inferences as facts
* Claim that an intervention will medically treat a condition
* Encourage users to replace professional support with the application
* Use sensitive information unnecessarily

Any future AI functionality should be designed with:

* Explicit uncertainty
* Conservative recommendations
* Clear boundaries
* Privacy by design
* Human-readable explanations
* Appropriate escalation guidance for high-risk situations

The application should be especially careful when dealing with potentially sensitive mental-health information.

---

# 🏗️ Architecture

The prototype is built with a lightweight web architecture.

```text
React Frontend
      │
      ├── User Interface
      ├── Wellbeing Signals
      ├── Recommendation Logic
      ├── Bloom Companion
      └── Progress Visualization
              │
              ▼
       Local / Application Data
```

### Current technology

* **React** — user interface and application state
* **Vite** — development and build tooling
* **JavaScript** — application logic
* **Tailwind CSS** — interface styling
* **localStorage** — lightweight client-side persistence

The architecture is intentionally simple for the prototype, and it already implements the recommendation/AI split the concept calls for, on purpose:

* **`service/ai.js`** — the only place that talks to an LLM. It carries an ongoing conversation with Bloom (not a single fire-and-forget reply) and only shapes *tone and continuity*. Its system prompt hard-codes the same rules as the README's Safety & Responsibility section: never diagnose, never claim certainty, never guilt. If no API key is configured, or the request fails, it falls back to a still-honest canned response instead of breaking.
* **`service/signals.js`** — a small, deterministic, fully local function that checks whether a check-in agrees with the person's recent pattern, using more than one dimension: the trend in recent feeling severity *and* how many recent activities were opened and abandoned (the README's own worked example, implemented literally). This is the safety-relevant judgment call, and it deliberately does **not** go through the model — it's plain, readable logic anyone can audit, not a black box. It never says "you're struggling" — only that the signals don't fully agree, exactly as the README specifies.
* **`components/garden/Garden.jsx`** — the visual payoff of "meaningful engagement, not streaks": the garden grows with the number of real moments a person has shared, not with consecutive daily logins. Every stage's message is written to be encouraging, including stage zero — a new garden is never framed as behind.
* **`service/world.js`** — the garden isn't just a screen that appears when opened. It runs on real wall-clock time (the sky actually reflects day, dusk, or night), and it remembers roughly how long you've been away and gives you a short, honest note about it when you return. There's no server, so nothing literally animates while the tab is closed — but the world reflects real time rather than only reacting to clicks, and it's the reason the app feels continuous instead of dormant between visits. This layer is kept intentionally separate from `signals.js`: it's flavor for the world, never a signal about the person.

### Known limitation

The OpenAI key is read client-side via a Vite env var, which means it ends up in the shipped JS bundle. That's acceptable for a hackathon prototype but not for production — a real deployment would proxy the request through a small backend so the key never reaches the browser.

---

# 📁 Project Structure

```text
bloom/
├── public/
│   └── assets/
│       └── Bloom.svg
│
├── src/
│   ├── components/
│   │   ├── garden/
│   │   │   ├── Garden.jsx
│   │   │   └── GardenState.js
│   │   │
│   │   └── ActivityHistory.jsx
│   │
│   ├── App.jsx
│   └── ...
│
├── package.json
├── vite.config.js
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

* Node.js
* npm
* Git

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/bloom.git
```

Navigate to the project:

```bash
cd bloom
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite.

---

# 🧪 Prototype Scope

This project is currently a **hackathon prototype**.

The prototype focuses on demonstrating the central product direction rather than presenting a clinically validated wellbeing system.

The long-term concept requires considerably more work, including:

* Evidence-informed intervention design
* Better wellbeing signal collection
* Confidence and uncertainty modelling
* Evaluation of conflicting user inputs
* Personalization
* Safety testing
* Accessibility testing
* User research
* Outcome evaluation
* Privacy and data protection work

The most important next step is not simply adding more features.

It is determining whether Bloom's approach **actually helps people improve their wellbeing in real-world use.**

---

# 🔮 Future Vision

Bloom could eventually evolve into a system that builds a cautious, continuously updated understanding of a person's wellbeing without requiring them to complete a daily questionnaire.

Instead of asking:

> "How are you today?"

every day, Bloom could learn from occasional, meaningful interactions and identify when something may deserve attention.

For example:

```text
        Multiple Signals
               │
               ▼
      ┌─────────────────┐
      │ Confidence /    │
      │ consistency     │
      │ analysis        │
      └────────┬────────┘
               │
       ┌───────┴────────┐
       │                │
    Confident       Uncertain
       │                │
       ▼                ▼
 Recommend          Ask for
 next action        context
       │                │
       └───────┬────────┘
               ▼
        Meaningful action
               │
               ▼
          User outcome
```

The long-term vision is not another application that tells people to check in every morning.

It is a **support system that helps people understand themselves better and make better choices for their wellbeing.**

---

# 🏆 Hackathon Context

Bloom was created for **Hack for Humanity | Summer 2026**, focused on technology addressing challenges in mental and physical health.

The project explores the intersection of:

* Mental wellbeing
* Human-centered design
* Responsible AI
* Adaptive personalization
* Data uncertainty
* Privacy
* Sustainable engagement

The central question behind Bloom is:

> **Can technology help people improve their wellbeing without making wellbeing itself another task they have to maintain?**

---

# 📌 Project Status

**Status:** Hackathon prototype 🚧

Bloom is an ongoing experiment in building technology that prioritizes the user's wellbeing over the application's engagement metrics.

The prototype demonstrates the direction.

The larger vision requires further research, testing, and iteration.

---

## 🌱 Philosophy

> **The app should work for you.
> You shouldn't have to work for the app.**
