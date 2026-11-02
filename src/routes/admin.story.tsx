import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/input";
import { DEFAULT_ABOUT_STORY, getAboutStory, saveAboutStory } from "@/lib/site-content-fns";

export const Route = createFileRoute("/admin/story")({ component: AboutStoryAdmin });

function AboutStoryAdmin() {
  const queryClient = useQueryClient();
  const story = useQuery({
    queryKey: ["about-story"],
    queryFn: () => getAboutStory(),
    placeholderData: DEFAULT_ABOUT_STORY,
  });
  const [draft, setDraft] = useState(DEFAULT_ABOUT_STORY);
  const [busy, setBusy] = useState(false);
  const savedStory = story.data ?? DEFAULT_ABOUT_STORY;

  useEffect(() => {
    setDraft(savedStory);
  }, [savedStory]);

  async function save() {
    setBusy(true);
    try {
      const result = await saveAboutStory({ data: draft });
      queryClient.setQueryData(["about-story"], result.story);
      toast.success("About story saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the story.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl uppercase tracking-[0.2em]">About story</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        Edit the story shown on the About page. Separate paragraphs with a blank line.
      </p>

      <form
        className="mt-8 max-w-3xl space-y-4 border border-fg p-4 md:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        {story.isError ? (
          <p role="alert" className="text-sm text-danger">
            The current story could not be loaded. Try again before editing.
          </p>
        ) : null}
        <div>
          <Label htmlFor="about-story-content">Story text</Label>
          <Textarea
            id="about-story-content"
            rows={12}
            maxLength={10000}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={story.isError}
            required
          />
          <p className="mt-2 text-xs text-muted">{draft.length}/10,000 characters</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={busy || story.isError || !draft.trim()}>
            {busy ? "Saving…" : "Save story"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy || draft === savedStory}
            onClick={() => setDraft(savedStory)}
          >
            Discard changes
          </Button>
        </div>
      </form>
    </div>
  );
}
