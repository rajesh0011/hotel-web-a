import * as React from "react";
import { useState, useEffect } from "react";
import { differenceInDays } from "date-fns";

export default function useBook() {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [rangeStart, setRangeStart] = useState(today);
  const [rangeEnd, setRangeEnd] = useState(tomorrow);
  const today1 = today;

  const selectStartDate = (d) => {
    setRangeStart(d);
  };

  const selectEndDate = (d) => {
    setRangeEnd(d);
  };

  // Initialize with one row already present
  const [formRows, setFormRows] = useState([
    { id: Date.now(), name: "", count1: 2, count2: 0, count3: 0 }
  ]);

  const [editingRowId, setEditingRowId] = useState(null);

  // Function to handle incrementing counters
  const handleIncrement = (id, counterName) => {
    setFormRows((rows) =>
      rows.map((row) =>
        row.id === id ? { ...row, [counterName]: row[counterName] + 1 } : row
      )
    );
  };

  // Function to handle decrementing counters
  const handleDecrement = (id, counterName) => {
    setFormRows((rows) =>
      rows.map((row) =>
        row.id === id && row[counterName] > 0
          ? { ...row, [counterName]: row[counterName] - 1 }
          : row
      )
    );
  };

  // Calculate Length of Stay (LOS)
  const los = differenceInDays(new Date(rangeEnd), new Date(rangeStart));
  const lengthOfStay = los > 1 ? los : 1; // Minimum LOS is 1

  // Function to add a new row (for adding a new room)
  const addNewRow = () => {
    const newRow = {
      id: Date.now(),
      name: "",
      count1: 1, // Adult count
      count2: 0, // Children count
      count3: 0 // Any other field if necessary
    };
    setFormRows((prevRows) => [...prevRows, newRow]);
  };

  // Function to remove a row
  const handleRemove = (id) => {
    setFormRows((rows) => rows.filter((row) => row.id !== id));
  };

  // Function to toggle edit mode
  const toggleEditMode = (id) => {
    setEditingRowId(editingRowId === id ? null : id);
  };

  // Automatically open the first row by default when initialized
  useEffect(() => {
    if (formRows.length > 0 && editingRowId === null) {
      setEditingRowId(formRows[0].id);
    }
  }, [formRows, editingRowId]);

// Function to calculate total adults across all rows
const adult = () => formRows.reduce((total, row) => total + row.count1, 0);

// Function to calculate total children across all rows
const children = () => formRows.reduce((total, row) => total + row.count2, 0);


  // Count total rooms
  const countroom = formRows.length;

  return {
    rangeStart,
    setRangeStart,
    selectStartDate,
    rangeEnd,
    setRangeEnd,
    selectEndDate,
    today1,
    formRows,
    setFormRows,
    children,
    adult,
    countroom,
    lengthOfStay,
    handleIncrement,
    handleDecrement,
    addNewRow,
    handleRemove,
    editingRowId,
    addNewRow,
    toggleEditMode
  };
}
