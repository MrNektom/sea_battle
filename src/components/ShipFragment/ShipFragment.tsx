import React from "react";
import { match } from "ts-pattern";
import { TShipFragment } from "../../store/types";
import s from "./ShipFragment.module.css";

interface IShipFragmentProps {
  kind: TShipFragment | null;
}

export const ShipFragment: React.FunctionComponent<IShipFragmentProps> = ({
  kind,
}: IShipFragmentProps) => {
  const c = match<TShipFragment | null, string>(kind)
    .with("middleH", () => s.sf_mh)
    .with("middleV", () => s.sf_mv)
    .with("prowR", () => s.sf_ptr)
    .with("prowB", () => s.sf_ptb)
    .with("sternT", () => s.sf_sft)
    .with("sternL", () => s.sf_sfl)
    .with("none", () => "")
    .with(null, () => "")
    .exhaustive();
  return <div className={c}></div>;
};
