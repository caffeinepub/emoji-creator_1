import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Palette,
  Save,
  ScanFace,
  Share2,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BASE_COLORS, EmojiSVG } from "./components/EmojiSVG";
import type { EmojiConfig } from "./components/EmojiSVG";
import {
  useGetAllEmojis,
  useSaveEmoji,
  useSeedEmojis,
} from "./hooks/useQueries";

const EYE_STYLES = ["dots", "wide", "sleepy", "wink", "stars"] as const;
const MOUTH_STYLES = [
  "smile",
  "big grin",
  "sad",
  "surprised",
  "smirk",
] as const;
const ACCESSORIES = [
  "none",
  "glasses",
  "sunglasses",
  "hat",
  "halo",
  "bowtie",
] as const;
const EXPRESSIONS = ["happy", "sad", "surprised", "cool", "sleepy"] as const;
const COLORS = Object.keys(BASE_COLORS) as Array<keyof typeof BASE_COLORS>;

const EXPRESSION_PRESETS: Record<string, Partial<EmojiConfig>> = {
  happy: { eyeStyle: "wide", mouthStyle: "big grin" },
  sad: { eyeStyle: "dots", mouthStyle: "sad" },
  surprised: { eyeStyle: "wide", mouthStyle: "surprised" },
  cool: { eyeStyle: "wink", mouthStyle: "smirk", accessory: "sunglasses" },
  sleepy: { eyeStyle: "sleepy", mouthStyle: "smile" },
};

const EXPRESSION_EMOJI: Record<string, string> = {
  happy: "😄",
  sad: "😢",
  surprised: "😲",
  cool: "😎",
  sleepy: "😴",
};

const CARD_BG_COLORS = [
  "#FFF3CD",
  "#D1FAE5",
  "#DBEAFE",
  "#F3E8FF",
  "#FFE4E6",
  "#D1FAE5",
  "#FEF9C3",
  "#E0F2FE",
];

const DEFAULT_CONFIG: EmojiConfig = {
  color: "yellow",
  eyeStyle: "dots",
  mouthStyle: "smile",
  accessory: "none",
  expression: "none",
  baseShape: "circle",
};

function OptionTile({
  label,
  selected,
  onClick,
  children,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all cursor-pointer hover:scale-105 ${
        selected
          ? "border-primary bg-primary/10 shadow-md"
          : "border-border bg-white hover:border-primary/50"
      }`}
    >
      {children}
      <span className="text-xs font-medium text-muted-foreground capitalize leading-tight">
        {label}
      </span>
    </button>
  );
}

function Navbar({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">😄</span>
          <span className="font-bold text-xl text-foreground">EmojiFun</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {["Home", "Create", "Gallery"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              data-ocid={`nav.${link.toLowerCase()}.link`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="rounded-full hidden sm:flex"
            data-ocid="nav.signin.button"
          >
            Sign In
          </Button>
          <Button
            onClick={onCreateClick}
            data-ocid="nav.getstarted.button"
            className="rounded-full gradient-cta text-white border-none font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeroSection({ onStartCreating }: { onStartCreating: () => void }) {
  return (
    <section
      id="home"
      className="hero-teal relative overflow-hidden"
      style={{ minHeight: 420 }}
    >
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {["😂", "🥰", "🤩", "😜", "🥳", "😎", "🤔", "😴"].map((e, i) => (
          <span
            key={e}
            className="absolute text-3xl opacity-20"
            style={{
              top: `${10 + ((i * 11) % 80)}%`,
              left: `${5 + ((i * 13) % 90)}%`,
              transform: `rotate(${((i * 35) % 60) - 30}deg)`,
            }}
          >
            {e}
          </span>
        ))}
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Create Your <span className="block">Perfect Emoji 🎨</span>
          </h1>
          <p className="text-white/85 text-lg mb-8 max-w-md">
            Design fun, unique cartoon emojis in seconds. Mix and match eyes,
            mouths, accessories, and more!
          </p>
          <Button
            onClick={onStartCreating}
            data-ocid="hero.start_creating.button"
            size="lg"
            className="rounded-full gradient-cta text-white border-none font-bold text-base px-8 py-6 shadow-lg hover:opacity-90 transition-opacity animate-float"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Creating
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-shrink-0"
        >
          <div className="animate-float" style={{ animationDelay: "0.5s" }}>
            <EmojiSVG
              config={{
                color: "yellow",
                eyeStyle: "wide",
                mouthStyle: "big grin",
                accessory: "none",
                expression: "happy",
                baseShape: "circle",
              }}
              size={200}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CreatorWorkspace({
  config,
  setConfig,
}: {
  config: EmojiConfig;
  setConfig: (c: EmojiConfig) => void;
}) {
  const [saveOpen, setSaveOpen] = useState(false);
  const [emojiName, setEmojiName] = useState("");
  const { mutateAsync: saveEmoji, isPending: isSaving } = useSaveEmoji();

  const handleDownloadPng = useCallback(() => {
    const svgEl = document.getElementById("main-emoji-svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = `emoji-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Emoji downloaded as PNG!");
    };
    img.src = url;
  }, []);

  const handleShare = useCallback(() => {
    const configStr = encodeURIComponent(JSON.stringify(config));
    const shareUrl = `${window.location.origin}?emoji=${configStr}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Share link copied to clipboard!");
    });
  }, [config]);

  const handleSave = useCallback(async () => {
    try {
      await saveEmoji({ ...config, name: emojiName || "My Emoji" });
      toast.success("Emoji saved!");
      setSaveOpen(false);
      setEmojiName("");
    } catch {
      toast.error("Failed to save emoji");
    }
  }, [saveEmoji, config, emojiName]);

  const applyExpression = (expr: string) => {
    const preset = EXPRESSION_PRESETS[expr] ?? {};
    setConfig({ ...config, expression: expr, ...preset });
  };

  return (
    <section id="create" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            Creator Workspace
          </h2>
          <p className="text-muted-foreground">
            Design your perfect cartoon emoji right here
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Canvas Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl border border-border shadow-card p-6"
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ScanFace className="w-5 h-5 text-primary" />
              Canvas Preview
            </h3>
            <div
              className="emoji-grid-bg rounded-xl flex items-center justify-center"
              style={{ minHeight: 280, backgroundColor: "#f8f9ff" }}
              data-ocid="creator.canvas_target"
            >
              <motion.div
                key={JSON.stringify(config)}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <EmojiSVG config={config} size={240} id="main-emoji-svg" />
              </motion.div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                onClick={() => setSaveOpen(true)}
                data-ocid="creator.save.button"
                className="flex-1 rounded-full gradient-cta text-white border-none font-semibold hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
              <Button
                onClick={handleShare}
                data-ocid="creator.share.button"
                variant="outline"
                className="flex-1 rounded-full font-semibold"
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
              <Button
                onClick={handleDownloadPng}
                data-ocid="creator.download.button"
                variant="outline"
                className="flex-1 rounded-full font-semibold"
              >
                <Download className="w-4 h-4 mr-2" /> Download PNG
              </Button>
            </div>
          </motion.div>

          {/* Customization Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl border border-border shadow-card p-6"
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Customization Panel
            </h3>
            <Tabs defaultValue="base" data-ocid="creator.tabs.panel">
              <TabsList className="grid grid-cols-5 mb-4 rounded-xl h-10">
                {["base", "eyes", "mouth", "accessories", "expressions"].map(
                  (tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      data-ocid={`creator.${tab}.tab`}
                      className="text-xs capitalize rounded-lg"
                    >
                      {tab.slice(0, 4)}
                    </TabsTrigger>
                  ),
                )}
              </TabsList>

              <TabsContent value="base">
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  Base Color
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((c) => (
                    <OptionTile
                      key={c}
                      label={c}
                      selected={config.color === c}
                      onClick={() => setConfig({ ...config, color: c })}
                    >
                      <div
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: BASE_COLORS[c] }}
                      />
                    </OptionTile>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="eyes">
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  Eye Style
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {EYE_STYLES.map((style) => (
                    <OptionTile
                      key={style}
                      label={style}
                      selected={config.eyeStyle === style}
                      onClick={() => setConfig({ ...config, eyeStyle: style })}
                    >
                      <EmojiSVG
                        config={{
                          ...config,
                          eyeStyle: style,
                          expression: "none",
                        }}
                        size={56}
                      />
                    </OptionTile>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="mouth">
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  Mouth Style
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {MOUTH_STYLES.map((style) => (
                    <OptionTile
                      key={style}
                      label={style}
                      selected={config.mouthStyle === style}
                      onClick={() =>
                        setConfig({ ...config, mouthStyle: style })
                      }
                    >
                      <EmojiSVG
                        config={{
                          ...config,
                          mouthStyle: style,
                          expression: "none",
                        }}
                        size={56}
                      />
                    </OptionTile>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="accessories">
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  Accessory
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {ACCESSORIES.map((acc) => (
                    <OptionTile
                      key={acc}
                      label={acc}
                      selected={config.accessory === acc}
                      onClick={() => setConfig({ ...config, accessory: acc })}
                    >
                      <EmojiSVG
                        config={{ ...config, accessory: acc }}
                        size={56}
                      />
                    </OptionTile>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="expressions">
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  Expression Presets
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {EXPRESSIONS.map((expr) => (
                    <OptionTile
                      key={expr}
                      label={expr}
                      selected={config.expression === expr}
                      onClick={() => applyExpression(expr)}
                    >
                      <span className="text-3xl">{EXPRESSION_EMOJI[expr]}</span>
                    </OptionTile>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent data-ocid="save.dialog">
          <DialogHeader>
            <DialogTitle>Save Your Emoji</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex justify-center">
              <EmojiSVG config={config} size={120} />
            </div>
            <Input
              placeholder="Give your emoji a name..."
              value={emojiName}
              onChange={(e) => setEmojiName(e.target.value)}
              data-ocid="save.name.input"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setSaveOpen(false)}
              data-ocid="save.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              data-ocid="save.confirm.button"
              className="gradient-cta text-white border-none rounded-full"
            >
              {isSaving ? "Saving..." : "Save Emoji"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Choose Your Base",
      desc: "Pick a base color and shape that expresses your style.",
    },
    {
      num: "2",
      title: "Customize Details",
      desc: "Mix and match eyes, mouths, accessories, and expressions.",
    },
    {
      num: "3",
      title: "Download & Share",
      desc: "Save, share a link, or download your emoji as a PNG file.",
    },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            Create your emoji in 3 simple steps
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black"
                style={{ backgroundColor: "#36D1C4" }}
              >
                {step.num}
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SAMPLE_EMOJIS: EmojiConfig[] = [
  {
    name: "Cool Cat",
    color: "blue",
    eyeStyle: "wink",
    mouthStyle: "smirk",
    accessory: "sunglasses",
    expression: "cool",
    baseShape: "circle",
  },
  {
    name: "Happy Star",
    color: "yellow",
    eyeStyle: "stars",
    mouthStyle: "big grin",
    accessory: "halo",
    expression: "happy",
    baseShape: "circle",
  },
  {
    name: "Party Time",
    color: "orange",
    eyeStyle: "wide",
    mouthStyle: "big grin",
    accessory: "hat",
    expression: "happy",
    baseShape: "circle",
  },
  {
    name: "Sweet Heart",
    color: "pink",
    eyeStyle: "dots",
    mouthStyle: "smile",
    accessory: "bowtie",
    expression: "happy",
    baseShape: "circle",
  },
  {
    name: "Sleepy Joe",
    color: "purple",
    eyeStyle: "sleepy",
    mouthStyle: "smile",
    accessory: "none",
    expression: "sleepy",
    baseShape: "circle",
  },
  {
    name: "Nerdy Vibes",
    color: "green",
    eyeStyle: "wide",
    mouthStyle: "smile",
    accessory: "glasses",
    expression: "happy",
    baseShape: "circle",
  },
];

function FeaturedCreations() {
  const { data: saved, isLoading } = useGetAllEmojis();
  const { mutate: seed } = useSeedEmojis();

  const emojis = saved && saved.length > 0 ? saved : SAMPLE_EMOJIS;

  return (
    <section id="gallery" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 flex flex-col items-center gap-2"
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground">
            Featured Creations
          </h2>
          <p className="text-muted-foreground">Emojis made by our community</p>
          {(!saved || saved.length === 0) && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full mt-2"
              onClick={() => seed()}
              data-ocid="gallery.seed.button"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Load Sample Emojis
            </Button>
          )}
        </motion.div>
        {isLoading ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            data-ocid="gallery.loading_state"
          >
            {["sk1", "sk2", "sk3", "sk4"].map((k) => (
              <Skeleton key={k} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            data-ocid="gallery.list"
          >
            <AnimatePresence>
              {emojis.slice(0, 8).map((emoji, i) => (
                <motion.div
                  key={`${emoji.name}-${emoji.color}-${emoji.eyeStyle}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ delay: i * 0.08 }}
                  data-ocid={`gallery.item.${i + 1}`}
                  className="rounded-2xl p-4 flex flex-col items-center gap-2 border border-border shadow-card hover:shadow-md transition-shadow"
                  style={{
                    backgroundColor: CARD_BG_COLORS[i % CARD_BG_COLORS.length],
                  }}
                >
                  <EmojiSVG config={emoji} size={96} />
                  <span className="text-sm font-semibold text-foreground text-center">
                    {emoji.name}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        {emojis.length === 0 && !isLoading && (
          <div className="text-center py-12" data-ocid="gallery.empty_state">
            <span className="text-5xl">🎨</span>
            <p className="text-muted-foreground mt-3">
              No emojis yet — be the first to create one!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  return (
    <footer className="bg-[#1a1a2e] text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">😄</span>
              <span className="font-bold text-xl">EmojiFun</span>
            </div>
            <p className="text-white/60 text-sm max-w-xs">
              The world's most fun emoji creator. Design, customize, and share
              your unique emojis.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/60">
                Product
              </h4>
              <ul className="space-y-2">
                {["Create", "Gallery", "How It Works"].map((l) => (
                  <li key={l}>
                    <a
                      href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                      className="text-white/70 hover:text-white text-sm transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-white/40 text-sm">
          © {year}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [config, setConfig] = useState<EmojiConfig>(DEFAULT_CONFIG);
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emojiParam = params.get("emoji");
    if (emojiParam) {
      try {
        const parsed = JSON.parse(
          decodeURIComponent(emojiParam),
        ) as EmojiConfig;
        setConfig(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-poppins">
      <Toaster richColors position="top-right" />
      <Navbar onCreateClick={scrollToWorkspace} />
      <main>
        <HeroSection onStartCreating={scrollToWorkspace} />
        <div ref={workspaceRef}>
          <CreatorWorkspace config={config} setConfig={setConfig} />
        </div>
        <HowItWorks />
        <FeaturedCreations />
      </main>
      <Footer />
    </div>
  );
}
