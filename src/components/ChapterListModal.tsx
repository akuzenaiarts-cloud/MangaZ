import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Eye, Lock, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { usePremiumSettings } from "@/hooks/usePremiumSettings";
import type { Chapter } from "@/types/manga";

interface ChapterListModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  mangaSlug: string;
  mangaCover: string;
  currentChapterNumber?: number;
}

const ChapterListModal = ({
  isOpen,
  onClose,
  chapters,
  mangaSlug,
  mangaCover,
  currentChapterNumber,
}: ChapterListModalProps) => {
  const navigate = useNavigate();
  const { settings } = usePremiumSettings();
  const currencyName = settings.coin_system.currency_name;
  const currencyIconUrl = settings.coin_system.currency_icon_url;

  const CurrencyIcon = ({ className }: { className?: string }) =>
    currencyIconUrl ? (
      <img src={currencyIconUrl} alt={currencyName} className={`${className} object-contain`} />
    ) : (
      <Coins className={className} />
    );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] w-[calc(100vw-2rem)] p-0 gap-0 bg-card border-border">
        <DialogHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
          <DialogTitle className="text-base font-bold">
            Chapter List ({chapters.length} chapters)
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] px-3 sm:px-4 pb-4">
          <div className="space-y-2">
            {chapters.map((chapter) => {
              const isCurrent = currentChapterNumber === chapter.number;
              const isPremium = !!chapter.premium;
              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    onClose();
                    navigate(`/manga/${mangaSlug}/chapter/${chapter.number}`);
                  }}
                  className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-200 border group ${
                    isCurrent
                      ? "bg-primary/10 border-primary/40"
                      : "bg-secondary/20 hover:bg-secondary/50 border-transparent hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                    {/* Chapter number */}
                    <div
                      className={`text-xl sm:text-2xl font-bold min-w-[2rem] text-center transition-colors shrink-0 ${
                        isCurrent
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary"
                      }`}
                    >
                      {chapter.number}
                    </div>

                    {/* Chapter info */}
                    <div className="text-left min-w-0">
                      <h3
                        className={`font-semibold text-sm transition-colors flex items-center gap-1.5 flex-wrap ${
                          isCurrent
                            ? "text-primary"
                            : "text-foreground group-hover:text-primary"
                        }`}
                      >
                        <span className="truncate">{chapter.title || `Chapter ${chapter.number}`}</span>
                        {chapter.number >= chapters.length - 2 && (
                          <Badge className="bg-destructive/80 text-destructive-foreground text-[10px] px-1.5 py-0 h-4 font-semibold border-none shrink-0">
                            NEW
                          </Badge>
                        )}
                        {isPremium && (
                          <Badge className="bg-amber-500/15 text-amber-500 text-[10px] px-1.5 py-0 h-4 font-semibold border border-amber-500/20 shrink-0">
                            <Lock className="w-2.5 h-2.5 mr-0.5" /> Premium
                          </Badge>
                        )}
                      </h3>
                      <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-muted-foreground mt-1 flex-wrap">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{chapter.date}</span>
                        </div>
                        <span>{chapter.pages?.length || 8} pages</span>
                        {isPremium && (
                          <div className="flex items-center space-x-1 text-amber-500">
                            <CurrencyIcon className="w-3 h-3" />
                            <span className="font-medium">{(chapter as any).coin_price ?? 100} {currencyName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Current / Premium label */}
                  <span
                    className={`text-xs sm:text-sm font-medium shrink-0 ml-2 ${
                      isCurrent ? "text-primary" : isPremium ? "text-amber-500" : "text-muted-foreground"
                    }`}
                  >
                    {isCurrent ? "Current" : isPremium ? <Lock className="w-4 h-4" /> : "Read"}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ChapterListModal;
