export function openWhatsApp(carName: string) {
  const phoneNumber = '918415038275'; // India number
  const message = `
Hello 👋
I want to book this car:

🚗 ${carName}
`;

  window.open(
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
    '_blank'
  );
}
