import { useState } from "react";
import {
  AudioLines,
  BadgeCheck,
  Brain,
  Camera,
  Car,
  Clapperboard,
  Disc3,
  Flame,
  Gauge,
  Gem,
  Layers,
  Mic2,
  MoonStar,
  Music2,
  Shield,
  Sparkles,
  WandSparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type ExperienceMode = {
  title: string;
  state: string;
  uiPrinciple: string;
  interaction: string;
};

type GameLoop = {
  name: string;
  loop: string;
  reward: string;
  metric: string;
};

type SensoryDirection = {
  label: string;
  palette: string[];
  audio: string;
  visual: string;
};

type PriorityFeature = {
  title: string;
  whyItMatters: string;
  shipNow: string[];
  kpi: string;
};

const genreChips = [
  "Amapiano",
  "Trap",
  "Hip Hop",
  "Afrobeat",
  "R&B",
  "Drill",
  "House",
  "Gospel",
];

const musicTools = [
  "Browser-based DAW with multi-track timeline",
  "Piano roll editor + drum sequencer",
  "Sample library with Amapiano, Trap, and Afrobeat kits",
  "Vocal recording, stem separation, BPM/key detection",
  "AI beat generator, melody writer, lyric and hook generator",
  "Mastering assistant, WAV/MP3 export, cloud projects, live collaboration",
];

const garageTools = [
  "Upload your car, motorcycle, or bicycle and generate build previews",
  "Rims, wraps, spoilers, widebody kits, stance and suspension simulations",
  "Before/after build timeline + modification journal",
  "BMW, VW, JDM, Mercedes, Stance, BBS, Air Suspension communities",
  "Forza-style garage UI with Pinterest-like inspiration boards",
];

const creatorTools = [
  "AI script writer + title + hook engine",
  "Storyboard, shot list, trailer planner and retention optimizer",
  "Short-form planner for TikTok/Reels/Shorts",
  "Subtitle generation, local-language dubbing and voiceover",
  "Viral clip extraction, social captions and brand pitch generator",
];

const smokeTools = [
  "Aesthetic cannabis culture feed with reels, photos and smoke sessions",
  "Strain reviews, rolling tool favorites and lounge discussion boards",
  "Late Night Vibes zone + mood-based playlist curation",
  "Memes, private groups, creator circles and trend boards",
  "Community-first experience (culture and expression over marketplace)",
];

const globalFeatures = [
  "Cinematic onboarding and creator profile system",
  "Follow graph, notifications and premium memberships",
  "AI-powered search, saved collections, moodboards and inspiration boards",
  "Community ranking system, badges and trend discovery",
  "Mobile-first responsiveness with dark mode by default",
];

const experienceModes: ExperienceMode[] = [
  {
    title: "Float Mode",
    state: "Lower working memory + slower pacing",
    uiPrinciple: "Bigger controls, fewer steps, one-tap posting",
    interaction: "Voice-to-post journaling and playlist-driven prompts",
  },
  {
    title: "Creative Spark",
    state: "High sensory salience + idea bursts",
    uiPrinciple: "Capture-first UX with AI expansion",
    interaction: "Turn voice notes into hooks, captions, and reel concepts",
  },
  {
    title: "Lounge Social",
    state: "Need for belonging and vibe alignment",
    uiPrinciple: "Small-group rooms + mood-led discovery",
    interaction: "Late Night Vibes rooms with track and image sharing",
  },
];

const gameLoops: GameLoop[] = [
  {
    name: "Pass The Aux Battles",
    loop: "Post 60s vibe clip → community reacts → remix challenge",
    reward: "Aura frames and featured placement",
    metric: "D1 return after first battle",
  },
  {
    name: "Moodboard Roulette",
    loop: "Tap once for randomized moodboard + beat + prompt",
    reward: "Collectible style packs",
    metric: "Avg. sessions per user",
  },
  {
    name: "Strain x Sound Lab",
    loop: "Rate pairings by mood and soundtrack",
    reward: "Top curator leaderboard",
    metric: "Weekly contribution rate",
  },
  {
    name: "Rolling Ritual Challenges",
    loop: "Weekly visual challenge with limited-time theme",
    reward: "Quest badges + profile rank",
    metric: "UGC posts per challenge",
  },
];

const sensoryDirections: SensoryDirection[] = [
  {
    label: "Late Night Melt",
    palette: ["#53C8FF", "#8D68FF", "#191A2D"],
    audio: "85-102 BPM, warm bass, atmospheric pads",
    visual: "Slow gradients, smoke trails, grainy film glow",
  },
  {
    label: "Neon Float",
    palette: ["#00E1FF", "#FF5CD7", "#050509"],
    audio: "Amapiano log drums + airy synth textures",
    visual: "Glass cards, bloom accents, soft chrome reflections",
  },
  {
    label: "Creative Fire",
    palette: ["#FF8B37", "#FFE45C", "#111111"],
    audio: "Percussive groove with short vocal chops",
    visual: "Dynamic kinetic typography + cut-up collage stills",
  },
];

const smokeTabs = ["Experience", "Games", "Sensory", "Safety"] as const;
type SmokeTab = (typeof smokeTabs)[number];

const priorityFeatures: PriorityFeature[] = [
  {
    title: "Live Remix Layer",
    whyItMatters: "Turns every post into a reusable creative object instead of a dead-end scroll item.",
    shipNow: ["Remix button on clips/posts", "Sound + visual remix presets", "Remix chain attribution"],
    kpi: "Remix rate per post",
  },
  {
    title: "Session OS",
    whyItMatters: "Creates ritual usage with low-friction focused rooms for creators.",
    shipNow: ["Start Session CTA", "25-min focus timer", "Mood playlist + prompt"],
    kpi: "Sessions started per active user",
  },
  {
    title: "Multi-Mode Profile",
    whyItMatters: "Users can be producer, garage builder, and lifestyle creator without splitting identity.",
    shipNow: ["Mode switcher", "Mode-specific feed weighting", "Mode badges"],
    kpi: "Weekly mode-switch count",
  },
  {
    title: "Contribution Reputation",
    whyItMatters: "Rewards useful creation and collaboration over vanity-only follower metrics.",
    shipNow: ["Contribution score", "Quest badges", "Featured creator slots"],
    kpi: "D7 return rate for contributors",
  },
];

const SectionCard = ({
  icon,
  title,
  subtitle,
  features,
  accent,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  features: string[];
  accent: string;
}) => (
  <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
    <div className={`pointer-events-none absolute -right-24 -top-20 h-48 w-48 rounded-full blur-3xl ${accent}`} />
    <div className="relative">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-300">
        {icon}
        Core Section
      </div>
      <h2 className="text-2xl font-semibold text-white md:text-3xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-zinc-300 md:text-base">{subtitle}</p>

      <div className="mt-6 grid gap-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-200"
          >
            {feature}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TabButton = ({
  tab,
  active,
  onClick,
}: {
  tab: SmokeTab;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
      active
        ? "border-cyan-300/60 bg-cyan-300/20 text-cyan-100"
        : "border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10"
    }`}
  >
    {tab}
  </button>
);

const BadgeHeader = ({ icon: Icon, text }: { icon: LucideIcon; text: string }) => (
  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-300">
    <Icon className="h-4 w-4 text-cyan-200" />
    {text}
  </div>
);

const Index = () => {
  const [activeTab, setActiveTab] = useState<SmokeTab>("Experience");

  return (
    <div className="min-h-screen bg-[#050509] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(93,63,211,0.28),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(0,229,255,0.18),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(255,65,120,0.2),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20">
        <header className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-2xl md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
            <Gem className="h-4 w-4" />
            3MGODINI • Cultural Creator Operating System
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Build the future of culture.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-zinc-300 sm:text-lg">
                3MGODINI combines pro music production, cannabis lifestyle communities, car/bike stance culture,
                and AI content creation in one cinematic platform built for creators, taste-makers, and obsessive
                builders.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-2xl border border-cyan-300/30 bg-cyan-300/15 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/25">
                  Launch Music Lab
                </button>
                <button className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/10">
                  Open Stance Visualizer
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/45 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Live stack preview</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  [Music2, "Music Lab"],
                  [Car, "Stance Garage"],
                  [Clapperboard, "Creator Studio"],
                  [Flame, "Smoke Club"],
                ].map(([Icon, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <Icon className="h-5 w-5 text-cyan-200" />
                    <p className="mt-2 text-sm font-medium text-zinc-100">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-violet-200" />
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Genre engine</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {genreChips.map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-violet-300/30 bg-violet-300/10 px-3 py-1 text-xs font-medium text-violet-100"
              >
                {genre}
              </span>
            ))}
          </div>
        </section>

        <main className="mt-8 grid gap-6">
          <section className="relative overflow-hidden rounded-3xl border border-emerald-300/20 bg-white/5 p-6 backdrop-blur-2xl md:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-500/20 blur-3xl" />
            <BadgeHeader icon={Sparkles} text="Phase 1 • Important Features First" />
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Build retention engines before everything else</h2>
            <p className="mt-3 max-w-3xl text-sm text-zinc-300 md:text-base">
              These are the highest-impact systems to launch first so 3MGODINI feels addictive, collaborative, and
              culture-native from day one.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {priorityFeatures.map((feature) => (
                <article key={feature.title} className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-xl">
                  <p className="text-base font-semibold text-white">{feature.title}</p>
                  <p className="mt-2 text-sm text-zinc-300">{feature.whyItMatters}</p>
                  <ul className="mt-3 space-y-1 text-sm text-zinc-200">
                    {feature.shipNow.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs uppercase tracking-[0.15em] text-emerald-200">KPI: {feature.kpi}</p>
                </article>
              ))}
            </div>
          </section>

          <SectionCard
            icon={<Disc3 className="h-4 w-4 text-cyan-200" />}
            title="1) Music Lab — Full DAW + AI Music Studio"
            subtitle="A polished browser DAW inspired by FL Studio/BandLab/Splice with investor-ready UX, pro workflow controls, and AI-native creation tools."
            features={musicTools}
            accent="bg-cyan-500/20"
          />

          <SectionCard
            icon={<Gauge className="h-4 w-4 text-pink-200" />}
            title="2) Stance Garage — Cars + Bikes + AI Build Visualizer"
            subtitle="Need for Speed garage energy with creator socials. Visualize full custom builds from your own uploads and publish build journals in niche communities."
            features={garageTools}
            accent="bg-pink-500/20"
          />

          <SectionCard
            icon={<WandSparkles className="h-4 w-4 text-emerald-200" />}
            title="3) Creator Studio — Video + Content Creation Engine"
            subtitle="CapCut/Runway-style creator tooling for YouTubers, filmmakers, and music creators with AI planning, editing, and growth optimization."
            features={creatorTools}
            accent="bg-emerald-500/20"
          />

          <SectionCard
            icon={<MoonStar className="h-4 w-4 text-amber-200" />}
            title="4) Smoke Club — Cannabis Lifestyle Community"
            subtitle="A premium, style-first social destination for cannabis culture with lounge energy, visual storytelling, mood playlists, and creator circles."
            features={smokeTools}
            accent="bg-amber-500/20"
          />
        </main>

        <section className="mt-8 rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-xl md:p-8">
          <BadgeHeader icon={Brain} text="Smoke Club • Engagement Intelligence" />
          <h3 className="text-2xl font-semibold text-white md:text-3xl">Designed for altered attention + social vibe behavior</h3>
          <p className="mt-2 max-w-3xl text-sm text-zinc-300 md:text-base">
            Interaction models below focus on low-friction flow, sensory storytelling, and contribution-based status loops
            to maximize session depth and retention.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {smokeTabs.map((tab) => (
              <TabButton key={tab} tab={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
            ))}
          </div>

          {activeTab === "Experience" && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {experienceModes.map((mode) => (
                <article key={mode.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{mode.title}</p>
                  <p className="mt-2 text-xs text-zinc-400">State</p>
                  <p className="text-sm text-zinc-200">{mode.state}</p>
                  <p className="mt-2 text-xs text-zinc-400">UX Principle</p>
                  <p className="text-sm text-zinc-200">{mode.uiPrinciple}</p>
                  <p className="mt-2 text-xs text-zinc-400">Interaction</p>
                  <p className="text-sm text-zinc-200">{mode.interaction}</p>
                </article>
              ))}
            </div>
          )}

          {activeTab === "Games" && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {gameLoops.map((game) => (
                <article key={game.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{game.name}</p>
                  <p className="mt-2 text-xs text-zinc-400">Loop</p>
                  <p className="text-sm text-zinc-200">{game.loop}</p>
                  <p className="mt-2 text-xs text-zinc-400">Reward</p>
                  <p className="text-sm text-zinc-200">{game.reward}</p>
                  <p className="mt-2 text-xs text-zinc-400">Primary KPI</p>
                  <p className="text-sm text-cyan-200">{game.metric}</p>
                </article>
              ))}
            </div>
          )}

          {activeTab === "Sensory" && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {sensoryDirections.map((direction) => (
                <article key={direction.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{direction.label}</p>
                  <div className="mt-3 flex gap-2">
                    {direction.palette.map((color) => (
                      <div key={color} className="h-6 w-6 rounded-full border border-white/20" style={{ background: color }} />
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-zinc-400">Audio direction</p>
                  <p className="text-sm text-zinc-200">{direction.audio}</p>
                  <p className="mt-2 text-xs text-zinc-400">Visual direction</p>
                  <p className="text-sm text-zinc-200">{direction.visual}</p>
                </article>
              ))}
            </div>
          )}

          {activeTab === "Safety" && (
            <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
              <div className="flex items-center gap-2 text-amber-100">
                <Shield className="h-4 w-4" />
                <p className="text-sm font-semibold uppercase tracking-[0.15em]">Safety + compliance design</p>
              </div>
              <ul className="mt-4 grid gap-2 text-sm text-zinc-100">
                <li>• Age-gated onboarding (18+/21+ by locale)</li>
                <li>• Harm-reduction prompts and wellness check-ins</li>
                <li>• No risky behavior glamorization in prompts/challenges</li>
                <li>• Community moderation + private group protections</li>
                <li>• Culture-first positioning over marketplace behavior</li>
              </ul>
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">MVP priority</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Built in launch order for maximum wow-factor</h3>
            <div className="mt-6 space-y-3">
              {[
                ["01", "Music Lab"],
                ["02", "Stance Garage AI Visualizer"],
                ["03", "Creator Studio"],
                ["04", "Smoke Club"],
              ].map(([order, name]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 px-4 py-3"
                >
                  <span className="text-xs font-semibold tracking-[0.2em] text-zinc-400">{order}</span>
                  <span className="text-sm font-medium text-zinc-100">{name}</span>
                  <Zap className="h-4 w-4 text-cyan-200" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/45 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Global platform systems</p>
            <div className="mt-5 grid gap-3">
              {globalFeatures.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-400/15 via-fuchsia-400/10 to-emerald-400/15 p-6 text-center backdrop-blur-xl md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">Design language</p>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-zinc-100 md:text-base">
            Luxury startup polish. Street + music + film + car culture DNA. Dark-first glassmorphism, cinematic
            gradients, high-contrast typography, and addictive creator workflows.
          </p>
          <div className="mt-4 flex justify-center gap-3 text-zinc-300">
            <Layers className="h-5 w-5" />
            <AudioLines className="h-5 w-5" />
            <Camera className="h-5 w-5" />
            <Mic2 className="h-5 w-5" />
            <Sparkles className="h-5 w-5" />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
