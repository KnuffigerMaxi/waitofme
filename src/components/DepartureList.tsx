// TrainSchedule.js

import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

function TrainSchedule({ departures }) {
  const columnDefs = [
    // Use dot notation to access nested fields
    { headerName: 'Zug', field: 'train.number', sortable: true },
    { headerName: 'Nach', field: 'route[0].station.title', sortable: true },
    {
      headerName: 'Abfahrt',
      field: 'departure.time',
      sortable: true,
      cellRenderer: (params: { value: string | number | Date; }) => {
        // Combine date and time formatting into one step
        const formattedDateTime = new Date(params.value).toLocaleString('de-DE', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        return formattedDateTime;
      },
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
    resizable: true,
    sortable: true,
    headerClass: 'header-cell',
    floatingFilterComponentParams: {
      suppressFilterButton: true,
    },
  };

  const rowClassRules = {
    // Use CSS nth-child selector instead of a function
    'even-row': 'nth-child(even)',
    'odd-row': 'nth-child(odd)',
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <h1>Abfahrten Hamburg Hbf</h1>
      <AgGridReact
        rowData={departures}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowClassRules={rowClassRules}
      />
    </div>
  );
}

export default TrainSchedule;
