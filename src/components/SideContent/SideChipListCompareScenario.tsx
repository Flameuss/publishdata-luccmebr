import { View, ViewType } from 'containers/Types';
import React from 'react';
import { useDispatch, useTrackedState } from 'store';
import { filter } from 'store/utils';
import SideChip, { SideChipProps } from './SideChip';

type SideChipListCompareScenarioProps = {
  viewType: ViewType;
  className: string;
  backgroundColorOnActive: string | { [name: string]: string };
  onClick?: (props: SideChipProps) => void;
};

function SideChipListCompareScenario(props: SideChipListCompareScenarioProps) {
  const dispatch = useDispatch();
  const state = useTrackedState();

  const getBackgroundColor = (name: string) => {
    let backgroundColorOnActive = '';

    if (typeof props.backgroundColorOnActive === 'string') {
      backgroundColorOnActive = props.backgroundColorOnActive;
    } else if (props.backgroundColorOnActive.hasOwnProperty(name)) {
      backgroundColorOnActive = props.backgroundColorOnActive[name];
    }

    return backgroundColorOnActive;
  };

  const getChips = (): SideChipProps[] => {
    const currentScenario = state.currentScenario;
    const chips = filter(state, props.viewType)
      .filter((view: View) => view.name !== currentScenario)
      .map((view: View) => {
        return {
          name: view.name,
          label: `${view.label} - ${currentScenario}`,
          active: view.visible,
          tooltip: `${view.label} - ${currentScenario}: ${view.description}`,
          className: props.className,
          disabled: false,
          backgroundColorOnActive: getBackgroundColor(view.name),
        };
      });

    if (chips.length) {
      let hasOneActive = false;
      chips.forEach((chip: SideChipProps) => {
        if (chip.name === state.compareWithScenario) {
          chip.active = true;
          chip.disabled = true;
          hasOneActive = true;
        }
      });

      if (!hasOneActive) {
        chips[0].active = true;
        dispatch({
          type: 'SET_COMPARE_SCENARIO',
          name: chips[0].name,
        });
      }
    }

    return chips;
  };

  const handleClick = (data: SideChipProps) => {
    dispatch({
      type: 'SET_COMPARE_SCENARIO',
      name: data.name,
    });

    if (props.onClick) {
      props.onClick(data);
    }
  };

  return (
    <div>
      {getChips().map((chip: SideChipProps) => (
        <SideChip
          key={chip.label}
          name={chip.name}
          label={chip.label}
          disabled={chip.disabled}
          active={chip.active}
          tooltip={chip.tooltip}
          className={chip.className}
          backgroundColorOnActive={chip.backgroundColorOnActive}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}

export default React.memo(SideChipListCompareScenario);
