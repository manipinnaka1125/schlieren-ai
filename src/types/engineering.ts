export interface EngineeringInputs {
  temperature: number;
  pressure: number;
  gasConstant: number;
}

export interface EngineeringOutputs {
  machNumber: number;
  density: number;
  velocity: number;
  staticPressure: number;
  dynamicPressure: number;
  speedOfSound: number;
}
