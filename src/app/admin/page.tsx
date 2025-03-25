'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LuArrowUpRight, LuDollarSign, LuPackage, LuShoppingCart, LuUsers } from "react-icons/lu";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function AdminDashboard() {
  // Mock data for charts
  const salesData = [
    { name: "Jan", total: 1500000 },
    { name: "Feb", total: 2300000 },
    { name: "Mar", total: 1800000 },
    { name: "Apr", total: 2100000 },
    { name: "May", total: 2800000 },
    { name: "Jun", total: 3200000 },
    { name: "Jul", total: 2600000 },
  ];

  const visitsData = [
    { name: "Mon", visits: 120 },
    { name: "Tue", visits: 160 },
    { name: "Wed", visits: 180 },
    { name: "Thu", visits: 190 },
    { name: "Fri", visits: 170 },
    { name: "Sat", visits: 250 },
    { name: "Sun", visits: 220 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-neutral-500 mt-1">Overview of your store performance and analytics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <LuDollarSign className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦12,500,000</div>
            <p className="text-xs text-neutral-500 mt-1">
              <span className="text-green-500 inline-flex items-center">
                +12.5% <LuArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <LuShoppingCart className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-neutral-500 mt-1">
              <span className="text-green-500 inline-flex items-center">
                +8.2% <LuArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <LuPackage className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-neutral-500 mt-1">
              <span className="text-green-500 inline-flex items-center">
                +4 <LuArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <LuUsers className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,205</div>
            <p className="text-xs text-neutral-500 mt-1">
              <span className="text-green-500 inline-flex items-center">
                +18.3% <LuArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salesData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₦${value / 1000000}M`}
                    />
                    <Bar
                      dataKey="total"
                      fill="currentColor"
                      radius={[4, 4, 0, 0]}
                      className="fill-primary"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Store Visits</CardTitle>
                <CardDescription>Daily visits for the current week</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={visitsData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="visits"
                      stroke="#000"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-neutral-500">
                Analytics content will be implemented in the next phase
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download custom reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-neutral-500">
                Reports functionality will be implemented in the next phase
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Recent Orders</h2>
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
                    Products
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                    Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                    Amount
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {[
                  {
                    id: "ORD-7352",
                    customer: "Oluwaseun A.",
                    products: 2,
                    date: "Mar 24, 2025",
                    amount: "₦85,000",
                    status: "Delivered",
                  },
                  {
                    id: "ORD-7351",
                    customer: "Chijioke M.",
                    products: 1,
                    date: "Mar 23, 2025",
                    amount: "₦45,000",
                    status: "Processing",
                  },
                  {
                    id: "ORD-7350",
                    customer: "Kofi O.",
                    products: 3,
                    date: "Mar 22, 2025",
                    amount: "₦125,000",
                    status: "Shipped",
                  },
                  {
                    id: "ORD-7349",
                    customer: "Ngozi E.",
                    products: 1,
                    date: "Mar 21, 2025",
                    amount: "₦35,000",
                    status: "Delivered",
                  },
                  {
                    id: "ORD-7348",
                    customer: "Kwame A.",
                    products: 2,
                    date: "Mar 20, 2025",
                    amount: "₦95,000",
                    status: "Delivered",
                  },
                ].map((order) => (
                  <tr
                    key={order.id}
                    className="border-b transition-colors hover:bg-neutral-50"
                  >
                    <td className="p-4 align-middle font-medium">{order.id}</td>
                    <td className="p-4 align-middle">{order.customer}</td>
                    <td className="p-4 align-middle">{order.products}</td>
                    <td className="p-4 align-middle">{order.date}</td>
                    <td className="p-4 align-middle">{order.amount}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
