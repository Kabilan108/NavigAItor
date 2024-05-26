import { useEffect, useState } from "react";

import KnowledgeBaseOptions from "@/components/dashboard/knowledge-base/options";
import Documents from "@/components/dashboard/knowledge-base/documents";
import HideablePanel from "@/components/dashboard/hideable-panel";
import Drawer from "@/components/dashboard/drawer";

import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";

import { type SharedProps } from "@/lib/utils";
import type { Document } from "@/lib/utils";
import { getDocuments } from "@/client";

interface Props extends SharedProps {}

const RightPanel = () => <HideablePanel children={<KnowledgeBaseOptions />} />;

export const KnowledgeBaseDrawer = () => (
  <Drawer children={<KnowledgeBaseOptions />} />
);

export function KnowledgeBase(props: Props) {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="relative flex flex-col rounded-xl bg-background p-4 lg:col-span-2">
        <Tabs defaultValue="documents-view">
          <TabsList className="flex justify-center mx-auto max-w-[200px]">
            <TabsTrigger value="documents-view">Documents</TabsTrigger>
            <TabsTrigger value="graph-view" disabled>
              Graph
            </TabsTrigger>
          </TabsList>
          <TabsContent value="documents-view">
            <Documents documents={documents} />
          </TabsContent>
        </Tabs>
      </div>
      <RightPanel />
    </main>
  );
}
