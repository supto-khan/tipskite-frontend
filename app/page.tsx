import Link from "next/link";
import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import { Container } from "./components/layout/container";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Coffee, GraduationCap, ShoppingBag, Palette, FileText, BarChart3, Brush } from "lucide-react";

const FEATURES = [
  {
    icon: Coffee,
    title: "One-Time Tips",
    description:
      "Let fans show love with a quick tip — no account needed. Powered by bKash, Nagad, Rocket & cards.",
  },
  {
    icon: GraduationCap,
    title: "Online Courses",
    description:
      "Create, host, and sell video and text-based structured courses directly to your audience.",
  },
  {
    icon: ShoppingBag,
    title: "Digital Shop",
    description:
      "Sell e-books, presets, templates, and other digital goods directly from your creator page.",
  },
  {
    icon: Palette,
    title: "Custom Services",
    description:
      "List personalized services — video shout-outs, reviews, commissions — with intake forms.",
  },
  {
    icon: FileText,
    title: "Exclusive Posts",
    description:
      "Share updates, behind-the-scenes, and exclusive content visible only to your supporters.",
  },
  {
    icon: BarChart3,
    title: "Creator Analytics",
    description:
      "Track earnings, supporters, and growth with beautiful, real-time dashboards.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Create your page",
    description: "Sign up in 30 seconds. Pick a slug, add your bio, and customize your page colors.",
  },
  {
    step: "2",
    title: "Share your link",
    description: "Drop your TipsKite link in your bio, videos, or streams. Supporters need no account.",
  },
  {
    step: "3",
    title: "Receive support",
    description: "Get tips and payments via bKash, Nagad, bank transfer, or cards. 5% platform fee.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-surface to-surface pb-20 pt-24 md:pt-32">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-40 h-[300px] w-[300px] rounded-full bg-warning-200/20 blur-3xl" />

          <Container size="lg" className="relative text-center">
            <div className="mx-auto max-w-3xl">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
                🪁 Made for Bangladeshi Creators
              </span>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl md:text-6xl">
                Your fans want to{" "}
                <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                  support you
                </span>
                .{" "}
                <br className="hidden sm:block" />
                Make it effortless.
              </h1>

              <p className="mt-6 text-lg text-text-secondary md:text-xl">
                Accept tips, sell digital products, courses, and offer services — all from
                one beautiful page. Powered by bKash, Nagad, Rocket &amp; cards.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/register">
                  <Button size="xl">
                    Start my page — it&apos;s free
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="secondary" size="xl">
                    Explore creators
                  </Button>
                </Link>
              </div>

              <p className="mt-4 text-sm text-text-muted">
                Free to start · Only 5% on transactions · No hidden fees
              </p>
            </div>

            {/* Mock creator page preview */}
            <div className="relative mx-auto mt-16 max-w-2xl">
              <div className="overflow-hidden rounded-2xl border border-border-default bg-surface shadow-xl">
                {/* Cover */}
                <div className="h-32 bg-gradient-to-r from-primary-400 via-primary-500 to-warning-400" />
                {/* Profile */}
                <div className="px-6 pb-6">
                  <div className="-mt-10 flex items-end gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-surface bg-primary-100 text-primary-600 shadow-md">
                      <Palette className="h-9 w-9" />
                    </div>
                    <div className="pb-1 text-left">
                      <h3 className="text-lg font-bold text-text-primary">
                        Rina Creates
                      </h3>
                      <p className="text-sm text-text-secondary">
                        tipskite.com/rina
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-text-secondary text-left">
                    Digital artist &amp; illustrator from Dhaka. Creating vibrant Bengali art
                    and illustrations. Your support keeps the colors flowing!
                  </p>
                  <div className="mt-4 flex gap-3">
                    <div className="flex-1 rounded-xl border border-primary-200 bg-primary-50 p-3 text-center flex flex-col items-center">
                      <Coffee className="h-6 w-6 text-primary-600 mb-1" />
                      <p className="mt-1 text-sm font-semibold text-primary-700">
                        Buy a coffee
                      </p>
                      <p className="text-xs text-primary-600">৳50</p>
                    </div>
                    <div className="flex-1 rounded-xl border border-border-default bg-surface-secondary p-3 text-center flex flex-col items-center">
                      <Palette className="h-6 w-6 text-text-secondary mb-1" />
                      <p className="mt-1 text-sm font-semibold text-text-primary">
                        Buy a canvas
                      </p>
                      <p className="text-xs text-text-secondary">৳200</p>
                    </div>
                    <div className="flex-1 rounded-xl border border-border-default bg-surface-secondary p-3 text-center flex flex-col items-center">
                      <Brush className="h-6 w-6 text-text-secondary mb-1" />
                      <p className="mt-1 text-sm font-semibold text-text-primary">
                        Buy a brush set
                      </p>
                      <p className="text-xs text-text-secondary">৳500</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Shadow glow */}
              <div className="pointer-events-none absolute -bottom-6 left-1/2 h-12 w-3/4 -translate-x-1/2 rounded-full bg-primary-500/10 blur-2xl" />
            </div>
          </Container>
        </section>

        {/* ── How It Works ─────────────────────────────────────────── */}
        <section className="py-20 bg-surface">
          <Container size="lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
                Three simple steps
              </h2>
              <p className="mt-3 text-text-secondary">
                Get started in under a minute — no tech skills needed.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {STEPS.map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-2xl font-bold text-primary-600">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Features ─────────────────────────────────────────────── */}
        <section className="py-20 bg-surface-secondary">
          <Container size="lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
                Everything you need
              </h2>
              <p className="mt-3 text-text-secondary">
                All the tools to build a sustainable creative career — in one place.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={feature.title} hover variant="default" padding="lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-text-primary">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ── Social Proof / Stats ─────────────────────────────────── */}
        <section className="py-20 bg-surface">
          <Container size="lg">
            <div className="grid gap-8 md:grid-cols-3 text-center">
              <div>
                <p className="text-4xl font-extrabold text-primary-500">5%</p>
                <p className="mt-2 text-sm text-text-secondary">
                  Platform fee — that&apos;s it. No hidden charges.
                </p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-primary-500">৳50</p>
                <p className="mt-2 text-sm text-text-secondary">
                  Minimum tip. Fans can start small.
                </p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-primary-500">0</p>
                <p className="mt-2 text-sm text-text-secondary">
                  Account required to tip. Guests welcome.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-700">
          <Container size="md" className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to fly?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Join TipsKite today and let your fans support what you do best.
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-surface text-primary-700 hover:bg-primary-50 border-0 shadow-lg"
                >
                  Create your free page →
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
