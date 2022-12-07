export const handleMouseMoveToContextMenu = (event, data, statsMenu) => {
  return {
    show: true,
    data,
    coordenates: { x: event.pageX, y: event.pageY },
    statsMenu,
  };
};
export const handleMouseLeaveToContextMenu = (statsMenu) => {
  return { show: false, data: {}, coordenates: { x: 0, y: 0 }, statsMenu };
};
