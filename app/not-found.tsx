import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/Futuristic_Glitch_Error_Animation.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl animate-pulse">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-lg">
            Page Not Found
          </h2>
          <p className="text-white/80 max-w-md mx-auto text-lg drop-shadow-md">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-primary/90 backdrop-blur-sm text-white rounded-lg hover:bg-primary transition-all duration-300 transform hover:scale-105 shadow-2xl border border-white/20"
          >
            Go Back Home
          </Link>
          
          <div className="text-sm text-white/70 space-x-4">
            <Link 
              href="/contact" 
              className="hover:text-primary transition-colors duration-300 drop-shadow-md"
            >
              Contact us
            </Link>
            <span>•</span>
            <Link 
              href="/projects" 
              className="hover:text-primary transition-colors duration-300 drop-shadow-md"
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}