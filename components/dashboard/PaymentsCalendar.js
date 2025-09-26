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
import { Dialog, Transition } from "@headlessui/react";
import { useMonthlyDuePayments } from "@/hooks/useMonthlyDuePayments";

const HOVER_CLOSE_DELAY = 150;

export default function PaymentsCalendar() {
  const [month, setMonth] = useState(new Date());

  // CLICK modal (full actions)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState(null);
  const [modalItems, setModalItems] = useState([]);

  // HOVER popover (tiny stats)
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

  // Map date -> pending[]
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

  // MOCK actions (keep as-is; real wiring later)
  const sendReminder = async (paymentId) => {
    await fetch("/api/payments/reminder", { method: "POST", body: JSON.stringify({ paymentId }) });
  };
  const confirmPayment = async (paymentId) => {
    await fetch("/api/payments/confirm", { method: "POST", body: JSON.stringify({ paymentId }) });
    await refresh();
  };

  // ----- hover popover helpers -----
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
      y: Math.round(rect.top) - 10, // popover above the cell
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

  // ----- click modal helpers -----
  const openModalForDay = (day) => {
    const key = isoKey(day);
    const items = (pendingByDay.get(key) || []).slice().sort((a, b) => a.memberName.localeCompare(b.memberName));
    setModalDay(day);
    setModalItems(items);
    setModalOpen(true);
  };

  return (
    <div className="w-full relative">
      {/* Header */}
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

      {/* Week labels */}
      <div className="grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-center text-xs font-medium text-gray-600">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
          <div key={d} className="bg-white py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
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

      {/* HOVER POPOVER (tiny stats) */}
      {hoverCard.show && (
        <div
          onMouseEnter={cancelHideHover}
          onMouseLeave={scheduleHideHover}
          className="fixed z-40 pointer-events-auto select-none"
          style={{ left: hoverCard.x, top: hoverCard.y, transform: "translate(-50%, -100%)" }}
        >
          <div className="rounded-xl border bg-white p-3 text-xs min-w-[180px]">
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
          </div>
        </div>
      )}

      {/* CLICK MODAL (full actions) */}
      <Transition.Root show={modalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setModalOpen(false)}>
          {/* Frosted backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px]" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-150"
                enterFrom="opacity-0 translate-y-1 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-1 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                  {/* Accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400" />

                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 px-5 pt-4">
                    <div>
                      <Dialog.Title className="text-lg font-semibold tracking-tight">
                        {modalDay ? format(modalDay, "EEEE d 'de' MMMM", { locale: es }) : "Día"}
                      </Dialog.Title>

                      {/* Status chip + totals (only when loaded) */}
                      {!isLoading && (
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          {(() => {
                            const count = modalItems.length;
                            const total = modalItems.reduce((s, p) => s + (p.amountCRC || 0), 0);
                            const isOverdue =
                              modalDay && format(modalDay, "yyyy-MM-dd") < format(new Date(), "yyyy-MM-dd");

                            return (
                              <>
                                <span
                                  className={[
                                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                    isOverdue ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800",
                                  ].join(" ")}
                                >
                                  {isOverdue ? "Pendiente vencido" : "Pendiente"}
                                </span>
                                <span>
                                  • {count} {count === 1 ? "membresía" : "membresías"}
                                </span>
                                <span>
                                  • Total <strong className="text-gray-800">₡{total.toLocaleString()}</strong>
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Close button */}
                    <button
                      onClick={() => setModalOpen(false)}
                      className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Cerrar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6.225 4.811a1 1 0 0 1 1.414 0L12 9.172l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 10.586l4.361 4.361a1 1 0 0 1-1.414 1.414L12 12l-4.361 4.361a1 1 0 1 1-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 0 1 0-1.414Z" />
                      </svg>
                    </button>
                  </div>

                  {/* Body */}
                  <div className="px-5 pb-2 pt-3">
                    {isLoading ? (
                      // Skeleton
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
                              <div className="space-y-2">
                                <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                                <div className="h-2 w-24 animate-pulse rounded bg-gray-100" />
                              </div>
                            </div>
                            <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    ) : modalItems.length === 0 ? (
                      <div className="rounded-xl border border-dashed bg-gray-50/70 p-6 text-center text-sm text-gray-500">
                        No hay pagos pendientes este día.
                      </div>
                    ) : (
                      <ul className="divide-y">
                        {modalItems.map((p) => (
                          <li key={p.id} className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              {/* Avatar/initials */}
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                                {p.memberName
                                  .split(" ")
                                  .map((w) => w[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium leading-tight">{p.memberName}</p>
                                <p className="text-xs text-gray-500 leading-tight">
                                  Adeuda ₡{p.amountCRC.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={async () => {
                                  await confirmPayment(p.id);
                                  setModalOpen(false);
                                }}
                                className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                              >
                                Registrar pago
                              </button>
                              <button
                                onClick={async () => {
                                  await sendReminder(p.id);
                                }}
                                className="rounded-lg border px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                              >
                                Recordatorio
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Sticky footer */}
                  <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-white/80 px-5 py-3 backdrop-blur">
                    <button
                      onClick={() => setModalOpen(false)}
                      className="rounded-lg border px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={() => refresh()}
                      className="rounded-lg border px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      Actualizar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
