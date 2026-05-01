import { Card, CardContent } from "@/components/ui/card";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { cn, formatDate } from "@/lib/utils";
import { isRiskLevel } from "@/lib/constants/risk-levels";
import { TIMELINE_DOT_TONE } from "@/lib/constants/ui-tokens";
import type { UpdateWithAuthor } from "@/server/queries/startups";

interface UpdatesTimelineProps {
  updates: UpdateWithAuthor[];
}

export function UpdatesTimeline({ updates }: UpdatesTimelineProps) {
  if (updates.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Nenhum update registrado ainda. Use o formulário acima para registrar o
          primeiro.
        </CardContent>
      </Card>
    );
  }

  return (
    <ol className="relative space-y-4 border-l border-border pl-6">
      {updates.map((update) => {
        const dotTone = isRiskLevel(update.risk_at_update)
          ? TIMELINE_DOT_TONE[update.risk_at_update]
          : "bg-muted-foreground";

        return (
          <li key={update.id} className="relative">
            <span
              className={cn(
                "absolute -left-[31px] top-2 h-3 w-3 rounded-full ring-4 ring-background",
                dotTone,
              )}
              aria-hidden
            />
            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatDate(update.update_date)}
                  </span>
                  <RiskBadge risk={update.risk_at_update} />
                  <span className="ml-auto text-xs text-muted-foreground">
                    Por {update.author?.full_name ?? "—"}
                  </span>
                </div>

                <UpdateSection title="O que aconteceu" content={update.what_happened} />
                <UpdateSection title="Bloqueios" content={update.blockers} />
                <UpdateSection title="Próximos passos" content={update.next_steps} />
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ol>
  );
}

function UpdateSection({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  if (!content || content.trim().length === 0) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <p className="whitespace-pre-line text-sm">{content}</p>
    </div>
  );
}
