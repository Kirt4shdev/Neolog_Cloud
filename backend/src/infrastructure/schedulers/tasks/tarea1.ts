export async function tarea1() {
  // // Error de sintaxis: intentar usar una variable que no existe
  // console.log(variableQueNoExiste);

  // // Error de tipo: intentar hacer operaciones incompatibles
  // const numero: number = "esto no es un numero" as any;
  // const resultado = numero * undefined;

  // // Error de acceso a propiedad null
  // const objeto = null;
  // objeto.propiedad.inexistente;

  // // Error de división por cero que puede causar problemas
  // const division = 10 / 0;

  // // Error de JSON parse con string inválido
  // JSON.parse("esto no es json válido");

  // // Error de array index fuera de rango
  // const array: string[] = [];
  // array[999].toUpperCase();

  throw new Error("Error generado intencionalmente");
}
