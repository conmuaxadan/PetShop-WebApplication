import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const ExportButton = ({ data, filename }) => {
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    >
      <Download className="w-4 h-4 mr-2" />
      Export to Excel
    </button>
  );
};

export default ExportButton;