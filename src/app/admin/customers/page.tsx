'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPlaceholderAvatar } from "@/lib/placeholder-image";
import Image from "next/image";
import { useState } from "react";
import { LuEye, LuMail, LuSearch, LuUserPlus } from "react-icons/lu";

// Mock customer data
const initialCustomers = [
  {
    id: 1,
    name: "Oluwaseun A.",
    email: "oluwaseun@example.com",
    phone: "+234 812 345 6789",
    location: "Lagos, Nigeria",
    orders: 5,
    totalSpent: 425000,
    lastOrder: "Mar 24, 2025",
    status: "Active",
  },
  {
    id: 2,
    name: "Chijioke M.",
    email: "chijioke@example.com",
    phone: "+234 803 456 7890",
    location: "Abuja, Nigeria",
    orders: 3,
    totalSpent: 135000,
    lastOrder: "Mar 23, 2025",
    status: "Active",
  },
  {
    id: 3,
    name: "Kofi O.",
    email: "kofi@example.com",
    phone: "+233 24 123 4567",
    location: "Accra, Ghana",
    orders: 7,
    totalSpent: 945000,
    lastOrder: "Mar 22, 2025",
    status: "Active",
  },
  {
    id: 4,
    name: "Ngozi E.",
    email: "ngozi@example.com",
    phone: "+234 805 678 9012",
    location: "Enugu, Nigeria",
    orders: 2,
    totalSpent: 70000,
    lastOrder: "Mar 21, 2025",
    status: "Active",
  },
  {
    id: 5,
    name: "Kwame A.",
    email: "kwame@example.com",
    phone: "+233 50 234 5678",
    location: "Kumasi, Ghana",
    orders: 4,
    totalSpent: 540000,
    lastOrder: "Mar 20, 2025",
    status: "Active",
  },
  {
    id: 6,
    name: "Amara C.",
    email: "amara@example.com",
    phone: "+234 809 012 3456",
    location: "Port Harcourt, Nigeria",
    orders: 3,
    totalSpent: 390000,
    lastOrder: "Mar 19, 2025",
    status: "Active",
  },
  {
    id: 7,
    name: "Tunde O.",
    email: "tunde@example.com",
    phone: "+234 802 345 6789",
    location: "Ibadan, Nigeria",
    orders: 2,
    totalSpent: 110000,
    lastOrder: "Mar 18, 2025",
    status: "Inactive",
  },
  {
    id: 8,
    name: "Fatima I.",
    email: "fatima@example.com",
    phone: "+234 807 890 1234",
    location: "Kano, Nigeria",
    orders: 6,
    totalSpent: 480000,
    lastOrder: "Mar 17, 2025",
    status: "Active",
  },
  {
    id: 9,
    name: "Adeola M.",
    email: "adeola@example.com",
    phone: "+234 813 456 7890",
    location: "Lagos, Nigeria",
    orders: 1,
    totalSpent: 95000,
    lastOrder: "Mar 16, 2025",
    status: "Active",
  },
  {
    id: 10,
    name: "Emmanuel K.",
    email: "emmanuel@example.com",
    phone: "+233 27 345 6789",
    location: "Accra, Ghana",
    orders: 4,
    totalSpent: 640000,
    lastOrder: "Mar 15, 2025",
    status: "Active",
  },
];

export default function CustomersPage() {
  const [customers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof initialCustomers[0] | null>(null);

  // Filter customers based on search query and status filter
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || customer.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-neutral-500 mt-1">Manage your customer database and relationships.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="sm:w-auto w-full" size="sm" variant="outline">
            <LuMail className="mr-2 h-4 w-4" />
            Email Customers
          </Button>
          <Button className="sm:w-auto w-full" size="sm">
            <LuUserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-neutral-500 mt-1">
              {customers.filter(c => c.status === "Active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{Math.round(customers.reduce((acc, customer) => acc + customer.totalSpent / customer.orders, 0) / customers.length).toLocaleString()}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Per customer
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{customers.reduce((acc, customer) => acc + customer.totalSpent, 0).toLocaleString()}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              From all customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Find Customers</CardTitle>
          <CardDescription>
            Search for customers by name, email, phone, or location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <LuSearch className="h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                variant={statusFilter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={statusFilter === "active" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button 
                variant={statusFilter === "inactive" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("inactive")}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-neutral-50">
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Customer
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Location
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Orders
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Total Spent
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Last Order
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b transition-colors hover:bg-neutral-50"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image 
                          src={getPlaceholderAvatar(customer.id, 100)}
                          alt={customer.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-neutral-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">{customer.location}</td>
                  <td className="p-4 align-middle">{customer.orders}</td>
                  <td className="p-4 align-middle">₦{customer.totalSpent.toLocaleString()}</td>
                  <td className="p-4 align-middle">{customer.lastOrder}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-neutral-100 text-neutral-800"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setSelectedCustomer(customer)}
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
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No customers found</h3>
          <p className="text-neutral-500 mb-6">
            Try adjusting your search or filters.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
          }}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-500">
          Showing <strong>{filteredCustomers.length}</strong> of{" "}
          <strong>{customers.length}</strong> customers
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-neutral-100">
            1
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Customer Details</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCustomer(null)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image 
                    src={getPlaceholderAvatar(selectedCustomer.id, 200)}
                    alt={selectedCustomer.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                  <p className="text-neutral-500">{selectedCustomer.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Email</h3>
                  <p>{selectedCustomer.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Phone</h3>
                  <p>{selectedCustomer.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Total Orders</h3>
                  <p>{selectedCustomer.orders}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Total Spent</h3>
                  <p>₦{selectedCustomer.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Last Order</h3>
                  <p>{selectedCustomer.lastOrder}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Status</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedCustomer.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-neutral-100 text-neutral-800"
                    }`}
                  >
                    {selectedCustomer.status}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-3">Recent Orders</h3>
              <div className="rounded-md border mb-6">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-neutral-50">
                        <th className="h-10 px-4 text-left align-middle font-medium text-neutral-500">
                          Order ID
                        </th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-neutral-500">
                          Date
                        </th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-neutral-500">
                          Amount
                        </th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-neutral-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {[...Array(Math.min(selectedCustomer.orders, 3))].map((_, index) => {
                        const orderDate = new Date(selectedCustomer.lastOrder);
                        orderDate.setDate(orderDate.getDate() - index * 30);
                        const formattedDate = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        
                        return (
                          <tr
                            key={index}
                            className="border-b transition-colors hover:bg-neutral-50"
                          >
                            <td className="p-4 align-middle font-medium">ORD-{7352 - index}</td>
                            <td className="p-4 align-middle">{formattedDate}</td>
                            <td className="p-4 align-middle">₦{(selectedCustomer.totalSpent / selectedCustomer.orders).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="p-4 align-middle">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                Delivered
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <LuMail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                <Button className="flex-1">View All Orders</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
