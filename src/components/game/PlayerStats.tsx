
import { CrownIcon } from "lucide-react";

const PlayerStats = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="h-5 w-5 flex items-center justify-center bg-fantasy-purple/20 rounded-full border border-fantasy-purple/50">
            <CrownIcon size={12} className="text-fantasy-gold" />
          </span>
          <span className="text-sm font-medium">Level 5</span>
        </div>
        <div className="h-6 w-[200px] xp-bar">
          <div className="xp-progress" style={{ width: '60%' }}></div>
        </div>
        <span className="text-xs text-muted-foreground">300/500 XP</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div className="h-5 w-5 flex items-center justify-center">
            <img src="/lovable-uploads/f6994451-b92c-48d9-be93-feaaf85bff8a.png" alt="Gold" className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-fantasy-gold">1,245</span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="h-5 w-5 flex items-center justify-center">
            <img src="/lovable-uploads/c0ce5755-bcb5-423a-baec-11074d96c6cd.png" alt="Gems" className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-fantasy-gem">54</span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="h-5 w-5 flex items-center justify-center">
            <img src="/lovable-uploads/eff6f3ed-69ac-47c8-ada2-50d0852653dc.png" alt="Energy" className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-blue-400">24/30</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
