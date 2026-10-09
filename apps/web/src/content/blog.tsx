import type { ReactNode } from "react";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  dateISO: string;
  category: string;
  readTime: string;
  body: ReactNode;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "automate-job-search-without-losing-the-personal-touch",
    title: "How to automate your job search without losing the personal touch",
    excerpt:
      "Automation should handle the repetitive work, not the relationships. Here is how to keep every application feeling personal while the busywork runs itself.",
    dateLabel: "June 18, 2026",
    dateISO: "2026-06-18",
    category: "Strategy",
    readTime: "5 min read",
    body: (
      <>
        <p>
          The fear with job-search automation is obvious: you send 200 identical applications and hear back from none of
          them. That is not automation — that is spam. Done well, automation removes the repetitive parts so you can
          spend your energy where it actually moves the needle.
        </p>
        <h2>Automate the logistics, personalize the story</h2>
        <p>
          Let software handle the tracking, the reminders, and the first draft. You keep ownership of the two things
          recruiters notice: why this company, and why you.
        </p>
        <ul>
          <li>Use templates for structure, then edit the opening line for every role.</li>
          <li>Feed the job description into your cover-letter draft so keywords line up naturally.</li>
          <li>Let follow-ups fire automatically, but write the first one yourself.</li>
        </ul>
        <h2>Keep a single source of truth</h2>
        <p>
          When every role, contact, and note lives on one board, you stop losing track of who you spoke to and when. That
          memory is what makes a follow-up feel informed instead of automated.
        </p>
        <blockquote>
          The goal is not more applications. It is more applications that look like you wrote each one by hand.
        </blockquote>
        <p>
          Start by automating one workflow — follow-ups are the easiest win — and add the next only once the first is
          running cleanly.
        </p>
      </>
    ),
  },
  {
    slug: "ats-friendly-resume-tips-that-actually-matter",
    title: "5 ATS-friendly resume tips that actually matter",
    excerpt:
      "Most applicant tracking systems are simpler than the internet suggests. These five habits prevent the parsing problems that really cost you interviews.",
    dateLabel: "May 30, 2026",
    dateISO: "2026-05-30",
    category: "Resumes",
    readTime: "4 min read",
    body: (
      <>
        <p>
          You do not need to outsmart an ATS — you need to avoid confusing it. Parsing failures are almost always caused
          by the same handful of formatting choices.
        </p>
        <h2>1. Use a single-column layout</h2>
        <p>
          Tables, text boxes, and multi-column designs are read out of order. A plain single column keeps your experience
          in the sequence a recruiter expects.
        </p>
        <h2>2. Standard section headings</h2>
        <ul>
          <li>Experience, Education, Skills — not clever alternatives like “Where I’ve Made An Impact”.</li>
          <li>Put dates in a consistent <code>MM/YYYY</code> format.</li>
        </ul>
        <h2>3. Mirror the job description’s keywords</h2>
        <p>
          Match the terms the employer uses. If they say “TypeScript”, do not only write “TS”. Run an ATS score before
          you apply to catch the gaps.
        </p>
        <h2>4. Skip images and icons for critical info</h2>
        <p>Contact details and section labels should be real text, not graphics.</p>
        <h2>5. Export to PDF from a text-based source</h2>
        <p>
          A PDF exported from a real document stays selectable. A scan or an image-based export does not.
        </p>
      </>
    ),
  },
  {
    slug: "the-follow-up-email-that-gets-replies",
    title: "The follow-up email that actually gets replies",
    excerpt:
      "A short, specific follow-up beats a long, polite one every time. Here is a template you can adapt in two minutes.",
    dateLabel: "May 12, 2026",
    dateISO: "2026-05-12",
    category: "Outreach",
    readTime: "3 min read",
    body: (
      <>
        <p>
          Most candidates either never follow up or send a wall of text. The middle path — short, specific, and easy to
          answer — is what gets responses.
        </p>
        <h2>The structure</h2>
        <ul>
          <li>One line of context: the role and when you applied.</li>
          <li>One line of value: something concrete you bring.</li>
          <li>One clear, low-effort question.</li>
        </ul>
        <h2>The template</h2>
        <blockquote>
          Hi [Name], I applied for [Role] on [date] and wanted to add one thing: [specific reason you fit]. Is there
          anything else you need from me to move my application forward?
        </blockquote>
        <p>
          Send it 5–7 days after applying, then once more a week later. After that, let it rest. Automation makes the
          timing effortless so you never have to remember.
        </p>
      </>
    ),
  },
  {
    slug: "from-40-applications-a-week-to-5-minutes-a-day",
    title: "From 40 applications a week to 5 minutes a day",
    excerpt:
      "A practical weekly rhythm for running a high-volume search without burning out — and the automations that make it possible.",
    dateLabel: "April 24, 2026",
    dateISO: "2026-04-24",
    category: "Productivity",
    readTime: "6 min read",
    body: (
      <>
        <p>
          High-volume searching fails when it becomes a second job. The fix is a repeatable rhythm: a short daily
          check-in and one longer weekly session.
        </p>
        <h2>The daily 5 minutes</h2>
        <ul>
          <li>Clear the follow-ups the system queued for today.</li>
          <li>Add any new roles that came in.</li>
          <li>Move cards forward on the board.</li>
        </ul>
        <h2>The weekly hour</h2>
        <p>
          Batch your tailoring: pick the roles closest to your goals, generate document drafts, run ATS scores, and send.
          Everything else stays on autopilot.
        </p>
        <blockquote>
          Consistency beats intensity. Five focused minutes every day outperforms a panicked Sunday of applications.
        </blockquote>
        <p>
          Set the rhythm once, let the reminders enforce it, and your pipeline keeps moving even on busy weeks.
        </p>
      </>
    ),
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
