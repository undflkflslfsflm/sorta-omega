import { createHash } from "node:crypto";
import type { Page } from "playwright-core";

type Note = { id: string; title: string; body: string; path: string };

export async function collectTeamsClassPosts(source: Page): Promise<{ notes: Note[]; coverage: { classes: number; posts: number; complete: false; limitation: string } }> {
  const context = source.context();
  const notes: Note[] = [];
  let classCount = 0;
  const probe = await context.newPage();
  try {
    await probe.goto(source.url(), { waitUntil: "domcontentloaded", timeout: 30_000 });
    const navigation = probe.getByRole("button", { name: /^Teams \(Ctrl\+Shift\+5\)$/ });
    await navigation.waitFor({ timeout: 20_000 });
    await navigation.click();
    const classes = probe.locator(".fui-AccordionItem").filter({ hasText: /Classes\s*\d+\s*teams/i });
    await classes.waitFor({ timeout: 20_000 });
    if (await classes.count() !== 1) throw new Error("teams_classes_accordion_ambiguous");
    const header = classes.locator(".fui-AccordionHeader__button");
    if (await header.count() !== 1) throw new Error("teams_classes_header_ambiguous");
    if (await header.getAttribute("aria-expanded") === "false") await header.click();
    const cards = classes.locator('[role="group"]');
    await cards.first().waitFor({ timeout: 15_000 });
    classCount = await cards.count();
    if (classCount < 1 || classCount > 30) throw new Error("teams_class_card_count_unbounded");
    for (let index = 0; index < classCount; index++) {
      const className = (await cards.nth(index).textContent() ?? "").replace(/\s+/g, " ").trim();
      if (!className) throw new Error("teams_class_name_missing");
      await cards.nth(index).click();
      await probe.locator('[data-reply-chain-id][data-mid]').first().waitFor({ timeout: 20_000 }).catch(() => undefined);
      let previousCount = -1, stable = 0;
      for (let attempt = 0; attempt < 12 && stable < 4; attempt++) {
        await probe.waitForTimeout(500);
        const count = await probe.locator('[data-reply-chain-id][data-mid]').count();
        stable = count === previousCount ? stable + 1 : 0;
        previousCount = count;
      }
      const posts = await probe.evaluate(() => [...document.querySelectorAll<HTMLElement>('[data-reply-chain-id][data-mid]')].map(element => ({
        messageId: element.getAttribute("data-mid") ?? "",
        chainId: element.getAttribute("data-reply-chain-id") ?? "",
        text: (element.closest<HTMLElement>('[role="group"]')?.innerText ?? element.innerText).replace(/\s+\n/g, "\n").replace(/\nReply\s*$/i, "").trim(),
      })));
      for (const post of posts) {
        if (!post.messageId || !post.chainId || !post.text) continue;
        const id = createHash("sha256").update(`teams-channel:${className}:${post.chainId}:${post.messageId}`).digest("hex");
        const title = `Teams · ${className.slice(0, 150)} · ${id.slice(0, 12)}`;
        const body = `Source: Teams class channel post\nClass: ${className}\nChannel: General\nCaptured: ${new Date().toISOString()}\nThis is a browser snapshot, not live synchronization.\n\n${post.text}`;
        if (Buffer.byteLength(body) > 1_000_000) continue;
        notes.push({ id, title, body, path: `teams/channels/${id}.json` });
      }
      await probe.getByText("All teams", { exact: true }).click();
      await cards.first().waitFor({ timeout: 15_000 });
    }
  } finally { await probe.close(); }
  const unique = [...new Map(notes.map(note => [note.id, note])).values()];
  if (!unique.length) throw new Error("teams_channel_posts_not_found_layout_review_required");
  if (unique.length > 500) throw new Error("teams_channel_post_count_exceeds_import_limit");
  return { notes: unique, coverage: { classes: classCount, posts: unique.length, complete: false, limitation: "Only rendered General-channel posts were captured. Older posts, other channels, attachments, classwork, and private chats require separate coverage." } };
}
