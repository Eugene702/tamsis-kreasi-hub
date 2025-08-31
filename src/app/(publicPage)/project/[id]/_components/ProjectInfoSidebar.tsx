interface ProjectInfoSidebarProps {
  category: string;
  created: string;
  updated: string;
  views: number;
  tags: string[];
}

const formatNumber = (n: number) => Intl.NumberFormat('id-ID').format(n);

export function ProjectInfoSidebar({ category, created, updated, views, tags }: ProjectInfoSidebarProps) {
  return (
    <aside className="lg:col-span-4 space-y-10 lg:pt-2">
      <div className="space-y-6 p-0 lg:p-2">
        <h3 className="font-semibold text-sm tracking-wide uppercase text-base-content/60">Info</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between gap-6"><span className="text-base-content/50">Kategori</span><span>{category}</span></li>
          <li className="flex justify-between gap-6"><span className="text-base-content/50">Dibuat</span><span>{created}</span></li>
          <li className="flex justify-between gap-6"><span className="text-base-content/50">Update</span><span>{updated}</span></li>
          <li className="flex justify-between gap-6"><span className="text-base-content/50">Views</span><span>{formatNumber(views)}</span></li>
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map(t => (<span key={t} className="px-3 py-1 rounded-full bg-base-200/70 text-xs text-base-content/70">{t}</span>))}
        </div>
      </div>
    </aside>
  );
}
