import React, { useState } from 'react';
import { SiMicrosoftexcel } from "react-icons/si";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import { RxChevronDown, RxChevronUp } from "react-icons/rx";
import { TbMoodCry } from "react-icons/tb";
import { ImSpinner2 } from "react-icons/im";
import { VscError } from "react-icons/vsc";

type TableColumn = {
  key: string;
  label: string;
  renderCell?: (cellData: any) => React.ReactNode;
};

type customStylingProp = {
  component?: React.CSSProperties; // Styles for the component wrapper
  table?: React.CSSProperties; // Styles for the table
  tableWrapper?: React.CSSProperties;
  header?: React.CSSProperties; // Styles for the table header
  body?: React.CSSProperties; // Styles for the table body
  footer?: React.CSSProperties;
  stripeStyle?: React.CSSProperties;
};

type TableData = { [key: string]: any }[];

type TableProps = {
  data: TableData | null | any;
  columns: TableColumn[];
  toolbars?: React.ReactNode[];
  enableServerPagination?: boolean;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  onGlobalTableSearchChange?: (searchTerm: string) => void;
  loading?: boolean;
  isError?: boolean;
  renderRowDetails?: (props: { row: any }) => React.ReactNode;
  showActions?: (rowData: any) => React.ReactNode;
  enableStripStyle?: boolean;
  removeStraightLines?: boolean;
  printTools?: boolean;
  tableTitle?: string;
  onRowSelection?: (rowData: any) => void;
  customStyles?: customStylingProp;
};

const itemsPerPageOptions = [5, 8, 10, 15, 20]

const DBLTable: React.FC<TableProps> = ({
  data,
  columns,
  toolbars,
  enableServerPagination = false,
  onPaginationChange,
  onGlobalTableSearchChange,
  loading = false,
  isError = false,
  renderRowDetails,
  showActions,
  enableStripStyle = true,
  removeStraightLines,
  printTools,
  tableTitle,
  onRowSelection,
  customStyles = {}
}) => {
  // State for pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  // if (!Array.isArray(data)) {
  //   throw new Error("Data must be an array");
  // }

  const searchedData = Array.isArray(data) ? data.filter((item: any) => {
    if (typeof item === 'object') {
      return Object.values(item).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return false;
  }) : [];

  const sortedData = searchedData ? [...searchedData].sort((a, b) => {
    const keyA = sortColumn ? a[sortColumn] : null;
    const keyB = sortColumn ? b[sortColumn] : null;

    if (keyA === keyB) {
      return 0;
    }

    if (sortOrder === 'asc') {
      return keyA < keyB ? -1 : 1;
    } else {
      return keyA > keyB ? -1 : 1;
    }
  }) : [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = Array.isArray(sortedData) ? sortedData.slice(startIndex, endIndex) : [];

  const totalPages = Math.ceil((data?.length || 1) / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    onPaginationChange && onPaginationChange({ pageIndex: newPage, pageSize: itemsPerPage });
  };

  const handleSearchChange = (term: string) => {
    onGlobalTableSearchChange ? onGlobalTableSearchChange(term) : setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleExportToExcel = () => {
    try {
      const csvContent = columns.map(column => column.label).join(',') + '\n';
      const csvRows = data.map((row: any) => columns.map(column => row[column.key]).join(',')).join('\n');
      const csvData = csvContent + csvRows;

      const blob = new Blob([csvData], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'exported_data.csv';
      link.click();
    } catch (error) {
      console.error("Error exporting data to Excel:", error);
    }
  };


  
  const TableRowComp = ({row, rowIndex}: any) => {
    const [displayRenderDetails, setDisplayRenderDetails] = useState<boolean>(false);
    const [rowSelectionState, setRowSelectionState] = useState<boolean | any>(false)

    const handleRowSelection = (rowData: any) => {
      if(rowData && onRowSelection){ 
        setRowSelectionState(!rowSelectionState)
        // console.log('Row Data:', rowData)
        // console.log('Row State:', !rowSelectionState)
        onRowSelection({rowState: !rowSelectionState, rowData})
      }
    }

    return (
      <React.Fragment>
        <tr 
          style={{
            ...(enableStripStyle && rowIndex % 2 === 0 && customStyles.stripeStyle
              ? customStyles.stripeStyle
              : {}),
            ...(rowSelectionState && { backgroundColor: '#DFF7FF' })
          }}
          className={`${enableStripStyle && rowIndex % 2 === 0 ? `bg-gray-100` : 'bg-white'}`}
          >
          {onRowSelection && 
            <td className='px-4 py-3 text-left border-t border-r border-gray-100'>
              <input className='w-[14px] h-[14px]' type="checkbox" value={rowSelectionState} onChange={()=>handleRowSelection(row)}/>
            </td>
          }
          {renderRowDetails && (
            <th onClick={() => setDisplayRenderDetails(!displayRenderDetails)} className="px-4 py-3 text-left border-t border-r border-gray-100">
              {displayRenderDetails ? <RxChevronUp /> : <RxChevronDown />}
            </th>
          )}
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
        {renderRowDetails && displayRenderDetails && (
          <tr className={`h-auto ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-white'} transition-max-h duration-300 ease-out border-y border-gray-100`}>
            <td colSpan={columns.length + (showActions ? 1 : 0)}>
              {renderRowDetails && renderRowDetails({ row })}
            </td>
          </tr>
        )}
      </React.Fragment>
    )
  }



  return (
    <div className={`rounded max-h-[700px] inter-light overflow-auto bg-white text-gray-500 shadow-lg p-6 w-full mx-auto mb-6 ${enableStripStyle ? 'striped' : ''}`} style={customStyles.component}>
      <div className="flex items-center justify-between mb-4 bg-white">
        <h3 className="text-lg font-semibold text-gray-800">{tableTitle ? tableTitle : ''}</h3>
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
        <div style={customStyles.tableWrapper} className='max-h-[500px] overflow-auto my-custom-scrollbar2'>
          <table className="w-full text-[15px] border-collapse" style={customStyles.table}>
            <thead style={customStyles.header} className={`${!enableStripStyle && 'bg-gray-100'}`}>
              <tr>
              {onRowSelection &&  <th className="px-4 py-3 text-left border-t border-r border-gray-100">Select</th>}
              {renderRowDetails && <th className="px-4 py-3 text-left border-t border-r border-gray-100"><HiMiniChevronUpDown /></th>}
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`${!enableStripStyle && 'bg-gray-100'} py-3 px-4 text-left border-r border-t border-gray-100`}
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                    {sortColumn === column.key && (
                      <span className="ml-2">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                ))}
                {showActions && <th className="px-4 py-3 text-left border-t border-r border-gray-100">Actions</th>}
              </tr>
            </thead>
            <tbody style={customStyles.body} className='my-custom-scrollbar'>
            {isError ? ( 
              <tr className='border'>
                <td colSpan={columns.length + (showActions ? 1 : 0) + (onRowSelection ? 1 : 0) + (renderRowDetails ? 1 : 0)} className="py-20">
                  <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                    <VscError className="mr-2 text-[4rem] text-red-300" />
                    <span className="text-gray-500">Error in fetching data. Please try again.</span>
                  </div>
                </td>
              </tr>
            ) : (
              data?.length === 0 ? (
                <tr className='border'>
                  <td colSpan={columns.length + (showActions ? 1 : 0) + (onRowSelection ? 1 : 0) + (renderRowDetails ? 1 : 0)} className="py-20">
                    <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                      <TbMoodCry className="mr-2 text-4xl text-gray-500" />
                      No data available
                    </div>
                  </td>
                </tr>
              ) : (
                loading ? (
                  <tr>
                    <td colSpan={columns.length + (showActions ? 1 : 0) + (onRowSelection ? 1 : 0) + (renderRowDetails ? 1 : 0)} className="py-20">
                      <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                        <ImSpinner2 className={`animate-spin text-4xl`}/>
                        <p>Loading Data...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Render table rows
                  paginatedData?.map((row, rowIndex) => (
                    <TableRowComp key={rowIndex} row={row} rowIndex={rowIndex}/>
                  ))
                )
              )
            )}
          </tbody>

          </table>
          <div className="sticky bottom-0 flex items-center justify-between mt-4 bg-white">
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
    </div>
  );
};


export default DBLTable;
