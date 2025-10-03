import { FiBookOpen, FiEye, FiTrendingUp, FiUsers } from "react-icons/fi"
import { GetType } from "../action"

const Stats = ({ data }: { data: GetType }) => {
    return <div className="stats stats-vertical lg:stats-horizontal shadow-lg bg-base-100 w-full rounded-3xl overflow-hidden">
        <div className="stat bg-gradient-to-br from-blue-500/10 to-blue-600/20 p-8">
            <div className="stat-figure text-blue-600">
                <FiUsers className="w-8 h-8" />
            </div>
            <div className="stat-title text-blue-600/70">Total Siswa</div>
            <div className="stat-value text-blue-600">{ data.stats?.studentTotal }</div>
        </div>

        <div className="stat bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 p-8">
            <div className="stat-figure text-emerald-600">
                <FiBookOpen className="w-8 h-8" />
            </div>
            <div className="stat-title text-emerald-600/70">Total Proyek</div>
            <div className="stat-value text-emerald-600">{ data.stats?.projectTotal }</div>
        </div>

        <div className="stat bg-gradient-to-br from-purple-500/10 to-purple-600/20 p-8">
            <div className="stat-figure text-purple-600">
                <FiEye className="w-8 h-8" />
            </div>
            <div className="stat-title text-purple-600/70">Total Views</div>
            <div className="stat-value text-purple-600">{ data.stats?.projectViewsTotal }</div>
        </div>
    </div>
}

export default Stats