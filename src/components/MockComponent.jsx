import React, { useMemo, useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

function MockComponent() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;

      if (file.type === "application/json") {
        const jsonData = JSON.parse(fileContent);
        setData(jsonData);
        setColumns(Object.keys(jsonData[0]));
        setSelectedColumns(Object.keys(jsonData[0]));
      } else if (file.type === "text/csv") {
        const rows = fileContent.split("\n");
        const csvData = rows.map((row) => row.split(","));
        const header = csvData[0];
        setData(
          csvData.slice(1).map((row) => {
            let obj = {};
            header.forEach((col, index) => {
              obj[col] = row[index];
            });
            return obj;
          })
        );
        setColumns(header);
        setSelectedColumns(header);
      }
    };

    reader.readAsText(file);
  };

  const handleColumnSelect = (column) => {
    setSelectedColumns((prevSelected) => {
      if (prevSelected.includes(column)) {
        return prevSelected.filter((col) => col !== column);
      } else {
        return [...prevSelected, column];
      }
    });
  };

  return (
    <div>
      <FileUpload handleChange={handleFileUpload} />
      {data && data.length > 0 && (
        <div>
          <CustomCheck
            selectedColumns={selectedColumns}
            handleColumnSelect={handleColumnSelect}
          />
          <CustomTable data={data} columns={selectedColumns} />
        </div>
      )}
    </div>
  );
}

const CustomCheck = ({ selectedColumns, handleColumnSelect }) => {
  return (
    <div
      className=" px-8 py-4 grid 
    grid-cols-[repeat(4,1fr)]    
    "
    >
      {selectedColumns.map((col, idx) => {
        return (
          <label className="flex gap-2 capitalize" key={idx}>
            <input
              type="checkbox"
              checked={selectedColumns.includes(col)}
              onChange={() => handleColumnSelect(col)}
            />
            {col}
          </label>
        );
      })}
    </div>
  );
};

const CustomTable = ({ data, columns }) => {
  const columnHelper = createColumnHelper();

  const tableColumns = useMemo(() => {
    if (!columns || columns.length === 0) return [];

    return columns.map((column) =>
      columnHelper.accessor(
        (row) => row[column], // Correctly access keys with special characters, S. No giving issue so bracket notation is the fix
        {
          id: column,
          header: column.charAt(0).toUpperCase() + column.slice(1),
        }
      )
    );
  }, [columns]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data.length) {
    return <div>No data available</div>;
  }

  return (
    <div className="mx-auto m-0 max-h-[70vh] w-fit max-w-[95vw] overflow-auto shadow-2xl mt-12 rounded-md">
      <table className="  w-full  ">
        <thead className="bg-slate-800 text-gray-100 z-50 sticky top-0  ">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className="p-2 text-md border-b border-slate-300 "
                  key={header.id}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="">
          {table
            .getRowModel()
            .rows.slice(0, -1)
            .map((row) => (
              <tr
                className="border-b border-slate-300 hover:bg-gray-50 cursor-pointer"
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className="p-2 text-center" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const FileUpload = ({ handleChange }) => (
  <input type="file" accept=".json, .csv" onChange={(e) => handleChange(e)} />
);

export default MockComponent;
