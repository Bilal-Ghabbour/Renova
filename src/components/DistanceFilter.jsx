import { useState } from "react";

export default function DistanceFilter({ onSelectDistance }) {
  const [distance, setDistance] = useState("Gesamte Stadt");

  return (
    <select
      className="border p-2"
      value={distance}
      onChange={(e) => {
        setDistance(e.target.value);
        onSelectDistance(e.target.value);
      }}
    >
      <option value="Gesamte Stadt">Gesamte Stadt</option>
      <option value="10">10 km</option>
      <option value="30">30 km</option>
      <option value="50">50 km</option>
      <option value="100">100 km</option>
      <option value="200">200 km</option>
    </select>
  );
}