// Exemplo: andersonfilho@gmail.com → and***il.com
export function maskEmail(email: string): string {
  if (email.length <= 6) return email;
  return email.slice(0, 3) + "***" + email.slice(-6);
}

// Exemplo: 11999991234 → (11) 9 9***-1234
export function maskPhone(rawDigits: string): string {
  const d = rawDigits.replace(/\D/g, "");
  if (d.length < 10) {
    const ddd = d.slice(0, 2);
    return d.length <= 2 ? d : `(${ddd}) ${d.slice(2)}`;
  }
  const ddd = d.slice(0, 2);
  const number = d.slice(2);
  const first2 = number.slice(0, 2);
  const last4 = number.slice(-4);
  return `(${ddd}) ${first2[0]} ${first2[1]}***-${last4}`;
}
