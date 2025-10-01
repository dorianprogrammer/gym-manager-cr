"use client";
import { Fragment, useMemo, useRef, useState } from "react";
import {
  addMonths,
  subMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import es from "date-fns/locale/es";
import { useMonthlyDuePayments } from "@/hooks/useMonthlyDuePayments";
import PaymentsModal from "../ui/PaymentsModal";
import HoverCard from "../ui/HoverCard";

const HOVER_CLOSE_DELAY = 150;

export default function PaymentsCalendar() {
  const [month, setMonth] = useState(new Date());
  const [modalDay, setModalDay] = useState(null);
  const [modalItems, setModalItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoverCard, setHoverCard] = useState({
    show: false,
    x: 0,
    y: 0,
    day: null,
    count: 0,
    totalCRC: 0,
    overdue: false,
  });
  const hoverTimer = useRef(null);

  const { payments, isLoading, refresh } = useMonthlyDuePayments(month);

  const pendingByDay = useMemo(() => {
    const map = new Map();
    payments.forEach((p) => {
      if (p.status !== "pending") return;
      const key = format(parseISO(p.dueDate), "yyyy-MM-dd");
      map.set(key, [...(map.get(key) || []), p]);
    });
    return map;
  }, [payments]);

  const first = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const last = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: first, end: last });
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const isoKey = (d) => format(d, "yyyy-MM-dd");
  const overdueBadgeClass = (key) =>
    key < todayKey ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-800 border-amber-200";

  const sendReminder = async (paymentId) => {
    await fetch("/api/payments/reminder", { method: "POST", body: JSON.stringify({ paymentId }) });
  };
  const confirmPayment = async (paymentId) => {
    await fetch("/api/payments/confirm", { method: "POST", body: JSON.stringify({ paymentId }) });
    await refresh();
  };

  const openHoverCard = (day, targetEl) => {
    const key = isoKey(day);
    const items = pendingByDay.get(key) || [];
    if (items.length === 0) return;

    const rect = targetEl.getBoundingClientRect();
    const count = items.length;
    const totalCRC = items.reduce((s, it) => s + (it.amountCRC || 0), 0);
    const overdue = key < todayKey;

    setHoverCard({
      show: true,
      x: Math.round(rect.left + rect.width / 2),
      y: Math.round(rect.top) - 10,
      day,
      count,
      totalCRC,
      overdue,
    });
  };

  const scheduleHideHover = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHoverCard((h) => ({ ...h, show: false })), HOVER_CLOSE_DELAY);
  };
  const cancelHideHover = () => clearTimeout(hoverTimer.current);

  const openModalForDay = (day) => {
    const key = isoKey(day);
    const items = (pendingByDay.get(key) || []).slice().sort((a, b) => a.memberName.localeCompare(b.memberName));
    setModalDay(day);
    setModalItems(items);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full relative">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Calendario de Pagos Pendientes</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMonth((m) => subMonths(m, 1))}
            className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
          >
            ←
          </button>
          <div className="min-w-[180px] text-center font-medium capitalize">
            {format(month, "MMMM yyyy", { locale: es })}
          </div>
          <button
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
          >
            →
          </button>
          <button
            onClick={() => setMonth(new Date())}
            className="ml-2 rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
          >
            Hoy
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-center text-xs font-medium text-gray-600">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
          <div key={d} className="bg-white py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm">
        {days.map((day) => {
          const key = isoKey(day);
          const items = pendingByDay.get(key) || [];
          const count = items.length;

          const isThisMonth = isSameMonth(day, month);
          const isCurrent = isToday(day);
          const badgeCls = count > 0 ? overdueBadgeClass(key) : "";

          return (
            <div
              key={key}
              onMouseEnter={(e) => {
                if (count > 0) {
                  cancelHideHover();
                  openHoverCard(day, e.currentTarget);
                }
              }}
              onMouseLeave={scheduleHideHover}
              onClick={() => count > 0 && openModalForDay(day)}
              className={[
                "relative min-h-[84px] bg-white p-2 text-left align-top cursor-pointer",
                !isThisMonth ? "text-gray-300" : "text-gray-700",
                isCurrent ? "ring-2 ring-blue-500" : "",
              ].join(" ")}
              aria-label={`${format(day, "PPP", { locale: es })} (${count} pendientes)`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-xs ${isCurrent ? "font-bold" : ""}`}>{format(day, "d")}</span>
                {count > 0 && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${badgeCls}`}
                  >
                    • {count}
                  </span>
                )}
              </div>

              {count > 0 && (
                <div className="mt-2 flex -space-x-2">
                  {items.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700"
                      title={`${p.memberName} adeuda ₡${p.amountCRC?.toLocaleString()}`}
                    >
                      {p.memberName
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  ))}
                  {count > 3 && (
                    <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-600">
                      +{count - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span> Hoy
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full border"></span> Días del mes
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-300"></span> Pendiente (hoy/próx.)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-red-400"></span> Pendiente vencido
        </span>
      </div>
      <HoverCard
        show={hoverCard.show}
        x={hoverCard.x}
        y={hoverCard.y}
        onMouseEnter={cancelHideHover}
        onMouseLeave={scheduleHideHover}
      >
        <div className="mb-1 font-semibold">
          {hoverCard.day ? format(hoverCard.day, "EEE d MMM", { locale: es }) : ""}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Pendientes</span>
          <span
            className={`ml-2 inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold
                ${
                  hoverCard.overdue
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
                }`}
          >
            • {hoverCard.count}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-gray-600">Total</span>
          <span className="font-medium">₡{hoverCard.totalCRC.toLocaleString()}</span>
        </div>
      </HoverCard>
      <PaymentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalDay={modalDay}
        modalItems={payments}
        isLoading={false}
        onConfirmPayment={confirmPayment}
        onSendReminder={sendReminder}
        onRefresh={refresh}
      />
    </div>
  );
}
