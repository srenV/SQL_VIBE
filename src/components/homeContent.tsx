"use client";

import { Container } from "@/components/container";
import { FadeIn } from "@/components/animations";
import { FeatureCard } from "@/components/featureCard";

export interface HomeContentProps {
  headline: string;
  subheadline: string;
  sectionTitle: string;
  sectionSubtitle: string;
  practiceTitle: string;
  practiceDescription: string;
  practiceCta: string;
  storyTitle: string;
  storyDescription: string;
  storyCta: string;
  sandboxTitle: string;
  sandboxDescription: string;
  sandboxCta: string;
  learnTitle: string;
  learnDescription: string;
  learnCta: string;
}

export function HomeContent({
  headline,
  subheadline,
  sectionTitle,
  sectionSubtitle,
  practiceTitle,
  practiceDescription,
  practiceCta,
  storyTitle,
  storyDescription,
  storyCta,
  sandboxTitle,
  sandboxDescription,
  sandboxCta,
  learnTitle,
  learnDescription,
  learnCta,
}: HomeContentProps) {
  return (
    <>
      <section className="py-20 text-center bg-linear-to-b from-primary-50/50 to-transparent dark:from-primary-950/30 dark:to-transparent">
        <Container className="space-y-6 max-w-4xl mx-auto">
          <FadeIn delay={0}>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
              {headline}
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-lg sm:text-xl text-ink-muted max-w-2xl mx-auto">
              {subheadline}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Feature-Cards */}
      <section className="py-16 bg-surface-dim/30">
        <Container className="space-y-8 max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ink">{sectionTitle}</h2>
            <p className="mt-2 text-ink-muted">
              {sectionSubtitle}
            </p>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              href="/lektionen"
              title={practiceTitle}
              description={practiceDescription}
              cta={practiceCta}
              colorTheme="primary"
              icon={
                <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>
              }
            />
            <FeatureCard
              href="/story"
              title={storyTitle}
              description={storyDescription}
              cta={storyCta}
              colorTheme="violet"
              icon={
                <svg className="w-10 h-10 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 2v2" />
                  <path d="M17.915 22a6 6 0 0 0-12 0" />
                  <path d="M8 2v2" />
                  <circle cx="12" cy="12" r="4" />
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                </svg>
              }
            />
            <FeatureCard
              href="/sandbox"
              title={sandboxTitle}
              description={sandboxDescription}
              cta={sandboxCta}
              colorTheme="accent"
              icon={
                <svg className="w-10 h-10 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              }
            />
            <FeatureCard
              href="/lernen"
              title={learnTitle}
              description={learnDescription}
              cta={learnCta}
              colorTheme="amber"
              icon={
                <svg className="w-10 h-10 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              }
            />
          </div>
        </Container>
      </section>
    </>
  );
}