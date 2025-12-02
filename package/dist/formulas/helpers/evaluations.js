export class EvaluationsManager {
    static validate(identifier, value, comparisonValue) {
        if (!this.evaluations[identifier]) {
            throw new Error(`Evaluation identifier "${identifier}" not recognized.`);
        }
        const result = this.evaluations[identifier](value, comparisonValue);
        return result;
    }
    /**
   * Evalúa un arreglo de valores para ver si alguno cumple con la condición especificada.
   * Retorna true si al menos uno de los valores cumple con la condición.
   */
    static validateAny(identifier, values, comparisonValue) {
        if (!this.evaluations[identifier]) {
            throw new Error(`Evaluation identifier "${identifier}" not recognized.`);
        }
        return values.some(value => this.evaluations[identifier](value, comparisonValue));
    }
    /**
     * Evalúa un arreglo de valores para ver si todos cumplen con la condición especificada.
     * Retorna true solo si todos los valores cumplen con la condición.
     */
    static validateAll(identifier, values, comparisonValue) {
        if (!this.evaluations[identifier]) {
            throw new Error(`Evaluation identifier "${identifier}" not recognized.`);
        }
        return values.every(value => this.evaluations[identifier](value, comparisonValue));
    }
}
EvaluationsManager.evaluations = {
    equal: (value, comparisonValue) => value == comparisonValue,
    lower: (value, comparisonValue) => Number(value) < Number(comparisonValue),
    upper: (value, comparisonValue) => Number(value) > Number(comparisonValue),
    between: (value, [min, max]) => {
        const numValue = Number(value);
        return numValue >= Number(min) && numValue <= Number(max);
    },
    different: (value, comparisonValue) => value != comparisonValue,
    hasValue: value => ![undefined, null, '', false].includes(value),
    empty: value => [undefined, null, '',].includes(value),
    lessOrEqual: (value, comparisonValue) => Number(value) <= Number(comparisonValue),
    greaterOrEqual: (value, comparisonValue) => Number(value) >= Number(comparisonValue),
};
//# sourceMappingURL=evaluations.js.map