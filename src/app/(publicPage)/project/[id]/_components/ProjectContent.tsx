import Image from "next/image"
import { createElement } from "react"

type Block = {
    type: string
    data: {
        text?: string
        file?: {
            url: string
        }
        caption?: string
        [key: string]: any
    }
}

type ProjectContentProps = {
    blocks: Block[]
    projectTitle: string
}

const ProjectContent = ({ blocks, projectTitle }: ProjectContentProps) => {
    if (!blocks || blocks.length === 0) return null

    return (
        <div className="space-y-8">
            {blocks.map((block: Block, i: number) => {
                // Paragraph block
                if (block.type === 'paragraph') {
                    return (
                        <p 
                            key={i} 
                            className="text-base-content/70 leading-relaxed text-left max-w-3xl mx-auto" 
                            dangerouslySetInnerHTML={{ __html: block.data.text || '' }} 
                        />
                    )
                }
                
                // Header block
                if (block.type === 'header') {
                    const level = block.data.level || 2
                    const headingClass = `font-bold mt-8 text-left max-w-3xl mx-auto ${
                        level === 1 ? 'text-3xl' : 
                        level === 2 ? 'text-2xl' : 
                        'text-xl'
                    }`
                    
                    return createElement(
                        `h${level}`,
                        { key: i, className: headingClass },
                        block.data.text
                    )
                }
                
                // Quote block
                if (block.type === 'quote') {
                    return (
                        <blockquote 
                            key={i} 
                            className="border-l-4 border-base-300 pl-6 italic text-base-content/60 max-w-3xl mx-auto"
                        >
                            <p dangerouslySetInnerHTML={{ __html: block.data.text || '' }} />
                            {block.data.caption && (
                                <footer className="text-sm text-base-content/50 mt-2">
                                    — {block.data.caption}
                                </footer>
                            )}
                        </blockquote>
                    )
                }
                
                // Image block - render sesuai urutan
                if (block.type === 'image' && block.data.file?.url) {
                    return (
                        <div key={i} className="max-w-4xl mx-auto">
                            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
                                <Image 
                                    src={block.data.file.url} 
                                    alt={block.data.caption || `${projectTitle} - Gambar ${i + 1}`}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto" 
                                />
                            </div>
                            {block.data.caption && (
                                <p className="text-center text-sm text-base-content/60 mt-3 italic">
                                    {block.data.caption}
                                </p>
                            )}
                        </div>
                    )
                }
                
                // List block
                if (block.type === 'list') {
                    const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul'
                    return (
                        <ListTag 
                            key={i} 
                            className={`text-base-content/70 leading-relaxed text-left max-w-3xl mx-auto ${
                                block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'
                            } list-inside space-y-2`}
                        >
                            {block.data.items?.map((item: string, j: number) => (
                                <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                        </ListTag>
                    )
                }
                
                return null
            })}
        </div>
    )
}

export default ProjectContent
