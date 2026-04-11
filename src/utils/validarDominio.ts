export const DOMINIOS_PERMITIDOS = [
  "uemg.br",
  "discente.uemg.br",
  "docente.uemg.br",
  "unitri.edu.br",
  "souunitri.com.br",
];

export function validarEmailInstitucional(email: string) {
  const emailLimpo = email.toLowerCase().trim();

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(emailLimpo)) return false;

  const dominio = emailLimpo.split("@")[1];

  return DOMINIOS_PERMITIDOS.includes(dominio);
}