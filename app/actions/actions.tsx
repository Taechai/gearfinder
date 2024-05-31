"use server";
export async function toogleImage(currentSrc: string | undefined) {
  const src1 =
    "https://images.unsplash.com/photo-1503891450247-ee5f8ec46dc3?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const src2 =
    "https://images.unsplash.com/photo-1533282960533-51328aa49826?q=80&w=3042&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  if (currentSrc == src1) {
    return src2;
  } else return src1;
}
