# DBLTable

`DBLTable` is a versatile lightweight React table component that allows you to display, search, paginate, and export tabular data easily. It supports various customization options and features, making it suitable for a wide range of applications. It is fully customizable. Make sure `TailwindCSS` is already installed in your project as the table depends on it.

## Installation

You can install **DBLTable** using npm:

```bash
npm install dbl-table
```

Add this line to your tailwind config file:

```bash
module.exports = {

    content: [
        "./node_modules/dbl-table/**/*.{ts,tsx,js}"
    ]

}
```

## Usage

### Basic Usage

```jsx
import React from 'react';
import DBLTable from 'dbl-table';

const YourComponent = () => {
  // Your data and columns configuration
  const data = [...]; // Array of objects
  const columns = [...]; // Array of TableColumn objects

  return (
    <DBLTable
      data={data}
      columns={columns}
    />
  );
};

export default YourComponent;
```

### Advanced Usage

```jsx
import React, { useState } from 'react';
import DBLTable from 'dbl-table';



const YourComponent = () => {
  // Your advanced data and columns configuration
  const data = [...]; // Array of objects
  const columns = [...]; // Array of TableColumn objects

  // Your custom styles
  const customStyles = {
    component: { /* Your custom styles for the component wrapper */ },
    table: { /* Your custom styles for the table */ },
    header: { /* Your custom styles for the table header */ },
    body: { /* Your custom styles for the table body */ },
    footer: { /* Your custom styles for the table footer */ },
    stripeStyle: { /* Your custom styles for striped rows */ },
    tableCell: { /* Your custom styles for table cells*/ }
  };

  // Your additional features
  const toolbars = [...]; // Additional components or buttons
  const onPaginationChange = (pagination) => { /* Handle server-side pagination */ };
  const onGlobalTableSearchChange = (searchTerm) => { /* Handle global table search */ };
  const renderRowDetails = (props) => { /* Render additional details for each row */ };
  const showActions = (rowData) => { /* Render actions for each row */ };
  const onRowSelection = ({ rowState, rowData }) => { /* Handle row selection */ };
  const userComponents = (<div>{/* Render your own components */}</div>)

  return (
    <DBLTable
      data={data}
      columns={columns}
      toolbars={toolbars}
      enableServerPagination={true}
      onPaginationChange={onPaginationChange}
      onGlobalTableSearchChange={onGlobalTableSearchChange}
      globalSearchText={/* state of the search term for server-side filtering. Only use for server-side search */}
      loading={false}
      renderRowDetails={renderRowDetails}
      showActions={showActions}
      enableStripStyle={true}
      removeStraightLines={false}
      printTools={true}
      totalRowCount={/* Enter use the total row count only when you're doing server side pagination*/}
      tableTitle="Your Table Title"
      onRowSelection={onRowSelection}
      userComponents={userComponents}
      customStyles={customStyles}
    />
  );
};

export default YourComponent;
```

## Props

| Prop                        | Type                                                  | Description                                                                                                                                                 |
| --------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`                      | `TableData`                                           | An array of objects representing the tabular data to be displayed.                                                                                          |
| `columns`                   | `TableColumn[]`                                       | An array of objects defining the columns of the table. Each object should have `key`, `label`, an optional `renderCell` function for custom rendering. and optional `width` |
| `toolbars`                  | `React.ReactNode[]` (optional)                        | An array of React components or buttons to be displayed above the table for additional functionality.                                                     |
| `enableServerPagination`    | `boolean` (optional)                                  | Enable or disable server-side pagination. Default is `false`.                                                                                                |
| `onPaginationChange`        | `(pagination: { pageIndex: number; pageSize: number }) => void` (optional) | Callback function triggered when the page index or page size changes. Useful for server-side pagination.                                                   |
| `onGlobalTableSearchChange` | `(searchTerm: string) => void` (optional)              | Callback function triggered when the global search term changes.                                                                                             |
| `loading`                   | `boolean` (optional)                                  | Indicates whether the table is in a loading state. Default is `false`.                                                                                        |
| `isError`                   | `boolean` (optional)                                  | Indicates whether there was an error in data fetch. Default is `false`.                                                                                        |
| `renderRowDetails`          | `(props: { row: any }) => React.ReactNode` (optional)  | Function to render additional details for each row. It receives a `row` object as a parameter.                                                              |
| `showActions`               | `(rowData: any) => React.ReactNode` (optional)        | Function to render actions for each row. It receives a `rowData` object as a parameter.                                                                     |
| `enableStripStyle`          | `boolean` (optional)                                  | Enable or disable striped table styling. Default is `true`.                                                                                                  |
| `removeStraightLines`       | `boolean` (optional)                                  | Remove straight lines (borders) between cells. Default is `false`.                                                                                           |
| `printTools`                | `boolean` (optional)                                  | Enable or disable printing tools, such as exporting to Excel. Default is `true`.                                                                             |
| `tableTitle`                | `string` (optional)                                   | Title to be displayed above the table.                                                                                                                     |
| `onRowSelection`            | `(rowData: { rowState: boolean, rowData: any }) => void` (optional) | Callback function triggered when a row is selected/deselected. It provides the row state and data.                                                     |
| `customStyles`              | `customStylingProp` (optional)                        | Custom styles for various parts of the table (component, table, tableCell header, body, footer, stripeStyle).                                                         |
| `userComponents`            | `() => React.ReactNode` (optional)                       | Allows users to pass their own custom components to the table.                                                         |
| `showSearch`                | `boolean` (optional)                                  | A prop that shows the search bar of the table right at the top right corner. It is true by default                                                              |
| `totalRowsCount`                | `number` (optional)                                  | A prop that is used for server-side pagination. Pass the total rows count| 
| `globalSearchText`                | `string` (optional)                                  | A prop that is used for server-side global searh. Pass the state of the global search term count 

## Additional Features

- **Export to Excel:** Click on the Excel button to export the table data to a CSV file.
- **Search:** Use the search input to filter data globally.
- **Pagination:** Navigate through different pages using the navigation buttons.
- **Sorting:** Click on column headers to sort data in ascending or descending order.
- **Row Selection:** Enable row selection with the ability to handle selection events.
- **Custom Styling:** Customize the table appearance with the `customStyles` prop.

Feel free to customize and extend the component according to your specific requirements. If you encounter any issues or have suggestions for improvements, please open an issue on the GitHub repository.


Happy coding! 🚀