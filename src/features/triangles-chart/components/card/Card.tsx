import React from "react";
import "./Card.css";

type Props = {
  children: React.ReactNode;
};

const Card = ({ children }: Props) => {
  return (
    <div className="card">
      <div className="container">{children}</div>
    </div>
  );
};

export default Card;
