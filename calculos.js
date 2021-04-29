function countPrimes(numero) {
  let count = 0;
  // Casos especiales
  if (numero == 0 || numero == 1 || numero == 4 || numero < 0) {
    console.log(count);
    return count;
  }
  for (let x = 2; x < numero / 2; x++) {
    if (numero % x != 0) {
      count = count + 1;
    }
  }
  if (count % 2 == 0) {
    count = count + 2;
  } else {
    count = count + 3;
  }
  console.log(count);
  // Si no se pudo dividir por ninguno de los de arriba, sí es primo
  return count;
}

countPrimes(20);
