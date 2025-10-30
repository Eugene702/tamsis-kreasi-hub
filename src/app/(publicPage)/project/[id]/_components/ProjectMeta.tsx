import { FaEye } from "react-icons/fa"
import moment from "moment"
import "moment/locale/id"

moment.locale('id')

type Category = {
    categoryId: string
    categories: {
        id: string
        name: string
        slug: string
    }
}

type ProjectMetaProps = {
    categories: Category[]
    viewsCount: number
    createdAt: Date
}

const ProjectMeta = ({ categories, viewsCount, createdAt }: ProjectMetaProps) => {
    return (
        <div className="max-w-3xl mx-auto text-center space-y-8">
            {categories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map(c => (
                        <span key={c.categoryId} className="px-4 py-1.5 rounded-full bg-base-200 text-sm">
                            {c.categories.name}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-center gap-4 text-sm text-base-content/60">
                <span className="flex items-center gap-1">
                    <FaEye className="w-4 h-4" />
                    {viewsCount.toLocaleString('id-ID')} views
                </span>
                <span>•</span>
                <span>{moment(createdAt).format('DD MMMM YYYY')}</span>
            </div>
        </div>
    )
}

export default ProjectMeta
