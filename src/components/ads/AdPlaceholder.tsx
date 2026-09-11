type AdPlacement = "banner1" | "banner2" | "banner3";

export function AdPlaceholder({
  slotId,
  unit,
}: {
  slotId: string;
  unit: AdPlacement;
}) {
  return (
    <aside
      className="ad-placeholder-section"
      aria-label="Advertisement placeholder"
      data-ad-placement={unit}
    >
      <span className="ad-placeholder-label">Advertisement</span>
      <div className="ad-placeholder-shell">
        <div
          className="ad-placeholder-slot"
          data-ad-placeholder={slotId}
          id={slotId}
        >
          <span>Reserved advertising space</span>
        </div>
      </div>
    </aside>
  );
}
