import type {
  EngineeringInputs,
  EngineeringOutputs,
} from "@/types/engineering";

export function computeEngineeringOutputs(
  inputs: EngineeringInputs,
  shockAngleDeg: number
): EngineeringOutputs {
  const { temperature, pressure, gasConstant, gamma } = inputs;

  const density = pressure / (gasConstant * temperature);
  const speedOfSound = Math.sqrt(gamma * gasConstant * temperature);

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
