'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getPlaceholderAvatar } from "@/lib/placeholder-image";
import Image from "next/image";
import { useState } from "react";
import { LuDownload, LuEye, LuSearch } from "react-icons/lu";

// Mock order data
const initialOrders = [
  {
    id: "ORD-7352",
    customer: {
      id: 1,
      name: "Oluwaseun A.",
      email: "oluwaseun@example.com",
    },
    products: [
      { id: 1, name: "Royal Agbada Set", quantity: 1, price: 85000 }
    ],
    date: "Mar 24, 2025",
    total: 85000,
    status: "Delivered",
    paymentStatus: "Paid",
    shippingAddress: "123 Lagos Street, Lagos, Nigeria",
  },
  {
    id: "ORD-7351",
    customer: {
      id: 2,
      name: "Chijioke M.",
      email: "chijioke@example.com",
    },
    products: [
      { id: 2, name: "Embroidered Kaftan", quantity: 1, price: 45000 }
    ],
    date: "Mar 23, 2025",
    total: 45000,
    status: "Processing",
    paymentStatus: "Paid",
    shippingAddress: "456 Abuja Road, Abuja, Nigeria",
  },
  {
    id: "ORD-7350",
    customer: {
      id: 3,
      name: "Kofi O.",
      email: "kofi@example.com",
    },
    products: [
      { id: 3, name: "Velvet Agbada", quantity: 1, price: 95000 },
      { id: 7, name: "Traditional Cap", quantity: 1, price: 15000 },
      { id: 8, name: "Beaded Necklace", quantity: 1, price: 25000 },
    ],
    date: "Mar 22, 2025",
    total: 135000,
    status: "Shipped",
    paymentStatus: "Paid",
    shippingAddress: "789 Accra Ave, Accra, Ghana",
  },
  {
    id: "ORD-7349",
    customer: {
      id: 4,
      name: "Ngozi E.",
      email: "ngozi@example.com",
    },
    products: [
      { id: 4, name: "Classic Kaftan", quantity: 1, price: 35000 }
    ],
    date: "Mar 21, 2025",
    total: 35000,
    status: "Delivered",
    paymentStatus: "Paid",
    shippingAddress: "101 Enugu Street, Enugu, Nigeria",
  },
  {
    id: "ORD-7348",
    customer: {
      id: 5,
      name: "Kwame A.",
      email: "kwame@example.com",
    },
    products: [
      { id: 5, name: "Premium Agbada Set", quantity: 1, price: 120000 },
      { id: 7, name: "Traditional Cap", quantity: 1, price: 15000 },
    ],
    date: "Mar 20, 2025",
    total: 135000,
    status: "Delivered",
    paymentStatus: "Paid",
    shippingAddress: "202 Kumasi Road, Kumasi, Ghana",
  },
  {
    id: "ORD-7347",
    customer: {
      id: 6,
      name: "Amara C.",
      email: "amara@example.com",
    },
    products: [
      { id: 6, name: "Luxury Kaftan", quantity: 2, price: 65000 }
    ],
    date: "Mar 19, 2025",
    total: 130000,
    status: "Delivered",
    paymentStatus: "Paid",
    shippingAddress: "303 Port Harcourt Blvd, Port Harcourt, Nigeria",
  },
  {
    id: "ORD-7346",
    customer: {
      id: 7,
      name: "Tunde O.",
      email: "tunde@example.com",
    },
    products: [
      { id: 1, name: "Royal Agbada Set", quantity: 1, price: 85000 },
      { id: 8, name: "Beaded Necklace", quantity: 1, price: 25000 },
    ],
    date: "Mar 18, 2025",
    total: 110000,
    status: "Cancelled",
    paymentStatus: "Refunded",
    shippingAddress: "404 Ibadan Lane, Ibadan, Nigeria",
  },
  {
    id: "ORD-7345",
    customer: {
      id: 8,
      name: "Fatima I.",
      email: "fatima@example.com",
    },
    products: [
      { id: 2, name: "Embroidered Kaftan", quantity: 1, price: 45000 },
      { id: 4, name: "Classic Kaftan", quantity: 1, price: 35000 },
    ],
    date: "Mar 17, 2025",
    total: 80000,
    status: "Delivered",
    paymentStatus: "Paid",
    shippingAddress: "505 Kano Street, Kano, Nigeria",
  },
  {
    id: "ORD-7344",
    customer: {
      id: 9,
      name: "Adeola M.",
      email: "adeola@example.com",
    },
    products: [
      { id: 3, name: "Velvet Agbada", quantity: 1, price: 95000 },
    ],
    date: "Mar 16, 2025",
    total: 95000,
    status: "Processing",
    paymentStatus: "Pending",
    shippingAddress: "606 Lagos Road, Lagos, Nigeria",
  },
  {
    id: "ORD-7343",
    customer: {
      id: 10,
      name: "Emmanuel K.",
      email: "emmanuel@example.com",
    },
    products: [
      { id: 5, name: "Premium Agbada Set", quantity: 1, price: 120000 },
      { id: 7, name: "Traditional Cap", quantity: 1, price: 15000 },
      { id: 8, name: "Beaded Necklace", quantity: 1, price: 25000 },
    ],
    date: "Mar 15, 2025",
    total: 160000,
    status: "Pending",
    paymentStatus: "Pending",
    shippingAddress: "707 Accra Street, Accra, Ghana",
  },
];

export default function OrdersPage() {
  const [orders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof initialOrders[0] | null>(null);

  // Filter orders based on search query and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPayment = paymentFilter === "all" || order.paymentStatus.toLowerCase() === paymentFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-neutral-500 mt-1">Manage and track customer orders.</p>
        </div>
        <Button className="md:w-auto w-full" size="sm" variant="outline">
          <LuDownload className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
          <CardDescription>
            Use the filters below to find specific orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <LuSearch className="h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setPaymentFilter("all");
            }}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-neutral-50">
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Order ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Customer
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Date
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Total
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Payment
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b transition-colors hover:bg-neutral-50"
                >
                  <td className="p-4 align-middle font-medium">{order.id}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image 
                          src={getPlaceholderAvatar(order.customer.id, 100)}
                          alt={order.customer.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-xs text-neutral-500">{order.customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">{order.date}</td>
                  <td className="p-4 align-middle">₦{order.total.toLocaleString()}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Shipped"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-neutral-100 text-neutral-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : order.paymentStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <LuEye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No orders found</h3>
          <p className="text-neutral-500 mb-6">
            Try adjusting your filters to find what you&apos;re looking for.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setPaymentFilter("all");
          }}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-500">
          Showing <strong>{filteredOrders.length}</strong> of{" "}
          <strong>{orders.length}</strong> orders
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-neutral-100">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Order Details</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Order ID</h3>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Date</h3>
                  <p>{selectedOrder.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Customer</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      <Image 
                        src={getPlaceholderAvatar(selectedOrder.customer.id, 100)}
                        alt={selectedOrder.customer.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{selectedOrder.customer.name}</div>
                      <div className="text-xs text-neutral-500">{selectedOrder.customer.email}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Shipping Address</h3>
                  <p>{selectedOrder.shippingAddress}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Status</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedOrder.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : selectedOrder.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : selectedOrder.status === "Shipped"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedOrder.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-neutral-100 text-neutral-800"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Payment Status</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedOrder.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-800"
                        : selectedOrder.paymentStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-3">Order Items</h3>
              <div className="rounded-md border mb-6">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-neutral-50">
                        <th className="h-10 px-4 text-left align-middle font-medium text-neutral-500">
                          Product
                        </th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-neutral-500">
                          Price
                        </th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-neutral-500">
                          Quantity
                        </th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-neutral-500">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {selectedOrder.products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b transition-colors hover:bg-neutral-50"
                        >
                          <td className="p-4 align-middle font-medium">{product.name}</td>
                          <td className="p-4 align-middle">₦{product.price.toLocaleString()}</td>
                          <td className="p-4 align-middle">{product.quantity}</td>
                          <td className="p-4 align-middle">₦{(product.price * product.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-neutral-200 pt-4">
                <div>
                  <h3 className="text-lg font-medium">Order Total</h3>
                  <p className="text-neutral-500 text-sm">Including shipping and taxes</p>
                </div>
                <div className="text-2xl font-bold">
                  ₦{selectedOrder.total.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
              <Select defaultValue={selectedOrder.status.toLowerCase()}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button>Update Order</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
