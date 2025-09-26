// app/api/payments/due/route.js
import { NextResponse } from "next/server";

/**
 * MOCK ONLY — no DB calls.
 * Mirrors your Firebase docs under gyms/{gymId}/payments
 * and returns a simplified list of "pending" items in [from, to].
 *
 * Fields from your screenshot:
 *  - amount: 25000
 *  - createdAt: August 13, 2025 at 2:26:33 PM UTC-6
 *  - memberId: "F6xAgp7gRSOyoMVabaEY"
 *  - method: "cash"
 *  - planId: "monthly"
 *  - reference: "GM-mbr-0001-20250813"
 *  - status: "confirmed"
 *
 * For the calendar we need a due date per user. Here we MOCK “pending”
 * items for the month using the same shape + a computed `dueDate` field.
 * Later you’ll replace this whole file with a Firestore query that
 * calculates the next due date from the last confirmed payment.
 */

const MOCK_MEMBER_NAMES = {
  F6xAgp7gRSOyoMVabaEY: "Carlos Pérez",
  G7kQ1n0b2c3d4e5f6g7: "María Fernández",
  H8h9i0j1k2l3m4n5o6p: "Ana Rojas",
  J1k2l3m4n5o6p7q8r9s: "Luis Castro",
};

// Helper: yyyy-mm-dd string
const isoDate = (y, m, d) => {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
};

// ===== MOCK DATA (adapt/extend as you like) =====
const MOCK_PENDING = [
  // Example from Sept 13
  {
    id: "mock-s-001",
    gymId: "W7QUHQqThDLI7pd5nlSE",
    amount: 25000,
    createdAt: "2025-09-13T20:26:33.000Z",
    memberId: "F6xAgp7gRSOyoMVabaEY",
    method: "cash",
    planId: "monthly",
    reference: "GM-mbr-0001-20250913",
    status: "pending",
    dueDate: isoDate(2025, 9, 13),
  },

  // A few more across September so you see dots
  {
    id: "mock-s-002",
    gymId: "W7QUHQqThDLI7pd5nlSE",
    amount: 25000,
    createdAt: "2025-09-03T14:00:00.000Z",
    memberId: "G7kQ1n0b2c3d4e5f6g7",
    method: "cash",
    planId: "monthly",
    reference: "GM-mbr-0002-20250903",
    status: "pending",
    dueDate: isoDate(2025, 9, 5),
  },
  {
    id: "mock-s-003",
    gymId: "W7QUHQqThDLI7pd5nlSE",
    amount: 25000,
    createdAt: "2025-09-10T14:00:00.000Z",
    memberId: "H8h9i0j1k2l3m4n5o6p",
    method: "cash",
    planId: "monthly",
    reference: "GM-mbr-0003-20250910",
    status: "pending",
    dueDate: isoDate(2025, 9, 18),
  },
  {
    id: "mock-s-004",
    gymId: "W7QUHQqThDLI7pd5nlSE",
    amount: 20000,
    createdAt: "2025-09-21T14:00:00.000Z",
    memberId: "J1k2l3m4n5o6p7q8r9s",
    method: "cash",
    planId: "monthly",
    reference: "GM-mbr-0004-20250921",
    status: "pending",
    dueDate: isoDate(2025, 9, 25),
  },

  // Example PAID item (won’t be shown)
  {
    id: "mock-s-005",
    gymId: "W7QUHQqThDLI7pd5nlSE",
    amount: 15000,
    createdAt: "2025-09-02T14:00:00.000Z",
    memberId: "G7kQ1n0b2c3d4e5f6g7",
    method: "cash",
    planId: "monthly",
    reference: "GM-mbr-0005-20250902",
    status: "confirmed",
    dueDate: isoDate(2025, 9, 2),
  },
];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from"); // 'YYYY-MM-DD'
  const to = searchParams.get("to"); // 'YYYY-MM-DD'

  // Filter by date range & return simplified shape that the calendar expects
  const inRange = (iso) => {
    const t = new Date(iso).getTime();
    const f = from ? new Date(from).getTime() : -Infinity;
    const tt = to ? new Date(to).getTime() : Infinity;
    return t >= f && t <= tt;
  };

  const result = MOCK_PENDING.filter((p) => inRange(p.dueDate)).map((p) => ({
    // 👉 This is what the calendar component consumes
    id: p.id,
    memberId: p.memberId,
    memberName: MOCK_MEMBER_NAMES[p.memberId] || "Miembro",
    amountCRC: p.amount,
    dueDate: p.dueDate, // 'YYYY-MM-DD'
    status: p.status, // 'pending' | 'confirmed'
    lastReminderAt: null, // keep null for now
  }));

  return NextResponse.json(result);
}
