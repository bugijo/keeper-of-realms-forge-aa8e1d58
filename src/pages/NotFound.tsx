
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-fantasy-dark p-4">
      <div className="text-center max-w-md fantasy-card">
        <h1 className="text-6xl font-medievalsharp mb-4 text-fantasy-gold">404</h1>
        <p className="text-xl text-white mb-6 font-medievalsharp">The quest you seek cannot be found</p>
        <p className="text-muted-foreground mb-8">The dungeon keeper has hidden this realm or it may not exist. Return to familiar territory, brave adventurer.</p>
        <Link to="/" className="fantasy-button primary inline-block">
          Return to Home Realm
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
