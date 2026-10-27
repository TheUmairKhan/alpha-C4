// Cuts the corners off diagonally; size comes from the --chamfer variable
export const chamfer =
  '[clip-path:polygon(var(--chamfer)_0,calc(100%_-_var(--chamfer))_0,100%_var(--chamfer),100%_calc(100%_-_var(--chamfer)),calc(100%_-_var(--chamfer))_100%,var(--chamfer)_100%,0_calc(100%_-_var(--chamfer)),0_var(--chamfer))]'

export const chamferOutline =
  '[--inner:calc(var(--chamfer)_+_0.414px)] [clip-path:polygon(evenodd,var(--chamfer)_0,calc(100%_-_var(--chamfer))_0,100%_var(--chamfer),100%_calc(100%_-_var(--chamfer)),calc(100%_-_var(--chamfer))_100%,var(--chamfer)_100%,0_calc(100%_-_var(--chamfer)),0_var(--chamfer),var(--chamfer)_0,var(--inner)_1px,1px_var(--inner),1px_calc(100%_-_var(--inner)),var(--inner)_calc(100%_-_1px),calc(100%_-_var(--inner))_calc(100%_-_1px),calc(100%_-_1px)_calc(100%_-_var(--inner)),calc(100%_-_1px)_var(--inner),calc(100%_-_var(--inner))_1px,var(--inner)_1px)]'
