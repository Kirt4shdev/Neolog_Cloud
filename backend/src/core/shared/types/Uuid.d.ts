declare global {
  /**
   * UUID - Identificador único universal
   * Se declara para poder tipar los UUIDs y tener intelisense en el editor de código.
   */
  type UUID = `${string}-${string}-${string}-${string}-${string}`;
}

export {};
