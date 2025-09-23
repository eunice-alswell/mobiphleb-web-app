interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
}

export default function Loader({ size = 'md', text = 'Loading...', className = '' }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Logo with pinging animation */}
      <div className="relative">
        {/* Ping animation rings */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-purple-400 opacity-75 animate-ping`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-purple-400 opacity-50 animate-ping animation-delay-75`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-blue-400 opacity-25 animate-ping animation-delay-150`}></div>
        
        {/* Logo container */}
        <div className={`relative ${sizeClasses[size]} bg-white rounded-full shadow-lg flex items-center justify-center p-2`}>
          <img
            src="/MOBIPHLEB_logo_purple.png"
            alt="MOBIPHLEB"
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              // Fallback to text if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Fallback text if image fails */}
          <div className="absolute inset-0 flex items-center justify-center text-purple-600 font-bold text-center">
            <span className="opacity-0" id="fallback-text">MOBIPHLEB</span>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p className={`${textSizeClasses[size]} font-medium text-gray-700 animate-pulse`}>
          {text}
        </p>
        {/* Loading dots animation */}
        <div className="flex justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
        </div>
      </div>
    </div>
  )
}

// Additional standalone components for specific use cases
export function FullScreenLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
      <Loader size="lg" text={text} />
    </div>
  )
}

export function InlineLoader({ size = 'sm', text }: { size?: 'sm' | 'md'; text?: string }) {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader size={size} text={text} />
    </div>
  )
}

export function ButtonLoader() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 relative">
        <div className="absolute inset-0 w-4 h-4 rounded-full bg-white opacity-75 animate-ping"></div>
        <div className="relative w-4 h-4 bg-white rounded-full shadow-sm flex items-center justify-center">
          <img
            src="/MOBIPHLEB_logo_no_bg.png"
            alt=""
            className="w-3 h-3 object-contain"
          />
        </div>
      </div>
      <span>Loading...</span>
    </div>
  )
}
