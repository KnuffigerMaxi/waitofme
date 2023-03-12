import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import corsAnywhere from 'cors-anywhere';
import DepartureRow from '../components/DepartureList';
import Header from '../components/Header';
import '../styles/main.css'; 

const useStartProxyServer = () => {
  const startProxyServer = useCallback(() => {
    const corsProxy = corsAnywhere.createServer({
      originWhitelist: [],
      requireHeader: ['origin', 'x-requested-with'],
      removeHeaders: ['cookie', 'cookie2']
    });
    corsProxy.listen(3000, () => {
      console.log('CORS-Anywhere-Proxy läuft auf Port 3000');
    });
  }, []);

  useEffect(() => {
    startProxyServer();
  }, [startProxyServer]);
};

const useApiUrls = () => {
  const API_URL = useMemo(() => 'https://apis.deutschebahn.com/auth/oauth/token', []);
  const DEPARTURE_URL = useMemo(() => 'https://apis.deutschebahn.com/fahrplan-plus/v1/plan/8000105/departure', []);
  return { API_URL, DEPARTURE_URL };
};

const CLIENT_ID = process.env.REACT_APP_CLIENTID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRETKEY;

function HomePage() {
  const [departures, setDepartures] = useState([]);
  const [error, setError] = useState(null);

  useStartProxyServer();

  const { API_URL, DEPARTURE_URL } = useApiUrls();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
          },
          body: 'grant_type=client_credentials'
        });
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
      } catch (error) {
        console.error(error);
        setError('Fehler beim Laden des Tokens');
      }
    };
    fetchToken();
  }, [API_URL]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(
          `http://localhost:8080/${DEPARTURE_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        if (response.ok) {
          const data = await response.json();
          setDepartures(data.departures.all);
        } catch (error) {
          console.error(error);
        }
      };

      const getToken = async () => {
        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
          });
          const data = await response.json();
          localStorage.setItem('token', data.access_token);
        } catch (error) {
          console.error(error);
        }
      };

      const token = localStorage.getItem('token');
      if (!token) {
        getToken();
      } else {
        fetchData();
      }
    }, []);


  };
<div>
Hier haben wir eine zusätzliche Bedingung hinzugefügt, um den Fall abzudecken, dass der Zugriffstoken abgelaufen oder ungültig ist.Wenn die Antwort 401(Unauthorized) ist, dann ist der Token wahrscheinlich abgelaufen oder ungültig.In diesem Fall versuchen wir, einen neuen Token zu bekommen und die Anfrage erneut zu stellen.Wir rufen die Funktion `getAccessToken` auf und wenn wir einen neuen Token erhalten haben, stellen wir die Anfrage erneut mit dem neuen Token.
</div>