export interface MovimientoStock {
    tipoDeMovimiento: 'INGRESO' | 'EGRESO' | 'COMPROMETIDO' | 'DESCOMPROMETIDO';
    cantidad: number;
    observacion?: string;  // Es opcional, ya que en algunos lugares quizás no lo mandás
}
