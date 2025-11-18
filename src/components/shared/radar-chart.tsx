import { ResponsiveRadar } from '@nivo/radar'

interface RadarChartProps {
  data: { name: string; value: number }[];
}

export const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    career: item.name,
    cost: item.value,
  }));

  return (
    <ResponsiveRadar
      data={chartData}
      keys={['cost']}
      indexBy="career"
      valueFormat=">-.2s"
      margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
      borderColor={{ from: 'color' }}
      gridLabelOffset={36}
      dotSize={10}
      dotColor={{ theme: 'background' }}
      dotBorderWidth={2}
      dotBorderColor={{ from: 'color' }}
      enableDotLabel={true}
      dotLabel="value"
      dotLabelYOffset={-12}
      colors={{ scheme: 'nivo' }}
      blendMode="multiply"
      motionConfig="wobbly"
    />
  );
};

