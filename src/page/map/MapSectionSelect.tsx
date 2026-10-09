"use client";

export function MapSectionSelect({ sections, className }: {
  sections: { id: string; label: string }[];
  className: string;
}) {
  return (
    <select className={className} aria-label="Jump to a map page section" defaultValue=""
      onChange={(event) => { if (event.currentTarget.value) window.location.hash = event.currentTarget.value; }}>
      <option value="" disabled>Jump to a map section</option>
      {sections.map((section) => <option key={section.id} value={section.id}>{section.label}</option>)}
    </select>
  );
}
