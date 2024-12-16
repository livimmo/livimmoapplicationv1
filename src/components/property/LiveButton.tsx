import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useToast } from "@/hooks/use-toast";

interface LiveButtonProps {
  id: number;
  title: string;
  liveDate?: Date;
  onJoinLive?: () => void;
  isLiveNow?: boolean;
  isUserRegistered?: boolean;
  remainingSeats?: number;
}

export const LiveButton = ({
  id,
  title,
  liveDate,
  onJoinLive,
  isLiveNow,
  isUserRegistered,
  remainingSeats,
}: LiveButtonProps) => {
  const { isAuthenticated } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();

  const handleClick = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    if (isLiveNow && onJoinLive) {
      onJoinLive();
    } else {
      if (isUserRegistered) {
        toast({
          title: "Vous êtes déjà inscrit à ce live",
          description: "Vous recevrez un rappel avant le début du live",
        });
      } else {
        toast({
          title: "Inscription confirmée !",
          description: "Vous recevrez un rappel avant le début du live",
        });
      }
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    if (isLiveNow && onJoinLive) {
      onJoinLive();
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant={isLiveNow ? "destructive" : "default"}
        className="w-full"
      >
        <Video className="w-4 h-4 mr-2" />
        {isLiveNow 
          ? "Rejoindre le live" 
          : isAuthenticated 
            ? isUserRegistered 
              ? "Live réservé" 
              : "S'inscrire au live"
            : "Réserver le live"
        }
      </Button>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        title={isLiveNow ? "Rejoignez le live maintenant !" : "Réservez votre place"}
        description={
          isLiveNow
            ? "Créez votre compte gratuitement pour rejoindre ce live en direct et interagir avec l'agent"
            : "Inscrivez-vous pour réserver votre place et recevoir un rappel avant le début du live"
        }
        liveData={
          liveDate
            ? {
                id,
                title,
                date: liveDate,
                availableSeats: remainingSeats,
              }
            : undefined
        }
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};