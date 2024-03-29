"use client";
import { useState, useEffect, Key, ReactNode } from "react";
import data from "../data";

class Monster {
  name: any;
  parents: any[];
  possibleOffspring: any[];
  constructor(name: any) {
    this.name = name;
    this.parents = [];
    this.possibleOffspring = [];
  }
  addParent(parent: any) {
    this.parents.push(parent);
  }
  addOffspring(offspring: any) {
    this.possibleOffspring.push(offspring);
  }
}

function findBreedPath(
  monName: any,
  male: any,
  fema: any,
  pairs: any,
  maxDepth: any
) {
  const visited = new Set();
  const queue = [[[], male, fema, 0]];
  let lastDepth = 0;

  while (queue.length > 0) {
    const [path, currentMales, currentFemales, depth] = queue.shift() as any;

    // Print when depth increases
    if (depth > lastDepth) {
      console.log(`Increasing depth to ${depth}`);
      lastDepth = depth;
    }

    if (depth > maxDepth) {
      continue;
    }

    for (const m of currentMales) {
      for (const f of currentFemales) {
        const key = [m, f].sort().join("_");
        if (visited.has(key)) {
          continue;
        }
        visited.add(key);

        if (pairs[key]) {
          const newPath = [...path, [m, f]];
          if (pairs[key] === monName) {
            return newPath;
          }

          const nextMales = Array.from(
            new Set([...currentMales, pairs[key]])
          ).sort();
          const nextFemales = Array.from(
            new Set([...currentFemales, pairs[key]])
          ).sort();
          queue.push([newPath, nextMales, nextFemales, depth + 1]);
        }
      }
    }
  }

  return null;
}

let allMons = [] as any;
const rows = data.split("\n");
for (let r of rows) {
  allMons.push(r.split(","));
}

let mons = [] as any;
let pairs = [] as any;
allMons.forEach((b: any, a: any) => {
  if (a === 0) {
    for (let i = 1; i < b.length; i++) {
      let monster = new Monster(b[i]);
      mons[b[i]] = monster;
    }
  } else {
    for (let i = 1; i < b.length; i++) {
      let parents = [allMons[0][i], b[0]].sort();
      let parentKey = parents.join("_");
      mons[b[i]].addParent(parentKey);
      mons[allMons[i][0]].addOffspring(`${allMons[0][i]}_${b[i]}`);
      mons[allMons[0][i]].addOffspring(`${allMons[i][0]}_${b[i]}`);
      pairs[parentKey] = b[i];
    }
  }
});

export default function Breeding(isClient: any) {
  const [selectedMales, setSelectedMales] = useState(
    JSON.parse(localStorage.getItem("selectedMales") || "") || []
  );
  const [selectedFemales, setSelectedFemales] = useState(
    JSON.parse(localStorage.getItem("selectedFemales") || "") || []
  );
  const [selectedOffspring, setSelectedOffspring] = useState(
    localStorage.getItem("selectedOffspring") || ""
  );
  const [path, setPath] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem("selectedMales", JSON.stringify(selectedMales));
    localStorage.setItem("selectedFemales", JSON.stringify(selectedFemales));
    localStorage.setItem("selectedOffspring", selectedOffspring);
  }, [selectedMales, selectedFemales, selectedOffspring]);

  useEffect(() => {
    if (isClient) {
      return;
    }
    setSelectedMales(JSON.parse(localStorage.getItem("selectedMales") || ""));
    setSelectedFemales(
      JSON.parse(localStorage.getItem("selectedFemales") || "")
    );
    setSelectedOffspring(localStorage.getItem("selectedOffspring") || "");
  }, [isClient]);

  const handleOffspringChange = (event: any) => {
    setSelectedOffspring(event.target.value);
  };

  const findPath = () => {
    const result = findBreedPath(
      selectedOffspring,
      selectedMales,
      selectedFemales,
      pairs,
      2
    );

    setPath(result as any[]);
  };

  const handleMaleCheckboxChange = (event: any) => {
    const selectedMale = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the selected male to the state
      setSelectedMales([...selectedMales, selectedMale]);
    } else {
      // Remove the unselected male from the state
      setSelectedMales(
        selectedMales.filter((male: any) => male !== selectedMale)
      );
    }
  };

  const handleFemaleCheckboxChange = (event: any) => {
    const selectedFemale = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the selected female to the state
      setSelectedFemales([...selectedFemales, selectedFemale]);
    } else {
      // Remove the unselected female from the state
      setSelectedFemales(
        selectedFemales.filter((female: any) => female !== selectedFemale)
      );
    }
  };

  // Create a list of all possible offspring from the pairs
  const offspringOptions = Object.values(pairs).filter(
    (value, index, self) => self.indexOf(value) === index
  );

  return (
    <div className="App">
      <h1>Monster Breeding Paths</h1>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2>Owned</h2>
          <div className="checkbox-group">
            <h3>Males</h3>
            <h3>Females</h3>
            <h3>Males</h3>
            <h3>Females</h3>
            {Object.keys(mons)
              .sort()
              .map((m) => (
                <>
                  <label key={m}>
                    <input
                      type="checkbox"
                      value={m}
                      onChange={handleMaleCheckboxChange}
                      checked={selectedMales.includes(m)}
                    />
                    {m}
                  </label>
                  <label key={m}>
                    <input
                      type="checkbox"
                      value={m}
                      onChange={handleFemaleCheckboxChange}
                      checked={selectedFemales.includes(m)}
                    />
                    {m}
                  </label>
                </>
              ))}
          </div>
        </div>
      </div>

      <div>
        <label>
          Select Offspring:
          <select value={selectedOffspring} onChange={handleOffspringChange}>
            <option value="">--Select an Offspring--</option>
            {offspringOptions.sort().map((offspring) => (
              <option key={offspring as Key} value={offspring as string}>
                {offspring as ReactNode}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button onClick={findPath}>Find Breeding Path</button>

      <section>
        <h2>Breeding Path</h2>
        <pre>{JSON.stringify(path, null, 2)}</pre>
      </section>
    </div>
  );
}
