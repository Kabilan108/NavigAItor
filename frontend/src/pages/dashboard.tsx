import { Navigate } from "react-router-dom";

import LoadingSpinner from "@/components/ui/loading-spinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/ui/sidebar";

import Header from "@/components/ui/app-header";
import { Chat, ChatDrawer } from "@/components/chat";

import { type SharedProps, Tabs } from "@/lib/utils";
import { useAuth, useTabs } from "@/lib/context";
import "@/pages/App.css";

interface Props extends SharedProps {}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { activeTab, setActiveTab } = useTabs();

  const props: Props = { activeTab, setActiveTab, user };

  // redirect only after loading
  if (!loading && user === undefined) {
    console.log("not logged in");
    return <Navigate to="/login" />;
  }

  // render the rest of the component only after loading
  if (loading || user === undefined) {
    return <LoadingSpinner />;
  }

  const renderDrawer = () => {
    if (activeTab === Tabs.CHAT) {
      return <ChatDrawer />;
    }
  };

  const renderTab = (props: Props) => {
    switch (props.activeTab.id) {
      case Tabs.CHAT.id:
        return <Chat {...props} />;
      // case "prompts":
      //   return <Prompts />;
      // case "knowledge-base":
      //   return <KnowledgeBase />;
      // case "help":
      //   return <Help />;
      // case "settings":
      //   return <Settings />;
      // case "account":
      //   return <Account />;
    }
  };

  return (
    <TooltipProvider>
      <div className="grid h-screen w-full pl-[53px]">
        <Sidebar {...props} />
        <div className="flex flex-col">
          <Header {...props}>{renderDrawer()}</Header>
          {renderTab(props)}
        </div>
      </div>
    </TooltipProvider>
  );
}
