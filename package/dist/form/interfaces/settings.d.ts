import { WiseFormField } from './interfaces';
import { IFormTemplate } from './template';
export interface IFormSettings {
    name: 'string';
    template?: IFormTemplate;
    values?: Record<string, string>;
    fields: WiseFormField[];
    gap?: number;
}
//# sourceMappingURL=settings.d.ts.map