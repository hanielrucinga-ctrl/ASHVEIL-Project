import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Shell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { DEFAULT_ABOUT_STORY, getAboutStory } from "@/lib/site-content-fns";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  const story = useQuery({
    queryKey: ["about-story"],
    queryFn: () => getAboutStory(),
    placeholderData: DEFAULT_ABOUT_STORY,
  });

  return (
    <Shell>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <div className="rounded-[2rem] border border-white/40 bg-[rgba(255,255,255,0.12)] p-5 shadow-[0_20px_60px_rgba(17,17,17,0.08)] backdrop-blur-2xl md:p-8">
          <h1 className="text-2xl uppercase tracking-[0.24em]">About</h1>
          <img src="/logo.png" alt="Ashveil" className="mx-auto my-8 h-auto w-full max-w-sm object-contain outline-none" />
          {story.isError ? (
            <div role="alert" className="text-sm text-danger">
              <p>The story could not be loaded. Check your connection and try again.</p>
              <Button variant="outline" className="mt-3" onClick={() => void story.refetch()}>
                Try again
              </Button>
            </div>
          ) : (
            <div className="space-y-5 text-sm leading-relaxed text-muted">
              {(story.data ?? DEFAULT_ABOUT_STORY).split(/\n\s*\n/).map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`} className={index === 0 ? "text-fg" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </article>
    </Shell>
  );
}
