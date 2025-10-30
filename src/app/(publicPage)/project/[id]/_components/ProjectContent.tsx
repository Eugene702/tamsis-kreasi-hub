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
        level?: number
        style?: string
        items?: string[] | any[]
        alignment?: string
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
                
                // Quote block - FIX untuk menangani berbagai format
                if (block.type === 'quote') {
                    // Ambil text dari berbagai kemungkinan struktur
                    const quoteText = typeof block.data.text === 'string' 
                        ? block.data.text 
                        : (block.data.text as any)?.toString?.() || ''
                    
                    const quoteCaption = typeof block.data.caption === 'string'
                        ? block.data.caption
                        : (block.data.caption as any)?.toString?.() || ''
                    
                    return (
                        <blockquote 
                            key={i} 
                            className="border-l-4 border-primary pl-6 italic text-base-content/70 max-w-3xl mx-auto my-8"
                        >
                            <p 
                                className="text-lg"
                                dangerouslySetInnerHTML={{ __html: quoteText }} 
                            />
                            {quoteCaption && (
                                <footer className="text-sm text-base-content/50 mt-2 not-italic">
                                    — {quoteCaption}
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
                
                // List block - FIX untuk menangani berbagai format
                if (block.type === 'list') {
                    const isOrdered = block.data.style === 'ordered'
                    const ListTag = isOrdered ? 'ol' : 'ul'
                    
                    // Pastikan items adalah array
                    const items = Array.isArray(block.data.items) 
                        ? block.data.items 
                        : []
                    
                    return (
                        <ListTag 
                            key={i} 
                            className={`text-base-content/70 leading-relaxed text-left max-w-3xl mx-auto ${
                                isOrdered ? 'list-decimal' : 'list-disc'
                            } list-inside space-y-2 pl-4`}
                        >
                            {items.map((item: string | any, j: number) => {
                                // Handle jika item adalah string atau object
                                const itemText = typeof item === 'string' 
                                    ? item 
                                    : (item?.content || item?.text || item?.toString?.() || '')
                                
                                return (
                                    <li 
                                        key={j} 
                                        className="ml-2"
                                        dangerouslySetInnerHTML={{ __html: itemText }} 
                                    />
                                )
                            })}
                        </ListTag>
                    )
                }
                
                // Fallback untuk tipe block yang tidak dikenali
                // Debug mode: tampilkan tipe block
                if (process.env.NODE_ENV === 'development') {
                    return (
                        <div key={i} className="p-4 border border-warning rounded-lg max-w-3xl mx-auto">
                            <p className="text-warning font-semibold">
                                Unknown block type: {block.type}
                            </p>
                            <pre className="text-xs mt-2 overflow-auto">
                                {JSON.stringify(block.data, null, 2)}
                            </pre>
                        </div>
                    )
                }
                
                return null
            })}
        </div>
    )
}

export default ProjectContent
