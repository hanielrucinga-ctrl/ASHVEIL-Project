import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "@/lib/admin-guard";
import { dbSource, getSql } from "@/lib/db";

export const DEFAULT_ABOUT_STORY = [
  "Worn by the ones who stay.",
  "Pieces are graphic and spare: heavy cotton, black ink, xerox grain. The 3 Lip Combo, the house oval, a hoodie you actually wear.",
  "Small runs. Direct from the brand. Questions, custom work, and wholesale through the contact page.",
].join("\n\n");

const ABOUT_STORY_KEY = "about_story";

export const getAboutStory = createServerFn({ method: "GET" }).handler(async () => {
  if (dbSource === "unconfigured") return DEFAULT_ABOUT_STORY;
  const sql = await getSql();
  const rows = await sql<{ value: string }>`
    select value from site_content where key = ${ABOUT_STORY_KEY}
  `;
  return rows[0]?.value ?? DEFAULT_ABOUT_STORY;
});

export const saveAboutStory = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator((story: string) => story)
  .handler(async ({ data }) => {
    const story = data.trim();
    if (!story) throw new Error("Add story text before saving.");
    if (story.length > 10000) throw new Error("The story must be 10,000 characters or fewer.");
    const sql = await getSql();
    await sql`
      insert into site_content (key, value)
      values (${ABOUT_STORY_KEY}, ${story})
      on conflict (key) do update set value = excluded.value, updated_at = now()
    `;
    return { story };
  });
