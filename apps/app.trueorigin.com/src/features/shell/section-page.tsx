export function SectionPage({ title, description }: { title: string; description?: string }) {
 return <div className="w-full px-4 py-[var(--cell)] text-center">
 <h1 className="text-[clamp(40px,9vw,144px)] font-semibold leading-none tracking-[-0.075em]">{title}</h1>
 {description && <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-white/45">{description}</p>}
 </div>;
}
