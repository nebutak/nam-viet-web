"use client";

import React, { createContext, useContext, useState } from "react";

// Context để quản lý state của Tabs
type TabsContextType = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// --- 1. Tabs Root ---
interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, className, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// --- 2. Tabs List (Container chứa các nút) ---
export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`flex ${className}`}>{children}</div>;
}

// --- 3. Tabs Trigger (Nút bấm chuyển tab) ---
interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const isActive = context.activeTab === value;

  return (
    <button
      className={`${className} ${isActive ? "data-[state=active]" : ""}`}
      onClick={() => context.setActiveTab(value)}
      // Thêm data attribute để dễ style từ bên ngoài (Tailwind)
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </button>
  );
}

// --- 4. Tabs Content (Nội dung từng tab) ---
interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  if (context.activeTab !== value) return null;

  return <div className={className}>{children}</div>;
}