
# DBLTable

  

`DBLTable` is a versatile lightweight React table component that allows you to display, search, paginate, and export tabular data easily. It supports various customization options and features, making it suitable for a wide range of applications. It is fully customizable. Make sure `TailwindCSS` is already installed in your project as the table depends on it.

  

## Installation

  

You can install `DBLTable` using npm:

  

```bash

npm  install  dbl-table

```


```jsx

import  React  from  'react';
import  DBLTable  from  'dbl-table';

// Your data and columns configuration
const  data  = [...];  // Array of objects
const  columns  = [...];  // Array of TableColumn objects


const  YourComponent  =  ()  =>  {

return (

    <DBLTable
        data={data}
        columns={columns}
        toolbars={[/* Additional components or buttons to be displayed above the table */]}
        enableServerPagination={false}
        onPaginationChange={(pagination)  =>  {/* Handle server-side pagination */}}
        onGlobalTableSearchChange={(searchTerm)  =>  {/* Handle global table search */}}
        loading={false}
        renderRowDetails={(props)  =>  {/* Render additional details for each row */}}
        showActions={(rowData)  =>  {/* Render actions for each row */}}
        enableStripStyle={true}
        removeStraightLines={false}
        printTools={true}
    />
    );

};

export  default  YourComponent;

```



## Props



| Prop                        | Type                                                  | Description                                                                                                                                                 |
| --------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`                      | `TableData`                                           | An array of objects representing the tabular data to be displayed.                                                                                          |
| `columns`                   | `TableColumn[]`                                       | An array of objects defining the columns of the table. Each object should have `key`, `label`, and an optional `renderCell` function for custom rendering. |
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
| `tableTitle`                | `string` (optional)                                  | A prop that shows the title of the table right at the top left corner.                                                                             
| `showSearch`                | `boolean` (optional)                                  | A prop that shows the search bar of the table right at the top right corner. It is true by default 


  

## Additional Features

Export to Excel: Click on the Excel button to export the table data to a CSV file.

Search: Use the search input to filter data globally.

Pagination: Navigate through different pages using the navigation buttons.

Feel free to customize and extend the component according to your specific requirements. If you encounter any issues or have suggestions for improvements, please open an issue on the GitHub repository.

  

Happy coding! 🚀