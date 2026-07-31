import Link from "next/link";
import { allWikiEntries, getWikiEntryByName } from "@/lib/content";
import styles from "./wiki-linked-text.module.css";

type WikiLinkedTextProps = {
  text: string;
  currentHref: string;
  maxLinks?: number;
};

const mentionAliases = [
  "Mountable Spud Gun",
  "Spud Gun",
  "Clay Gun",
  "Plasma Drill Level 1",
  "Plasma Saw 1",
  "Gas Engine Level 1",
  "Electric Engine Level 1",
  "Thruster Level 1",
  "Controller Level 1",
  "Piston Level 1",
  "Sensor Level 1",
  "Driver's Seat Level 1",
  "Metal Block Level 1",
  "Metal Block Level 2",
  "Metal Block Level 3",
  "Metal Block 1",
  "Metal Block 2",
  "Metal Block 3",
  "Wood Block Level 1",
  "Wood Block Level 2",
  "Wood Block Level 3",
  "Wood Block 1",
  "Wood Block 2",
  "Wood Block 3",
];

const mentionNames = [...new Set([
  ...allWikiEntries.map((entry) => entry.name),
  ...mentionAliases,
])]
  .filter((name) => name.length >= 4)
  .sort((left, right) => right.length - left.length);

const mentionPattern = new RegExp(
  `(?<![A-Za-z0-9])(${mentionNames
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})(?![A-Za-z0-9])`,
  "g",
);

export function WikiLinkedText({
  text,
  currentHref,
  maxLinks = 5,
}: WikiLinkedTextProps) {
  const matches = [...text.matchAll(mentionPattern)];
  if (matches.length === 0) return text;

  const output: React.ReactNode[] = [];
  const linkedHrefs = new Set<string>();
  let cursor = 0;
  let linkCount = 0;

  matches.forEach((match, index) => {
    const label = match[0];
    const start = match.index ?? 0;
    const entry = getWikiEntryByName(label);
    const href = entry ? `/wiki/${entry.category}/${entry.slug}` : undefined;

    output.push(text.slice(cursor, start));

    if (
      href &&
      href !== currentHref &&
      !linkedHrefs.has(href) &&
      linkCount < maxLinks
    ) {
      output.push(
        <Link className={styles.link} href={href} key={`${href}-${start}-${index}`}>
          {label}
        </Link>,
      );
      linkedHrefs.add(href);
      linkCount += 1;
    } else {
      output.push(label);
    }

    cursor = start + label.length;
  });

  output.push(text.slice(cursor));
  return output;
}
