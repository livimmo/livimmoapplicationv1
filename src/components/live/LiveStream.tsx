import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { LiveInfo } from "./LiveInfo";
import { useState } from "react";
import { X, Maximize2, Minimize2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveCarousel } from "./LiveCarousel";
import { ReplayCarousel } from "./ReplayCarousel";
import { liveStreams } from "@/data/mockLives";
import { cn } from "@/lib/utils";

interface LiveStreamProps {
  videoId: string;
  currentLiveId: number;
  otherLives: any[];
  onLiveChange?: (liveId: number) => void;
  isReplay?: boolean;
}

const replayTimestamps = [
  'VIQpb65HmMs',
  'VIQpb65HmMs?start=300',
  'VIQpb65HmMs?start=600',
  'VIQpb65HmMs?start=900',
  'VIQpb65HmMs?start=1200',
];

const mockProperty = {
  id: 1,
  title: "Villa Moderne avec Piscine",
  price: 2500000,
  location: "Marrakech",
  type: "Villa",
  surface: 350,
  rooms: 5,
  bathrooms: 3,
  description: "Magnifique villa moderne avec piscine et jardin paysager",
  features: ["Piscine", "Jardin", "Garage"],
  images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"],
  hasLive: true,
  liveDate: new Date(),
  agent: {
    name: "Karim Benjelloun",
    image: "https://i.pravatar.cc/150?u=karim",
    phone: "+212 6 00 11 22 33",
    email: "karim.benjelloun@example.com",
  },
  coordinates: {
    lat: 31.7917,
    lng: -7.0926,
  },
  transactionType: "Vente" as const,
};

export const LiveStream = ({ 
  videoId, 
  currentLiveId,
  otherLives,
  onLiveChange,
  isReplay = false,
}: LiveStreamProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'default' | 'cinema' | 'fullscreen'>('default');
  const [showOtherLives, setShowOtherLives] = useState(!isMobile);

  const handleViewModeChange = (mode: 'default' | 'cinema' | 'fullscreen') => {
    if (mode === 'fullscreen') {
      const element = document.documentElement;
      if (!document.fullscreenElement) {
        element.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
    setViewMode(mode);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleLiveSelect = (liveId: number) => {
    navigate(`/live/${liveId}`);
  };

  const getEmbedUrl = () => {
    const baseUrl = 'https://www.youtube.com/embed/';
    const videoIdWithTimestamp = isReplay 
      ? replayTimestamps[Math.floor(Math.random() * replayTimestamps.length)]
      : videoId;
    
    const autoplayParam = isReplay ? '&autoplay=1' : '';
    return `${baseUrl}${videoIdWithTimestamp}?rel=0&modestbranding=1&showinfo=0${autoplayParam}`;
  };

  return (
    <div className={cn(
      "fixed inset-0 bg-black flex flex-col",
      viewMode === 'fullscreen' && 'z-[9999]'
    )}>
      <div className="relative flex-1">
        {/* Header mobile avec bouton retour */}
        {isMobile && (
          <div className="absolute top-0 left-0 right-0 p-4 z-[52] bg-gradient-to-b from-black/70 via-black/40 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              onClick={handleClose}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Conteneur vidéo avec overlay */}
        <div className={cn(
          "relative w-full h-full z-[1] group",
          viewMode === 'fullscreen' && 'fixed inset-0 z-[9999]'
        )}>
          <iframe
            src={getEmbedUrl()}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
          {/* Overlay sombre au survol */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Contrôles vidéo avec fond dégradé */}
        <div className="absolute bottom-[64px] left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex justify-between items-center gap-2 z-[51]">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            onClick={() => setShowOtherLives(!showOtherLives)}
          >
            {showOtherLives ? (
              <Minimize2 className="h-6 w-6" />
            ) : (
              <Maximize2 className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Carousel avec transition fluide */}
        <div 
          className={cn(
            "absolute left-0 right-0 z-[51] transition-all duration-300 ease-in-out",
            showOtherLives 
              ? isMobile 
                ? "bottom-[180px] opacity-100" 
                : "bottom-[120px] opacity-100" 
              : "-bottom-full opacity-0"
          )}
        >
          {isReplay ? (
            <ReplayCarousel
              replays={liveStreams}
              currentReplayId={currentLiveId}
              onReplaySelect={handleLiveSelect}
            />
          ) : (
            <LiveCarousel
              lives={liveStreams}
              currentLiveId={currentLiveId}
              onLiveSelect={handleLiveSelect}
            />
          )}
        </div>

        {/* Informations de la vidéo avec fond flouté */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 z-[52]",
          viewMode === 'fullscreen' && 'z-[9999]'
        )}>
          <LiveInfo 
            property={mockProperty}
            onMakeOffer={() => {}}
            viewerCount={Math.floor(Math.random() * 1000)}
            onToggleChat={() => {}}
            isReplay={isReplay}
            onToggleFullscreen={() => handleViewModeChange(viewMode === 'fullscreen' ? 'default' : 'fullscreen')}
            isFullscreen={viewMode === 'fullscreen'}
          />
        </div>
      </div>
    </div>
  );
};