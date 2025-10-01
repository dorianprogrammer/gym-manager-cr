import Modal from "./Modal"; // your base modal component
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function PaymentsModal({
  isOpen,
  onClose,
  modalDay,
  modalItems = [],
  isLoading = false,
  onConfirmPayment,
  onSendReminder,
  onRefresh,
}) {
  // Calculate totals
  const count = modalItems.length;
  const total = modalItems.reduce((s, p) => s + (p.amountCRC || 0), 0);
  const isOverdue = modalDay && format(modalDay, "yyyy-MM-dd") < format(new Date(), "yyyy-MM-dd");

  // Title component
  const title = (
    <div className="flex-1">
      <h3 className="text-lg font-semibold tracking-tight">
        {modalDay ? format(modalDay, "EEEE d 'de' MMMM", { locale: es }) : "Día"}
      </h3>

      {/* Status chip + totals (only when loaded) */}
      {!isLoading && modalItems.length > 0 && (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
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
        </div>
      )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg" showCloseButton={true} closeOnOverlayClick={true}>
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400" />

      {/* Body content */}
      <div className="mt-2">
        {isLoading ? (
          // Loading skeleton
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
          // Empty state
          <div className="rounded-xl border border-dashed bg-gray-50/70 p-6 text-center text-sm text-gray-500">
            No hay pagos pendientes este día.
          </div>
        ) : (
          // Items list
          <ul className="divide-y -mx-6">
            {modalItems.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 px-6">
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
                    <p className="text-xs text-gray-500 leading-tight">Adeuda ₡{p.amountCRC.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      await onConfirmPayment(p.id);
                      onClose();
                    }}
                    className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    Registrar pago
                  </button>
                  <button
                    onClick={() => onSendReminder(p.id)}
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

      {/* Footer actions */}
      <div className="mt-6 flex items-center justify-end gap-2 border-t pt-4 -mx-6 px-6 -mb-6 pb-6 bg-gray-50/50">
        <button
          onClick={onClose}
          className="rounded-lg border px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Cerrar
        </button>
        <button
          onClick={onRefresh}
          className="rounded-lg border px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Actualizar
        </button>
      </div>
    </Modal>
  );
}
