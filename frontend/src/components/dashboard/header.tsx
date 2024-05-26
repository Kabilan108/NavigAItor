import UserAvatar from "@/components/dashboard/user-avatar";

import { type SharedProps } from "@/lib/utils";

interface Props extends SharedProps {
  children?: React.ReactNode;
}

export default function Header(props: Props) {
  const { children, ...rest } = props;
  return (
    <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
      <h1 className="text-xl font-semibold">{rest.activeTab.title}</h1>
      {children}
      <UserAvatar {...rest} />
    </header>
  );
}
