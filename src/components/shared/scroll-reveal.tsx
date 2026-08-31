"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

type RevealState = "server" | "pending" | "visible";

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("server");

  useEffect(() => {
    const element = elementRef.current;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches || !("IntersectionObserver" in window) || !element) {
      setState("visible");
      return;
    }

    setState("pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={cn(
        "scroll-reveal",
        state === "pending" && "scroll-reveal-pending",
        state === "visible" && "scroll-reveal-visible",
        className,
      )}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
