"use client";

import type {
  EngineeringInputs,
  EngineeringOutputs,
} from "@/types/engineering";

interface Props {
  inputs: EngineeringInputs;
  outputs: EngineeringOutputs;
  onChange: <K extends keyof EngineeringInputs>(
    key: K,
    value: EngineeringInputs[K]
  ) => void;
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
      />
    </label>
  );
}

function OutputCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default function EngineeringPanel({ inputs, outputs, onChange }: Props) {
  return (
    <section
      className="border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur"
      style={{ borderRadius: "1.75rem" }}
    >
      <div className="mb-4 text-center sm:text-left">
        <p className="text-[11px] uppercase tracking-[0.3em] text-blue-200">
          Engineering inputs
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Quick calculator
        </h2>
      </div>

      <div className="space-y-5 rounded-3xl border border-white/10 bg-white/3 p-4">
        <div>
          <p className="text-center text-sm font-semibold text-white sm:text-left">Inputs</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-1">
            <Field
              label="Temperature (K)"
              value={inputs.temperature}
              onChange={(value) => onChange("temperature", value)}
            />
            <Field
              label="Pressure (psi)"
              value={inputs.pressure}
              onChange={(value) => onChange("pressure", value)}
            />
            <Field
              label="Gas Constant"
              value={inputs.gasConstant}
              onChange={(value) => onChange("gasConstant", value)}
            />
          </div>
        </div>

        <div>
          <p className="text-center text-sm font-semibold text-white sm:text-left">Outputs</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            <OutputCard label="Mach Number" value={outputs.machNumber.toFixed(2)} />
            <OutputCard label="Density" value={`${outputs.density.toFixed(3)} kg/m³`} />
            <OutputCard label="Velocity" value={`${outputs.velocity.toFixed(1)} m/s`} />
            <OutputCard
              label="Static Pressure"
              value={`${outputs.staticPressure.toFixed(2)} psi`}
            />
            <OutputCard
              label="Dynamic Pressure"
              value={`${outputs.dynamicPressure.toFixed(0)} Pa`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}