"use client";
import { useState, useEffect } from "react";
import Breeding from "./Breeding";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }
  if (localStorage.getItem("selectedMales") === null) {
    localStorage.setItem("selectedMales", JSON.stringify([]));
  }
  if (localStorage.getItem("selectedFemales") === null) {
    localStorage.setItem("selectedFemales", JSON.stringify([]));
  }
  if (localStorage.getItem("selectedOffspring") === null) {
    localStorage.setItem("selectedOffspring", "");
  }

  return (
    <div>
      <Breeding isClient={isClient} />
    </div>
  );
}
