"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SimpleTabs({
  defaultValue,
  tabs,
}: {
  defaultValue: string;
  tabs: { value: string; label: string; content: React.ReactNode }[];
}) {
  return (
    <Tabs defaultValue={defaultValue} className="gap-8">
      <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
