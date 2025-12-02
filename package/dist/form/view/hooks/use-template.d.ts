/**
 * Applies a template to create a structured layout, optionally using a gap between elements.
 *
 * @param template - The template to be applied. Can be an array or an object conforming to the IFormTemplate interface.
 * @param gap - Specifies the gap between elements.
 * The `gap` parameter is deprecated and will be removed in a future version. Use the gap property within the template object instead.
 * @returns An object representing the structured layout with type, styles, and items.
 */
export declare function useTemplate(settings: any, gap?: any): {
    type: string;
    styles: {};
    items: any;
};
//# sourceMappingURL=use-template.d.ts.map