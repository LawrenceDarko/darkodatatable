import React, { useState } from 'react';
import { SiMicrosoftexcel } from "react-icons/si";

type TableColumn = {
  key: string;
  label: string;
  renderCell?: (cellData: any) => React.ReactNode;
};

type TableData = { [key: string]: any }[];

type TableProps = {
  data: TableData;
  columns: TableColumn[];
  toolbars?: React.ReactNode[];
  enableServerPagination?: boolean;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  onGlobalTableSearchChange?: (searchTerm: string) => void;
  loading?: boolean;
  renderRowDetails?: (props: { row: any }) => React.ReactNode;
  showActions?: (rowData: any) => React.ReactNode;
  enableStripStyle?: boolean;
  removeStraightLines?: boolean;
  printTools?: boolean;
};

const itemsPerPageOptions = [5, 10, 15, 20]

const DarkoDataTable: React.FC<TableProps> = ({
  data,
  columns,
  toolbars,
  enableServerPagination = false,
  onPaginationChange,
  onGlobalTableSearchChange,
  loading = false,
  renderRowDetails,
  showActions,
  enableStripStyle = true,
  removeStraightLines,
  printTools
}) => {
  // State for pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const searchedData = data.filter((item) => {
    if (typeof item === 'object') {
      // Check if any property includes the searchTerm
      return Object.values(item).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // If it's not an object, we cannot search through properties, so return false
    return false;
  });

  // Calculate pagination indexes
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = searchedData.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    onPaginationChange && onPaginationChange({ pageIndex: newPage, pageSize: itemsPerPage });
  };

  const handleSearchChange = (term: string) => {
    onGlobalTableSearchChange ? onGlobalTableSearchChange(term) : setSearchTerm(term);;
    setCurrentPage(1); // Reset current page when search term changes
  };

  const handleExportToExcel = () => {
    // Implement your logic for exporting data to Excel here
    // For simplicity, let's assume 'data' is an array of objects and 'columns' contains the keys
    const csvContent = columns.map(column => column.label).join(',') + '\n';
    const csvRows = data.map(row => columns.map(column => row[column.key]).join(',')).join('\n');
    const csvData = csvContent + csvRows;

    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'exported_data.csv';
    link.click();
  };



  return (
    <div className={`rounded max-h-[700px] inter-light overflow-auto bg-white text-gray-500 shadow-lg p-6 w-full mx-auto mb-6 ${enableStripStyle ? 'striped' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Merchant List</h3>
        <div className="flex items-center space-x-2">
          {printTools && (
              <div className="flex items-center justify-center">
                <button
                  className="flex items-center justify-center gap-2 px-3 py-1 text-white bg-green-500 rounded"
                  onClick={handleExportToExcel}
                >
                  <SiMicrosoftexcel />
                  Excel
                </button>
              </div>
            )}
          {toolbars &&
            toolbars.map((toolbar, index) => (
              <div key={index} className="mr-2">
                {toolbar}
              </div>
            ))}
          <input
            type="text"
            placeholder="Search..."
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-28">
          Loading...
        </div>
      ) : (
        <div>
          <table className="w-full text-[15px] border-collapse">
            <thead  className={`${!enableStripStyle && 'bg-gray-100'}`}>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`${!enableStripStyle && 'bg-gray-100'} py-3 px-4 text-left border-r border-t border-gray-100`}
                  >
                    {column.label}
                  </th>
                ))}
                {showActions && <th className="px-4 py-3 text-left border-t border-r border-gray-100">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <tr className={enableStripStyle && rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    {columns.map((column, colIndex) => (
                      <td
                      key={colIndex}
                      className={`py-3 px-4 ${
                        enableStripStyle && colIndex === columns.length - 1
                          ? 'border-b'
                          : removeStraightLines
                          ? ''
                          : 'border-r'
                      } border-gray-100 ${!enableStripStyle && colIndex === columns.length - 1 ? 'border-b' : 'border-b'}`}
                    >
                      {column.renderCell
                        ? column.renderCell(row[column.key])
                        : row[column.key]
                      }
                    </td>
                    ))}
                    {showActions && (
                      <td className="px-4 py-3 border-b border-gray-100">
                        {showActions(row)}
                      </td>
                    )}
                  </tr>
                  {renderRowDetails && (
                    <tr className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-white'}>
                      <td colSpan={columns.length + (showActions ? 1 : 0)}>
                        <button onClick={() => handlePageChange(currentPage + 1)}>
                          Show Details
                        </button>
                        {renderRowDetails({ row })}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="mr-2">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
                className="px-2 py-1 border border-gray-300 rounded"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              {totalPages > 1 && (
                <div className="flex justify-end mt-4">
                  <button
                    className={`px-3 py-1 text-gray-500 bg-gray-300 rounded ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="mx-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className={`px-3 py-1 text-gray-500 bg-gray-300 rounded ${
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default DarkoDataTable;
