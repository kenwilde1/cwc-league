import Link from "next/link";
import Image from 'next/image';

export function Header() {
    return (
        <div className="flex flex-col md:flex-row bg-black items-center justify-around p-8" >
            <div className="flex mb-2 items-center">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/cwc-logo.svg"
                        alt="Club World Cup Predictor Logo"
                        width={80}
                        height={80}
                        className="rounded-full mr-4"
                    />
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">CWC 2025</h1>
                    <h1 className="text-2xl font-bold">Match Predictor</h1>
                </div>
                </Link>

            </div>
            <div className='flex flex-col justify-center items-center gap-2 text-sm sm:text-base md:flex-row'>
                Want to get in on the action? {' '}
                <Link
                    href="/register"
                    className="bg-primary hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-full transition-colors"
                >
                    Register Now
                </Link>
            </div>
        </div >
    )
};