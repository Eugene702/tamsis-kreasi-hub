"use client";
import { useEffect, useMemo, useState } from 'react';
import { StarFilters, StarFilterState } from './StarFilters';
import { StarItem, type StudentStarData } from './StarItem';

// Mock generator (replace with server fetch later)
function generateMock(): StudentStarData[] {
  const names = ['Aji Nugraha', 'Suwir Pratama', 'Nabila Firda', 'Raka Wijaya', 'Dewi Lestari', 'Fikri Maulana', 'Gilang Saputra', 'Intan Pramesi'];
  const jur = ['RPL', 'DKV', 'TKJ', 'AKL'];
  return names.map((n, i) => {
    const projects = Array.from({ length: 5 }).map((_, j) => ({
      id: `${i}-${j}`,
      title: `Project ${j + 1} ${n.split(' ')[0]}`,
      views: Math.floor(Math.random() * 4000) + 100,
    })).sort((a, b) => b.views - a.views);
    const totalViews = projects.reduce((s, p) => s + p.views, 0);
    return {
      id: `stu-${i}`,
      name: n,
      avatar: '/temp.png',
      jurusan: jur[i % jur.length],
      kelas: ['X', 'XI', 'XII'][i % 3],
      umur: 16 + (i % 3),
      projects,
      totalViews,
    } as StudentStarData;
  }).sort((a, b) => b.totalViews - a.totalViews);
}

export function StarList() {
  const [filter, setFilter] = useState<StarFilterState>({ query: '', jurusan: 'Semua', kelas: 'Semua', umur: 'Semua' });
  const [data, setData] = useState<StudentStarData[]>([]);

  useEffect(() => { setData(generateMock()); }, []);

  const filtered = useMemo(() => {
    return data.filter(d => {
      if (filter.query && !d.name.toLowerCase().includes(filter.query.toLowerCase())) return false;
      if (filter.jurusan !== 'Semua' && d.jurusan !== filter.jurusan) return false;
      if (filter.kelas !== 'Semua' && d.kelas !== filter.kelas) return false;
      if (filter.umur !== 'Semua' && d.umur !== Number(filter.umur)) return false;
      return true;
    });
  }, [data, filter]);

  return (
    <div className="space-y-10">
      <StarFilters onChange={setFilter} />
      <div className="space-y-10">
        {filtered.map(stu => <StarItem key={stu.id} data={stu} />)}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-base-content/50 text-sm">Tidak ada hasil yang cocok.</div>
        )}
      </div>
    </div>
  );
}
