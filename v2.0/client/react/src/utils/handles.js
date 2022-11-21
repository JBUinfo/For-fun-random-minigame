export const handleMouseMoveToContextMenu = (event, data, setContextMenu) => {
  setContextMenu({
    ...{ show: true, data, coordenates: { x: event.pageX, y: event.pageY } },
  });
};
export const handleMouseLeaveToContextMenu = (setContextMenu) => {
  setContextMenu({ ...{ show: false, coordenates: { x: 0, y: 0 } } });
};
