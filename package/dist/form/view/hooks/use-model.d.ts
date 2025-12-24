import { FormModel } from '@bgroup/wise-form/models';
/**
 * Hook para gestionar el modelo del formulario
 *
 * Principios SOLID aplicados:
 * - Single Responsibility: Solo gestiona el estado del modelo del formulario
 * - Open/Closed: Extensible mediante eventos del modelo sin modificar el hook
 * - Dependency Inversion: Depende de la abstracción FormModel, no de implementaciones concretas
 */
export declare function useModel(settings: any, form?: FormModel): {
    ready: boolean;
    model: FormModel;
    values: Record<string, any>;
    type: string;
    styles: {};
    items: any;
};
//# sourceMappingURL=use-model.d.ts.map