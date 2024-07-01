import { Navigate } from "react-router-dom";

// import LoadingSpinner from "@/components/ui/loading-spinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

import { ChatContextProvider } from "@/context/chat-provider";

import {
  KnowledgeBase,
  KnowledgeBaseDrawer,
} from "@/components/dashboard/knowledge-base";
import { Chat, ChatDrawer } from "@/components/dashboard/chat";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

import { type SharedProps, Tabs } from "@/lib/utils";
import { useAuth, useTabs } from "@/lib/hooks";

interface Props extends SharedProps {}

function TabContent(props: Props) {
  switch (props.activeTab.id) {
    case Tabs.CHAT.id:
      return (
        <ChatContextProvider>
          <Header {...props} children={<ChatDrawer />} />
          <Chat {...props} />
        </ChatContextProvider>
      );
    case Tabs.KNOWLEDGE_BASE.id:
      return (
        <>
          <Header {...props} children={<KnowledgeBaseDrawer />} />
          <KnowledgeBase {...props} />
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
  const { checkAuth, user } = useAuth();
  const { activeTab, setActiveTab } = useTabs();

  const props: Props = { activeTab, setActiveTab, user: user! };

  // redirect only after loading
  if (!checkAuth()) {
    return <Navigate to="/login" />;
  }

  // TODO: loading

  return (
    <TooltipProvider>
      <div className="grid h-screen w-full pl-[53px]">
        <Sidebar {...props} />
        <div className="flex flex-col">
          <TabContent {...props} />
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
