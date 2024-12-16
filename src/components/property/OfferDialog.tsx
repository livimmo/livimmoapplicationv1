import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Euro, HandCoins, UserPlus2 } from "lucide-react";

interface OfferDialogProps {
  title: string;
  price: number;
}

export const OfferDialog = ({ title, price }: OfferDialogProps) => {
  const [offerAmount, setOfferAmount] = useState(price);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const getButtonContent = () => {
    if (!isAuthenticated) {
      return (
        <>
          <UserPlus2 className="w-4 h-4" />
          Faire une offre rapide
        </>
      );
    }
    
    if (price > 1000000) {
      return (
        <>
          <Euro className="w-4 h-4" />
          Proposer un prix
        </>
      );
    }

    return (
      <>
        <HandCoins className="w-4 h-4" />
        Faire une offre
      </>
    );
  };

  const validateForm = () => {
    if (!isAuthenticated) {
      if (!name.trim()) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer votre nom",
          variant: "destructive",
        });
        return false;
      }
      if (!email.trim() || !email.includes("@")) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer une adresse email valide",
          variant: "destructive",
        });
        return false;
      }
      if (!phone.trim()) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer votre numéro de téléphone",
          variant: "destructive",
        });
        return false;
      }
    }
    if (offerAmount <= 0) {
      toast({
        title: "Erreur",
        description: "Le montant de l'offre doit être supérieur à 0",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleOffer = () => {
    if (!validateForm()) return;

    const offerData = {
      propertyTitle: title,
      amount: offerAmount,
      message,
      contact: isAuthenticated
        ? {
            name: `${user?.firstName} ${user?.lastName}`,
            email: user?.email,
            phone: phone,
          }
        : {
            name,
            email,
            phone,
          },
    };

    console.log("Offer data:", offerData);

    toast({
      title: "Offre envoyée !",
      description: `Votre offre de ${offerAmount.toLocaleString()} DH pour ${title} a été envoyée. L'agent vous contactera bientôt.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full" 
          variant={!isAuthenticated ? "secondary" : "default"}
        >
          {getButtonContent()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Faire une offre pour {title}</DialogTitle>
          <DialogDescription>
            Prix demandé : {price.toLocaleString()} DH
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!isAuthenticated && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+212 6XX XXX XXX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant de votre offre (DH) *</Label>
            <Input
              id="amount"
              type="number"
              value={offerAmount}
              onChange={(e) => setOfferAmount(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optionnel)</Label>
            <Textarea
              id="message"
              placeholder="Expliquez votre offre..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button onClick={handleOffer} className="w-full">
            Envoyer l'offre
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};