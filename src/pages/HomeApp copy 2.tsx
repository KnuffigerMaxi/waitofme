

import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS


import corsAnywhere from 'cors-anywhere';


const startProxyServer = () => {
    const corsProxy = corsAnywhere.createServer({
        originWhitelist: [], // Leere Liste bedeutet, dass keine Domains zugelassen sind
        requireHeader: ['origin', 'x-requested-with'],
        removeHeaders: ['cookie', 'cookie2']
    });
    corsProxy.listen(3000, () => {
        console.log('CORS-Anywhere-Proxy läuft auf Port 3000');
    });
}

const API_URL = 'https://apis.deutschebahn.com/auth/oauth/token';
const DEPARTURE_URL = 'https://apis.deutschebahn.com/fahrplan-plus/v1/plan/8000105/departure';
const CLIENT_ID = process.env.REACT_APP_CLIENTID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRETKEY;

function HomeApp(): JSX.Element {
    const [departures, setDepartures] = useState([]);

    useEffect(() => {
        startProxyServer();
        const fetchData = async () => {
            try {
                // Combine the two fetch requests into one
                const response = await fetch(`http://localhost:8080/${DEPARTURE_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                });
                const data = await response.json();
                setDepartures(data.departures.all);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

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

export default HomeApp;

// Optimizations:
// - Removed unnecessary import of agGridReact
// - Removed unnecessary comments
// - Combined two fetch requests into one
// - Used dot notation to access nested fields in columnDefs
// - Combined date and time formatting into one step in cellRenderer
// - Used CSS nth-child selector instead of a function in rowClassRules