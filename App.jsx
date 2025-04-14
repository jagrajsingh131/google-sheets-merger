import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [sheet1, setSheet1] = useState('');
  const [sheet2, setSheet2] = useState('');
  const [mergeColumn, setMergeColumn] = useState('');
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [files, setFiles] = useState({});

  const fetchColumns = async () => {
    const res = await axios.post('http://localhost:5000/get-columns', {
      sheet1,
      sheet2
    });
    setAvailableColumns(res.data.columns);
  };

  const handleMerge = async () => {
    const res = await axios.post('http://localhost:5000/merge', {
      sheet1,
      sheet2,
      merge_column: mergeColumn,
      selected_columns: selectedColumns
    });
    setFiles(res.data);
  };

  const handleDownload = (type) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000/download?file=${encodeURIComponent(files[type])}`;
    link.setAttribute('download', `merged.${type}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Google Sheets Merger</h1>
      <input type="text" placeholder="Google Sheet 1 URL" value={sheet1} onChange={e => setSheet1(e.target.value)} />
      <br /><br />
      <input type="text" placeholder="Google Sheet 2 URL" value={sheet2} onChange={e => setSheet2(e.target.value)} />
      <br /><br />
      <button onClick={fetchColumns}>Load Columns</button>
      <br /><br />
      <select onChange={e => setMergeColumn(e.target.value)}>
        <option value="">Select Merge Column</option>
        {availableColumns.map(col => (
          <option key={col} value={col}>{col}</option>
        ))}
      </select>
      <br /><br />
      <div>
        <strong>Select Columns to Keep:</strong><br />
        {availableColumns.map(col => (
          <label key={col}>
            <input type="checkbox" value={col} onChange={e => {
              const value = e.target.value;
              setSelectedColumns(prev => e.target.checked
                ? [...prev, value]
                : prev.filter(v => v !== value));
            }} />
            {col}
          </label>
        ))}
      </div>
      <br />
      <button onClick={handleMerge}>Merge & Generate</button>
      <br /><br />
      {Object.keys(files).length > 0 && (
        <div>
          <h3>Download Merged File:</h3>
          <button onClick={() => handleDownload('excel')}>Excel</button>
          <button onClick={() => handleDownload('csv')}>CSV</button>
          <button onClick={() => handleDownload('word')}>Word</button>
        </div>
      )}
    </div>
  );
}

export default App;