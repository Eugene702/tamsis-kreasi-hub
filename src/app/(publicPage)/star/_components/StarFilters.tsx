"use client"

import { useState, useTransition } from 'react'
import { FiSearch, FiSliders } from 'react-icons/fi'
import { Major } from '@/lib/values'
import { useRouter, useSearchParams } from 'next/navigation'

export interface StarFilterState {
  query: string
  jurusan: string
  kelas: string
  umur: string
}

interface Props {
  availableAges: number[]
}

const kelasOptions = ['Semua', '10', '11', '12']

export const StarFilters = ({ availableAges }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [openAdv, setOpenAdv] = useState(false)
  
  const jurusanKeyFromUrl = searchParams.get('jurusan') || 'Semua'
  const jurusanValue = jurusanKeyFromUrl === 'Semua' 
    ? 'Semua' 
    : Major.find(m => m.key === jurusanKeyFromUrl)?.value || 'Semua'
  
  const [state, setState] = useState<StarFilterState>({ 
    query: searchParams.get('query') || '', 
    jurusan: jurusanValue, 
    kelas: searchParams.get('kelas') || 'Semua', 
    umur: searchParams.get('umur') || 'Semua' 
  })

  const jurusanOptions = ['Semua', ...Major.map(m => m.value)]
  const umurOptions = ['Semua', ...availableAges.map(a => a.toString())]

  const update = (patch: Partial<StarFilterState>) => {
    const next = { ...state, ...patch }
    setState(next)
    
    const params = new URLSearchParams()
    if (next.query) params.set('query', next.query)
    
    if (next.jurusan && next.jurusan !== 'Semua') {
      const jurusanKey = Major.find(m => m.value === next.jurusan)?.key
      if (jurusanKey) params.set('jurusan', jurusanKey)
    }
    
    if (next.kelas && next.kelas !== 'Semua') params.set('kelas', next.kelas)
    if (next.umur && next.umur !== 'Semua') params.set('umur', next.umur)
    
    startTransition(() => {
      router.push(`/star?${params.toString()}`)
    })
  }

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
      {isPending && (
        <div className="text-center py-4">
          <div className="loading loading-spinner loading-sm"></div>
        </div>
      )}
    </div>
  )
}

interface SelectProps { label: string; value: string; options: string[]; onChange: (v: string) => void }
const Select = ({ label, value, options, onChange }: SelectProps) => {
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
  )
}
