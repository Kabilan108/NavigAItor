import React from "react";
import { Link } from "react-router-dom";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface MainNavProps {
  items?: NavItem[];
  className?: string;
}

interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
}

const MainNav: React.FC<MainNavProps> = ({ items, className }) => {
  return (
    <div className={`flex gap-6 md:gap-10 ${className}`}>
      <Link to="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.title}
                </Link>
              ),
          )}
        </nav>
      ) : null}
    </div>
  );
};

export default MainNav;
