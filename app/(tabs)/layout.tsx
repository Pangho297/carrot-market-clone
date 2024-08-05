import TabBar from "@/components/TabBar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[78px]">
      {children}
      <TabBar />
    </div>
  );
}
