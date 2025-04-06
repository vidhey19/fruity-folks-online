
import { motion } from "framer-motion";
import { FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  userName: string | undefined;
  isExporting: boolean;
  isConnected: boolean;
  handleExportToGoogleSheets: () => void;
}

const AdminHeader = ({ 
  userName, 
  isExporting, 
  isConnected, 
  handleExportToGoogleSheets 
}: AdminHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
        {userName && (
          <p className="text-sm text-gray-500 mt-1">
            Welcome, {userName} | <span className="text-primary font-medium">Administrator</span>
          </p>
        )}
      </div>
      
      <div className="flex gap-4">
        <Button
          onClick={handleExportToGoogleSheets}
          disabled={isExporting || !isConnected}
          className={`bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md flex items-center gap-2 ${!isConnected ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <FileSpreadsheet size={16} />
          {isExporting ? "Exporting..." : "Export to Google Sheets"}
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
