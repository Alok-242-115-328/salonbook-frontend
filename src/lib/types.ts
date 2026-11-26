export type Role = "admin" | "customer";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  isBlocked?: boolean;
  phone?: string | null;
};

export type Service = {
  id: string;
  _id?: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
  createdAt?: string;
};

export type Appointment = {
  id: string;
  _id?: string;
  serviceId: Service | string;
  customerId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  servicePrice: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
};

export type CustomerSummary = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  isBlocked: boolean;
  phone?: string | null;
  createdAt?: string;
};

export type Transaction = {
  id: string;
  appointmentId: string | { appointmentDate: string; timeSlot: string; status: string; serviceId?: { serviceName?: string } };
  customerId: string;
  customer?: { name: string; email: string; image?: string | null } | null;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
};
