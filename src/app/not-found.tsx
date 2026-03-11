
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-center px-4">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <p className="text-2xl md:text-4xl mt-4 text-gray-700">
                    Sorry, the page you are looking for does not exist.
                </p>
                <a
                    href="/"
                    className="mt-8 inline-block bg-accent text-primary font-bold px-8 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
                >
                    Back to Home
                </a>
            </div>
        </div>
    );
}