export function AppHeader() {
  return (
    <header className="relative isolate overflow-hidden bg-brand-header px-5 pb-[86px] pt-7 text-[#f6fffb] sm:px-[76px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center gap-3 text-[21px] font-bold tracking-[0.02em]">
          <span className="grid h-[34px] w-[34px] place-items-center rounded-[10px] bg-[#c9f1e6] text-[20px] text-teal-dark">
            ✓
          </span>
          TaskFlow
        </div>
        <div className="mt-[70px] flex items-end justify-between gap-8 max-[620px]:block">
          <h1 className="m-0 max-w-[610px] text-[clamp(38px,5vw,68px)] font-medium leading-[0.96] tracking-[-0.045em]">
            Haz espacio para lo que importa.
          </h1>
          <p className="m-0 mb-1 max-w-[270px] font-sans text-[15px] leading-[1.55] text-[#b8d9d2] max-[620px]:mt-5">
            Tu centro ligero para capturar, ordenar y terminar el trabajo del día.
          </p>
        </div>
      </div>
    </header>
  )
}
