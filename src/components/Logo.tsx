export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`logo ${className}`.trim()} role="img" aria-label="Mart">
      <span className="logo-m" aria-hidden="true">
        M
      </span>
      <span className="logo-art" aria-hidden="true">
        art
      </span>
    </div>
  )
}
