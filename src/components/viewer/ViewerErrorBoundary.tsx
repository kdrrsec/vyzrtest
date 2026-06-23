"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; fallback: ReactNode };

type State = { hasError: boolean };

export class ViewerErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("[VYZR 3D] ViewerErrorBoundary", msg, stack ?? "", info.componentStack);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

type SubtreeProps = { children: ReactNode; fallback: ReactNode; name?: string };

/**
 * Catches errors inside the Canvas (e.g. failed GLB load, Environment HDR fetch)
 * without replacing the whole viewer chrome.
 */
export class SubtreeErrorBoundary extends Component<SubtreeProps, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(
      "[VYZR 3D]",
      this.props.name ?? "canvas-subtree",
      error.message,
      info.componentStack
    );
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
