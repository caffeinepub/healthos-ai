import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Activity,
  Apple,
  BookHeart,
  Brain,
  ClipboardList,
  Crown,
  Dumbbell,
  FileText,
  Heart,
  Home,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AIAssistantTab from "../components/AIAssistantTab";
import DailyTrackingTab from "../components/DailyTrackingTab";
import FamilyHealthTab from "../components/FamilyHealthTab";
import FeedbackTab from "../components/FeedbackTab";
import FitnessTab from "../components/FitnessTab";
import HealthVaultTab from "../components/HealthVaultTab";
import MembershipTab from "../components/MembershipTab";
import MentalHealthTab from "../components/MentalHealthTab";
import NutritionTab from "../components/NutritionTab";
import OnboardingTab from "../components/OnboardingTab";
import OverviewTab from "../components/OverviewTab";
import ProfileTab from "../components/ProfileTab";
import RemindersTab from "../components/RemindersTab";
import RiskDetectionTab from "../components/RiskDetectionTab";
import VitalsTab from "../components/VitalsTab";
import WellnessStoriesTab from "../components/WellnessStoriesTab";

type TabId =
  | "overview"
  | "vitals"
  | "mental"
  | "daily-tracking"
  | "fitness"
  | "nutrition"
  | "membership"
  | "feedback"
  | "stories"
  | "profile"
  | "ai-assistant"
  | "risk-detection"
  | "health-vault"
  | "reminders"
  | "family"
  | "onboarding";

const drawerPrimaryItems = [
  {
    id: "vitals" as TabId,
    label: "Vitals",
    icon: Heart,
    color: "text-rose-400",
  },
  {
    id: "mental" as TabId,
    label: "Mental Health",
    icon: Brain,
    color: "text-violet-400",
  },
  {
    id: "daily-tracking" as TabId,
    label: "Daily Log",
    icon: ClipboardList,
    color: "text-cyan-400",
  },
  {
    id: "fitness" as TabId,
    label: "Fitness",
    icon: Dumbbell,
    color: "text-emerald-400",
  },
  {
    id: "nutrition" as TabId,
    label: "Nutrition",
    icon: Apple,
    color: "text-lime-400",
  },
];

const drawerSecondaryItems = [
  { id: "ai-assistant" as TabId, label: "AI Assistant", icon: Sparkles },
  { id: "health-vault" as TabId, label: "Health Vault", icon: FileText },
  { id: "risk-detection" as TabId, label: "Risk Detection", icon: Shield },
  { id: "reminders" as TabId, label: "Reminders", icon: Activity },
  { id: "family" as TabId, label: "Family Health", icon: Users },
  { id: "membership" as TabId, label: "Membership", icon: Crown },
];

const bottomNavItems = [
  { id: "overview" as TabId, label: "Overview", icon: Home },
  { id: "feedback" as TabId, label: "Feedback", icon: MessageSquare },
  { id: "stories" as TabId, label: "Stories", icon: BookHeart },
  { id: "membership" as TabId, label: "Membership", icon: Crown },
  { id: "profile" as TabId, label: "Settings", icon: Settings },
];

export default function Dashboard({
  onOpenProfileSetup,
}: { onOpenProfileSetup?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigateToMembership = () => setActiveTab("membership");
  const handleNavigateToSettings = () => setActiveTab("profile");

  const navigateTo = (tab: TabId) => {
    setActiveTab(tab);
    setDrawerOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "vitals":
        return <VitalsTab />;
      case "onboarding":
        return <OnboardingTab />;
      case "mental":
        return (
          <MentalHealthTab
            onNavigateToSettings={handleNavigateToSettings}
            onOpenProfileSetup={onOpenProfileSetup}
          />
        );
      case "daily-tracking":
        return <DailyTrackingTab />;
      case "membership":
        return <MembershipTab />;
      case "ai-assistant":
        return <AIAssistantTab />;
      case "risk-detection":
        return <RiskDetectionTab />;
      case "health-vault":
        return <HealthVaultTab />;
      case "fitness":
        return <FitnessTab />;
      case "nutrition":
        return <NutritionTab />;
      case "reminders":
        return (
          <RemindersTab onNavigateToMembership={handleNavigateToMembership} />
        );
      case "family":
        return <FamilyHealthTab />;
      case "feedback":
        return <FeedbackTab />;
      case "stories":
        return <WellnessStoriesTab />;
      case "profile":
        return <ProfileTab onOpenProfileSetup={onOpenProfileSetup} />;
      default:
        return <OverviewTab />;
    }
  };

  const getOcid = (id: TabId): string => {
    if (id === "profile") return "settings";
    return id;
  };

  return (
    <div className="mobile-layout">
      {/* ── Fixed Top Header ── */}
      <header className="mobile-header">
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground/80 hover:text-foreground hover:bg-white/10 rounded-xl"
          onClick={() => setDrawerOpen(true)}
          data-ocid="header.hamburger_button"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="header-logo-dot" />
          <span className="header-title">HealthOS AI</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-foreground/80 hover:text-foreground hover:bg-white/10 rounded-xl"
          onClick={() => navigateTo("membership")}
          aria-label="Membership"
        >
          <Crown className="h-5 w-5 text-amber-400" />
        </Button>
      </header>

      {/* ── Hamburger Drawer ── */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="left"
          className="drawer-sheet w-[300px] sm:w-[320px] p-0 border-0"
          data-ocid="header.menu.sheet"
        >
          <SheetHeader className="drawer-header px-6 pt-8 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="drawer-logo-badge">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-white text-lg font-bold tracking-tight">
                    HealthOS AI
                  </SheetTitle>
                  <p className="text-white/50 text-xs">Your health companion</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl"
                onClick={() => setDrawerOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>

          <div className="px-4 pb-4 overflow-y-auto">
            <p className="drawer-section-label">Health Modules</p>

            <nav className="space-y-1">
              {drawerPrimaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const ocid =
                  item.id === "daily-tracking" ? "daily_log" : item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`drawer-primary-item ${isActive ? "active" : ""}`}
                    onClick={() => navigateTo(item.id)}
                    data-ocid={`drawer.${ocid}.link`}
                  >
                    <span className={`drawer-icon-wrap ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-left text-sm font-medium">
                      {item.label}
                    </span>
                    {isActive && <span className="drawer-active-dot" />}
                  </button>
                );
              })}
            </nav>

            <div className="my-4 border-t border-white/10" />

            <p className="drawer-section-label">More Features</p>

            <nav className="space-y-1">
              {drawerSecondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`drawer-secondary-item ${isActive ? "active" : ""}`}
                    onClick={() => navigateTo(item.id)}
                  >
                    <Icon className="h-4 w-4 text-white/60" />
                    <span className="flex-1 text-left text-sm">
                      {item.label}
                    </span>
                    {item.id === "membership" && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0">
                        PRO
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="my-4 border-t border-white/10" />

            <button
              type="button"
              className="drawer-secondary-item w-full"
              onClick={() => navigateTo("profile")}
            >
              <Settings className="h-4 w-4 text-white/60" />
              <span className="flex-1 text-left text-sm">Settings</span>
            </button>

            <div className="mt-6 mx-1 rounded-2xl drawer-upgrade-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-amber-400" />
                <span className="text-white text-sm font-semibold">
                  Go Premium
                </span>
              </div>
              <p className="text-white/60 text-xs mb-3">
                Unlock AI-powered sleep analysis, therapy modules & more.
              </p>
              <button
                type="button"
                className="drawer-upgrade-btn w-full"
                onClick={() => navigateTo("membership")}
              >
                $20 / 3 months →
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Scrollable Main Content ── */}
      <main className="mobile-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="px-4 py-4"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Fixed Bottom Navigation ── */}
      <nav className="bottom-nav" aria-label="Main navigation">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              type="button"
              key={item.id}
              className={`bottom-nav-item ${isActive ? "active" : ""}`}
              onClick={() => navigateTo(item.id)}
              data-ocid={`bottom_nav.${getOcid(item.id)}.tab`}
              aria-label={item.label}
            >
              <span className="bottom-nav-icon-wrap">
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-pill"
                    className="bottom-nav-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={`h-5 w-5 relative z-10${
                    item.id === "membership" && isActive
                      ? " text-amber-400"
                      : ""
                  }`}
                />
              </span>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
