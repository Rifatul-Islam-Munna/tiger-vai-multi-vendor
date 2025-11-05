// app/dashboard/orders/page.tsx
"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Trash2, Clock } from "lucide-react";

import { ViewOrderModal } from "@/components/ui/custom/admin/order-manage/ViewOrderModal";
import { UpdateOrderStatusModal } from "@/components/ui/custom/admin/order-manage/UpdateOrderStatusModal";

// Order Status Colors
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "rgba(239, 68, 68, 0.2)", text: "text-red-400" },
  CONFIRMED: { bg: "rgba(251, 191, 36, 0.2)", text: "text-yellow-400" },
  PROCESSING: { bg: "rgba(59, 130, 246, 0.2)", text: "text-blue-400" },
  SHIPPED: { bg: "rgba(147, 51, 234, 0.2)", text: "text-purple-400" },
  DELIVERED: { bg: "rgba(34, 197, 94, 0.2)", text: "text-green-400" },
  CANCELLED: { bg: "rgba(107, 114, 128, 0.2)", text: "text-gray-400" },
};

// Static Orders Data
const STATIC_ORDERS = [
  {
    _id: "order_001",
    products: [
      {
        productId: "prod_123",
        name: "Premium Cotton T-Shirt",
        slug: "t-shirt",
        quantity: 2,
        unitPrice: 1200,
        totalPrice: 2400,
        variant: { size: "M", color: "Red", price: 1200, discountPrice: 999 },
        brandName: "Nike",
        vendorId: "vendor_1",
      },
      {
        productId: "prod_456",
        name: "Running Shoes",
        slug: "shoes",
        quantity: 1,
        unitPrice: 5500,
        totalPrice: 5500,
        variant: { size: "42", color: "Black", price: 5500 },
        brandName: "Adidas",
        vendorId: "vendor_2",
      },
    ],
    shipment: {
      name: "John Doe",
      phone: "01712345678",
      house: "123 Main Street, Dhaka",
      paymentMethod: "COD",
      comment: "Please deliver in the morning",
    },
    userId: "user_123",
    isAdmin: false,
    orderStatus: "PENDING",
    orderTotal: 7900,
    totalDiscount: 300,
    createdAt: "2025-11-05T10:30:00Z",
    updatedAt: "2025-11-05T10:30:00Z",
  },
  {
    _id: "order_002",
    products: [
      {
        productId: "prod_789",
        name: "Summer Floral Dress",
        slug: "dress",
        quantity: 1,
        unitPrice: 2800,
        totalPrice: 2800,
        variant: { size: "S", color: "Pink", price: 3200, discountPrice: 2800 },
        brandName: "Zara",
        vendorId: "vendor_3",
      },
    ],
    shipment: {
      name: "Jane Smith",
      phone: "01987654321",
      house: "456 Oak Avenue, Chittagong",
      paymentMethod: "ONLINE",
      comment: "Safe packaging please",
    },
    userId: "user_456",
    isAdmin: true,
    orderStatus: "CONFIRMED",
    orderTotal: 2800,
    totalDiscount: 400,
    createdAt: "2025-11-04T14:20:00Z",
    updatedAt: "2025-11-05T08:15:00Z",
  },
  {
    _id: "order_003",
    products: [
      {
        productId: "prod_234",
        name: "Denim Jeans",
        slug: "jeans",
        quantity: 2,
        unitPrice: 2500,
        totalPrice: 5000,
        variant: { size: "32", color: "Dark Blue", price: 2500 },
        brandName: "Levi's",
        vendorId: "vendor_1",
      },
    ],
    shipment: {
      name: "Ahmed Hassan",
      phone: "01756432189",
      house: "789 Pine Road, Sylhet",
      paymentMethod: "COD",
    },
    userId: "user_789",
    isAdmin: false,
    orderStatus: "PROCESSING",
    orderTotal: 5000,
    totalDiscount: 0,
    createdAt: "2025-11-03T09:45:00Z",
    updatedAt: "2025-11-05T11:00:00Z",
  },
  {
    _id: "order_004",
    products: [
      {
        productId: "prod_567",
        name: "Leather Wallet",
        slug: "wallet",
        quantity: 3,
        unitPrice: 800,
        totalPrice: 2400,
        variant: { size: "Standard", color: "Brown", price: 800 },
        brandName: "Fossil",
        vendorId: "vendor_4",
      },
    ],
    shipment: {
      name: "Maria Garcia",
      phone: "01654329876",
      house: "321 Elm Street, Khulna",
      paymentMethod: "ONLINE",
    },
    userId: "user_321",
    isAdmin: true,
    orderStatus: "SHIPPED",
    orderTotal: 2400,
    totalDiscount: 0,
    createdAt: "2025-11-02T16:30:00Z",
    updatedAt: "2025-11-05T09:30:00Z",
  },
  {
    _id: "order_005",
    products: [
      {
        productId: "prod_890",
        name: "Running Shoes Pro",
        slug: "shoes-pro",
        quantity: 1,
        unitPrice: 4800,
        totalPrice: 4800,
        variant: {
          size: "43",
          color: "White",
          price: 5500,
          discountPrice: 4800,
        },
        brandName: "Adidas",
        vendorId: "vendor_2",
      },
    ],
    shipment: {
      name: "Carlos Rodriguez",
      phone: "01834567890",
      house: "654 Maple Drive, Rajshahi",
      paymentMethod: "COD",
    },
    userId: "user_654",
    isAdmin: false,
    orderStatus: "DELIVERED",
    orderTotal: 4800,
    totalDiscount: 700,
    createdAt: "2025-11-01T12:00:00Z",
    updatedAt: "2025-11-04T14:45:00Z",
  },
];

// Status flow - what's the next valid status
const NEXT_STATUS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export default function OrderManagementPage() {
  const [orders, setOrders] = useState(STATIC_ORDERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [statusUpdateOrder, setStatusUpdateOrder] = useState<any>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleOpenStatusUpdate = (order: any) => {
    setStatusUpdateOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = (newStatus: string) => {
    setOrders(
      orders.map((o) =>
        o._id === statusUpdateOrder._id
          ? {
              ...o,
              orderStatus: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );
    setIsStatusModalOpen(false);
    setStatusUpdateOrder(null);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setOrders(orders.filter((o) => o._id !== orderId));
  };

  const total = orders.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedOrders = orders.slice((page - 1) * limit, page * limit);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "var(--palette-bg)",
        color: "var(--palette-text)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p style={{ color: "var(--palette-accent-3)" }} className="mt-1">
            Manage and track all customer orders
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 items-center flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label
              className="text-sm mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Sort By
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger
                style={{
                  borderColor: "var(--palette-accent-3)",
                  backgroundColor: "var(--palette-bg)",
                  color: "var(--palette-text)",
                }}
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "var(--palette-bg)",
                  color: "var(--palette-text)",
                }}
              >
                <SelectItem value="createdAt">Order Date</SelectItem>
                <SelectItem value="orderTotal">Total Amount</SelectItem>
                <SelectItem value="orderStatus">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label
              className="text-sm mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Order
            </label>
            <Select
              value={sortOrder}
              onValueChange={(value: any) => setSortOrder(value)}
            >
              <SelectTrigger
                style={{
                  borderColor: "var(--palette-accent-3)",
                  backgroundColor: "var(--palette-bg)",
                  color: "var(--palette-text)",
                }}
              >
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "var(--palette-bg)",
                  color: "var(--palette-text)",
                }}
              >
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label
              className="text-sm mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Per Page
            </label>
            <Select
              value={limit.toString()}
              onValueChange={(value) => setLimit(parseInt(value))}
            >
              <SelectTrigger
                style={{
                  borderColor: "var(--palette-accent-3)",
                  backgroundColor: "var(--palette-bg)",
                  color: "var(--palette-text)",
                }}
              >
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "var(--palette-bg)",
                  color: "var(--palette-text)",
                }}
              >
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: "var(--palette-accent-3)" }}
        >
          <Table>
            <TableHeader style={{ backgroundColor: "var(--palette-btn)" }}>
              <TableRow>
                <TableHead className="text-white font-semibold">
                  Order ID
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Customer
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Items
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Total
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-white font-semibold">Date</TableHead>
                <TableHead className="text-white font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow
                  key={order._id}
                  style={{ borderColor: "var(--palette-accent-3)" }}
                  className="hover:bg-white/5 transition"
                >
                  <TableCell className="font-mono text-sm">
                    {order._id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.shipment.name}</p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--palette-accent-3)" }}
                      >
                        {order.shipment.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {order.products.length}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">৳{order.orderTotal}</p>
                      {order.totalDiscount > 0 && (
                        <p
                          className="text-xs"
                          style={{ color: "var(--palette-accent-1)" }}
                        >
                          Save: ৳{order.totalDiscount}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        STATUS_COLORS[order.orderStatus]?.text || ""
                      }`}
                      style={{
                        backgroundColor: STATUS_COLORS[order.orderStatus]?.bg,
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="p-2 hover:bg-blue-500/20 rounded transition"
                        title="View Order"
                      >
                        <Eye
                          size={18}
                          style={{ color: "var(--palette-btn)" }}
                        />
                      </button>
                      <button
                        onClick={() => handleOpenStatusUpdate(order)}
                        className="p-2 hover:bg-yellow-500/20 rounded transition"
                        title="Update Status"
                      >
                        <Clock
                          size={18}
                          style={{ color: "var(--palette-accent-1)" }}
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="p-2 hover:bg-red-500/20 rounded transition"
                        title="Delete Order"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div style={{ color: "var(--palette-accent-3)" }}>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)}{" "}
            of {total}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              variant="outline"
              style={{
                borderColor: "var(--palette-accent-3)",
                color:
                  page === 1
                    ? "var(--palette-accent-3)"
                    : "var(--palette-text)",
              }}
            >
              Previous
            </Button>
            <div
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: "var(--palette-btn)",
                color: "white",
              }}
            >
              Page {page} of {totalPages}
            </div>
            <Button
              onClick={() => setPage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              variant="outline"
              style={{
                borderColor: "var(--palette-accent-3)",
                color:
                  page === totalPages
                    ? "var(--palette-accent-3)"
                    : "var(--palette-text)",
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* View Order Modal */}
      <ViewOrderModal
        order={selectedOrder}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedOrder(null);
        }}
      />

      {/* Update Status Modal */}
      <UpdateOrderStatusModal
        order={statusUpdateOrder}
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setStatusUpdateOrder(null);
        }}
        onStatusUpdate={handleUpdateStatus}
        nextStatuses={
          statusUpdateOrder ? NEXT_STATUS[statusUpdateOrder.orderStatus] : []
        }
      />
    </div>
  );
}
