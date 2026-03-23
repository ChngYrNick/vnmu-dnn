# Component Patterns

HTML patterns for all UI components. CSS lives in `base.css` — these are the markup templates.

All components use semantic HTML and accessibility attributes. When creating a new page, compose from these patterns and extract into `bs-` prefixed Nunjucks partials when reused across 2+ pages.

## Page Shell

Pages extend the base layout, which links to `main.css` via `scripts/main.js`. No inline `<style>` blocks.

```html
{% extends "layouts/base.html" %}

{% block content %}
{% include "partials/bs-skip-link.html" %}
{% include "partials/bs-masthead.html" %}
{% include "partials/bs-nav.html" %}

<main id="main-content" hx-boost="true" preload preload-images="true">
  <div class="page">
    <!-- page content -->
  </div>
</main>

{% include "partials/bs-footer.html" %}
{% endblock %}
```

## Skip Link — `partials/bs-skip-link.html`

First focusable element on every page. Hidden until focused.

```html
<a href="#main-content" class="skip-link">Skip to content</a>
```

## Masthead — `partials/bs-masthead.html`

```html
<header class="masthead">
  <div class="page">
    <div class="masthead-title">{{ t('title') }}</div>
    <p class="masthead-sub">{{ t('meta.description') }}</p>
  </div>
</header>

<div class="page">
  <div class="dateline">
    <span>{{ i18n.resolvedLanguage | upper }} Edition</span>
    <span>VNMU — M.I. Pirogov</span>
  </div>
</div>
```

## Section Navigation — `partials/bs-nav.html`

```html
<div class="page">
  <nav class="section-nav" aria-label="Section navigation">
    <a href="/" {% if page === 'Home' %}aria-current="page"{% endif %}>
      {{ t('nav.home') }}
    </a>
    <a href="/about" {% if page === 'About' %}aria-current="page"{% endif %}>
      {{ t('nav.about') }}
    </a>
    <a href="/staff" {% if page === 'Staff' %}aria-current="page"{% endif %}>
      {{ t('nav.staff') }}
    </a>
    <a href="/news?page=1" {% if page === 'News' %}aria-current="page"{% endif %}>
      {{ t('nav.news') }}
    </a>
    <a href="/student" {% if page === 'Student' %}aria-current="page"{% endif %}>
      {{ t('nav.student') }}
    </a>
    <a href="/intern" {% if page === 'Intern' %}aria-current="page"{% endif %}>
      {{ t('nav.intern') }}
    </a>
    <a href="/listener" {% if page === 'Listener' %}aria-current="page"{% endif %}>
      {{ t('nav.listener') }}
    </a>
    <a href="/syllabus" {% if page === 'Syllabus' %}aria-current="page"{% endif %}>
      {{ t('nav.syllabus') }}
    </a>
    <a href="/literature" {% if page === 'Literature' %}aria-current="page"{% endif %}>
      {{ t('nav.literature') }}
    </a>
  </nav>
</div>
```

## Headline / Hero

```html
<section class="headline">
  <h1>{{ t('pages.home.hero.title') }}</h1>
  <p class="lead">{{ t('pages.home.hero.description') }}</p>
  <a href="/about" class="learn-more">{{ t('pages.home.hero.learnMore') }} →</a>
</section>
```

## Two-Column Layout

```html
<div class="columns">
  <main class="col-main">
    <!-- primary content -->
  </main>

  <aside class="col-side">
    <!-- sidebar content -->
  </aside>
</div>
```

When `<main>` is used inside columns (e.g. homepage), keep `id="main-content"` on the outer wrapper instead.

## Section Label

```html
<h2 class="col-label">{{ t('pages.home.news.title') }}</h2>
```

Always use a heading element (`<h2>`, `<h3>`) for section labels — not a `<div>`. This maintains heading hierarchy for screen readers.

## Article Card — `partials/bs-article.html`

```html
<article class="article">
  <h3>
    <a href="/news?page=1#{{ item.slug }}">{{ item.title }}</a>
  </h3>
  <time class="byline" datetime="{{ item.publishedAt }}">
    {{ formatDate(item.publishedAt, i18n.resolvedLanguage) }}
  </time>
  <p>{{ truncate(striptags(item.data), 180) }}</p>
  <a href="/news?page=1#{{ item.slug }}" class="read-more"
    aria-label="{{ t('pages.home.news.continue') }} — {{ item.title }}">
    {{ t('pages.home.news.continue') }}
  </a>
</article>
```

Notes:
- Use `<time>` with `datetime` for machine-readable dates
- `aria-label` on "Continue reading" links disambiguates them for screen readers

## Article List with HTMX

```html
<div id="news-list" aria-live="polite">
  {% if data.news.length === 0 %}
    <p class="no-content">{{ t('pages.home.news.noNews') }}</p>
  {% else %}
    {% for item in data.news %}
      {% include "partials/bs-article.html" %}
    {% endfor %}

    <a href="/news?page=1" class="btn">{{ t('pages.home.news.viewAll') }}</a>
  {% endif %}
</div>
```

## Sidebar Link List

```html
<nav aria-label="{{ t('pages.home.sidebar.quickLinks.title') }}">
  <h2 class="col-label">{{ t('pages.home.sidebar.quickLinks.title') }}</h2>

  {% if data.quickLinks.length === 0 %}
    <p class="no-content">{{ t('pages.home.sidebar.quickLinks.noLinks') }}</p>
  {% else %}
    <ul class="sidebar-links">
      {% for link in data.quickLinks %}
        <li><a href="{{ link.url }}">{{ link.name }}</a></li>
      {% endfor %}
    </ul>
  {% endif %}
</nav>
```

## Form — Sign-in Example

```html
<div class="form-card">
  <h1 class="form-title">{{ t('pages.signIn.logIn') }}</h1>
  <p class="form-sub">{{ t('pages.signIn.fillInfo') }}</p>

  {% if error %}
    <div class="alert" role="alert">{{ error }}</div>
  {% endif %}

  <form action="/sign-in" method="post" hx-boost="true">
    <div class="field">
      <label for="email">{{ t('pages.signIn.email') }}</label>
      <input type="email" id="email" name="email"
        placeholder="{{ t('pages.signIn.enterEmail') }}"
        required aria-required="true"
        {% if error %}aria-describedby="form-error"{% endif %} />
    </div>

    <div class="field">
      <label for="password">{{ t('pages.signIn.password') }}</label>
      <input type="password" id="password" name="password"
        placeholder="{{ t('pages.signIn.enterPassword') }}"
        required aria-required="true" />
    </div>

    <button type="submit" class="btn btn-primary">
      {{ t('pages.signIn.signIn') }}
    </button>

    <p class="form-footer">
      {{ t('pages.signIn.goSignUp') }}
      <a href="/sign-up">{{ t('pages.signIn.signUp') }}</a>
    </p>
  </form>
</div>
```

## Staff Grid

```html
<section aria-label="{{ t('nav.staff') }}">
  {% if data.staff.length === 0 %}
    <p class="no-content">{{ t('pages.staff.noStaff') }}</p>
  {% else %}
    <div class="staff-grid">
      {% for member in data.staff %}
        <article class="staff-card">
          {% if member.profilePicture %}
            <img src="{{ member.profilePicture.path }}"
              alt="{{ member.name }}"
              class="staff-photo" />
          {% endif %}

          <h3 class="staff-name">{{ member.name }}</h3>

          {% if member.position %}
            <p class="staff-position">{{ member.position }}</p>
          {% endif %}

          {% if member.email %}
            <p class="staff-contact">
              <a href="mailto:{{ member.email }}">{{ member.email }}</a>
            </p>
          {% endif %}

          {% if member.phone %}
            <p class="staff-contact">
              <a href="tel:{{ member.phone }}">{{ member.phone }}</a>
            </p>
          {% endif %}
        </article>
      {% endfor %}
    </div>
  {% endif %}
</section>
```

## Pagination — `partials/bs-pagination.html`

```html
<nav class="pagination" aria-label="Pagination">
  {% if data.pagination.hasPrev %}
    <a href="/news?page={{ currentPage - 1 }}" class="page-link">
      {{ t('pages.news.previous') }}
    </a>
  {% else %}
    <span class="page-link" aria-disabled="true">
      {{ t('pages.news.previous') }}
    </span>
  {% endif %}

  {% for pageNum in range(1, data.pagination.totalPages + 1) %}
    <a href="/news?page={{ pageNum }}" class="page-link"
      {% if pageNum === currentPage %}aria-current="page"{% endif %}>
      {{ pageNum }}
    </a>
  {% endfor %}

  {% if data.pagination.hasNext %}
    <a href="/news?page={{ currentPage + 1 }}" class="page-link">
      {{ t('pages.news.next') }}
    </a>
  {% else %}
    <span class="page-link" aria-disabled="true">
      {{ t('pages.news.next') }}
    </span>
  {% endif %}
</nav>
```

## Footer — `partials/bs-footer.html`

```html
<footer class="footer">
  <div class="page">
    <p>{{ t('footer.copyright', { year: 2026 }) }}</p>
  </div>
</footer>
```

## HTMX Patterns

### Filter with partial swap

```html
<select name="course"
  hx-get="/student"
  hx-target="#course-content"
  hx-swap="innerHTML"
  hx-push-url="true"
  hx-indicator="#loading">
  <option value="">{{ t('pages.student.selectCourse') }}</option>
</select>

<span id="loading" class="htmx-indicator" aria-hidden="true"
  style="color: var(--fg-light); font-size: 0.8rem;">
  Loading...
</span>

<div id="course-content" aria-live="polite">
  <!-- swapped content -->
</div>
```

### Paginated load

```html
<div id="news-list" aria-live="polite"
  hx-get="/news?page={{ currentPage + 1 }}"
  hx-trigger="revealed"
  hx-swap="afterend"
  hx-indicator="#loading">
  <!-- news articles -->
</div>
```
