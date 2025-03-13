import React, { useState, useEffect } from "react";

const TrianglePizza = ({ left, top }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        width: "0",
        height: "0",
        borderLeft: "25px solid transparent",
        borderRight: "25px solid transparent",
        borderBottom: "50px solid yellow",
        position: "absolute",
      }}
    >
      {/* Toppings */}
      <div
        style={{
          position: "absolute",
          left: "-8px",
          top: "15px",
          width: "6px",
          height: "6px",
          backgroundColor: "brown",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "5px",
          top: "20px",
          width: "6px",
          height: "6px",
          backgroundColor: "brown",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-2px",
          top: "30px",
          width: "6px",
          height: "6px",
          backgroundColor: "brown",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

const Game = () => {
  const [boxPosition, setBoxPosition] = useState(50);
  const [pizzas, setPizzas] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const dropPizza = setInterval(() => {
      setPizzas((prev) => {
        const newPizzas = prev.slice();
        newPizzas.push({ id: Date.now(), x: Math.random() * 90, y: 0 });
        return newPizzas;
      });
    }, 1500);
    return () => clearInterval(dropPizza);
  }, []);

  useEffect(() => {
    const moveBox = (e) => {
      if (e.key === "ArrowLeft") {
        setBoxPosition((prev) => Math.max(prev - 10, 0));
      } else if (e.key === "ArrowRight") {
        setBoxPosition((prev) => Math.min(prev + 10, 90));
      }
    };
    window.addEventListener("keydown", moveBox);
    return () => window.removeEventListener("keydown", moveBox);
  }, []);

  const handleTouch = (e) => {
    const touchX = e.touches[0].clientX;
    const screenWidth = window.innerWidth;
    setBoxPosition((touchX / screenWidth) * 90);
  };

  useEffect(() => {
    const fallInterval = setInterval(() => {
      setPizzas((prev) => {
        const updatedPizzas = [];
        for (let i = 0; i < prev.length; i++) {
          const pizza = prev[i];
          const newY = pizza.y + 5;
          if (newY >= 80 && Math.abs(pizza.x - boxPosition) < 10) {
            setScore((s) => s + 1);
          } else if (newY < 100) {
            updatedPizzas.push({ id: pizza.id, x: pizza.x, y: newY });
          }
        }
        return updatedPizzas;
      });
    }, 100);
    return () => clearInterval(fallInterval);
  }, [boxPosition]);

  return (
    <div
      style={{ position: "relative", width: "100vw", height: "100vh", backgroundColor: "#1a1a1a", overflow: "hidden" }}
      onTouchMove={handleTouch}
    >
      <h1 style={{ position: "absolute", top: "10px", left: "10px", color: "white", fontSize: "20px" }}>Score: {score}</h1>
      {pizzas.map((pizza) => (
        <TrianglePizza key={pizza.id} left={pizza.x} top={pizza.y} />
      ))}
      <div
        style={{
          position: "absolute",
          left: `${boxPosition}%`,
          top: "90%",
          width: "100px",
          height: "50px",
          backgroundColor: "red",
          borderRadius: "5px",
          border: "5px solid black",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        🍕 Pizza Box
      </div>
    </div>
  );
};

export default Game;