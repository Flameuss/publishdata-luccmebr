import React from 'react';
import {
  withStyles,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import {
  Button,
  Card,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import debounce from 'lodash.debounce';
import { useDispatch, useTrackedState } from 'store';
import { TimelineOption } from 'containers/Types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      position: 'fixed',
      zIndex: 1198,
      display: 'flex',
      bottom: '16px',
      justifyContent: 'center',
      right: '40px',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        left: 0,
        bottom: 0,
        zIndex: 1200,
        right: 0,
      },
    },
    slider: {
      width: 500 + theme.spacing(3) * 2,
      display: 'block',
      background: '#fff',
      padding: '8px 26px 0',
      position: 'relative',
      left: '40px',
      [theme.breakpoints.down('xs')]: {
        left: 0,
      },
    },
    content: {
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      marginRight: '24px',
    },
    margin: {
      height: theme.spacing(3),
    },
  }),
);

const thumbShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const defaultMarks = [
  {
    value: 0,
    label: '2000',
  },
  {
    value: 20,
    label: '2010',
  },
  {
    value: 40,
    label: '2020',
  },
  {
    value: 60,
    label: '2030',
  },
  {
    value: 80,
    label: '2040',
  },
  {
    value: 100,
    label: '2050',
  },
];

// const TemporalSlider = withStyles({
//   root: {
//     color: '#008000', //variável
//     height: 2,
//     padding: '16px 0',
//   },
//   thumb: {
//     height: 24,
//     width: 24,
//     backgroundColor: '#008000', //variável
//     boxShadow: thumbShadow,
//     marginTop: -12,
//     marginLeft: -12,
//     '&:focus, &:hover, &$active': {
//       boxShadow:
//         '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
//       // Reset on touch devices, it doesn't add specificity
//       '@media (hover: none)': {
//         boxShadow: thumbShadow,
//       },
//     },
//   },
//   active: {},
//   valueLabel: {
//     left: 'calc(-50% + 12px)',
//     top: -18,
//     '& *': {
//       background: 'transparent',
//       color: '#000',
//     },
//   },
//   track: {
//     height: 2,
//   },
//   rail: {
//     height: 2,
//     opacity: 0.5,
//     backgroundColor: '#bfbfbf',
//   },
//   mark: {
//     backgroundColor: '#bfbfbf',
//     height: 8,
//     width: 1,
//     marginTop: -3,
//   },
//   markActive: {
//     opacity: 1,
//     backgroundColor: 'currentColor',
//   },
// })(Slider);

const createTemporalSlider = (
  barColor: string,
  buttonColor: string,
  trackHeight: number,
) => {
  return React.memo(
    withStyles({
      root: {
        color: barColor,
        height: 2,
        padding: '16px 0',
      },
      thumb: {
        height: 24,
        width: 24,
        backgroundColor: buttonColor,
        boxShadow: thumbShadow,
        marginTop: -12,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
          boxShadow:
            '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            boxShadow: thumbShadow,
          },
        },
      },
      active: {},
      valueLabel: {
        left: 'calc(-50% + 12px)',
        top: -18,
        '& *': {
          background: 'transparent',
          color: '#000',
        },
      },
      track: {
        height: trackHeight,
      },
      rail: {
        height: 2,
        opacity: 0.5,
        backgroundColor: '#bfbfbf',
      },
      mark: {
        backgroundColor: '#bfbfbf',
        height: 8,
        width: 1,
        marginTop: -3,
      },
      markActive: {
        opacity: 1,
        backgroundColor: 'currentColor',
      },
    })(Slider),
  );
};

// TODO bug #38 Com funcoes genericas lendo as cores do state, nao e possivel
// deslocar a barra do tempo mais do que 1 ano por vez.
const TemporalSliderScenario1Difference = createTemporalSlider(
  '#008000',
  '#008000',
  3,
);
const TemporalSliderScenario1Absolute = createTemporalSlider('#757575', '#008000', 0);
const TemporalSliderScenario2Difference = createTemporalSlider(
  '#f5d22e',
  '#f5d22e',
  3,
);
const TemporalSliderScenario2Absolute = createTemporalSlider(
  '#757575',
  '#f5d22e',
  0,
);
const TemporalSliderScenario3Difference = createTemporalSlider(
  '#EB4B35',
  '#EB4B35',
  3,
);
const TemporalSliderScenario3Absolute = createTemporalSlider(
  '#757575',
  '#EB4B35',
  0,
);
const TemporalSliderCompareScenario = createTemporalSlider(
  '#757575',
  '#757575',
  0,
);

function Temporal() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useTrackedState();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [sliderValue, setSliderValue] = React.useState<number | number[]>(0);
  const [buttonDisabled, setButtonDisabled] = React.useState<boolean>(false);

  const validYears = [2000, 2020];
  const [selectedYear, setSelectedYear] = React.useState<number>(validYears[0]);
  const [marks, setMarks] = React.useState<{ value: number; label: string }[]>(
    defaultMarks,
  );

  const getScenarioComponent = (): JSX.Element => {
    if (state.compareScenarioEnabled) {
      return (
        <TemporalSliderCompareScenario
          aria-label="slider"
          value={sliderValue}
          step={null}
          marks={marks}
          valueLabelDisplay="off"
          disabled={buttonDisabled}
          onChange={handleChangeSlider}
        />
      );
    }

    if (TimelineOption.DIFFERENCE === state.currentTimelineOption) {
      if (state.currentScenario === 'SSP1') {
        return (
          <TemporalSliderScenario1Difference
            aria-label="slider"
            value={sliderValue}
            step={null}
            marks={marks}
            valueLabelDisplay="off"
            disabled={buttonDisabled}
            onChange={handleChangeSlider}
          />
        );
      } else if (state.currentScenario === 'SSP2') {
        return (
          <TemporalSliderScenario2Difference
            aria-label="slider"
            value={sliderValue}
            step={null}
            marks={marks}
            valueLabelDisplay="off"
            disabled={buttonDisabled}
            onChange={handleChangeSlider}
          />
        );
      }

      return (
        <TemporalSliderScenario3Difference
          aria-label="slider"
          value={sliderValue}
          step={null}
          marks={marks}
          valueLabelDisplay="off"
          disabled={buttonDisabled}
          onChange={handleChangeSlider}
        />
      );
    }

    if (state.currentScenario === 'SSP1') {
      return (
        <TemporalSliderScenario1Absolute
          aria-label="slider"
          value={sliderValue}
          step={null}
          marks={marks}
          valueLabelDisplay="off"
          disabled={buttonDisabled}
          onChange={handleChangeSlider}
        />
      );
    } else if (state.currentScenario === 'SSP2') {
      return (
        <TemporalSliderScenario2Absolute
          aria-label="slider"
          value={sliderValue}
          step={null}
          marks={marks}
          valueLabelDisplay="off"
          disabled={buttonDisabled}
          onChange={handleChangeSlider}
        />
      );
    }

    return (
      <TemporalSliderScenario3Absolute
        aria-label="slider"
        value={sliderValue}
        step={null}
        marks={marks}
        valueLabelDisplay="off"
        disabled={buttonDisabled}
        onChange={handleChangeSlider}
      />
    );
  };

  const handleClickPlay = () => {
    setButtonDisabled(true);

    const indexMark = marks.findIndex((mark) => mark.value === sliderValue);
    if (indexMark > -1) {
      let index = 0;

      const sliderEvent = { timeline: true };
      handleChangeSlider(sliderEvent, 0);

      const timelineInterval = setInterval(() => {
        const position = marks[index];
        handleChangeSlider(sliderEvent, position.value);

        index++;
        if (index > indexMark) {
          clearInterval(timelineInterval);
          setButtonDisabled(false);
        }
      }, 500);
    }
  };

  const handleChangeSlider = (
    event: any,
    newSliderValue: number | number[],
  ) => {
    if ((event && event.timeline) || sliderValue !== newSliderValue) {
      setSliderValue(newSliderValue);

      const debounceSlider = debounce(() => {
        const mark = marks.find((mark) => mark.value === newSliderValue);
        if (mark) {
          dispatch({ type: 'SET_CURRENT_YEAR', year: Number(mark.label) });
        }
      }, 300);

      debounceSlider();
    }
  };

  const handleClickMenuYears = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenuYears = (year: number) => {
    setSelectedYear(year);

    const newMarks = defaultMarks.filter((mark) => Number(mark.label) >= year);
    setSliderValue(newMarks[0].value);
    setMarks(newMarks);

    dispatch({ type: 'SET_CHANGE_FROM_YEAR', year: Number(year) });
    setAnchorEl(null);
  };

  const getDifferenceButton = () => {
    if (TimelineOption.ABSOLUTE === state.currentTimelineOption) {
      return <div></div>;
    }

    return (
      <div>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClickMenuYears}
        >
          {selectedYear}
          <Icon style={{ marginLeft: 8 }}>keyboard_arrow_down</Icon>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseMenuYears}
        >
          {validYears.map((year: number) => (
            <MenuItem
              key={year}
              onClick={() => {
                handleCloseMenuYears(year);
              }}
            >
              {year}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <Card className={classes.slider}>
        <Typography gutterBottom></Typography>

        <div className={classes.content}>
          {getDifferenceButton()}
          <IconButton
            aria-label="play"
            className={classes.icon}
            disabled={buttonDisabled}
            onClick={handleClickPlay}
          >
            <PlayArrowIcon />
          </IconButton>

          {getScenarioComponent()}
        </div>
      </Card>
    </div>
  );
}

export default React.memo(Temporal);
