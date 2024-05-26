import { useState } from "react";

import Card from "@/components/dashboard/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { type Document, DocumentType } from "@/lib/utils";

const METADATA_FIELDS = [
  { key: "name", name: "Name", className: "" },
  { key: "document_type", name: "Type", className: "" },
  { key: "tags", name: "Tags", className: "" },
];

const BadgeColors = {
  document_type: {
    [DocumentType.SLIDES]: "bg-[#e9795d]",
    [DocumentType.DOCUMENT]: "bg-[#f4a261]",
    [DocumentType.RECORDING]: "bg-[#e9c46a]",
    test: "bg-[#2a9d8f]",
  },
};

// TODO: dialog needs to get the document passed to it
// maybe use Sheet instead of Dialog
// see https://github.com/shadcn-ui/ui/issues/1905

const DocumentEntry = ({
  document,
  handleTriggerDialog,
}: {
  document: Document;
  handleTriggerDialog: () => void;
}) => {
  const handleRowClick = () => {
    handleTriggerDialog();
  };

  return (
    <TableRow onClick={handleRowClick}>
      {METADATA_FIELDS.map((field) => {
        return (
          <TableCell key={field.key} className={field.className}>
            {field.key === "document_type" ? (
              <Badge
                className={BadgeColors[field.key][document.metadata[field.key]]}
              >
                {document.metadata[field.key]}
              </Badge>
            ) : (
              document.metadata[field.key]
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

const DocumentTable = ({
  documents,
  isOpenDialog,
  setIsOpenDialog,
}: {
  documents: Document[];
  isOpenDialog: boolean;
  setIsOpenDialog: (value: boolean) => void;
}) => {
  const handleTriggerDialog = () => {
    setIsOpenDialog(!isOpenDialog);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {METADATA_FIELDS.map((field) => (
            <TableHead key={field.key} className={field.className}>
              {field.name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <Dialog open={isOpenDialog} onOpenChange={handleTriggerDialog}>
          {documents.map((document) => (
            <DocumentEntry
              key={document.id}
              document={document}
              handleTriggerDialog={handleTriggerDialog}
            />
          ))}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Document X</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableBody>
    </Table>
  );
};

interface Props {
  documents: Document[];
}

export default function Documents({ documents }: Props) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  return (
    <Card
      title="Knowledge Base"
      description="Manage your personal knowledge base."
      className="flex flex-col gap-4"
    >
      <DocumentTable
        documents={documents}
        isOpenDialog={isOpenDialog}
        setIsOpenDialog={setIsOpenDialog}
      />
    </Card>
  );
}
