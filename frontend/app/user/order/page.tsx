// app/account/orders/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

enum PaymentMethod {
  COD = "COD",
  ONLINE = "ONLINE",
}

interface SellProductItem {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  totalPrice: number;
  brandName: string;
  category: string;
}

interface ShipmentDetails {
  name: string;
  phone: string;
  house: string;
  paymentMethod: PaymentMethod;
  comment?: string;
}

interface Order {
  _id: string;
  products: SellProductItem[];
  shipment: ShipmentDetails;
  orderStatus: OrderStatus;
  createdAt: string;
  totalAmount: number;
}

// Demo data - 12 orders for pagination
const demoOrders: Order[] = [
  {
    _id: "1",
    products: [
      {
        productId: "p1",
        slug: "premium-headphones",
        name: "Premium Wireless Headphones",
        quantity: 1,
        totalPrice: 249.99,
        brandName: "AudioTech Pro",
        category: "Audio",
      },
    ],
    shipment: {
      name: "Masud Rana",
      phone: "+880 1712345679",
      house: "House 123, Road 4, Bashundhara, Dhaka",
      paymentMethod: PaymentMethod.COD,
      comment: "Please deliver in the morning",
    },
    orderStatus: OrderStatus.DELIVERED,
    createdAt: "2025-11-01",
    totalAmount: 249.99,
  },
  {
    _id: "2",
    products: [
      {
        productId: "p2",
        slug: "smart-watch",
        name: "Smart Watch Pro Max",
        quantity: 1,
        totalPrice: 299.99,
        brandName: "TechWear",
        category: "Watches",
      },
    ],
    shipment: {
      name: "Masud Rana",
      phone: "+880 1712345679",
      house: "House 123, Road 4, Bashundhara, Dhaka",
      paymentMethod: PaymentMethod.ONLINE,
    },
    orderStatus: OrderStatus.SHIPPED,
    createdAt: "2025-11-03",
    totalAmount: 299.99,
  },
  {
    _id: "3",
    products: [
      {
        productId: "p4",
        slug: "power-bank",
        name: "Portable Power Bank 50000mAh",
        quantity: 1,
        totalPrice: 34.99,
        brandName: "PowerTech",
        category: "Accessories",
      },
    ],
    shipment: {
      name: "Masud Rana",
      phone: "+880 1712345679",
      house: "House 123, Road 4, Bashundhara, Dhaka",
      paymentMethod: PaymentMethod.COD,
    },
    orderStatus: OrderStatus.PENDING,
    createdAt: "2025-11-04",
    totalAmount: 34.99,
  },
  {
    _id: "4",
    products: [
      {
        productId: "p5",
        slug: "running-shoes",
        name: "Professional Running Shoes",
        quantity: 2,
        totalPrice: 199.98,
        brandName: "SportZone",
        category: "Shoes",
      },
    ],
    shipment: {
      name: "Masud Rana",
      phone: "+880 1712345679",
      house: "House 123, Road 4, Bashundhara, Dhaka",
      paymentMethod: PaymentMethod.COD,
    },
    orderStatus: OrderStatus.PROCESSING,
    createdAt: "2025-10-28",
    totalAmount: 199.98,
  },
  {
    _id: "5",
    products: [
      {
        productId: "p6",
        slug: "wallet",
        name: "Premium Leather Wallet",
        quantity: 1,
        totalPrice: 89.99,
        brandName: "LuxeStyle",
        category: "Accessories",
      },
    ],
    shipment: {
      name: "Masud Rana",
      phone: "+880 1712345679",
      house: "House 123, Road 4, Bashundhara, Dhaka",
      paymentMethod: PaymentMethod.ONLINE,
    },
    orderStatus: OrderStatus.CONFIRMED,
    createdAt: "2025-10-25",
    totalAmount: 89.99,
  },
  {
    _id: "6",
    products: [
      {
        productId: "p7",
        slug: "gaming-mouse",
        name: "Wireless Gaming Mouse",
        quantity: 1,
        totalPrice: 59.99,
        brandName: "GameGear",
        category: "Gaming",
      },
    ],
    shipment: {
      name: "Masud Rana",
      phone: "+880 1712345679",
      house: "House 123, Road 4, Bashundhara, Dhaka",
      paymentMethod: PaymentMethod.COD,
    },
    orderStatus: OrderStatus.DELIVERED,
    createdAt: "2025-10-20",
    totalAmount: 59.99,
  },
  {
    _id: "7",
    products: [
      {
        productId: "p8",
        slug: "tshirt",
        name: "Cotton T-Shirt Classic",
        quantity: 3,
        totalPrice: 59.97,
        brandName: "ComfortWear",
        category: "Clothing",
      },
    ],
    shipment: {
      name: "Masud Rana",
      phone: "+880 1712345679",
      house: "House 123, Road 4, Bashundhara, Dhaka",
      paymentMethod: PaymentMethod.COD,
    },
    orderStatus: OrderStatus.DELIVERED,
    createdAt: "2025-10-15",
    totalAmount: 59.97,
  },
  {
    _id: "8",
    products: [
      {
        productId: "p9",
        slug: "webcam",
        name: "4K Webcam Ultra HD",
        quantity: 1,
        totalPrice: 179.99,
        brandName: "CameraPro",
        category: "Cameras",
      },
    ],
    shipment: {
      name: "Masud Rana",
      phone: "+880 1712345679",
      house: "House 123, Road 4, Bashundhara, Dhaka",
      paymentMethod: PaymentMethod.ONLINE,
    },
    orderStatus: OrderStatus.CANCELLED,
    createdAt: "2025-10-10",
    totalAmount: 179.99,
  },
  {
    _id: "9",
    products: [
      {
        productId: "p10",
        slug: "keyboard",
        name: "Mechanical Gaming Keyboard",
        quantity: 1,
        totalPrice: 129.99,
        brandName: "KeyMaster",
        category: "Gaming",
      },
    ],
    shipment: {
      name: "Masud Rana",
      phone: "+880 1712345679",
      house: "House 123, Road 4, Bashundhara, Dhaka",
      paymentMethod: PaymentMethod.COD,
    },
    orderStatus: OrderStatus.DELIVERED,
    createdAt: "2025-10-05",
    totalAmount: 129.99,
  },
  {
    _id: "10",
    products: [
      {
        productId: "p11",
        slug: "monitor",
        name: "27 Inch Gaming Monitor",
        quantity: 1,
        totalPrice: 399.99,
        brandName: "DisplayPro",
        category: "Electronics",
      },
    ],
    shipment: {
      name: "Masud Rana",
      phone: "+880 1712345679",
      house: "House 123, Road 4, Bashundhara, Dhaka",
      paymentMethod: PaymentMethod.ONLINE,
    },
    orderStatus: OrderStatus.SHIPPED,
    createdAt: "2025-09-30",
    totalAmount: 399.99,
  },
  {
    _id: "11",
    products: [
      {
        productId: "p12",
        slug: "charger",
        name: "Fast USB-C Charger",
        quantity: 2,
        totalPrice: 39.98,
        brandName: "ChargeFast",
        category: "Accessories",
      },
    ],
    shipment: {
      name: "Masud Rana",
      phone: "+880 1712345679",
      house: "House 123, Road 4, Bashundhara, Dhaka",
      paymentMethod: PaymentMethod.COD,
    },
    orderStatus: OrderStatus.DELIVERED,
    createdAt: "2025-09-25",
    totalAmount: 39.98,
  },
  {
    _id: "12",
    products: [
      {
        productId: "p13",
        slug: "speaker",
        name: "Portable Bluetooth Speaker",
        quantity: 1,
        totalPrice: 79.99,
        brandName: "SoundWave",
        category: "Audio",
      },
    ],
    shipment: {
      name: "Masud Rana",
      phone: "+880 1712345679",
      house: "House 123, Road 4, Bashundhara, Dhaka",
      paymentMethod: PaymentMethod.ONLINE,
    },
    orderStatus: OrderStatus.PENDING,
    createdAt: "2025-09-20",
    totalAmount: 79.99,
  },
];

const ITEMS_PER_PAGE = 5;

const getStatusColor = (status: OrderStatus) => {
  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-700",
    [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-700",
    [OrderStatus.PROCESSING]: "bg-palette-accent-1/20 text-palette-accent-1",
    [OrderStatus.SHIPPED]: "bg-palette-accent-3/20 text-palette-accent-3",
    [OrderStatus.DELIVERED]: "bg-palette-accent-2/30 text-palette-text",
    [OrderStatus.CANCELLED]: "bg-red-100 text-red-700",
  };
  return statusColors[status];
};

const formatStatus = (status: OrderStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "high" | "low">(
    "newest"
  );

  // Sort orders
  const sortedOrders = useMemo(() => {
    const sorted = [...demoOrders];
    switch (sortBy) {
      case "oldest":
        return sorted.reverse();
      case "high":
        return sorted.sort((a, b) => b.totalAmount - a.totalAmount);
      case "low":
        return sorted.sort((a, b) => a.totalAmount - b.totalAmount);
      case "newest":
      default:
        return sorted;
    }
  }, [sortBy]);

  // Paginate
  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = sortedOrders.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  return (
    <div className="w-full space-y-6 container mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-palette-text">My Orders</h2>
        <p className="text-palette-text/60 text-sm mt-2">
          View and track your orders
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="flex justify-end">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-palette-text">
            Sort by:
          </label>
          <Select
            value={sortBy}
            onValueChange={(value: any) => {
              setSortBy(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] border border-gray-200">
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="high">Highest Price</SelectItem>
              <SelectItem value="low">Lowest Price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border border-gray-200 shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-palette-bg border-b border-gray-200">
                <TableRow className="hover:bg-palette-bg">
                  <TableHead className="text-palette-text font-bold">
                    Order ID
                  </TableHead>
                  <TableHead className="text-palette-text font-bold">
                    Date
                  </TableHead>
                  <TableHead className="text-palette-text font-bold">
                    Products
                  </TableHead>
                  <TableHead className="text-palette-text font-bold">
                    Amount
                  </TableHead>
                  <TableHead className="text-palette-text font-bold">
                    Status
                  </TableHead>
                  <TableHead className="text-palette-text font-bold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="border-b border-gray-200 hover:bg-palette-bg/50 transition"
                  >
                    <TableCell className="font-medium text-palette-text">
                      #{order._id.substring(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-palette-text/70">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-palette-text/70">
                      {order.products.length} item
                      {order.products.length > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="font-semibold text-palette-text">
                      ৳{order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {formatStatus(order.orderStatus)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setSelectedOrder(order)}
                        variant="outline"
                        size="sm"
                        className="text-palette-btn border-palette-btn hover:bg-palette-btn/10 gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-palette-text/60">
          Showing {startIdx + 1} to{" "}
          {Math.min(startIdx + ITEMS_PER_PAGE, sortedOrders.length)} of{" "}
          {sortedOrders.length} orders
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <PaginationItem key={idx + 1}>
                <PaginationLink
                  onClick={() => setCurrentPage(idx + 1)}
                  isActive={currentPage === idx + 1}
                  className={
                    currentPage === idx + 1
                      ? "bg-palette-btn text-white hover:bg-palette-btn/90"
                      : ""
                  }
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-palette-text">
                Order Details #{selectedOrder._id.substring(0, 8).toUpperCase()}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between bg-palette-bg p-4 rounded-lg">
                <span className="font-semibold text-palette-text">Status:</span>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    selectedOrder.orderStatus
                  )}`}
                >
                  {formatStatus(selectedOrder.orderStatus)}
                </span>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-bold text-palette-text mb-4">Products</h3>
                <div className="space-y-3">
                  {selectedOrder.products.map((product, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-palette-text">
                            {product.name}
                          </p>
                          <p className="text-sm text-palette-text/60">
                            {product.brandName} • {product.category}
                          </p>
                        </div>
                        <p className="font-bold text-palette-btn">
                          ৳{product.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between text-sm text-palette-text/60">
                        <span>Quantity: {product.quantity}</span>
                        <span>SKU: {product.slug}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipment Details */}
              <div className="bg-palette-accent-2/10 border border-palette-accent-2/30 rounded-lg p-4">
                <h3 className="font-bold text-palette-text mb-4">
                  Shipment Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-palette-text/70">Name:</span>
                    <span className="font-medium text-palette-text">
                      {selectedOrder.shipment.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-palette-text/70">Phone:</span>
                    <span className="font-medium text-palette-text">
                      {selectedOrder.shipment.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-palette-text/70">Address:</span>
                    <span className="font-medium text-palette-text text-right">
                      {selectedOrder.shipment.house}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-palette-text/70">Payment:</span>
                    <span className="font-medium text-palette-text">
                      {selectedOrder.shipment.paymentMethod}
                    </span>
                  </div>
                  {selectedOrder.shipment.comment && (
                    <div className="flex justify-between">
                      <span className="text-palette-text/70">Note:</span>
                      <span className="font-medium text-palette-text">
                        {selectedOrder.shipment.comment}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Total */}
              <div className="flex justify-between items-center bg-palette-bg p-4 rounded-lg border border-gray-200">
                <span className="font-bold text-palette-text">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-palette-btn">
                  ৳{selectedOrder.totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-palette-btn hover:bg-palette-btn/90 text-white"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
