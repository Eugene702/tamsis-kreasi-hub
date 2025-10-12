const Error = ({ message }: { message: string }) => {
    return <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">{ message }</h1>
    </main>
}

export default Error