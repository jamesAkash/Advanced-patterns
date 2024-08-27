import React, { useState } from "react";

const CreateDataSet = () => {
  const [data, setData] = useState([]);
  // const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [finalizedJson, setFinalizedJson] = useState(null);

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      console.log(fileContent);
      if (file.type === "application/json") {
        // Parse JSON file
        const jsonData = JSON.parse(fileContent);
        setData(jsonData);
        setColumns(Object.keys(jsonData[0]));
        setSelectedColumns(Object.keys(jsonData[0])); // Select all columns by default
      } else if (file.type === "text/csv") {
        // Parse CSV file
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
        setSelectedColumns(header); // Select all columns by default
      }
    };

    reader.readAsText(file);
  };

  // Function to handle row selection
  // const handleRowSelect = (index) => {
  //   setSelectedRows((prevSelected) => {
  //     if (prevSelected.includes(index)) {
  //       return prevSelected.filter((i) => i !== index);
  //     } else {
  //       return [...prevSelected, index];
  //     }
  //   });
  // };

  // Function to handle column selection
  const handleColumnSelect = (column) => {
    setSelectedColumns((prevSelected) => {
      if (prevSelected.includes(column)) {
        return prevSelected.filter((col) => col !== column);
      } else {
        return [...prevSelected, column];
      }
    });
  };

  // Function to generate finalized JSON
  const generateFinalizedJson = () => {
    const filteredData = data.map((row) => {
      let filteredRow = {};
      selectedColumns.forEach((column) => {
        filteredRow[column] = row[column];
      });
      return filteredRow;
    });
    setFinalizedJson(filteredData);
  };

  return (
    <div>
      <input type="file" accept=".json, .csv" onChange={handleFileUpload} />

      {/* Column Selection Checkboxes */}
      {columns.length > 0 && (
        <div>
          <h3>Select Columns to Display:</h3>
          {columns.map((column, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={selectedColumns.includes(column)}
                onChange={() => handleColumnSelect(column)}
              />
              {column}
            </label>
          ))}
        </div>
      )}

      {/* Table Display */}
      <table border="1">
        <thead>
          <tr>
            {/* <th>Select</th> */}
            {selectedColumns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {/* <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => handleRowSelect(index)}
                />
              </td> */}
              {selectedColumns.map((column, colIndex) => (
                <td className="text-center" key={colIndex}>
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to Generate Finalized JSON */}
      <button onClick={generateFinalizedJson}>View Finalized JSON</button>

      {/* Display Finalized JSON */}
      {finalizedJson && (
        <div>
          <h3>Finalized JSON:</h3>
          <pre>{JSON.stringify(finalizedJson, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateDataSet;
