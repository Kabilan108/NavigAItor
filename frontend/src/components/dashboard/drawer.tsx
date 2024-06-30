import {
  Drawer as BaseDrawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import * as Icons from "@/components/icons";

export default function Drawer({ children }: { children: React.ReactNode }) {
  return (
    <BaseDrawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden ml-2">
          <Icons.Options className="size-5" />
          <span className="sr-only">Options</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Sources</DrawerTitle>
          <DrawerDescription>
            View the sources that the model used to generate its answer.
          </DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </BaseDrawer>
  );
}
