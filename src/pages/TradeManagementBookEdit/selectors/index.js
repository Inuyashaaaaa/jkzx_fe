// import { createSelector } from 'reselect';

export const selectActivePanel = state => state.bookEdit.panel;

export const selectCurPanel = state => state.bookEdit.panel;

export const selectActivePanelScope = bookEdit => {
  return bookEdit;
};

export const selectCurPanelScope = bookEdit => {
  return bookEdit;
};
