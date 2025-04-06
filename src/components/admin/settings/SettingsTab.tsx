
import { useState } from "react";
import { FileSpreadsheet, KeyRound, Link, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface SettingsTabProps {
  googleApiKey: string;
  setGoogleApiKey: (apiKey: string) => void;
  googleSheetId: string;
  setGoogleSheetId: (sheetId: string) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  isTesting: boolean;
  setIsTesting: (isTesting: boolean) => void;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  setFirebaseConfig: (config: any) => void;
  handleSaveGoogleSheetsSettings: () => void;
  handleSaveFirebaseConfig: () => void;
}

const SettingsTab = ({
  googleApiKey,
  setGoogleApiKey,
  googleSheetId,
  setGoogleSheetId,
  isConnected,
  setIsConnected,
  isTesting,
  setIsTesting,
  firebaseConfig,
  setFirebaseConfig,
  handleSaveGoogleSheetsSettings,
  handleSaveFirebaseConfig
}: SettingsTabProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Settings</h2>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FileSpreadsheet className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-medium">Google Sheets Integration</h3>
            {isConnected && (
              <span className="ml-2 flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle2 size={12} className="mr-1" /> Connected
              </span>
            )}
          </div>
          
          <p className="text-gray-500 mb-6">
            Connect to your Google Sheets account to automatically export orders and product data. Your sheet should have the following columns: Order ID, Customer Name, Email, Phone, Address, Products, Total, Payment Method, and Status.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 flex items-center">
              <KeyRound size={16} className="mr-2 text-gray-500" />
              Google Sheets API Key
            </label>
            <input
              type="text"
              value={googleApiKey}
              onChange={(e) => setGoogleApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-gray-500">
              Get your API key from the <a href="https://console.developers.google.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Link size={16} className="mr-2 text-gray-500" />
              Sheet ID
            </label>
            <input
              type="text"
              value={googleSheetId}
              onChange={(e) => setGoogleSheetId(e.target.value)}
              placeholder="Enter your Sheet ID"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-gray-500">
              Find your Sheet ID in the URL of your Google Sheet (e.g., https://docs.google.com/spreadsheets/d/[YOUR_SHEET_ID]/edit)
            </p>
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              onClick={handleSaveGoogleSheetsSettings} 
              disabled={isTesting}
              className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md flex items-center gap-2"
            >
              {isTesting ? "Connecting..." : (
                <>
                  <Save size={16} />
                  {isConnected ? "Update Connection" : "Connect to Google Sheets"}
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <KeyRound className="h-6 w-6 text-orange-500 mr-2" />
            <h3 className="text-lg font-medium">Firebase Authentication</h3>
          </div>
          
          <p className="text-gray-500 mb-6">
            Configure Firebase for user authentication. Enter your Firebase project credentials below.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                API Key
              </label>
              <input
                type="text"
                value={firebaseConfig.apiKey}
                onChange={(e) => setFirebaseConfig({...firebaseConfig, apiKey: e.target.value})}
                placeholder="Enter Firebase API Key"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Auth Domain
              </label>
              <input
                type="text"
                value={firebaseConfig.authDomain}
                onChange={(e) => setFirebaseConfig({...firebaseConfig, authDomain: e.target.value})}
                placeholder="your-app.firebaseapp.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Project ID
              </label>
              <input
                type="text"
                value={firebaseConfig.projectId}
                onChange={(e) => setFirebaseConfig({...firebaseConfig, projectId: e.target.value})}
                placeholder="your-app-id"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Storage Bucket
              </label>
              <input
                type="text"
                value={firebaseConfig.storageBucket}
                onChange={(e) => setFirebaseConfig({...firebaseConfig, storageBucket: e.target.value})}
                placeholder="your-app.appspot.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Messaging Sender ID
              </label>
              <input
                type="text"
                value={firebaseConfig.messagingSenderId}
                onChange={(e) => setFirebaseConfig({...firebaseConfig, messagingSenderId: e.target.value})}
                placeholder="123456789012"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                App ID
              </label>
              <input
                type="text"
                value={firebaseConfig.appId}
                onChange={(e) => setFirebaseConfig({...firebaseConfig, appId: e.target.value})}
                placeholder="1:123456789012:web:abc123def456"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              onClick={handleSaveFirebaseConfig}
              className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md flex items-center gap-2"
            >
              <Save size={16} />
              Save Firebase Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
