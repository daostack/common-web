import { Option } from "@/shared/components/Dropdown/Dropdown";
import {
  InheritFromCircle
} from "@/shared/models";



interface AdvancedSettingsOption extends Option {
  text: string;
  value: InheritFromCircle;
  key: string;
}

interface InheritCirclesOptions {
  inheritedCircles: AdvancedSettingsOption[];
  previousCirclesTierMax: number;
  nextCirclesTierMin: number;
}



export const getInheritCirclesOptions = ({
  inheritedCircles,
  previousCirclesTierMax,
  nextCirclesTierMin,
}: InheritCirclesOptions) => {
  return (inheritedCircles || []).reduce((acc, inheritCircle) => {
    const tier = Number(inheritCircle.value?.tier);
    if (
      Number.isInteger(tier) &&
      (tier <= previousCirclesTierMax || tier >= nextCirclesTierMin)
    ) {
      return acc;
    }

    acc.push(inheritCircle);
    return acc;
  }, [] as AdvancedSettingsOption[]);
};
