"use client";

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-2 text-sm flex-wrap ${className || 'text-[#666]'}`}>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2 whitespace-nowrap">
          {index > 0 && <span>/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-[#c9a227] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Wrapper with white background
interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbBar({ items, className = "" }: BreadcrumbBarProps) {
  return (
    <div className={`bg-white border-b border-[#e5e5e5] ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <Breadcrumb items={items} />
      </div>
    </div>
  );
}

export default Breadcrumb;
