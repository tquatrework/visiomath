import React, { useEffect, useRef } from "react";
import "mathlive/dist/mathlive.css"; // Import du style de MathLive
import { MathfieldElement } from "mathlive"; // Import du composant MathLive

const MathInput = ({ value, onChange }) => {
  const mathfieldRef = useRef(null);

  useEffect(() => {
    const mathfield = mathfieldRef.current;
    if (mathfield) {
      mathfield.value = value; // Initialiser avec la valeur passée
      mathfield.addEventListener("input", (event) => {
        // Propager les modifications via la prop onChange
        onChange && onChange(event.target.value);
      });
    }
  }, [value, onChange]);

  return (
    <math-field
      ref={mathfieldRef}
      style={{
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
        minHeight: "40px",
        width: "100%",
      }}
    ></math-field>
  );
};

export default MathInput;
