import { State } from 'store';
import { TimelineOption, View, ViewType } from 'containers/Types';

export const filter = (state: State, viewType: ViewType): View[] => {
  return state.views.filter((view: View) => view.type === viewType);
};

export const filterByName = (
  state: State,
  viewType: ViewType,
  name: string,
): View | undefined => {
  return state.views.find(
    (view: View) => view.type === viewType && view.name === name,
  );
};

export const getMapTitleEn = (state: State, t: any) => {
  if (state.currentBorder === 'None' && state.currentBackground === 'None') {
    return null;
  }

  const attributesMapper: any = {
    'Forest vegetation': t('Drawer.SideContent.attribute.chips.0.label'),
    'Pasture planted': t('Drawer.SideContent.attribute.chips.1.label'),
    'Agriculture': t('Drawer.SideContent.attribute.chips.2.label'),
    'Mosaic of occupation': t('Drawer.SideContent.attribute.chips.3.label'),
    'Forestry': t(
      'Drawer.SideContent.attribute.chips.4.label',
    ),
    'Others': t(
      'Drawer.SideContent.attribute.chips.5.label',
    ),
  };

  const borderMapper: any = {
    Biomes: t('Drawer.SideContent.border.chips.1.label'),
    Brazil: t('Drawer.SideContent.border.chips.2.label'),
    Regions: t('Drawer.SideContent.border.chips.3.label'),
    States: t('Drawer.SideContent.border.chips.4.label'),
  };

  const isDifference =
    TimelineOption.DIFFERENCE === state.currentTimelineOption;

  const borderPrefix = state.currentBorder === 'Brazil' ? 'in' : 'per';
  const borderDescription =
    state.currentBorder === 'None'
      ? ''
      : ` ${borderPrefix} ${borderMapper[state.currentBorder]}`;

  let title = `${attributesMapper[state.currentAttribute]} Area${borderDescription} in Scenario ${state.currentScenario} for ${state.currentYear}`;
  if (isDifference) {
    title = `Change of ${attributesMapper[state.currentAttribute]} Area from ${state.changeFromYear} to ${state.currentYear} ${borderPrefix} ${borderMapper[state.currentBorder]} in Scenario ${state.currentScenario}`;
  }

  if (state.compareScenarioEnabled) {
    title = `Change of ${attributesMapper[state.currentAttribute]} Area for Scenario ${state.compareWithScenario} minus ${state.currentScenario} in ${state.currentYear} ${borderPrefix} ${borderMapper[state.currentBorder]}`;
  }

  return title;
};

export const getMapTitlePt = (state: State, t: any) => {
  if (state.currentBorder === 'None' && state.currentBackground === 'None') {
    return null;
  }

  const attributesMapper: any = {
    'Forest vegetation': t('Drawer.SideContent.attribute.chips.0.label'),
    'Pasture planted': t('Drawer.SideContent.attribute.chips.1.label'),
    'Agriculture': t('Drawer.SideContent.attribute.chips.2.label'),
    'Mosaic of occupation': t('Drawer.SideContent.attribute.chips.3.label'),
    'Forestry': t(
      'Drawer.SideContent.attribute.chips.4.label',
    ),
    'Others': t(
      'Drawer.SideContent.attribute.chips.5.label',
    ),
  };

  const borderMapper: any = {
    Biomes: t('Drawer.SideContent.border.chips.1.label'),
    Brazil: t('Drawer.SideContent.border.chips.2.label'),
    Regions: t('Drawer.SideContent.border.chips.3.label'),
    States: t('Drawer.SideContent.border.chips.4.label'),
  };

  const isDifference =
    TimelineOption.DIFFERENCE === state.currentTimelineOption;

  const borderPrefix = state.currentBorder === 'Brazil' ? 'no' : 'por';
  const borderDescription =
    state.currentBorder === 'None'
      ? ''
      : ` ${borderPrefix} ${borderMapper[state.currentBorder]}`;

  let title = `Área de ${
    attributesMapper[state.currentAttribute]
  } ${borderDescription} no Cenário ${state.currentScenario} em ${
    state.currentYear
  }`;
  if (isDifference) {
    title = `Mudanças da Área de ${
      attributesMapper[state.currentAttribute]
    } de 2000 à ${state.currentYear} ${borderPrefix} ${
      borderMapper[state.currentBorder]
    } no Cenário ${state.currentScenario}`;
  }

  return title;
};
