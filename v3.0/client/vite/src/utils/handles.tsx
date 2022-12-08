import { Root } from "react-dom/client";
import {
  defaultPokemonStats,
  IInputContextMenu,
} from "@components/context-menu/context-menu.component";
import { IPokemonStats } from "./requests";

export const handleMouseMoveToContextMenu = (
  event: React.MouseEvent,
  data: IPokemonStats,
  statsMenu: Root
): IInputContextMenu => {
  return {
    show: true,
    data,
    coordenates: { x: event.pageX, y: event.pageY },
    statsMenu,
  };
};
export const handleMouseLeaveToContextMenu = (
  statsMenu: Root
): IInputContextMenu => {
  return {
    show: false,
    data: defaultPokemonStats,
    coordenates: { x: 0, y: 0 },
    statsMenu,
  };
};
