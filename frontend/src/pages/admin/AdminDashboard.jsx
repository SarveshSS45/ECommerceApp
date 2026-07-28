import { useEffect, useState } from "react";
import { getDashboardData } from "../../services/dashboardService";
import toast from "react-hot-toast";

import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaRupeeSign,
  FaTags,
  FaExclamationTriangle,
  FaTrophy,
  FaChartLine,
  FaClipboardList,
  FaBoxOpen,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import StatCard from "../../components/admin/StatCard";
import StatusBadge from "../../components/admin/StatusBadge";
import StockBadge from "../../components/admin/StockBadge";
import SectionCard from "../../components/admin/SectionCard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Base URL where the .NET API serves product images from (wwwroot)
const IMAGE_BASE_URL = "https://localhost:7172";

const formatINR = (value) => `\u20B9${Number(value || 0).toLocaleString("en-IN")}`;

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();
      setDashboard(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const revenueChartData = {
    labels: dashboard?.revenueChart?.map((x) => x.month) || [],
    datasets: [
      {
        label: "Revenue",
        data: dashboard?.revenueChart?.map((x) => x.revenue) || [],
        backgroundColor: "#16a34a",
        borderRadius: 6,
        maxBarThickness: 48,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${formatINR(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        ticks: {
          callback: (val) => `\u20B9${val.toLocaleString("en-IN")}`,
        },
        grid: { color: "#f1f5f9" },
      },
    },
  };

  if (loading || !dashboard) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store's performance</p>
      </div>

      {/* ---------------- Statistic Cards ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          icon={<FaBox />}
          label="Products"
          value={dashboard.totalProducts}
          color="blue"
        />
        <StatCard
          icon={<FaRupeeSign />}
          label="Revenue"
          value={formatINR(dashboard.totalRevenue)}
          color="green"
        />
        <StatCard
          icon={<FaShoppingCart />}
          label="Orders"
          value={dashboard.totalOrders}
          color="yellow"
        />
        <StatCard
          icon={<FaUsers />}
          label="Users"
          value={dashboard.totalUsers}
          color="purple"
        />
        <StatCard
          icon={<FaTags />}
          label="Categories"
          value={dashboard.totalCategories}
          color="rose"
        />
      </div>

      {/* ---------------- Revenue Chart ---------------- */}
      <SectionCard icon={<FaChartLine className="text-green-600" />} title="Revenue analytics">
        <div className="h-72">
          <Bar data={revenueChartData} options={revenueChartOptions} />
        </div>
      </SectionCard>

      {/* ---------------- Recent Orders ---------------- */}
      <SectionCard icon={<FaShoppingCart className="text-blue-600" />} title="Recent orders">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="p-3 font-medium rounded-l-lg">Order ID</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Amount</th>
                <th className="p-3 font-medium rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentOrders.map((order) => (
                <tr key={order.orderId} className="border-b border-gray-100 last:border-0">
                  <td className="p-3 font-medium text-gray-900">#{order.orderId}</td>
                  <td className="p-3 text-gray-700">{order.customerName}</td>
                  <td className="p-3 text-gray-700">{formatINR(order.amount)}</td>
                  <td className="p-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ---------------- Top Products + Low Stock (side by side on large screens) ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard icon={<FaTrophy className="text-amber-500" />} title="Top selling products">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="p-3 font-medium rounded-l-lg">Product</th>
                  <th className="p-3 font-medium rounded-r-lg">Total sold</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.topProducts.map((product) => (
                  <tr key={product.productId} className="border-b border-gray-100 last:border-0">
                    <td className="p-3 text-gray-900">{product.productName}</td>
                    <td className="p-3 text-gray-700">{product.totalSold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard icon={<FaExclamationTriangle className="text-yellow-500" />} title="Low stock products">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="p-3 font-medium rounded-l-lg">Product</th>
                  <th className="p-3 font-medium rounded-r-lg">Stock</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.lowStockProducts.map((product) => (
                  <tr key={product.productId} className="border-b border-gray-100 last:border-0">
                    <td className="p-3 text-gray-900">{product.productName}</td>
                    <td className="p-3">
                      <StockBadge stock={product.stock} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* ---------------- Latest Products (with images) ---------------- */}
      <SectionCard icon={<FaBoxOpen className="text-indigo-500" />} title="Recently added products">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dashboard.latestProducts.map((product) => (
            <div
              key={product.productId}
              className="border border-gray-100 rounded-lg p-3 flex flex-col gap-2 hover:shadow-md transition-shadow"
            >
              <div className="w-full h-32 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={`${IMAGE_BASE_URL}${product.imageUrl}`}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f1f5f9'/%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <FaBox className="text-gray-300 text-3xl" />
                )}
              </div>
              <p className="font-medium text-gray-900 truncate" title={product.productName}>
                {product.productName}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">{formatINR(product.price)}</span>
                <StockBadge stock={product.stock} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ---------------- Order Status Summary ---------------- */}
      <SectionCard icon={<FaClipboardList className="text-blue-500" />} title="Order status summary">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="p-3 font-medium rounded-l-lg">Status</th>
                <th className="p-3 font-medium rounded-r-lg">Orders</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.orderStatusSummary.map((status) => (
                <tr key={status.status} className="border-b border-gray-100 last:border-0">
                  <td className="p-3">
                    <StatusBadge status={status.status} />
                  </td>
                  <td className="p-3 text-gray-700 font-medium">{status.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default AdminDashboard;