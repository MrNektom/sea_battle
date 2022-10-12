import React from "react";
import { match } from "ts-pattern";
import { EShipFragment } from "../../store/types";
import s from "./ShipFragment.module.css";

interface IShipFragmentProps {
  kind: EShipFragment | null;
}

export const ShipFragment: React.FunctionComponent<IShipFragmentProps> = ({
  kind,
}: IShipFragmentProps) => {
  const c = match<EShipFragment | null, string>(kind)
    .with(EShipFragment.middleHorisontal, () => s.sf_mh)
    .with(EShipFragment.middleVertical, () => s.sf_mv)
    .with(EShipFragment.prowToR, () => s.sf_ptr)
    .with(EShipFragment.prowToB, () => s.sf_ptb)
    .with(EShipFragment.sternFromT, () => s.sf_sft)
    .with(EShipFragment.sternFromL, () => s.sf_sfl)
    .otherwise(() => "");
  return <div className={c}></div>;
};
