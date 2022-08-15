import { createStyles, makeStyles } from '@material-ui/core';
import { TimelineOption, View } from 'containers/Types';
import { formatNumberDefault } from 'core/utils';
import { State } from 'store';

const scenario1Label = 'SSP1';
const scenario2Label = 'SSP2';
const scenario3Label = 'SSP3';

const compareColor = 'rgba(117,117,117, 1)';
const scenario1Color = 'rgba(0, 128, 0, 1)';
const scenario2Color = 'rgba(235,75,53, 1)';
const scenario3Color = 'rgba(245,210,46, 1)';

export function datasetsFactory(
  state: State,
  properties: GeoJSON.GeoJsonProperties,
  scenariosNames: string[],
  validLabels: string[],
  axis = 'vertical',
) {
  const datasets: any = {};
  const isDifference =
    TimelineOption.DIFFERENCE === state.currentTimelineOption;
  const changeFromYear = state.changeFromYear;

  for (const key in properties) {
    let value = properties[key];
    let name = key.toLowerCase();

    const parts = name.split('_');
    if (parts.length !== 3) {
      continue;
    }

    const date = parts[2].match(/\d+/g)?.join('');

    if (date) {
      name = key.toLowerCase().replace(`_${date}`, '');

      scenariosNames.forEach((scenarioName: string) => {
        if (name.startsWith(scenarioName)) {
          name = name.replace(`${scenarioName}_`, '');

          if (!datasets.hasOwnProperty(name)) {
            datasets[name] = {};
          }

          const scenario: any = datasets[name];
          if (!scenario.hasOwnProperty(scenarioName)) {
            scenario[scenarioName] = {
              object: [],
            };
          }

          if (isDifference) {
            const baseAttributeName = key.replace(`_${date}`, '');
            const baseAttributeKey = `${baseAttributeName}_${changeFromYear}`;
            const baseAttributeValue = properties[baseAttributeKey];

            value = value - baseAttributeValue;
          }

          scenario[scenarioName].object.push({ x: date, y: value });
        }
      });
    }
  }

  for (const propertyName in datasets) {
    const property = datasets[propertyName];

    for (const scenarioName in property) {
      const scenario = property[scenarioName];
      const object = scenario.object as { x: any; y: any }[];

      scenario.labels = [];
      scenario.data = [];
      validLabels.forEach((label: string) => {
        const found = object.find((entry: { x: any; y: any }) =>
          axis === 'vertical' ? entry.x === label : entry.y === label,
        );
        if (found) {
          const data = axis === 'vertical' ? found.y : found.x;
          scenario.labels.push(label);
          scenario.data.push(data);
        }
      });
    }
  }

  return datasets;
}

export function chartDataFactory(
  state: State,
  datasetName: string,
  datasets: { [name: string]: any },
) {
  let property = datasets[datasetName];

  if (!property) {
    property = datasets[datasetName.toLowerCase()];
  }

  const labels = property.ssp1.labels;
  const scenario1Data = property.ssp1.data;
  const scenario2Data = property.ssp2.data;
  const scenario3Data = property.ssp3.data;

  if (state.compareScenarioEnabled) {
    let baseArray = [];
    let compareArray = [];
    let newLabel = ``;

    if (state.currentScenario === scenario1Label) {
      baseArray = scenario1Data;

      if (state.compareWithScenario === scenario2Label) {
        compareArray = scenario2Data;
        newLabel = `${scenario2Label} - ${scenario1Label}`;
      }

      if (state.compareWithScenario === scenario3Label) {
        compareArray = scenario3Data;
        newLabel = `${scenario3Label} - ${scenario1Label}`;
      }
    } else if (state.currentScenario === scenario2Label) {
      baseArray = scenario2Data;

      if (state.compareWithScenario === scenario1Label) {
        compareArray = scenario1Data;
        newLabel = `${scenario1Label} - ${scenario2Label}`;
      }

      if (state.compareWithScenario === scenario3Label) {
        compareArray = scenario3Data;
        newLabel = `${scenario3Label} - ${scenario2Label}`;
      }
    } else {
      baseArray = scenario3Data;

      if (state.compareWithScenario === scenario1Label) {
        compareArray = scenario1Data;
        newLabel = `${scenario1Label} - ${scenario3Label}`;
      }

      if (state.compareWithScenario === scenario2Label) {
        compareArray = scenario2Data;
        newLabel = `${scenario2Label} - ${scenario2Label}`;
      }
    }

    const newArray: number[] = [];
    for (let index = 0; index < baseArray.length; index++) {
      const baseValue = Number(baseArray[index]);
      const compareValue = Number(compareArray[index]);

      const newValue = compareValue - baseValue;
      newArray.push(newValue);
    }

    return {
      labels,
      datasets: [
        {
          label: newLabel,
          fill: false,
          lineTension: 0.1,
          backgroundColor: compareColor,
          borderColor: compareColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: compareColor,
          pointBackgroundColor: compareColor,
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: compareColor,
          pointHoverBorderColor: compareColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: newArray,
        },
      ],
    };
  }

  return {
    labels,
    datasets: [
      {
        label: scenario1Label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario1Color,
        borderColor: scenario1Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario1Color,
        pointBackgroundColor: scenario1Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario1Color,
        pointHoverBorderColor: scenario1Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: scenario1Data,
      },
      {
        label: scenario2Label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario2Color,
        borderColor: scenario2Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario2Color,
        pointBackgroundColor: scenario2Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario2Color,
        pointHoverBorderColor: scenario2Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: scenario2Data,
      },
      {
        label: scenario3Label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario3Color,
        borderColor: scenario3Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario3Color,
        pointBackgroundColor: scenario3Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario3Color,
        pointHoverBorderColor: scenario3Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: scenario3Data,
      },
    ],
  };
}

export function chartOptionsFactory(t: any) {
  return {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: t('ReportAllBiomes.chart.labelX'),
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Area (Km²)',
          },
        },
      ],
    },
    tooltips: {
      mode: 'label',
      callbacks: {
        label: function (tooltipItem: any, data: any) {
          const defaultLabel =
            data.datasets[tooltipItem.datasetIndex].label || '';
          const label = t(`Legend.cardValues.${defaultLabel}`, {
            defaultValue: defaultLabel,
          });

          const value = formatNumberDefault(tooltipItem.yLabel);
          return `${label}: ${value}`;
        },
      },
    },
  };
}

export function getStyles() {
  return makeStyles(() =>
    createStyles({
      buttonDefault: {
        backgroundColor: '#24806F',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: '#24806F',
        },
      },
    }),
  )();
}

export function createCharts(
  state: State,
  t: any,
  properties: GeoJSON.GeoJsonProperties | undefined,
) {
  const charts: any = [];
  if (!properties) {
    return charts;
  }

  const scenariosNames = ['ssp1', 'ssp2', 'ssp3'];
  const labels = ['2000', '2010', '2020', '2030', '2040', '2050'];

  const datasetAbbreviation = [
    'veg',
    'pastp',
    'agric',
    'mosc',
    'fores',
    'others',
  ];
  const datasetNames = [
    t('Drawer.SideContent.attribute.chips.0.name'),
    t('Drawer.SideContent.attribute.chips.1.name'),
    t('Drawer.SideContent.attribute.chips.2.name'),
    t('Drawer.SideContent.attribute.chips.3.name'),
    t('Drawer.SideContent.attribute.chips.4.name'),
    t('Drawer.SideContent.attribute.chips.5.name'),
  ];
  const datasetLabels = [
    t('Drawer.SideContent.attribute.chips.0.label'),
    t('Drawer.SideContent.attribute.chips.1.label'),
    t('Drawer.SideContent.attribute.chips.2.label'),
    t('Drawer.SideContent.attribute.chips.3.label'),
    t('Drawer.SideContent.attribute.chips.4.label'),
    t('Drawer.SideContent.attribute.chips.5.label'),
  ];
  const datasetDescriptions = [
    t('Drawer.SideContent.attribute.chips.0.description'),
    t('Drawer.SideContent.attribute.chips.1.description'),
    t('Drawer.SideContent.attribute.chips.2.description'),
    t('Drawer.SideContent.attribute.chips.3.description'),
    t('Drawer.SideContent.attribute.chips.4.description'),
    t('Drawer.SideContent.attribute.chips.5.description'),
  ];

  const datasets = datasetsFactory(state, properties, scenariosNames, labels);
  datasetAbbreviation.forEach((selectedName: string, index: number) => {
    const name = datasetNames[index];

    if (state.currentAttribute && name === state.currentAttribute) {
      const label = datasetLabels[index];
      const description = datasetDescriptions[index];

      charts.push({
        name,
        label,
        description,
        data: chartDataFactory(state, selectedName, datasets),
        options: chartOptionsFactory(t),
      });
    }
  });

  return charts;
}

export function createChartsAllBiomes(state: State, t: any, view: View) {
  const lines: any = [];

  const scenariosNames = ['ssp1', 'ssp2', 'ssp3'];
  const labels = ['2000', '2010', '2020', '2030', '2040', '2050'];

  const datasetAbbreviation = [
    'veg',
    'pastp',
    'agric',
    'mosc',
    'fores',
    'others',
  ];
  const datasetNames = [
    t('Drawer.SideContent.attribute.chips.0.name'),
    t('Drawer.SideContent.attribute.chips.1.name'),
    t('Drawer.SideContent.attribute.chips.2.name'),
    t('Drawer.SideContent.attribute.chips.3.name'),
    t('Drawer.SideContent.attribute.chips.4.name'),
    t('Drawer.SideContent.attribute.chips.5.name'),
  ];
  const datasetLabels = [
    t('Drawer.SideContent.attribute.chips.0.label'),
    t('Drawer.SideContent.attribute.chips.1.label'),
    t('Drawer.SideContent.attribute.chips.2.label'),
    t('Drawer.SideContent.attribute.chips.3.label'),
    t('Drawer.SideContent.attribute.chips.4.label'),
    t('Drawer.SideContent.attribute.chips.5.label'),
  ];
  const datasetDescriptions = [
    t('Drawer.SideContent.attribute.chips.0.description'),
    t('Drawer.SideContent.attribute.chips.1.description'),
    t('Drawer.SideContent.attribute.chips.2.description'),
    t('Drawer.SideContent.attribute.chips.3.description'),
    t('Drawer.SideContent.attribute.chips.4.description'),
    t('Drawer.SideContent.attribute.chips.5.description'),
  ];

  let chartLabel = '';
  let chartDescription = '';

  const data = view!.data;
  const features = (data as any).features as any[];
  features.forEach((feature: GeoJSON.Feature) => {
    const datasets = datasetsFactory(
      state,
      feature.properties,
      scenariosNames,
      labels,
    );
    datasetAbbreviation.forEach((selectedName: string, index: number) => {
      const name = datasetNames[index];

      if (name === state.currentAttribute) {
        const attributeLabel = datasetLabels[index];
        const description = datasetDescriptions[index];

        const property = datasets[selectedName];
        const featureName = (feature.properties as any).name;
        const featureLabel = t(`Legend.cardValues.${featureName}`, {
          defaultValue: featureName,
        });

        chartLabel = attributeLabel;
        chartDescription = description;

        lines.push({
          featureName,
          featureLabel,
          attributeName: name,
          attributeLabel,
          attributeDescription: description,
          ssp1: property.ssp1.data,
          ssp2: property.ssp2.data,
          ssp3: property.ssp3.data,
        });
      }
    });
  });

  const chartDatasets: any = [];
  lines.forEach((line: any) => {
    if (state.compareScenarioEnabled) {
      const compareColor = getFeatureColor(
        line.featureName,
        view!.style!.value!,
      );

      let baseArray = [];
      let compareArray = [];

      const scenario1Data = line.ssp1;
      const scenario2Data = line.ssp2;
      const scenario3Data = line.ssp3;

      if (state.currentScenario === scenario1Label) {
        baseArray = scenario1Data;

        if (state.compareWithScenario === scenario2Label) {
          compareArray = scenario2Data;
        }

        if (state.compareWithScenario === scenario3Label) {
          compareArray = line.ssp3;
        }
      } else if (state.currentScenario === scenario2Label) {
        baseArray = scenario2Data;

        if (state.compareWithScenario === scenario1Label) {
          compareArray = scenario1Data;
        }

        if (state.compareWithScenario === scenario3Label) {
          compareArray = scenario3Data;
        }
      } else {
        baseArray = scenario3Data;

        if (state.compareWithScenario === scenario1Label) {
          compareArray = scenario1Data;
        }

        if (state.compareWithScenario === scenario2Label) {
          compareArray = scenario2Data;
        }
      }

      const newArray: number[] = [];
      for (let index = 0; index < baseArray.length; index++) {
        const baseValue = Number(baseArray[index]);
        const compareValue = Number(compareArray[index]);

        const newValue = compareValue - baseValue;
        newArray.push(newValue);
      }

      chartDatasets.push({
        label: `${line.featureLabel}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: compareColor,
        borderColor: compareColor,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: compareColor,
        pointBackgroundColor: compareColor,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: compareColor,
        pointHoverBorderColor: compareColor,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: newArray,
      });
    } else if (state.currentScenario === scenario1Label) {
      const scenario1Color = getFeatureColor(
        line.featureName,
        view!.style!.value!,
      );

      chartDatasets.push({
        label: `${line.featureLabel}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario1Color,
        borderColor: scenario1Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario1Color,
        pointBackgroundColor: scenario1Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario1Color,
        pointHoverBorderColor: scenario1Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: line.ssp1,
      });
    } else if (state.currentScenario === scenario2Label) {
      const scenario2Color = getFeatureColor(
        line.featureName,
        view!.style!.value!,
      );

      chartDatasets.push({
        label: `${line.featureLabel}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario2Color,
        borderColor: scenario2Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario2Color,
        pointBackgroundColor: scenario2Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario2Color,
        pointHoverBorderColor: scenario2Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: line.ssp2,
      });
    } else {
      const scenario3Color = getFeatureColor(
        line.featureName,
        view!.style!.value!,
      );

      chartDatasets.push({
        label: `${line.featureLabel}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario3Color,
        borderColor: scenario3Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario3Color,
        pointBackgroundColor: scenario3Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario3Color,
        pointHoverBorderColor: scenario3Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: line.ssp2,
      });
    }
  });

  return {
    label: chartLabel,
    description: chartDescription,
    data: {
      labels,
      datasets: chartDatasets,
    },
    options: chartOptionsFactory(t),
  };
}

function getRandomColor() {
  return '#' + (((1 << 24) * Math.random()) | 0).toString(16);
}

function getFeatureColor(featureName: string, style: any[]) {
  const found = style.find((s: any) => s.valueString === featureName);
  if (found) {
    return found.style.fillColor;
  }

  return getRandomColor();
}
