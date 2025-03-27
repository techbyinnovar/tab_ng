import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ separator = <ChevronRight className="h-4 w-4" />, className, children, ...props }, ref) => {
    // Create a clone of the children with separators
    const items = React.Children.toArray(children);
    const itemsWithSeparators = items.map((item, index) => {
      if (index === 0) {
        return item;
      }
      return (
        <React.Fragment key={index}>
          <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
          {item}
        </React.Fragment>
      );
    });

    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn("flex items-center text-sm text-neutral-500", className)}
        {...props}
      >
        <ol className="flex items-center">{itemsWithSeparators}</ol>
      </nav>
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  current?: boolean;
}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, current, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("inline-flex items-center", className)}
        aria-current={current ? "page" : undefined}
        {...props}
      />
    );
  }
);
BreadcrumbItem.displayName = "BreadcrumbItem";

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  asChild?: boolean;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...props }, ref) => {
    if (asChild) {
      return (
        <span
          ref={ref}
          className={cn("hover:text-neutral-900 transition-colors", className)}
          {...props}
        />
      );
    }

    if (!props.href) {
      return (
        <span
          ref={ref}
          className={cn("font-medium text-neutral-900", className)}
          {...props}
        />
      );
    }

    return (
      <Link
        ref={ref}
        className={cn("hover:text-neutral-900 transition-colors", className)}
        {...props}
      />
    );
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
}

const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("mx-2 text-neutral-400", className)}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
};
