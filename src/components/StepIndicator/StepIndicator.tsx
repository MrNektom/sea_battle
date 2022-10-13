import React from "react";
import s from "./StepIndicator.module.css";

interface IStepIndicatorProps {
  dir: "right" | "left";
}

export function StepIndicator({ dir }: IStepIndicatorProps) {
  return (
    <div className={s.step_indicator}>
      <div
        className={`${s.step_indicator__indicator} ${
          dir === "right" ? s.right : s.left
        }`}
      ></div>
    </div>
  );
}
