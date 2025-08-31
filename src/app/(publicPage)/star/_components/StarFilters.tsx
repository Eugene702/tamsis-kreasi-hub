"use client";
import { useState } from 'react';
import { FiSearch, FiSliders } from 'react-icons/fi';

export interface StarFilterState {
  query: string;
  jurusan: string;
  kelas: string;
  umur: string;
}

interface Props {
  onChange: (state: StarFilterState) => void;
}

const jurusanOptions = ['Semua', 'RPL', 'DKV', 'TKJ', 'AKL'];
const kelasOptions = ['Semua', 'X', 'XI', 'XII'];
const umurOptions = ['Semua', '15', '16', '17', '18'];

export function StarFilters({ onChange }: Props) {
  const [openAdv, setOpenAdv] = useState(false);
  const [state, setState] = useState<StarFilterState>({ query: '', jurusan: 'Semua', kelas: 'Semua', umur: 'Semua' });

  const update = (patch: Partial<StarFilterState>) => {
    const next = { ...state, ...patch };
    setState(next);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1">
          <FiSearch className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input
            placeholder="Cari nama siswa..."
            className="w-full pl-11 pr-4 h-11 rounded-full bg-base-100/80 ring-1 ring-base-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            value={state.query}
            onChange={e => update({ query: e.target.value })}
          />
        </div>
        <button
          type="button"
          onClick={() => setOpenAdv(o => !o)}
          className="h-11 px-5 rounded-full bg-base-200/70 hover:bg-base-200 transition text-sm inline-flex items-center gap-2 ring-1 ring-base-300/40"
        >
          <FiSliders className="w-4 h-4" /> Filter
        </button>
      </div>
      {openAdv && (
        <div className="grid sm:grid-cols-3 gap-4 bg-base-100/60 p-4 rounded-2xl ring-1 ring-base-300/40">
          <Select label="Jurusan" value={state.jurusan} options={jurusanOptions} onChange={v => update({ jurusan: v })} />
          <Select label="Kelas" value={state.kelas} options={kelasOptions} onChange={v => update({ kelas: v })} />
            <Select label="Umur" value={state.umur} options={umurOptions} onChange={v => update({ umur: v })} />
        </div>
      )}
    </div>
  );
}

interface SelectProps { label: string; value: string; options: string[]; onChange: (v: string) => void; }
function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-base-content/60">
      {label}
      <select
        className="h-10 rounded-xl bg-base-200/70 ring-1 ring-base-300/40 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
