import { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // core
import 'react-date-range/dist/theme/default.css'; // theme

export default function DateRangePickerBox({ onSelect }) {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-4 rounded shadow-lg">
        <DateRange
          editableDateInputs={true}
          onChange={(item) => {
            const selection = item.selection;
            setRange([selection]);

            // Only close after both start and end dates are picked
            if (
              selection.startDate &&
              selection.endDate &&
              selection.startDate.getTime() !== selection.endDate.getTime()
            ) {
              onSelect(selection);
            }
          }}
          moveRangeOnFirstSelection={true}
          ranges={range}
          rangeColors={["#3b82f6"]}
          showDateDisplay={false}
          showSelectionPreview={true}
          retainEndDateOnFirstSelection={false}
          months={2}
          direction="horizontal"
          showPreview={true}
        />
      </div>
    </div>
  );
}