/** Hotel Buena Vista — precios y vigencia en un solo lugar (ambos idiomas).
 * Las promociones NO se publican hasta confirmar fecha exacta de vencimiento.
 * Edita confirmed:true y validUntil:"AAAA-MM-DD" una vez autorizado.
 */
window.HBV_CONFIG = Object.freeze({
  siteUrl: "https://hotelbuenavista.online",
  whatsApp: "50257598151",
  seasonal: {
    confirmed: false,
    validUntil: "",
    label: {es:"Especial navideño",en:"Christmas special"},
    rooms: {
      romantic: 1390,
      alpine: 1490,
      family: 2650
    }
  },
  bbq: {confirmed:false, validUntil:"", price:100}
});
