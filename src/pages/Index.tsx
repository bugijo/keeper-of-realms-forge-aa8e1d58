
import MainLayout from "@/components/layout/MainLayout";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { QuickActions } from "@/components/home/QuickActions";
import { CreationSection } from "@/components/home/CreationSection";
import { QuestsSection } from "@/components/home/QuestsSection";

const Index = () => {
  return (
    <MainLayout>
      <div className="container mx-auto pb-20">
        <WelcomeSection />
        <QuickActions />
        <CreationSection />
        <QuestsSection />
      </div>
    </MainLayout>
  );
};

export default Index;
