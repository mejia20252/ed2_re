export  interface Bitacora {
  id: number;
  login: string;
  logout?: string | null;
  usuario: number;
  ip?: string | null;
  device?: string | null;
}