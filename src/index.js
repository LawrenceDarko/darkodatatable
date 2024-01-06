import React, { useState } from 'react';
import { SiMicrosoftexcel } from "react-icons/si";
var itemsPerPageOptions = [5, 10, 15, 20];
var DarkoDataTable = function (_a) {
    var data = _a.data, columns = _a.columns, toolbars = _a.toolbars, _b = _a.enableServerPagination, enableServerPagination = _b === void 0 ? false : _b, onPaginationChange = _a.onPaginationChange, onGlobalTableSearchChange = _a.onGlobalTableSearchChange, _c = _a.loading, loading = _c === void 0 ? false : _c, renderRowDetails = _a.renderRowDetails, showActions = _a.showActions, _d = _a.enableStripStyle, enableStripStyle = _d === void 0 ? true : _d, removeStraightLines = _a.removeStraightLines, printTools = _a.printTools;
    // State for pagination
    var _e = useState(10), itemsPerPage = _e[0], setItemsPerPage = _e[1];
    var _f = useState(1), currentPage = _f[0], setCurrentPage = _f[1];
    var _g = useState(''), searchTerm = _g[0], setSearchTerm = _g[1];
    var searchedData = data.filter(function (item) {
        if (typeof item === 'object') {
            // Check if any property includes the searchTerm
            return Object.values(item).some(function (value) {
                return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }
        // If it's not an object, we cannot search through properties, so return false
        return false;
    });
    // Calculate pagination indexes
    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    var paginatedData = searchedData.slice(startIndex, endIndex);
    // Calculate total pages
    var totalPages = Math.ceil((data === null || data === void 0 ? void 0 : data.length) / itemsPerPage);
    var handlePageChange = function (newPage) {
        setCurrentPage(newPage);
        onPaginationChange && onPaginationChange({ pageIndex: newPage, pageSize: itemsPerPage });
    };
    var handleSearchChange = function (term) {
        onGlobalTableSearchChange ? onGlobalTableSearchChange(term) : setSearchTerm(term);
        ;
        setCurrentPage(1); // Reset current page when search term changes
    };
    var handleExportToExcel = function () {
        // Implement your logic for exporting data to Excel here
        // For simplicity, let's assume 'data' is an array of objects and 'columns' contains the keys
        var csvContent = columns.map(function (column) { return column.label; }).join(',') + '\n';
        var csvRows = data.map(function (row) { return columns.map(function (column) { return row[column.key]; }).join(','); }).join('\n');
        var csvData = csvContent + csvRows;
        var blob = new Blob([csvData], { type: 'text/csv' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'exported_data.csv';
        link.click();
    };
    return (React.createElement("div", { className: "rounded max-h-[700px] inter-light overflow-auto bg-white text-gray-500 shadow-lg p-6 w-full mx-auto mb-6 ".concat(enableStripStyle ? 'striped' : '') },
        React.createElement("div", { className: "flex items-center justify-between mb-4" },
            React.createElement("h3", { className: "text-lg font-semibold text-gray-800" }, "Merchant List"),
            React.createElement("div", { className: "flex items-center space-x-2" },
                printTools && (React.createElement("div", { className: "flex items-center justify-center" },
                    React.createElement("button", { className: "flex items-center justify-center gap-2 px-3 py-1 text-white bg-green-500 rounded", onClick: handleExportToExcel },
                        React.createElement(SiMicrosoftexcel, null),
                        "Excel"))),
                toolbars &&
                    toolbars.map(function (toolbar, index) { return (React.createElement("div", { key: index, className: "mr-2" }, toolbar)); }),
                React.createElement("input", { type: "text", placeholder: "Search...", className: "px-2 py-1 border border-gray-300 rounded focus:outline-none", onChange: function (e) { return handleSearchChange(e.target.value); } }))),
        loading ? (React.createElement("div", { className: "flex items-center justify-center p-28" }, "Loading...")) : (React.createElement("div", null,
            React.createElement("table", { className: "w-full text-[15px] border-collapse" },
                React.createElement("thead", { className: "".concat(!enableStripStyle && 'bg-gray-100') },
                    React.createElement("tr", null,
                        columns.map(function (column, index) { return (React.createElement("th", { key: index, className: "".concat(!enableStripStyle && 'bg-gray-100', " py-3 px-4 text-left border-r border-t border-gray-100") }, column.label)); }),
                        showActions && React.createElement("th", { className: "px-4 py-3 text-left border-t border-r border-gray-100" }, "Actions"))),
                React.createElement("tbody", null, paginatedData.map(function (row, rowIndex) { return (React.createElement(React.Fragment, { key: rowIndex },
                    React.createElement("tr", { className: enableStripStyle && rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white' },
                        columns.map(function (column, colIndex) { return (React.createElement("td", { key: colIndex, className: "py-3 px-4 ".concat(enableStripStyle && colIndex === columns.length - 1
                                ? 'border-b'
                                : removeStraightLines
                                    ? ''
                                    : 'border-r', " border-gray-100 ").concat(!enableStripStyle && colIndex === columns.length - 1 ? 'border-b' : 'border-b') }, column.renderCell
                            ? column.renderCell(row[column.key])
                            : row[column.key])); }),
                        showActions && (React.createElement("td", { className: "px-4 py-3 border-b border-gray-100" }, showActions(row)))),
                    renderRowDetails && (React.createElement("tr", { className: rowIndex % 2 === 0 ? 'bg-white' : 'bg-white' },
                        React.createElement("td", { colSpan: columns.length + (showActions ? 1 : 0) },
                            React.createElement("button", { onClick: function () { return handlePageChange(currentPage + 1); } }, "Show Details"),
                            renderRowDetails({ row: row })))))); }))),
            React.createElement("div", { className: "flex items-center justify-between mt-4" },
                React.createElement("div", null,
                    React.createElement("span", { className: "mr-2" }, "Items per page:"),
                    React.createElement("select", { value: itemsPerPage, onChange: function (e) { return setItemsPerPage(parseInt(e.target.value, 10)); }, className: "px-2 py-1 border border-gray-300 rounded" }, itemsPerPageOptions.map(function (option) { return (React.createElement("option", { key: option, value: option }, option)); }))),
                React.createElement("div", { className: "flex items-center space-x-2" }, totalPages > 1 && (React.createElement("div", { className: "flex justify-end mt-4" },
                    React.createElement("button", { className: "px-3 py-1 text-gray-500 bg-gray-300 rounded ".concat(currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''), onClick: function () { return handlePageChange(currentPage - 1); }, disabled: currentPage === 1 }, "Previous"),
                    React.createElement("span", { className: "mx-2" },
                        "Page ",
                        currentPage,
                        " of ",
                        totalPages),
                    React.createElement("button", { className: "px-3 py-1 text-gray-500 bg-gray-300 rounded ".concat(currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''), onClick: function () { return handlePageChange(currentPage + 1); }, disabled: currentPage === totalPages }, "Next")))))))));
};
export default DarkoDataTable;
