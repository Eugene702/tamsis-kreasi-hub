import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("./_components/LoginForm"));

const page = () => {
    return (
        <div className="min-h-screen flex">
            <div className="flex-1 flex items-center justify-center p-8 bg-base-100">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-base-content mb-2">Welcome Back</h1>
                        <p className="text-base-content/70">Sign in to your account</p>
                    </div>

                    <div className="bg-base-100 p-8 rounded-2xl shadow-2xl">
                        <LoginForm />
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-8">
                <div className="text-center text-primary-content max-w-md">
                    <div className="mb-8">
                        <div className="w-32 h-32 mx-auto bg-primary-content/20 rounded-full flex items-center justify-center shadow-2xl">
                            <svg className="w-16 h-16 text-primary-content" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Bangun Karya, Raih Prestasi Bersama</h2>
                    <p className="text-xl text-primary-content/90 leading-relaxed">
                        Eksplorasi, kolaborasi, dan tampilkan proyek terbaikmu di platform yang mempertemukan inovator, kreator, dan pembelajar dari berbagai bidang.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default page;