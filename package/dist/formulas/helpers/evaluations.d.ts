export declare class EvaluationsManager {
    private static evaluations;
    static validate(identifier: string, value: any, comparisonValue?: any): boolean;
    /**
   * Evalúa un arreglo de valores para ver si alguno cumple con la condición especificada.
   * Retorna true si al menos uno de los valores cumple con la condición.
   */
    static validateAny(identifier: string, values: any[], comparisonValue?: any): boolean;
    /**
     * Evalúa un arreglo de valores para ver si todos cumplen con la condición especificada.
     * Retorna true solo si todos los valores cumplen con la condición.
     */
    static validateAll(identifier: string, values: any[], comparisonValue?: any): boolean;
}
//# sourceMappingURL=evaluations.d.ts.map