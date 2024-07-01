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

import Tooltip from "@/components/dashboard/tooltip";

import { deleteDocument } from "@/client";
import { type Document, DocumentType } from "@/client/types";

const METADATA_FIELDS = [
  { key: "name", name: "Name", className: "" },
  { key: "document_type", name: "Type", className: "" },
  { key: "tags", name: "Tags", className: "" },
  { key: "delete", name: "", className: "" },
];

const BadgeColors = {
  document_type: {
    [DocumentType.SLIDES]: "bg-[#e9795d]",
    [DocumentType.DOCUMENT]: "bg-[#f4a261]",
    [DocumentType.RECORDING]: "bg-[#e9c46a]",
    [DocumentType.UPLOAD]: "bg-[#2a9d8f]",
  },
  tags: "bg-[#2a9d8f]",
};

// TODO: dialog needs to get the document passed to it
// maybe use Sheet instead of Dialog
// see https://github.com/shadcn-ui/ui/issues/1905

const DocumentEntry = ({
  document,
  handleTriggerDialog,
  onDelete,
}: {
  document: Document;
  handleTriggerDialog: () => void;
  onDelete: (id: string) => void;
}) => {
  const handleRowClick = () => {
    handleTriggerDialog();
  };

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const response = await deleteDocument(document.id);
      onDelete(document.id);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const badge = (field: (typeof METADATA_FIELDS)[number]) => (
    <Badge
      className={
        field.key === "document_type"
          ? BadgeColors[field.key][document.metadata[field.key]]
          : BadgeColors[field.key]
      }
    >
      {field.key === "document_type"
        ? document.metadata[field.key]
        : `#${document.metadata[field.key]}`}
    </Badge>
  );

  return (
    <TableRow onClick={handleRowClick}>
      {METADATA_FIELDS.map((field) => {
        return (
          <TableCell key={field.key} className={field.className}>
            {field.key === "document_type" || field.key === "tags"
              ? badge(field)
              : document.metadata[field.key]}
          </TableCell>
        );
      })}
      <TableCell>
        <Tooltip type="delete" onClick={handleDelete} />
      </TableCell>
    </TableRow>
  );
};

const DocumentTable = ({
  documents,
  isOpenDialog,
  setIsOpenDialog,
  onDelete,
}: {
  documents: Document[];
  isOpenDialog: boolean;
  setIsOpenDialog: (value: boolean) => void;
  onDelete: (id: string) => void;
}) => {
  const handleTriggerDialog = () => {
    // setIsOpenDialog(!isOpenDialog);
    setIsOpenDialog(false);
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
              onDelete={onDelete}
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
  onDelete: (id: string) => void;
}

export default function Documents({ documents, onDelete }: Props) {
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
        onDelete={onDelete}
      />
    </Card>
  );
}
