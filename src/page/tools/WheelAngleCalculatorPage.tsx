import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GptAd } from "@/components/ads/GptAd";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { site } from "@/config/site";
import { getTool } from "@/lib/content/catalog";
import { createMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/JsonLd";
import { WheelAngleCalculator } from "@/page/tools/components/WheelAngleCalculator";
import styles from "@/style/page/tools/wheel-angle-calculator-page.module.css";

const tool = getTool("wheel-angle-calculator")!;

const faqs = [
  {
    question: "How do I change steering angle on a Level 5 Driver's Seat?",
    answer:
      "Connect the Level 5 Driver's Seat directly to both front steering bearings. Equip the Connect Tool, aim at one connected bearing, press E, and enter the left and right limits calculated for that physical wheel. Repeat on the other side and test both directions at low speed.",
  },
  {
    question: "What is the best steering angle for a Scrap Mechanic car?",
    answer:
      "There is no universal best angle. The 27-degree preset is a practical starting input, but wheelbase and steering-bearing spacing determine the matching outside angle. Tire grip, vehicle speed, clearance, suspension, and weight distribution still need an in-game test.",
  },
  {
    question: "Why does my Scrap Mechanic car slide or drift while turning?",
    answer:
      "Giving both front wheels the same angle can add tire scrub because they follow different circles. Separate inner and outer angles can reduce that conflict, but low friction, excess speed, poor weight distribution, suspension movement, wheel offset, and body contact can also cause sliding or drifting.",
  },
  {
    question: "Why should the inner wheel turn farther than the outer wheel?",
    answer:
      "The inner wheel follows a smaller circle. Ackermann geometry aims both front wheels toward one shared turn center, reducing low-speed sideways tire scrub.",
  },
  {
    question: "Does a Controller set these normal steering angles?",
    answer:
      "Not for this setup. Connect a Level 5 Driver's Seat directly to both front steering bearings, then enter the calculated left and right limits on each connected bearing.",
  },
  {
    question: "Will 100% Ackermann guarantee perfect handling?",
    answer:
      "No. Tire friction, suspension movement, weight distribution, center of mass, power, speed, and body clearance still affect how the vehicle handles.",
  },
  {
    question: "Can this calculator handle rear-wheel or four-wheel steering?",
    answer:
      "No. It models one fixed rear axle and one independently steered front axle. Multi-axle, rear-steer, linkage, skid-steer, and suspension-glitch designs need a different model.",
  },
];

export const metadata: Metadata = createMetadata(
  tool.seo,
  "/tools/wheel-angle-calculator",
);

export default function WheelAngleCalculatorPage() {
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              name: "Scrap Mechanic Wheel Angle Calculator",
              description: tool.seo.description,
              applicationCategory: "GameApplication",
              operatingSystem: "Web browser",
              url: `${site.url}/tools/wheel-angle-calculator`,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ],
        }}
      />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Tools", href: "/tools" },
                { label: "Wheel Angle Calculator" },
              ]}
            />
            <span className={styles.eyebrow}>Ackermann geometry / bearing limits</span>
            <h1>
              Scrap Mechanic Wheel Angle Calculator <span>- Steering Setup</span>
            </h1>
            <p>
              Calculate separate inner and outer steering limits for a Level 5
              Driver&apos;s Seat. Use the result to reduce low-speed tire scrub on a
              conventional front-steered vehicle.
            </p>
            <div className={styles.heroFacts}>
              <span>3 editable presets</span>
              <span>1°–89° steering model</span>
              <span>Runs in your browser</span>
            </div>
          </div>
          <aside className={styles.heroPlate} aria-label="Calculator model summary">
            <div className={styles.seatIcon}>
              <Image
                src="/images/game-items/driver-s-seat-cf3fdcfc.webp"
                alt="Driver's Seat item from Scrap Mechanic"
                width={112}
                height={112}
                priority
              />
            </div>
            <div className={styles.heroPlateCopy}>
              <span>Vanilla steering model</span>
              <strong>2 + 2</strong>
              <p>Two independently steered front wheels and one fixed rear axle.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.scopeBand} aria-label="Wheel angle calculation scope">
        <div className={`container ${styles.scopeBandInner}`}>
          <div className={styles.scopeLead}>
            <span>Geometry baseline</span>
            <strong>Ideal alignment, not a complete handling simulation</strong>
            <p>
              Uses bearing-center geometry; grip, suspension flex, body contact,
              weight transfer, and high-speed stability still need an in-game test.
            </p>
          </div>
          <dl className={styles.scopeFacts}>
            <div><dt>Steering axle</dt><dd>Front only</dd></div>
            <div><dt>Rear axle</dt><dd>Fixed</dd></div>
            <div><dt>Seat setup</dt><dd>Level 5 direct</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.toolSection}>
        <div className="container">
          <WheelAngleCalculator />
        </div>
      </section>

      <GptAd slotId="div-gpt-ad-wheel-angle-1" unit="banner1" />

      <section className={styles.referenceSection}>
        <div className="container">
          <header className={styles.referenceHeading}>
            <div>
              <span>Setup reference</span>
              <h2>Measure, calculate, then enter both bearing limits</h2>
            </div>
            <p>
              Use bearing centers, not tire edges. With the default 6 × 4 setup,
              a 27° inner limit produces a 20.82° outer target.
            </p>
          </header>

          <div className={styles.referenceGrid}>
            <div className={styles.measureGrid}>
              <article>
                <span>01</span>
                <div>
                  <h3>Wheelbase</h3>
                  <p>Front axle centerline to rear axle centerline.</p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <h3>Steering pivot track</h3>
                  <p>Center of the left steering bearing to the center of the right.</p>
                </div>
              </article>
              <article>
                <span>03</span>
                <div>
                  <h3>Inner wheel limit</h3>
                  <p>The maximum angle for the wheel closest to the turn center.</p>
                </div>
              </article>
            </div>

            <article className={styles.stepsCard}>
              <span>Level 5 seat workflow</span>
              <h2>How to set Level 5 Driver&apos;s Seat bearing angles</h2>
              <ol>
                <li><b>01</b><p>Upgrade the Driver&apos;s Seat to Level 5.</p></li>
                <li><b>02</b><p>Connect it directly to both front steering bearings.</p></li>
                <li><b>03</b><p>Aim the Connect Tool at one bearing and press E.</p></li>
                <li><b>04</b><p>Enter that wheel&apos;s calculated left and right limits.</p></li>
                <li><b>05</b><p>Repeat on the other side and test at low speed.</p></li>
              </ol>
            </article>

            <div className={styles.modelStack}>
              <article className={styles.formulaCard}>
                <span>Geometry reference</span>
                <h2>How the outside angle is found</h2>
                <div className={styles.formula}>
                  <code>R = T ÷ 2 + L ÷ tan(δᵢ)</code>
                  <code>δₒ = atan(L ÷ (R + T ÷ 2))</code>
                </div>
                <dl>
                  <div><dt>L</dt><dd>Wheelbase</dd></div>
                  <div><dt>T</dt><dd>Pivot track</dd></div>
                  <div><dt>δᵢ</dt><dd>Inner angle</dd></div>
                  <div><dt>δₒ</dt><dd>Outer angle</dd></div>
                </dl>
              </article>
              <article className={styles.scopeCard}>
                <span>Outside this model</span>
                <h2>Designs that need another method</h2>
                <ul>
                  <li>Four-wheel, rear-wheel, or multi-axle steering</li>
                  <li>Mechanical linkages or suspension-glitch steering</li>
                  <li>Tire, bumper, and body-clearance checks</li>
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      <GptAd slotId="div-gpt-ad-wheel-angle-2" unit="banner2" />

      <section className={styles.supportSection}>
        <div className={`container ${styles.supportGrid}`}>
          <div className={styles.faqPanel}>
            <header>
              <span>Steering questions</span>
              <h2>Wheel angle calculator FAQ</h2>
              <p>What the geometry can solve—and what still needs an in-game test.</p>
            </header>
            <div className={styles.faqList}>
              {faqs.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className={styles.relatedRail} aria-label="Related vehicle guides">
            <article>
              <span>Building the chassis?</span>
              <h2>Start with a complete vehicle guide</h2>
              <p>Frame, bearings, seat, engine, load placement, and steering tests.</p>
              <Link href="/guides/first-vehicle">Open the first vehicle guide →</Link>
            </article>
            <article>
              <span>Wheel turning the wrong way?</span>
              <h2>Review the Connect Tool</h2>
              <p>Check connection direction before increasing steering angle or speed.</p>
              <Link href="/wiki/tools/connect-tool">Open the Connect Tool guide →</Link>
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}
