
interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminTabs = ({ activeTab, setActiveTab }: AdminTabsProps) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`py-4 px-6 text-sm font-medium border-b-2 ${
            activeTab === "dashboard"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`py-4 px-6 text-sm font-medium border-b-2 ${
            activeTab === "orders"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`py-4 px-6 text-sm font-medium border-b-2 ${
            activeTab === "products"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`py-4 px-6 text-sm font-medium border-b-2 ${
            activeTab === "settings"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Settings
        </button>
      </nav>
    </div>
  );
};

export default AdminTabs;
