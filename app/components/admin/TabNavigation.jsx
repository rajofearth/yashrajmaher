import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabNavigation({ activeTab = "all", tabs = [], onTabChange }) {
  if (!tabs.length) {
    // Default tabs
    tabs = [
      { id: "all", label: "All" },
      { id: "published", label: "Published" }
    ];
  }

  return (
    <div className="pb-3">
      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={onTabChange}
        className="mx-4"
      >
        <TabsList className="h-auto bg-transparent p-0 border-b border-border w-full rounded-none justify-start gap-8">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={`rounded-none px-0 py-4 border-b-[3px] data-[state=active]:border-primary data-[state=inactive]:border-transparent
                          data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=active]:shadow-none
                          text-sm font-bold leading-normal tracking-[0.015em] bg-transparent`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
} 