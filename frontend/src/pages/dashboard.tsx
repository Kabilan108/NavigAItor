import { Navigate } from "react-router-dom";

import LoadingSpinner from "@/components/ui/loading-spinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/ui/dashboard/sidebar";

import Header from "@/components/ui/dashboard/header";
import { Chat, ChatDrawer } from "@/components/chat";

import { type SharedProps, Tabs } from "@/lib/utils";
import { useAuth, useTabs } from "@/lib/context";

interface Props extends SharedProps {}

function TabContent(props: Props) {
  switch (props.activeTab.id) {
    case Tabs.CHAT.id:
      return (
        <>
          <Header {...props} children={<ChatDrawer />} />
          <Chat {...props} />
        </>
      );
    case Tabs.KNOWLEDGE_BASE.id:
      return (
        <>
          <Header {...props} />
          {/* <KnowledgeBase {...props} /> */}
        </>
      );
    case Tabs.PROMPTS.id:
      return (
        <>
          <Header {...props} />
          {/* <Prompts {...props} /> */}
        </>
      );
    case Tabs.HELP.id:
      return (
        <>
          <Header {...props} />
          {/* <Help {...props} /> */}
        </>
      );
    case Tabs.SETTINGS.id:
      return (
        <>
          <Header {...props} />
          {/* <Settings {...props} /> */}
        </>
      );
    case Tabs.ACCOUNT.id:
      return (
        <>
          <Header {...props} />
          {/* <Account {...props} /> */}
        </>
      );
    default:
      return <div>Unknown tab selected</div>;
  }
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { activeTab, setActiveTab } = useTabs();

  const props: Props = { activeTab, setActiveTab, user: user! };

  // redirect only after loading
  if (!loading && user === undefined) {
    return <Navigate to="/login" />;
  }

  // render the rest of the component only after loading
  if (loading || user === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <TooltipProvider>
      <div className="grid h-screen w-full pl-[53px]">
        <Sidebar {...props} />
        <div className="flex flex-col">
          <TabContent {...props} />
        </div>
      </div>
    </TooltipProvider>
  );
}
