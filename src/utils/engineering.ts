import type {
  EngineeringInputs,
  EngineeringOutputs,
} from "@/types/engineering";

const PSI_TO_PASCAL = 6894.757293168;
const DEFAULT_GAMMA = 1.4;

export function computeEngineeringOutputs(
  inputs: EngineeringInputs,
  shockAngleDeg: number
): EngineeringOutputs {
  const { temperature, pressure, gasConstant } = inputs;
  const pressureInPascal = pressure * PSI_TO_PASCAL;

  const density = pressureInPascal / (gasConstant * temperature);
  const speedOfSound = Math.sqrt(DEFAULT_GAMMA * gasConstant * temperature);

  const shockAngleRad = (shockAngleDeg * Math.PI) / 180;
  const sinAngle = Math.sin(shockAngleRad);
  const machNumber =
    sinAngle > 0.01 ? Math.max(1, 1 / sinAngle) : 1.5;

  const velocity = machNumber * speedOfSound;
  const dynamicPressure = 0.5 * density * velocity * velocity;

  return {
    machNumber,
    density,
    velocity,
    staticPressure: pressure,
    dynamicPressure,
    speedOfSound,
  };
}
