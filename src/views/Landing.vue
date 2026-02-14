<template>
  <div class="landing">
    <div class="landing__backdrop"></div>

    <header class="landing__header">
      <div class="brand">
        <div class="brand__mark">SP</div>
        <div>
          <p class="brand__name">StaffPoint</p>
          <p class="brand__tag">Employee Operations Suite</p>
        </div>
      </div>

      <nav class="landing__nav">
        <a href="#platform">Platform</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </nav>

      <div class="landing__actions">
        <router-link class="btn btn--ghost" to="/login">Sign in</router-link>
        <router-link class="btn btn--primary" to="/app/dashboard">Open app</router-link>
      </div>
    </header>

    <main class="landing__main">
      <section class="hero">
        <div class="hero__content">
          <p class="eyebrow">Built for modern people teams</p>
          <h1>All your employee workflows, designed to feel effortless.</h1>
          <p class="hero__lead">
            StaffPoint centralizes onboarding, attendance, leaves, and payroll into one source of truth with approval flows and audit-ready
            reporting.
          </p>
          <div class="hero__cta">
            <router-link class="btn btn--primary" to="/login">Launch dashboard</router-link>
            <button class="btn btn--outline" type="button" @click="openDemo">Watch demo</button>
          </div>
          <div class="hero__stats">
            <div class="stat">
              <p class="stat__value">48%</p>
              <p class="stat__label">faster approvals</p>
            </div>
            <div class="stat">
              <p class="stat__value">99.2%</p>
              <p class="stat__label">policy compliance</p>
            </div>
            <div class="stat">
              <p class="stat__value">12</p>
              <p class="stat__label">core workflows</p>
            </div>
          </div>
        </div>

        <div class="hero__panel">
          <div class="panel-card float">
            <div class="panel-card__header">
              <div>
                <p class="panel-card__title">Today</p>
                <p class="panel-card__subtitle">Operations overview</p>
              </div>
              <span class="chip chip--live">Live</span>
            </div>
            <div class="panel-card__body">
              <div class="panel-metric">
                <p>Clock-ins</p>
                <h3>186</h3>
                <span class="trend trend--up">+6% vs yesterday</span>
              </div>
              <div class="panel-metric">
                <p>Pending leaves</p>
                <h3>14</h3>
                <span class="trend">3 awaiting review</span>
              </div>
              <div class="panel-list">
                <p class="panel-list__title">Next approvals</p>
                <div class="panel-list__item">
                  <div>
                    <p class="name">Jordan Lee</p>
                    <p class="role">Engineering</p>
                  </div>
                  <span class="chip">Leave</span>
                </div>
                <div class="panel-list__item">
                  <div>
                    <p class="name">Ravi Patel</p>
                    <p class="role">Finance</p>
                  </div>
                  <span class="chip">Timesheet</span>
                </div>
              </div>
            </div>
          </div>
          <div class="panel-card panel-card--secondary float delay-2">
            <p class="panel-card__title">Compliance Center</p>
            <p class="panel-card__subtitle">Audit trails and export-ready logs.</p>
            <div class="bar">
              <span style="width: 82%"></span>
            </div>
            <p class="panel-card__note">82% of monthly audits already resolved.</p>
          </div>
        </div>
      </section>

      <section id="platform" class="section">
        <div class="section__header">
          <p class="eyebrow">Platform highlights</p>
          <h2>Everything HR needs from one command center.</h2>
        </div>
        <div class="feature-grid">
          <article class="feature-card">
            <h3>Employee intelligence</h3>
            <p>Maintain a living profile with role history, documents, and custom tags.</p>
          </article>
          <article class="feature-card">
            <h3>Attendance automation</h3>
            <p>Capture check-ins, overtime, and shift exceptions with live notifications.</p>
          </article>
          <article class="feature-card">
            <h3>Payroll visibility</h3>
            <p>Generate payslips, track deductions, and align policy changes per department.</p>
          </article>
          <article class="feature-card">
            <h3>Leave intelligence</h3>
            <p>Approve time off faster with contextual calendars, balances, and routing.</p>
          </article>
        </div>
      </section>

      <section class="section section--split">
        <div class="section__header">
          <p class="eyebrow">Customer proof</p>
          <h2>Teams replacing spreadsheets and scattered admin tools.</h2>
        </div>
        <div class="testimonials">
          <article class="quote-card">
            <p>
              "We moved 6 disconnected HR workflows into StaffPoint. Leave reviews and attendance corrections are now same-day."
            </p>
            <div>
              <strong>Angela M.</strong>
              <span>People Ops Lead, Northline Health</span>
            </div>
          </article>
          <article class="quote-card">
            <p>"Audit preparation went from two days to two hours because every action is already traceable."</p>
            <div>
              <strong>David R.</strong>
              <span>Compliance Manager, Millbrook Finance</span>
            </div>
          </article>
        </div>
      </section>

      <section id="pricing" class="section">
        <div class="section__header">
          <p class="eyebrow">Pricing</p>
          <h2>Plans that scale with your organization.</h2>
        </div>
        <div class="pricing-grid">
          <article class="price-card">
            <h3>Starter</h3>
            <p class="price">$39<span>/month</span></p>
            <p>For small teams getting organized.</p>
            <ul>
              <li>Up to 25 employees</li>
              <li>Attendance and leave workflows</li>
              <li>Email support</li>
            </ul>
            <router-link class="btn btn--ghost btn--full" to="/login">Get started</router-link>
          </article>
          <article class="price-card price-card--featured">
            <p class="pill">Most Popular</p>
            <h3>Growth</h3>
            <p class="price">$129<span>/month</span></p>
            <p>For scaling operations and approvals.</p>
            <ul>
              <li>Up to 200 employees</li>
              <li>Payslips and advanced reporting</li>
              <li>Audit logs and role permissions</li>
            </ul>
            <router-link class="btn btn--primary btn--full" to="/login">Start growth plan</router-link>
          </article>
          <article class="price-card">
            <h3>Enterprise</h3>
            <p class="price">Custom</p>
            <p>For multi-entity operations with strict controls.</p>
            <ul>
              <li>Unlimited employees</li>
              <li>Dedicated onboarding</li>
              <li>Priority and security reviews</li>
            </ul>
            <router-link class="btn btn--ghost btn--full" to="/login">Contact sales</router-link>
          </article>
        </div>
      </section>

      <section id="faq" class="section section--faq">
        <div class="section__header">
          <p class="eyebrow">FAQ</p>
          <h2>Common implementation questions.</h2>
        </div>
        <div class="faq-grid">
          <article class="faq-card">
            <h4>How long does setup take?</h4>
            <p>Most teams configure core attendance and leave flows in under one day.</p>
          </article>
          <article class="faq-card">
            <h4>Do you support role-based access?</h4>
            <p>Yes. Admin, manager, and employee roles can be extended with granular permissions.</p>
          </article>
          <article class="faq-card">
            <h4>Can we export reports?</h4>
            <p>Attendance and audit reports are exportable in CSV and PDF formats.</p>
          </article>
          <article class="faq-card">
            <h4>Is there an audit history?</h4>
            <p>Every sensitive action is tracked for compliance and internal accountability.</p>
          </article>
        </div>
      </section>

      <section class="section section--cta">
        <div>
          <p class="eyebrow">Security and trust</p>
          <h2>Control access, track actions, and stay compliant.</h2>
          <p class="section__lead">Granular permissions and audit logs make internal and external reviews straightforward.</p>
        </div>
        <div class="cta-card">
          <p class="cta-card__title">Ready to see StaffPoint live?</p>
          <p class="cta-card__subtitle">Sign in and explore the operations dashboard.</p>
          <router-link class="btn btn--primary" to="/login">Sign in to continue</router-link>
        </div>
      </section>
    </main>

    <div v-if="showDemo" class="demo-modal" @click.self="closeDemo">
      <div class="demo-modal__card">
        <button class="demo-modal__close" type="button" aria-label="Close demo" @click="closeDemo">x</button>
        <p class="eyebrow">Product walkthrough</p>
        <h3>Two-minute StaffPoint demo</h3>
        <p class="demo-modal__lead">Replace this embed URL with your product video when ready.</p>
        <div class="demo-frame">
          <iframe
            title="StaffPoint demo video"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showDemo = ref(false);

function openDemo() {
  showDemo.value = true;
}

function closeDemo() {
  showDemo.value = false;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap");

.landing {
  position: relative;
  min-height: 100vh;
  background: #060712;
  color: #f8fafc;
  overflow: hidden;
}

.landing__backdrop {
  position: absolute;
  inset: -40vh -20vw auto -20vw;
  height: 80vh;
  background:
    radial-gradient(circle at 15% 20%, rgba(255, 183, 77, 0.35), transparent 60%),
    radial-gradient(circle at 80% 10%, rgba(99, 102, 241, 0.45), transparent 55%),
    radial-gradient(circle at 50% 80%, rgba(56, 189, 248, 0.25), transparent 60%);
  filter: blur(10px);
  pointer-events: none;
}

.landing__header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 64px;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand__mark {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(140deg, #f59e0b, #fb7185);
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #080a18;
}

.brand__name {
  font-family: "Space Grotesk", "Manrope", "Segoe UI", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.brand__tag {
  margin: 0;
  font-size: 0.75rem;
  color: #cbd5f5;
}

.landing__nav {
  display: flex;
  gap: 24px;
  font-size: 0.9rem;
}

.landing__nav a {
  color: #cbd5f5;
  text-decoration: none;
}

.landing__actions {
  display: flex;
  gap: 12px;
}

.landing__main {
  position: relative;
  z-index: 1;
  padding: 40px 64px 80px;
  display: grid;
  gap: 96px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 48px;
  align-items: center;
}

.hero__content h1 {
  font-family: "Space Grotesk", "Manrope", "Segoe UI", sans-serif;
  font-size: clamp(2.6rem, 3vw, 3.6rem);
  line-height: 1.05;
  margin: 0 0 16px;
}

.hero__lead {
  color: #dbe4ff;
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 34rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.7rem;
  color: #f59e0b;
  font-weight: 600;
}

.hero__cta {
  margin-top: 28px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.btn--primary {
  background: linear-gradient(120deg, #fb7185, #f59e0b);
  color: #111827;
  box-shadow: 0 12px 30px rgba(251, 113, 133, 0.32);
}

.btn--ghost {
  border-color: rgba(226, 232, 240, 0.35);
  color: #e2e8f0;
}

.btn--outline {
  border-color: rgba(226, 232, 240, 0.35);
  color: #e2e8f0;
  background: rgba(15, 23, 42, 0.35);
}

.btn--full {
  width: 100%;
}

.btn:hover {
  transform: translateY(-1px);
}

.hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 36px;
}

.stat {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 16px;
  border-radius: 16px;
}

.stat__value {
  font-family: "Space Grotesk", "Manrope", "Segoe UI", sans-serif;
  font-size: 1.4rem;
  margin: 0 0 6px;
}

.stat__label {
  margin: 0;
  font-size: 0.8rem;
  color: #cbd5f5;
}

.hero__panel {
  display: grid;
  gap: 18px;
}

.panel-card {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 20px;
  padding: 18px 20px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.45);
}

.panel-card--secondary {
  background: rgba(30, 41, 59, 0.7);
}

.panel-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.panel-card__title {
  margin: 0;
  font-weight: 600;
}

.panel-card__subtitle {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: #cbd5f5;
}

.panel-card__body {
  display: grid;
  gap: 14px;
}

.panel-metric h3 {
  margin: 6px 0 2px;
  font-size: 1.4rem;
}

.trend {
  font-size: 0.75rem;
  color: #94a3b8;
}

.trend--up {
  color: #4ade80;
}

.panel-list__title {
  margin: 0 0 8px;
  font-size: 0.75rem;
  color: #94a3b8;
}

.panel-list__item {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.5);
}

.panel-list__item .name {
  margin: 0;
  font-weight: 600;
}

.panel-list__item .role {
  margin: 2px 0 0;
  font-size: 0.7rem;
  color: #94a3b8;
}

.chip {
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.7rem;
  background: rgba(148, 163, 184, 0.2);
  color: #e2e8f0;
}

.chip--live {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.bar {
  height: 8px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.2);
  overflow: hidden;
  margin: 14px 0 10px;
}

.bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #f472b6);
}

.panel-card__note {
  margin: 0;
  font-size: 0.8rem;
  color: #cbd5f5;
}

.section {
  display: grid;
  gap: 32px;
}

.section__header h2,
.section h2 {
  font-family: "Space Grotesk", "Manrope", "Segoe UI", sans-serif;
  margin: 0 0 12px;
  font-size: clamp(2rem, 2.4vw, 2.6rem);
}

.section__lead {
  max-width: 36rem;
  color: #dbe4ff;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.feature-card {
  background: rgba(15, 23, 42, 0.6);
  padding: 22px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.section--split {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
}

.testimonials {
  display: grid;
  gap: 16px;
}

.quote-card {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 20px;
  border-radius: 16px;
  display: grid;
  gap: 14px;
}

.quote-card p {
  margin: 0;
}

.quote-card span {
  display: block;
  margin-top: 4px;
  color: #cbd5f5;
  font-size: 0.85rem;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.price-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 18px;
  padding: 22px;
  display: grid;
  gap: 12px;
}

.price-card--featured {
  border-color: rgba(245, 158, 11, 0.7);
  box-shadow: 0 20px 50px rgba(245, 158, 11, 0.2);
}

.pill {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  color: #111827;
  background: #f59e0b;
  border-radius: 999px;
  padding: 5px 10px;
  width: fit-content;
}

.price {
  margin: 0;
  font-family: "Space Grotesk", "Manrope", "Segoe UI", sans-serif;
  font-size: 2rem;
}

.price span {
  font-size: 0.9rem;
  color: #cbd5f5;
}

.price-card ul {
  margin: 0;
  padding-left: 18px;
  color: #dbe4ff;
}

.section--faq .faq-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.faq-card {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 14px;
  padding: 16px;
}

.faq-card h4 {
  margin: 0 0 8px;
}

.faq-card p {
  margin: 0;
  color: #dbe4ff;
}

.section--cta {
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
  align-items: center;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 32px;
  border-radius: 24px;
}

.cta-card {
  background: rgba(6, 11, 27, 0.9);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  display: grid;
  gap: 14px;
}

.cta-card__title {
  margin: 0;
  font-weight: 600;
}

.cta-card__subtitle {
  margin: 0;
  color: #cbd5f5;
}

.demo-modal {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(2, 6, 23, 0.8);
  display: grid;
  place-items: center;
  padding: 20px;
}

.demo-modal__card {
  width: min(860px, 100%);
  background: #090f24;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 18px;
  padding: 24px;
  position: relative;
  animation: enter 0.25s ease;
}

.demo-modal__close {
  position: absolute;
  top: 10px;
  right: 12px;
  border: 0;
  background: transparent;
  color: #e2e8f0;
  font-size: 1.2rem;
  cursor: pointer;
}

.demo-modal__lead {
  color: #cbd5f5;
  margin-bottom: 12px;
}

.demo-frame {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  border-radius: 12px;
  overflow: hidden;
}

.demo-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.float {
  animation: float 9s ease-in-out infinite;
}

.delay-2 {
  animation-delay: 1.5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
}

@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1100px) {
  .landing__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pricing-grid {
    grid-template-columns: 1fr;
  }

  .section--split {
    grid-template-columns: 1fr;
  }

  .section--cta {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .landing__header {
    padding: 24px;
  }

  .landing__main {
    padding: 24px;
  }

  .landing__nav {
    flex-wrap: wrap;
  }

  .hero__stats {
    grid-template-columns: 1fr;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .section--faq .faq-grid {
    grid-template-columns: 1fr;
  }
}
</style>
