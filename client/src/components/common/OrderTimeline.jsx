const STEPS = [
  {
    status:  "CONFIRMED",
    label:   "Order Confirmed",
    icon:    "✅",
    desc:    "Your order has been placed",
  },
  {
    status:  "PROCESSING",
    label:   "Processing",
    icon:    "⚙️",
    desc:    "Your order is being packed",
  },
  {
    status:  "SHIPPED",
    label:   "Shipped",
    icon:    "🚚",
    desc:    "Your order is on the way",
  },
  {
    status:  "DELIVERED",
    label:   "Delivered",
    icon:    "📦",
    desc:    "Order delivered successfully",
  },
];

const CANCELLED_STEP = {
  status: "CANCELLED",
  label:  "Cancelled",
  icon:   "❌",
  desc:   "Order has been cancelled",
};

const RETURNED_STEP = {
  status: "RETURNED",
  label:  "Returned",
  icon:   "↩️",
  desc:   "Return has been initiated",
};

export default function OrderTimeline({ status, statusLogs = [] }) {
  const isCancelled = status === "CANCELLED";
  const isReturned  = status === "RETURNED";

  // Map logs by status for quick lookup
  const logMap = {};
  statusLogs.forEach((log) => {
    if (!logMap[log.status]) logMap[log.status] = log;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleString("en-IN", {
      day:    "numeric",
      month:  "short",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });
  };

  // Determine which step index is current
  const stepOrder = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentIndex = isCancelled || isReturned
    ? -1
    : stepOrder.indexOf(status);

  if (isCancelled || isReturned) {
    const specialStep = isCancelled ? CANCELLED_STEP : RETURNED_STEP;
    const log = logMap[status];
    return (
      <div className="bg-carbon border border-white/10 rounded-sm p-6">
        <h3 className="font-display text-xl text-ivory mb-6">Order Timeline</h3>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-red-500/20 border border-red-500/30 flex-shrink-0">
            {specialStep.icon}
          </div>
          <div>
            <p className="text-red-400 font-semibold">{specialStep.label}</p>
            <p className="text-muted text-sm">{specialStep.desc}</p>
            {log && (
              <p className="text-muted text-xs mt-1">{formatDate(log.createdAt)}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-carbon border border-white/10 rounded-sm p-6">
      <h3 className="font-display text-xl text-ivory mb-6">Order Timeline</h3>
      <div className="relative">
        {STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent   = index === currentIndex;
          const log         = logMap[step.status];

          return (
            <div key={step.status} className="flex items-start gap-4 relative">

              {/* Vertical line connecting steps */}
              {index < STEPS.length - 1 && (
                <div
                  className={`absolute left-5 top-10 w-0.5 h-full -translate-x-1/2 transition-colors duration-500
                    ${index < currentIndex ? "bg-gold" : "bg-white/10"}`}
                  style={{ height: "calc(100% - 8px)" }}
                />
              )}

              {/* Circle icon */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-all duration-500
                  ${isCompleted
                    ? "bg-gold/20 border-2 border-gold"
                    : "bg-white/5 border-2 border-white/20"
                  }
                  ${isCurrent ? "ring-2 ring-gold/40 ring-offset-2 ring-offset-carbon" : ""}
                `}
              >
                {isCompleted ? step.icon : (
                  <span className="text-white/20 text-sm">{index + 1}</span>
                )}
              </div>

              {/* Text content */}
              <div className="pb-8 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`font-semibold text-sm transition-colors
                    ${isCompleted ? "text-ivory" : "text-muted"}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30">
                      Current
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 ${isCompleted ? "text-muted" : "text-white/20"}`}>
                  {step.desc}
                </p>
                {log && isCompleted && (
                  <p className="text-gold/70 text-xs mt-1 font-mono">
                    {formatDate(log.createdAt)}
                  </p>
                )}
                {!log && isCompleted && (
                  <p className="text-muted text-xs mt-1 italic">
                    Completed
                  </p>
                )}
                {!isCompleted && (
                  <p className="text-white/15 text-xs mt-1">Pending</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}